import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import geminiService from '../services/geminiService.js';
import WatchlistMovie from '../models/WatchlistMovie.js';
import tmdbService from '../services/tmdbService.js';

// Helper to build user taste profile from watchlist
const buildTasteProfile = async (userId) => {
    const watchlist = await WatchlistMovie.find({
        addedBy: userId,
        myRating: { $gte: 4 } // High rated movies
    }).limit(10); // Use last 10 highly rated movies

    if (watchlist.length === 0) {
        return {
            favoriteGenres: ['General'],
            avgRating: 0,
            keywords: [],
        };
    }

    const ratings = watchlist.map(m => m.myRating);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    // In a real app, we'd aggregate genres and keywords more robustly
    // For now, we'll use a simplified approach
    const genres = [
        ...new Set(watchlist.flatMap(m => m.tags))
    ].slice(0, 5);

    return {
        favoriteGenres: genres.length > 0 ? genres : ['Various'],
        avgRating,
        keywords: genres // Using tags as keywords for now
    };
};

export const predictMovieRating = asyncHandler(async (req, res) => {
    const { tmdbId, type = 'movie' } = req.params;

    try {
        // 1. Get Movie/TV Details
        const details = type === 'movie'
            ? await tmdbService.getMovieDetails(tmdbId)
            : await tmdbService.getTVShowDetails(tmdbId);

        // 2. Build User Taste Profile
        const userTaste = await buildTasteProfile(req.user._id);

        // 3. Get Prediction
        const movieData = {
            title: details.title || details.name,
            genres: details.genres ? details.genres.map(g => g.name) : [],
            overview: details.overview || '',
            voteAverage: details.vote_average || 0
        };

        const prediction = await geminiService.predictRating(userTaste, movieData);

        ApiResponse.success(res, prediction);
    } catch (error) {
        console.error('Prediction Error:', error);
        ApiResponse.error(res, 'Failed to predict rating', 503);
    }
});

export const getTasteMatch = asyncHandler(async (req, res) => {
    const { tmdbId, type = 'movie' } = req.params;

    try {
        const details = type === 'movie'
            ? await tmdbService.getMovieDetails(tmdbId)
            : await tmdbService.getTVShowDetails(tmdbId);

        const userTaste = await buildTasteProfile(req.user._id);

        const movieData = {
            title: details.title || details.name,
            genres: details.genres ? details.genres.map(g => g.name) : []
        };

        const match = await geminiService.calculateTasteMatch(userTaste, movieData);

        ApiResponse.success(res, match);
    } catch (error) {
        console.error('Taste Match Error:', error);
        ApiResponse.error(res, 'Failed to calculate taste match', 503);
    }
});
