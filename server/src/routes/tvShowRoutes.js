import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import {
    getTVShows,
    getTVShow,
    getTVShowByTMDBId,
    createTVShow,
    updateTVShow,
    deleteTVShow,
    getAllTags,
    bulkUpdate,
    createTVShowValidation,
    updateTVShowValidation
} from '../controllers/tvShowController.js';

const router = Router();

// Public routes (with optional auth for user's own content)
router.get('/', optionalAuth, getTVShows);
router.get('/tags', optionalAuth, getAllTags);
router.get('/tmdb/:tmdbId', optionalAuth, getTVShowByTMDBId);
router.get('/:id', optionalAuth, getTVShow);

// Protected routes
router.post('/', authenticate, createTVShowValidation, validateRequest, createTVShow);
router.put('/:id', authenticate, updateTVShowValidation, validateRequest, updateTVShow);
router.delete('/:id', authenticate, deleteTVShow);
router.patch('/bulk', authenticate, bulkUpdate);

export default router;
