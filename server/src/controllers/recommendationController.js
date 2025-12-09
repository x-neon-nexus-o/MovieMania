import recommendationService from '../services/recommendationService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get personalized recommendations
 * @route   GET /api/recommendations
 * @access  Private
 */
export const getRecommendations = asyncHandler(async (req, res) => {
    const { type = 'home' } = req.query;

    const result = await recommendationService.getRecommendations(req.user._id, type);

    ApiResponse.success(res, result, 'Recommendations fetched successfully');
});

/**
 * @desc    Get "Because you watched X" recommendations
 * @route   GET /api/recommendations/because/:tmdbId
 * @access  Private
 */
export const getBecauseYouWatched = asyncHandler(async (req, res) => {
    const { tmdbId } = req.params;

    const recommendations = await recommendationService.getBecauseYouWatched(
        parseInt(tmdbId),
        req.user._id
    );

    ApiResponse.success(res, { recommendations });
});

/**
 * @desc    Get user's taste profile
 * @route   GET /api/recommendations/profile
 * @access  Private
 */
export const getTasteProfile = asyncHandler(async (req, res) => {
    const profile = await recommendationService.buildUserProfile(req.user._id);

    ApiResponse.success(res, { profile });
});
