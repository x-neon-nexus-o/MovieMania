import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import {
    getAllEpisodes,
    getSeasonEpisodes,
    getShowAnalytics,
    rateEpisode,
    syncEpisodes,
} from '../controllers/episodeController.js';

const router = Router();

// Public routes - can view without auth
router.get('/:tmdbShowId', optionalAuth, getAllEpisodes);
router.get('/:tmdbShowId/season/:seasonNumber', optionalAuth, getSeasonEpisodes);
router.get('/:tmdbShowId/analytics', optionalAuth, getShowAnalytics);

// Protected routes - require auth
router.post('/:tmdbShowId/rate', authenticate, rateEpisode);
router.post('/:tmdbShowId/sync', authenticate, syncEpisodes);

export default router;
