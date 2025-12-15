import { Router } from 'express';
import {
    generateReviewDraft,
    expandThoughts,
    removeSpoilers,
    analyzeSentiment,
    suggestTags
} from '../controllers/aiController.js';
import { smartSearch } from '../controllers/smartSearchController.js';
import { predictMovieRating, getTasteMatch } from '../controllers/predictionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to all AI routes
router.use(authenticate);

router.post('/search', smartSearch);

router.get('/predict/rating/:tmdbId', predictMovieRating);
router.get('/predict/match/:tmdbId', getTasteMatch);
// Support TV shows too with query param or separate route, for now let's assume query supported
router.get('/predict/rating/:tmdbId/:type', predictMovieRating);
router.get('/predict/match/:tmdbId/:type', getTasteMatch);

import { getAutoInsights } from '../controllers/insightsController.js';
router.get('/insights/dashboard', getAutoInsights);

router.post('/review/generate', generateReviewDraft);
router.post('/review/expand', expandThoughts);
router.post('/review/spoiler-free', removeSpoilers);
router.post('/review/analyze', analyzeSentiment);
router.post('/review/suggest-tags', suggestTags);

export default router;
