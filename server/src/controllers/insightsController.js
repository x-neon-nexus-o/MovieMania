import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import geminiService from '../services/geminiService.js';
import WatchlistMovie from '../models/WatchlistMovie.js';
import WatchlistTVShow from '../models/WatchlistTVShow.js';

const buildExtendedProfile = async (userId) => {
    // Fetch all watched content
    const [movies, tvShows] = await Promise.all([
        WatchlistMovie.find({ addedBy: userId, watchStatus: 'Watched' }),
        WatchlistTVShow.find({ addedBy: userId, watchStatus: 'Watched' })
    ]);

    const allItems = [...movies, ...tvShows];

    if (allItems.length < 5) {
        return null; // Not enough data
    }

    // Calculate aggregations
    const ratings = allItems.map(i => i.myRating).filter(r => r > 0);
    const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

    // Get all genres (flattened)
    const genres = allItems.flatMap(i => i.genres || []).map(g => g.name || g);
    const genreCounts = genres.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});

    const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([k]) => k);

    // Simplistic analysis of directors/actors would require fetching full credits
    // For MVP, we'll skip detailed credits and rely on genres + ratings + tags

    // Determine watch pattern (weekend vs weekday based on watchedDate)
    const weekendCount = allItems.filter(i => {
        const date = new Date(i.watchedDate);
        const day = date.getDay();
        return day === 0 || day === 6;
    }).length;

    const watchPatterns = weekendCount > allItems.length / 2
        ? "More active on weekends"
        : "Steady viewer throughout the week";

    return {
        totalMovies: allItems.length,
        favoriteGenres: topGenres,
        topDirectors: ["Unknown"], // Would need credit enrichment
        topActors: ["Unknown"], // Would need credit enrichment
        avgRating,
        watchPatterns
    };
};

export const getAutoInsights = asyncHandler(async (req, res) => {
    try {
        const profile = await buildExtendedProfile(req.user._id);

        if (!profile) {
            return ApiResponse.success(res, {
                ready: false,
                message: 'Rate at least 5 movies/shows to unlock insights!'
            });
        }

        const insights = await geminiService.generateInsights(profile);

        ApiResponse.success(res, {
            ready: true,
            insights
        });
    } catch (error) {
        console.error('Insights Error:', error);
        ApiResponse.error(res, 'Failed to generate insights', 503);
    }
});
