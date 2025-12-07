import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    // TMDB Data
    tmdbId: {
        type: Number,
        required: [true, 'TMDB ID is required'],
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 500
    },
    originalTitle: {
        type: String,
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1888, 'Year must be after 1888 (first film ever made)'],
        max: [new Date().getFullYear() + 5, 'Year cannot be too far in the future']
    },
    releaseDate: Date,
    posterPath: String,
    backdropPath: String,
    overview: {
        type: String,
        maxlength: 2000
    },
    runtime: {
        type: Number,
        min: 0
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
    director: String,
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
    watchedDate: {
        type: Date,
        required: [true, 'Watched date is required'],
        default: Date.now
    },
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
movieSchema.index({ tmdbId: 1 }, { unique: true });
movieSchema.index({ addedBy: 1 });
movieSchema.index({ watchedDate: -1 });
movieSchema.index({ myRating: -1 });
movieSchema.index({ year: 1 });
movieSchema.index({ tags: 1 });
movieSchema.index({ isFavorite: 1 });
movieSchema.index({ title: 'text', myReview: 'text', overview: 'text' });

// Virtual: Full poster URL
movieSchema.virtual('posterUrl').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${this.posterPath}`;
});

// Virtual: Full backdrop URL
movieSchema.virtual('backdropUrl').get(function () {
    if (!this.backdropPath) return null;
    return `https://image.tmdb.org/t/p/w1280${this.backdropPath}`;
});

// Virtual: Thumbnail poster URL
movieSchema.virtual('posterThumbnail').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w185${this.posterPath}`;
});

// Virtual: Years since watched
movieSchema.virtual('yearsSinceWatched').get(function () {
    if (!this.watchedDate) return null;
    const now = new Date();
    const watched = new Date(this.watchedDate);
    return Math.floor((now - watched) / (365.25 * 24 * 60 * 60 * 1000));
});

/**
 * Static method: Find movie by TMDB ID
 */
movieSchema.statics.findByTMDBId = function (tmdbId) {
    return this.findOne({ tmdbId });
};

/**
 * Static method: Get statistics for a user
 */
movieSchema.statics.getStatistics = async function (userId) {
    const stats = await this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalMovies: { $sum: 1 },
                averageRating: { $avg: '$myRating' },
                totalRuntime: { $sum: '$runtime' },
                favoriteCount: {
                    $sum: { $cond: ['$isFavorite', 1, 0] }
                }
            }
        }
    ]);

    return stats[0] || {
        totalMovies: 0,
        averageRating: 0,
        totalRuntime: 0,
        favoriteCount: 0
    };
};

/**
 * Static method: Get rating distribution
 */
movieSchema.statics.getRatingDistribution = async function (userId) {
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
 * Static method: Get movies by year
 */
movieSchema.statics.getByYear = async function (userId) {
    return this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$year',
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' }
            }
        },
        { $sort: { _id: -1 } }
    ]);
};

/**
 * Static method: Get top tags
 */
movieSchema.statics.getTopTags = async function (userId, limit = 10) {
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

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
