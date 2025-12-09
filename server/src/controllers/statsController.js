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

/**
 * @desc    Get heatmap data for calendar visualization
 * @route   GET /api/stats/heatmap
 * @access  Public
 */
export const getHeatmap = asyncHandler(async (req, res) => {
    const { year = new Date().getFullYear() } = req.query;
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const stats = await Movie.aggregate([
        {
            $match: {
                ...matchQuery,
                watchedDate: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$watchedDate' }
                },
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Convert to object for easy lookup
    const heatmapData = {};
    stats.forEach(item => {
        heatmapData[item._id] = {
            count: item.count,
            avgRating: Math.round(item.avgRating * 10) / 10
        };
    });

    ApiResponse.success(res, {
        year: parseInt(year),
        heatmap: heatmapData,
        totalDays: stats.length
    });
});

/**
 * @desc    Get movies grouped by decade
 * @route   GET /api/stats/by-decade
 * @access  Public
 */
export const getStatsByDecade = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    const stats = await Movie.aggregate([
        { $match: matchQuery },
        {
            $addFields: {
                decade: {
                    $multiply: [
                        { $floor: { $divide: ['$year', 10] } },
                        10
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$decade',
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' },
                totalRuntime: { $sum: '$runtime' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Format decades nicely
    const decades = stats.map(item => ({
        decade: `${item._id}s`,
        startYear: item._id,
        count: item.count,
        avgRating: Math.round((item.avgRating || 0) * 10) / 10,
        totalRuntime: item.totalRuntime
    }));

    ApiResponse.success(res, { byDecade: decades });
});

/**
 * @desc    Get watching streaks
 * @route   GET /api/stats/streaks
 * @access  Public
 */
export const getStreaks = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    // Get all watch dates sorted
    const movies = await Movie.find(matchQuery)
        .select('watchedDate')
        .sort({ watchedDate: 1 });

    if (movies.length === 0) {
        return ApiResponse.success(res, {
            currentStreak: 0,
            longestStreak: 0,
            totalWatchDays: 0,
            avgMoviesPerMonth: 0
        });
    }

    // Get unique dates
    const watchDates = [...new Set(
        movies.map(m => m.watchedDate.toISOString().split('T')[0])
    )].sort();

    // Calculate streaks (weekly - watching at least once per week)
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    const lastWatchDate = new Date(watchDates[watchDates.length - 1]);
    const daysSinceLastWatch = Math.floor((today - lastWatchDate) / (1000 * 60 * 60 * 24));

    // Check if still in an active streak (watched within last 7 days)
    if (daysSinceLastWatch <= 7) {
        currentStreak = 1;
        // Count backwards to find current streak
        for (let i = watchDates.length - 2; i >= 0; i--) {
            const current = new Date(watchDates[i + 1]);
            const prev = new Date(watchDates[i]);
            const diff = Math.floor((current - prev) / (1000 * 60 * 60 * 24));
            if (diff <= 7) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    for (let i = 1; i < watchDates.length; i++) {
        const current = new Date(watchDates[i]);
        const prev = new Date(watchDates[i - 1]);
        const diff = Math.floor((current - prev) / (1000 * 60 * 60 * 24));

        if (diff <= 7) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate average movies per month
    const firstWatch = new Date(watchDates[0]);
    const monthsActive = Math.max(1,
        (today.getFullYear() - firstWatch.getFullYear()) * 12 +
        (today.getMonth() - firstWatch.getMonth())
    );
    const avgMoviesPerMonth = Math.round((movies.length / monthsActive) * 10) / 10;

    ApiResponse.success(res, {
        currentStreak,
        longestStreak,
        totalWatchDays: watchDates.length,
        avgMoviesPerMonth,
        daysSinceLastWatch
    });
});

/**
 * @desc    Get director and actor statistics
 * @route   GET /api/stats/credits
 * @access  Public
 */
export const getCreditStats = asyncHandler(async (req, res) => {
    const matchQuery = req.user
        ? { addedBy: req.user._id }
        : { isPublic: true };

    // Top directors
    const directors = await Movie.aggregate([
        { $match: { ...matchQuery, director: { $exists: true, $ne: '' } } },
        {
            $group: {
                _id: '$director',
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    // Top actors
    const actors = await Movie.aggregate([
        { $match: matchQuery },
        { $unwind: '$cast' },
        {
            $group: {
                _id: '$cast',
                count: { $sum: 1 },
                avgRating: { $avg: '$myRating' }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    ApiResponse.success(res, {
        topDirectors: directors.map(d => ({
            name: d._id,
            count: d.count,
            avgRating: Math.round((d.avgRating || 0) * 10) / 10
        })),
        topActors: actors.map(a => ({
            name: a._id,
            count: a.count,
            avgRating: Math.round((a.avgRating || 0) * 10) / 10
        }))
    });
});
