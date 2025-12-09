import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getRecommendations,
    getBecauseYouWatched,
    getTasteProfile
} from '../controllers/recommendationController.js';

const router = express.Router();

// All recommendation routes require authentication
router.use(authenticate);

// GET /api/recommendations - Get personalized recommendations
router.get('/', getRecommendations);

// GET /api/recommendations/profile - Get user's taste profile
router.get('/profile', getTasteProfile);

// GET /api/recommendations/because/:tmdbId - "Because you watched X"
router.get('/because/:tmdbId', getBecauseYouWatched);

export default router;
