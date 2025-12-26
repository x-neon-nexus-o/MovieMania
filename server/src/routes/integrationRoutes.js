import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import traktService from '../services/traktService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// OAuth callback for Trakt
router.post('/trakt/callback', authenticate, asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return ApiResponse.error(res, 'Authorization code is required', 400);
    }

    const { username } = await traktService.exchangeCode(code, req.user._id);
    ApiResponse.success(res, { username }, 'Connected to Trakt successfully');
}));

// Trigger manual sync
router.post('/trakt/sync', authenticate, asyncHandler(async (req, res) => {
    const result = await traktService.syncHistory(req.user._id);
    ApiResponse.success(res, result, `Synced ${result.syncedCount} movies from Trakt`);
}));

export default router;
