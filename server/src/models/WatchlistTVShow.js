import mongoose from 'mongoose';

const watchlistTVShowSchema = new mongoose.Schema({
    // TMDB Data
    tmdbId: {
        type: Number,
        required: [true, 'TMDB ID is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 500
    },
    firstAirDate: Date,
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
    status: String,
    tmdbGenres: [{
        id: Number,
        name: String
    }],
    tmdbRating: {
        type: Number,
        min: 0,
        max: 10
    },
    networks: [{
        id: Number,
        name: String
    }],

    // Watchlist-specific fields
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    targetStartDate: Date,
    notes: {
        type: String,
        maxlength: 500
    },
    source: {
        type: String,
        enum: ['friend', 'social_media', 'trailer', 'article', 'recommendation', 'other'],
        default: 'other'
    },
    recommendedBy: {
        type: String,
        maxlength: 100
    },

    // Owner
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Streaming availability
    isAvailableOnStreaming: {
        type: Boolean,
        default: false
    },
    streamingPlatforms: [String],
    reminderSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound unique index - one entry per show per user
watchlistTVShowSchema.index({ tmdbId: 1, addedBy: 1 }, { unique: true });
watchlistTVShowSchema.index({ addedBy: 1, priority: 1 });
watchlistTVShowSchema.index({ addedBy: 1, createdAt: -1 });
watchlistTVShowSchema.index({ targetStartDate: 1 });

// Virtual: Full poster URL
watchlistTVShowSchema.virtual('posterUrl').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${this.posterPath}`;
});

// Virtual: Thumbnail poster URL
watchlistTVShowSchema.virtual('posterThumbnail').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w185${this.posterPath}`;
});

// Virtual: Year from first air date
watchlistTVShowSchema.virtual('year').get(function () {
    if (!this.firstAirDate) return null;
    return new Date(this.firstAirDate).getFullYear();
});

// Virtual: Days since added
watchlistTVShowSchema.virtual('daysSinceAdded').get(function () {
    const now = new Date();
    const added = new Date(this.createdAt);
    return Math.floor((now - added) / (24 * 60 * 60 * 1000));
});

/**
 * Static method: Get watchlist statistics for a user
 */
watchlistTVShowSchema.statics.getStatistics = async function (userId) {
    const stats = await this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                highPriority: {
                    $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
                },
                mediumPriority: {
                    $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
                },
                lowPriority: {
                    $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
                }
            }
        }
    ]);

    // Genre breakdown
    const genreBreakdown = await this.aggregate([
        { $match: { addedBy: new mongoose.Types.ObjectId(userId) } },
        { $unwind: '$tmdbGenres' },
        {
            $group: {
                _id: '$tmdbGenres.name',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    return {
        ...(stats[0] || { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 }),
        topGenres: genreBreakdown
    };
};

const WatchlistTVShow = mongoose.model('WatchlistTVShow', watchlistTVShowSchema);

export default WatchlistTVShow;
