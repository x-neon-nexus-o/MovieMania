import { Router } from 'express';
import {
    searchMovies,
    getMovieDetails,
    getTrending,
    getPopular,
    getMovieVideos,
    getWatchProviders,
    getRecommendations,
    getSimilarMovies,
    searchTVShows,
    getTVShowDetails,
    getTrendingTV,
    getPopularTV,
    getTVShowVideos,
    getTVWatchProviders,
    getTVShowRecommendations,
    searchValidation
} from '../controllers/tmdbController.js';
import { authenticate } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { tmdbLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// ==================== MOVIE ROUTES ====================
router.get('/trending', tmdbLimiter, getTrending);
router.get('/popular', tmdbLimiter, getPopular);
router.get('/movie/:tmdbId/videos', tmdbLimiter, getMovieVideos);
router.get('/movie/:tmdbId/providers', tmdbLimiter, getWatchProviders);
router.get('/movie/:tmdbId/recommendations', tmdbLimiter, getRecommendations);
router.get('/movie/:tmdbId/similar', tmdbLimiter, getSimilarMovies);
router.get('/search', authenticate, tmdbLimiter, searchValidation, validateRequest, searchMovies);
router.get('/movie/:tmdbId', authenticate, tmdbLimiter, getMovieDetails);

// ==================== TV SHOW ROUTES ====================
router.get('/tv/trending', tmdbLimiter, getTrendingTV);
router.get('/tv/popular', tmdbLimiter, getPopularTV);
router.get('/tv/search', authenticate, tmdbLimiter, searchValidation, validateRequest, searchTVShows);
router.get('/tv/:tmdbId/videos', tmdbLimiter, getTVShowVideos);
router.get('/tv/:tmdbId/providers', tmdbLimiter, getTVWatchProviders);
router.get('/tv/:tmdbId/recommendations', tmdbLimiter, getTVShowRecommendations);
router.get('/tv/:tmdbId', authenticate, tmdbLimiter, getTVShowDetails);

export default router;

