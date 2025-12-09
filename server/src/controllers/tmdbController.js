import { query } from 'express-validator';
import tmdbService from '../services/tmdbService.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Validation rules for TMDB search
 */
export const searchValidation = [
    query('query')
        .notEmpty()
        .withMessage('Search query is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Query must be between 1 and 100 characters')
];

/**
 * @desc    Search TMDB movies
 * @route   GET /api/tmdb/search
 * @access  Private
 */
export const searchMovies = asyncHandler(async (req, res) => {
    const { query: searchQuery, page = 1, year } = req.query;

    try {
        const results = await tmdbService.searchMovies(
            searchQuery,
            parseInt(page),
            year ? parseInt(year) : null
        );

        ApiResponse.success(res, results);
    } catch (error) {
        throw ApiError.internal('Failed to search TMDB');
    }
});

/**
 * @desc    Get TMDB movie details
 * @route   GET /api/tmdb/movie/:tmdbId
 * @access  Private
 */
export const getMovieDetails = asyncHandler(async (req, res) => {
    const { tmdbId } = req.params;

    try {
        const movie = await tmdbService.getMovieDetails(parseInt(tmdbId));
        ApiResponse.success(res, { movie });
    } catch (error) {
        if (error.response?.status === 404) {
            throw ApiError.notFound('Movie not found in TMDB');
        }
        throw ApiError.internal('Failed to fetch movie details from TMDB');
    }
});

/**
 * @desc    Get trending movies
 * @route   GET /api/tmdb/trending
 * @access  Public
 */
export const getTrending = asyncHandler(async (req, res) => {
    const { timeWindow = 'week', page = 1 } = req.query;

    try {
        const results = await tmdbService.getTrending(timeWindow, parseInt(page));
        ApiResponse.success(res, results);
    } catch (error) {
        throw ApiError.internal('Failed to fetch trending movies');
    }
});

/**
 * @desc    Get popular movies
 * @route   GET /api/tmdb/popular
 * @access  Public
 */
export const getPopular = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;

    try {
        const results = await tmdbService.getPopular(parseInt(page));
        ApiResponse.success(res, results);
    } catch (error) {
        throw ApiError.internal('Failed to fetch popular movies');
    }
});

/**
 * @desc    Get movie videos (trailers, teasers)
 * @route   GET /api/tmdb/movie/:tmdbId/videos
 * @access  Public
 */
export const getMovieVideos = asyncHandler(async (req, res) => {
    const { tmdbId } = req.params;

    try {
        const videos = await tmdbService.getMovieVideos(parseInt(tmdbId));
        ApiResponse.success(res, videos);
    } catch (error) {
        throw ApiError.internal('Failed to fetch movie videos');
    }
});

/**
 * @desc    Get watch providers (streaming availability)
 * @route   GET /api/tmdb/movie/:tmdbId/providers
 * @access  Public
 */
export const getWatchProviders = asyncHandler(async (req, res) => {
    const { tmdbId } = req.params;
    const { region = 'US' } = req.query;

    try {
        const providers = await tmdbService.getWatchProviders(parseInt(tmdbId), region);
        ApiResponse.success(res, providers);
    } catch (error) {
        throw ApiError.internal('Failed to fetch watch providers');
    }
});
