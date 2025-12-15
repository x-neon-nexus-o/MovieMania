import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import geminiService from '../services/geminiService.js';

/**
 * @desc    Generate a review draft
 * @route   POST /api/ai/review/generate
 * @access  Private
 */
export const generateReviewDraft = asyncHandler(async (req, res) => {
    const { movieTitle, rating, genres } = req.body;

    if (!movieTitle || !rating) {
        return ApiResponse.error(res, 'Movie title and rating are required', 400);
    }

    try {
        const draft = await geminiService.generateReviewDraft(movieTitle, rating, genres || []);
        ApiResponse.success(res, { draft });
    } catch (error) {
        console.error('AI Generation Error:', error);
        ApiResponse.error(res, 'Failed to generate review draft', 503);
    }
});

/**
 * @desc    Expand bullet points into a review
 * @route   POST /api/ai/review/expand
 * @access  Private
 */
export const expandThoughts = asyncHandler(async (req, res) => {
    const { bulletPoints } = req.body;

    if (!bulletPoints) {
        return ApiResponse.error(res, 'Bullet points are required', 400);
    }

    try {
        const review = await geminiService.expandThoughts(bulletPoints);
        ApiResponse.success(res, { review });
    } catch (error) {
        console.error('AI Expansion Error:', error);
        ApiResponse.error(res, 'Failed to expand thoughts', 503);
    }
});

/**
 * @desc    Remove spoilers from review
 * @route   POST /api/ai/review/spoiler-free
 * @access  Private
 */
export const removeSpoilers = asyncHandler(async (req, res) => {
    const { reviewText } = req.body;

    if (!reviewText) {
        return ApiResponse.error(res, 'Review text is required', 400);
    }

    try {
        const cleanText = await geminiService.removeSpoilers(reviewText);
        ApiResponse.success(res, { cleanText });
    } catch (error) {
        console.error('AI Spoiler Removal Error:', error);
        ApiResponse.error(res, 'Failed to remove spoilers', 503);
    }
});

/**
 * @desc    Analyze sentiment
 * @route   POST /api/ai/review/analyze
 * @access  Private
 */
export const analyzeSentiment = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return ApiResponse.error(res, 'Text is required', 400);
    }

    try {
        const analysis = await geminiService.analyzeSentiment(text);
        ApiResponse.success(res, analysis);
    } catch (error) {
        console.error('AI Analysis Error:', error);
        ApiResponse.error(res, 'Failed to analyze sentiment', 503);
    }
});

/**
 * @desc    Suggest tags for review
 * @route   POST /api/ai/review/suggest-tags
 * @access  Private
 */
export const suggestTags = asyncHandler(async (req, res) => {
    const { reviewText } = req.body;

    if (!reviewText) {
        return ApiResponse.error(res, 'Review text is required', 400);
    }

    try {
        const tags = await geminiService.suggestTags(reviewText);
        ApiResponse.success(res, { tags });
    } catch (error) {
        console.error('AI Tag Suggestion Error:', error);
        ApiResponse.error(res, 'Failed to suggest tags', 503);
    }
});
