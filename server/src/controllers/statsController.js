import Movie from '../models/Movie.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get overall statistics
 * @route   GET /api/stats
 * @access  Public (returns public movies stats) / Private (returns user's stats)
 */
export const getStats = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const stats = await Movie.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: null,
                totalMovies: { $sum: 1 },
                averageRating: { $avg: '$myRating' },
                totalRuntime: { $sum: '$runtime' },
                favoriteCount: { $sum: { $cond: ['$isFavorite', 1, 0] } },
                maxRating: { $max: '$myRating' },
                minRating: { $min: '$myRating' }
            }
        }
    ]);

    // Get top rated movie
    const topRated = await Movie.findOne(matchQuery)
        .sort({ myRating: -1 })
        .select('title year myRating posterPath');

    // Get most recent
    const mostRecent = await Movie.findOne(matchQuery)
        .sort({ watchedDate: -1 })
        .select('title year myRating watchedDate posterPath');

    // Get most watched year
    const yearStats = await Movie.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$year', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const result = stats[0] || {
        totalMovies: 0,
        averageRating: 0,
        totalRuntime: 0,
        favoriteCount: 0,
        maxRating: 0,
        minRating: 0
    };

    ApiResponse.success(res, {
        ...result,
        averageRating: Math.round((result.averageRating || 0) * 10) / 10,
        totalRuntimeHours: Math.round((result.totalRuntime || 0) / 60),
        topRatedMovie: topRated,
        mostRecentMovie: mostRecent,
        mostWatchedYear: yearStats[0]?._id || null
    });
});

/**
 * @desc    Get movies grouped by year
 * @route   GET /api/stats/by-year
 * @access  Public
 */
export const getStatsByYear = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const stats = await Movie.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$year',
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' },
                totalRuntime: { $sum: '$runtime' }
            }
        },
        { $sort: { _id: -1 } }
    ]);

    ApiResponse.success(res, { byYear: stats });
});

/**
 * @desc    Get rating distribution
 * @route   GET /api/stats/by-rating
 * @access  Public
 */
export const getStatsByRating = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const stats = await Movie.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$myRating',
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: -1 } }
    ]);

    // Convert to object format
    const distribution = {};
    stats.forEach(item => {
        distribution[item._id] = item.count;
    });

    ApiResponse.success(res, { ratingDistribution: distribution });
});

/**
 * @desc    Get genre breakdown
 * @route   GET /api/stats/by-genre
 * @access  Public
 */
export const getStatsByGenre = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const stats = await Movie.aggregate([
        { $match: matchQuery },
        { $unwind: '$tmdbGenres' },
        {
            $group: {
                _id: '$tmdbGenres.name',
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 15 }
    ]);

    ApiResponse.success(res, { byGenre: stats });
});

/**
 * @desc    Get watching timeline (movies by month)
 * @route   GET /api/stats/timeline
 * @access  Public
 */
export const getTimeline = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const stats = await Movie.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: {
                    year: { $year: '$watchedDate' },
                    month: { $month: '$watchedDate' }
                },
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 24 } // Last 2 years
    ]);

    ApiResponse.success(res, { timeline: stats });
});

/**
 * @desc    Get top tags
 * @route   GET /api/stats/tags
 * @access  Public
 */
export const getTopTags = asyncHandler(async (req, res) => {
    const { limit = 20 } = req.query;
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const stats = await Movie.aggregate([
        { $match: matchQuery },
        { $unwind: '$tags' },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit) }
    ]);

    ApiResponse.success(res, { topTags: stats });
});
