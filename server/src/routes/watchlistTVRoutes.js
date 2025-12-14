import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getTVWatchlist,
    getTVWatchlistStats,
    getTVWatchlistItem,
    addToTVWatchlist,
    updateTVWatchlistItem,
    updateTVPriority,
    removeFromTVWatchlist,
    startWatching,
    checkTVShowStatus
} from '../controllers/watchlistTVShowController.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Statistics route (must be before :id routes)
router.get('/stats', getTVWatchlistStats);

// Check TV show status route
router.get('/check/:tmdbId', checkTVShowStatus);

// CRUD routes
router.get('/', getTVWatchlist);
router.get('/:id', getTVWatchlistItem);
router.post('/', addToTVWatchlist);
router.put('/:id', updateTVWatchlistItem);
router.delete('/:id', removeFromTVWatchlist);

// Quick priority update
router.patch('/:id/priority', updateTVPriority);

// Move to tracking (start watching)
router.post('/:id/start-watching', startWatching);

export default router;
