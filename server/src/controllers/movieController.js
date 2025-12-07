import { body, query, param } from 'express-validator';
import Movie from '../models/Movie.js';
import tmdbService from '../services/tmdbService.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Validation rules for creating a movie
 */
export const createMovieValidation = [
    body('tmdbId')
        .isInt({ min: 1 })
        .withMessage('Valid TMDB ID is required'),
    body('myRating')
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    body('watchedDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('myReview')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Review cannot exceed 2000 characters'),
    body('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
    body('isFavorite')
        .optional()
        .isBoolean()
        .withMessage('isFavorite must be a boolean')
];

/**
 * Validation rules for updating a movie
 */
export const updateMovieValidation = [
    body('myRating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    body('watchedDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('myReview')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Review cannot exceed 2000 characters'),
    body('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
    body('isFavorite')
        .optional()
        .isBoolean()
        .withMessage('isFavorite must be a boolean')
];

/**
 * @desc    Get all movies with filtering or public movies
 * @route   GET /api/movies
 * @access  Public
 */
export const getMovies = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        sort = 'watchedDate',
        order = 'desc',
        year,
        yearMin,
        yearMax,
        minRating,
        maxRating,
        tags,
        search,
        isFavorite
    } = req.query;

    // Build query
    const query = { isPublic: true };

    // If authenticated user, show their movies
    if (req.user) {
        query.addedBy = req.user._id;
        delete query.isPublic; // Show all their movies
    }

    // Filters
    if (year) {
        query.year = parseInt(year);
    }

    if (yearMin || yearMax) {
        query.year = {};
        if (yearMin) query.year.$gte = parseInt(yearMin);
        if (yearMax) query.year.$lte = parseInt(yearMax);
    }

    if (minRating || maxRating) {
        query.myRating = {};
        if (minRating) query.myRating.$gte = parseFloat(minRating);
        if (maxRating) query.myRating.$lte = parseFloat(maxRating);
    }

    if (tags) {
        const tagArray = tags.split(',').map(t => t.trim());
        query.tags = { $in: tagArray };
    }

    if (search) {
        query.$text = { $search: search };
    }

    if (isFavorite === 'true') {
        query.isFavorite = true;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sort] = sortOrder;

    // Execute query
    const [movies, totalCount] = await Promise.all([
        Movie.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('addedBy', 'username profile.displayName'),
        Movie.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    ApiResponse.paginated(res, movies, {
        currentPage: pageNum,
        totalPages,
        totalMovies: totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
    });
});

/**
 * @desc    Get single movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
export const getMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
        .populate('addedBy', 'username profile.displayName');

    if (!movie) {
        throw ApiError.notFound('Movie not found');
    }

    // Check if movie is public or belongs to user
    if (!movie.isPublic && (!req.user || !movie.addedBy._id.equals(req.user._id))) {
        throw ApiError.forbidden('You do not have access to this movie');
    }

    ApiResponse.success(res, { movie });
});

/**
 * @desc    Get movie by TMDB ID
 * @route   GET /api/movies/tmdb/:tmdbId
 * @access  Public
 */
export const getMovieByTMDBId = asyncHandler(async (req, res) => {
    const movie = await Movie.findByTMDBId(parseInt(req.params.tmdbId))
        .populate('addedBy', 'username profile.displayName');

    if (!movie) {
        throw ApiError.notFound('Movie not found');
    }

    if (!movie.isPublic && (!req.user || !movie.addedBy._id.equals(req.user._id))) {
        throw ApiError.forbidden('You do not have access to this movie');
    }

    ApiResponse.success(res, { movie });
});

/**
 * @desc    Add new movie
 * @route   POST /api/movies
 * @access  Private
 */
export const createMovie = asyncHandler(async (req, res) => {
    const { tmdbId, myRating, watchedDate, myReview, tags, isFavorite, notes, isPublic } = req.body;

    // Check if movie already exists
    const existingMovie = await Movie.findByTMDBId(tmdbId);
    if (existingMovie) {
        throw ApiError.conflict('Movie already exists in your collection');
    }

    // Fetch movie details from TMDB
    let tmdbData;
    try {
        tmdbData = await tmdbService.getMovieDetails(tmdbId);
    } catch (error) {
        throw ApiError.badRequest('Failed to fetch movie data from TMDB');
    }

    // Create movie
    const movie = await Movie.create({
        ...tmdbData,
        myRating,
        watchedDate: watchedDate || new Date(),
        myReview,
        tags: tags || [],
        isFavorite: isFavorite || false,
        notes,
        isPublic: isPublic !== false,
        addedBy: req.user._id
    });

    ApiResponse.created(res, { movie }, 'Movie added successfully');
});

/**
 * @desc    Update movie
 * @route   PUT /api/movies/:id
 * @access  Private
 */
export const updateMovie = asyncHandler(async (req, res) => {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
        throw ApiError.notFound('Movie not found');
    }

    // Check ownership
    if (!movie.addedBy.equals(req.user._id)) {
        throw ApiError.forbidden('You can only update your own movies');
    }

    // Allowed fields to update
    const allowedFields = [
        'myRating', 'watchedDate', 'myReview', 'tags',
        'isFavorite', 'rewatchCount', 'notes', 'isPublic'
    ];

    const updates = {};
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('addedBy', 'username profile.displayName');

    ApiResponse.success(res, { movie }, 'Movie updated successfully');
});

/**
 * @desc    Delete movie
 * @route   DELETE /api/movies/:id
 * @access  Private
 */
export const deleteMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        throw ApiError.notFound('Movie not found');
    }

    // Check ownership (admin can delete any)
    if (!movie.addedBy.equals(req.user._id) && req.user.role !== 'admin') {
        throw ApiError.forbidden('You can only delete your own movies');
    }

    await movie.deleteOne();

    ApiResponse.success(res, null, 'Movie deleted successfully');
});

/**
 * @desc    Get all unique tags
 * @route   GET /api/movies/tags
 * @access  Public
 */
export const getAllTags = asyncHandler(async (req, res) => {
    const query = { isPublic: true };

    if (req.user) {
        query.addedBy = req.user._id;
        delete query.isPublic;
    }

    const tags = await Movie.distinct('tags', query);

    ApiResponse.success(res, { tags: tags.sort() });
});

/**
 * @desc    Bulk update movies (toggle favorite, etc.)
 * @route   PATCH /api/movies/bulk
 * @access  Private
 */
export const bulkUpdate = asyncHandler(async (req, res) => {
    const { movieIds, updates } = req.body;

    if (!Array.isArray(movieIds) || movieIds.length === 0) {
        throw ApiError.badRequest('Movie IDs array is required');
    }

    // Only allow certain fields for bulk update
    const allowedFields = ['isFavorite', 'isPublic', 'tags'];
    const safeUpdates = {};

    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            safeUpdates[field] = updates[field];
        }
    });

    const result = await Movie.updateMany(
        {
            _id: { $in: movieIds },
            addedBy: req.user._id
        },
        { $set: safeUpdates }
    );

    ApiResponse.success(res, {
        modifiedCount: result.modifiedCount
    }, `${result.modifiedCount} movies updated`);
});
