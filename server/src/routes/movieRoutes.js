import { Router } from 'express';
import {
    getMovies,
    getMovie,
    getMovieByTMDBId,
    createMovie,
    updateMovie,
    deleteMovie,
    getAllTags,
    bulkUpdate,
    createMovieValidation,
    updateMovieValidation
} from '../controllers/movieController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

// Public routes (with optional auth for user-specific data)
router.get('/', optionalAuth, getMovies);
router.get('/tags', optionalAuth, getAllTags);
router.get('/tmdb/:tmdbId', optionalAuth, getMovieByTMDBId);
router.get('/:id', optionalAuth, getMovie);

// Protected routes
router.post('/', authenticate, createMovieValidation, validateRequest, createMovie);
router.put('/:id', authenticate, updateMovieValidation, validateRequest, updateMovie);
router.patch('/:id', authenticate, updateMovieValidation, validateRequest, updateMovie);
router.delete('/:id', authenticate, deleteMovie);
router.patch('/bulk/update', authenticate, bulkUpdate);

export default router;
