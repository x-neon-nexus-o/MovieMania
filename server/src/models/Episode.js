import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema(
    {
        tmdbShowId: {
            type: Number,
            required: true,
            index: true,
        },
        seasonNumber: {
            type: Number,
            required: true,
            min: 0,
        },
        episodeNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        overview: {
            type: String,
            default: '',
        },
        airDate: {
            type: Date,
        },
        voteAverage: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        voteCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        stillPath: {
            type: String,
        },
        runtime: {
            type: Number,
            min: 0,
        },
        // User ratings
        userRatings: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 10,
                },
                ratedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        // Cached analytics for performance
        cachedAnalytics: {
            averageUserRating: {
                type: Number,
                default: 0,
            },
            totalUserRatings: {
                type: Number,
                default: 0,
            },
            lastUpdated: {
                type: Date,
                default: Date.now,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Compound Indexes following ESR (Equality, Sort, Range) Rule
episodeSchema.index({ tmdbShowId: 1, seasonNumber: 1, episodeNumber: 1 }, { unique: true });
episodeSchema.index({ tmdbShowId: 1, seasonNumber: 1 });
episodeSchema.index({ 'userRatings.userId': 1, tmdbShowId: 1 });
episodeSchema.index({ tmdbShowId: 1, voteAverage: -1 });
episodeSchema.index({ tmdbShowId: 1, airDate: -1 });

// Virtual for full episode identifier
episodeSchema.virtual('episodeCode').get(function () {
    return `S${String(this.seasonNumber).padStart(2, '0')}E${String(this.episodeNumber).padStart(2, '0')}`;
});

// Method to update cached analytics
episodeSchema.methods.updateCachedAnalytics = function () {
    if (this.userRatings.length > 0) {
        const sum = this.userRatings.reduce((acc, rating) => acc + rating.rating, 0);
        this.cachedAnalytics.averageUserRating = sum / this.userRatings.length;
        this.cachedAnalytics.totalUserRatings = this.userRatings.length;
        this.cachedAnalytics.lastUpdated = new Date();
    }
};

// Static method for bulk analytics
episodeSchema.statics.getShowAnalytics = async function (tmdbShowId) {
    const pipeline = [
        { $match: { tmdbShowId } },
        {
            $group: {
                _id: '$seasonNumber',
                episodeCount: { $sum: 1 },
                averageRating: { $avg: '$voteAverage' },
                maxRating: { $max: '$voteAverage' },
                minRating: { $min: '$voteAverage' },
            },
        },
        { $sort: { _id: 1 } },
    ];

    return await this.aggregate(pipeline);
};

// Pre-save hook to update cached analytics
episodeSchema.pre('save', function (next) {
    if (this.isModified('userRatings')) {
        this.updateCachedAnalytics();
    }
    next();
});

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;
