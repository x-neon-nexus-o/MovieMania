import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getWatchlist,
    getWatchlistStats,
    getWatchlistItem,
    addToWatchlist,
    updateWatchlistItem,
    updatePriority,
    removeFromWatchlist,
    moveToWatched,
    checkMovieStatus
} from '../controllers/watchlistController.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getWatchlist);
router.get('/stats', getWatchlistStats);
router.get('/check/:tmdbId', checkMovieStatus);
router.get('/:id', getWatchlistItem);
router.post('/', addToWatchlist);
router.put('/:id', updateWatchlistItem);
router.patch('/:id/priority', updatePriority);
router.delete('/:id', removeFromWatchlist);
router.post('/:id/move-to-watched', moveToWatched);

export default router;
