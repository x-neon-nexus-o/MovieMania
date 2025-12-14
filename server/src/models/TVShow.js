import mongoose from 'mongoose';

const tvShowSchema = new mongoose.Schema({
    // TMDB Data
    tmdbId: {
        type: Number,
        required: [true, 'TMDB ID is required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 500
    },
    originalName: {
        type: String,
        trim: true
    },
    firstAirDate: Date,
    lastAirDate: Date,
    posterPath: String,
    backdropPath: String,
    overview: {
        type: String,
        maxlength: 2000
    },
    numberOfSeasons: {
        type: Number,
        min: 0
    },
    numberOfEpisodes: {
        type: Number,
        min: 0
    },
    episodeRunTime: [Number], // Array of typical episode lengths
    status: {
        type: String,
        enum: ['Returning Series', 'Ended', 'Canceled', 'In Production', 'Planned', 'Pilot', 'Unknown'],
        default: 'Unknown'
    },
    tmdbGenres: [{
        id: Number,
        name: String
    }],
    tmdbRating: {
        type: Number,
        min: 0,
        max: 10
    },
    tmdbVoteCount: Number,
    networks: [{
        id: Number,
        name: String,
        logoPath: String
    }],
    creators: [String],
    cast: [String],

    // Personal Data
    myRating: {
        type: Number,
        required: [true, 'Your rating is required'],
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot exceed 5'],
        validate: {
            validator: function (v) {
                return v % 0.5 === 0;
            },
            message: 'Rating must be in 0.5 increments (0, 0.5, 1, 1.5, etc.)'
        }
    },
    watchStatus: {
        type: String,
        enum: ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'],
        default: 'watching'
    },
    currentSeason: {
        type: Number,
        min: 0,
        default: 1
    },
    currentEpisode: {
        type: Number,
        min: 0,
        default: 1
    },
    startedDate: {
        type: Date,
        default: Date.now
    },
    completedDate: Date,
    myReview: {
        type: String,
        maxlength: [2000, 'Review cannot exceed 2000 characters'],
        trim: true
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return v.length <= 10;
            },
            message: 'Maximum 10 tags allowed'
        }
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    rewatchCount: {
        type: Number,
        default: 0,
        min: 0
    },
    notes: {
        type: String,
        maxlength: 1000
    },

    // Metadata
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for common queries
tvShowSchema.index({ tmdbId: 1 }, { unique: true });
tvShowSchema.index({ addedBy: 1 });
tvShowSchema.index({ startedDate: -1 });
tvShowSchema.index({ myRating: -1 });
tvShowSchema.index({ watchStatus: 1 });
tvShowSchema.index({ tags: 1 });
tvShowSchema.index({ isFavorite: 1 });
tvShowSchema.index({ name: 'text', myReview: 'text', overview: 'text' });

// Virtual: Full poster URL
tvShowSchema.virtual('posterUrl').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${this.posterPath}`;
});

// Virtual: Full backdrop URL
tvShowSchema.virtual('backdropUrl').get(function () {
    if (!this.backdropPath) return null;
    return `https://image.tmdb.org/t/p/w1280${this.backdropPath}`;
});

// Virtual: Thumbnail poster URL
tvShowSchema.virtual('posterThumbnail').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w185${this.posterPath}`;
});

// Virtual: Year from first air date
tvShowSchema.virtual('year').get(function () {
    if (!this.firstAirDate) return null;
    return new Date(this.firstAirDate).getFullYear();
});

// Virtual: Average episode runtime
tvShowSchema.virtual('avgEpisodeRuntime').get(function () {
    if (!this.episodeRunTime || this.episodeRunTime.length === 0) return null;
    return Math.round(this.episodeRunTime.reduce((a, b) => a + b, 0) / this.episodeRunTime.length);
});

// Virtual: Watch progress percentage
tvShowSchema.virtual('watchProgress').get(function () {
    if (!this.numberOfEpisodes || this.numberOfEpisodes === 0) return 0;
    const watchedEpisodes = (this.currentSeason - 1) * (this.numberOfEpisodes / this.numberOfSeasons) + this.currentEpisode;
    return Math.round((watchedEpisodes / this.numberOfEpisodes) * 100);
});

/**
 * Static method: Find TV show by TMDB ID
 */
tvShowSchema.statics.findByTMDBId = function (tmdbId) {
    return this.findOne({ tmdbId });
};

/**
 * Static method: Get statistics for a user
 */
tvShowSchema.statics.getStatistics = async function (userId) {
    const stats = await this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalShows: { $sum: 1 },
                averageRating: { $avg: '$myRating' },
                totalEpisodes: { $sum: '$numberOfEpisodes' },
                favoriteCount: {
                    $sum: { $cond: ['$isFavorite', 1, 0] }
                },
                watching: {
                    $sum: { $cond: [{ $eq: ['$watchStatus', 'watching'] }, 1, 0] }
                },
                completed: {
                    $sum: { $cond: [{ $eq: ['$watchStatus', 'completed'] }, 1, 0] }
                },
                onHold: {
                    $sum: { $cond: [{ $eq: ['$watchStatus', 'on-hold'] }, 1, 0] }
                },
                dropped: {
                    $sum: { $cond: [{ $eq: ['$watchStatus', 'dropped'] }, 1, 0] }
                }
            }
        }
    ]);

    return stats[0] || {
        totalShows: 0,
        averageRating: 0,
        totalEpisodes: 0,
        favoriteCount: 0,
        watching: 0,
        completed: 0,
        onHold: 0,
        dropped: 0
    };
};

/**
 * Static method: Get rating distribution
 */
tvShowSchema.statics.getRatingDistribution = async function (userId) {
    return this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$myRating',
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: -1 } }
    ]);
};

/**
 * Static method: Get shows by status
 */
tvShowSchema.statics.getByStatus = async function (userId) {
    return this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$watchStatus',
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

/**
 * Static method: Get top tags
 */
tvShowSchema.statics.getTopTags = async function (userId, limit = 10) {
    return this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        { $unwind: '$tags' },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: limit }
    ]);
};

const TVShow = mongoose.model('TVShow', tvShowSchema);

export default TVShow;
