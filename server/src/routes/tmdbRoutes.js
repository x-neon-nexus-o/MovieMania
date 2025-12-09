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
    searchValidation
} from '../controllers/tmdbController.js';
import { authenticate } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { tmdbLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public routes
router.get('/trending', tmdbLimiter, getTrending);
router.get('/popular', tmdbLimiter, getPopular);
router.get('/movie/:tmdbId/videos', tmdbLimiter, getMovieVideos);
router.get('/movie/:tmdbId/providers', tmdbLimiter, getWatchProviders);
router.get('/movie/:tmdbId/recommendations', tmdbLimiter, getRecommendations);
router.get('/movie/:tmdbId/similar', tmdbLimiter, getSimilarMovies);

// Protected routes (requires auth to search)
router.get('/search', authenticate, tmdbLimiter, searchValidation, validateRequest, searchMovies);
router.get('/movie/:tmdbId', authenticate, tmdbLimiter, getMovieDetails);

export default router;
