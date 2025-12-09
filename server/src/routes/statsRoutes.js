import { Router } from 'express';
import {
    getStats,
    getStatsByYear,
    getStatsByRating,
    getStatsByGenre,
    getTimeline,
    getTopTags,
    getHeatmap,
    getStatsByDecade,
    getStreaks,
    getCreditStats
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
router.get('/by-decade', optionalAuth, getStatsByDecade);
router.get('/timeline', optionalAuth, getTimeline);
router.get('/tags', optionalAuth, getTopTags);
router.get('/heatmap', optionalAuth, getHeatmap);
router.get('/streaks', optionalAuth, getStreaks);
router.get('/credits', optionalAuth, getCreditStats);

export default router;
