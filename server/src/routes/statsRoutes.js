import { Router } from 'express';
import {
    getStats,
    getStatsByYear,
    getStatsByRating,
    getStatsByGenre,
    getTimeline,
    getTopTags
} from '../controllers/statsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// All stats routes support optional auth
// If authenticated, shows user's stats
// If not, shows public movies stats
router.get('/', optionalAuth, getStats);
router.get('/by-year', optionalAuth, getStatsByYear);
router.get('/by-rating', optionalAuth, getStatsByRating);
router.get('/by-genre', optionalAuth, getStatsByGenre);
router.get('/timeline', optionalAuth, getTimeline);
router.get('/tags', optionalAuth, getTopTags);

export default router;
