import mongoose from 'mongoose';

const watchlistMovieSchema = new mongoose.Schema({
    // TMDB Data
    tmdbId: {
        type: Number,
        required: [true, 'TMDB ID is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 500
    },
    year: {
        type: Number,
        min: [1888, 'Year must be after 1888'],
        max: [new Date().getFullYear() + 5, 'Year cannot be too far in the future']
    },
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
    releaseDate: Date,

    // Watchlist-specific fields
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    targetWatchDate: Date,
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

    // Streaming availability (for future notifications)
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

// Compound unique index - one entry per movie per user
watchlistMovieSchema.index({ tmdbId: 1, addedBy: 1 }, { unique: true });
watchlistMovieSchema.index({ addedBy: 1, priority: 1 });
watchlistMovieSchema.index({ addedBy: 1, createdAt: -1 });
watchlistMovieSchema.index({ targetWatchDate: 1 });

// Virtual: Full poster URL
watchlistMovieSchema.virtual('posterUrl').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${this.posterPath}`;
});

// Virtual: Thumbnail poster URL
watchlistMovieSchema.virtual('posterThumbnail').get(function () {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/w185${this.posterPath}`;
});

// Virtual: Days since added
watchlistMovieSchema.virtual('daysSinceAdded').get(function () {
    const now = new Date();
    const added = new Date(this.createdAt);
    return Math.floor((now - added) / (24 * 60 * 60 * 1000));
});

/**
 * Static method: Get watchlist statistics for a user
 */
watchlistMovieSchema.statics.getStatistics = async function (userId) {
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

const WatchlistMovie = mongoose.model('WatchlistMovie', watchlistMovieSchema);

export default WatchlistMovie;
