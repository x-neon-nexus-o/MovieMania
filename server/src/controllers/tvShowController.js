import { body } from 'express-validator';
import TVShow from '../models/TVShow.js';
import tmdbService from '../services/tmdbService.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Validation rules for creating a TV show
 */
export const createTVShowValidation = [
    body('tmdbId')
        .isInt({ min: 1 })
        .withMessage('Valid TMDB ID is required'),
    body('myRating')
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    body('watchStatus')
        .optional()
        .isIn(['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'])
        .withMessage('Invalid watch status'),
    body('currentSeason')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current season must be a positive number'),
    body('currentEpisode')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current episode must be a positive number'),
    body('startedDate')
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
 * Validation rules for updating a TV show
 */
export const updateTVShowValidation = [
    body('myRating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    body('watchStatus')
        .optional()
        .isIn(['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'])
        .withMessage('Invalid watch status'),
    body('currentSeason')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current season must be a positive number'),
    body('currentEpisode')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current episode must be a positive number'),
    body('startedDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('completedDate')
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
 * @desc    Get all TV shows with filtering
 * @route   GET /api/tvshows
 * @access  Public
 */
export const getTVShows = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        sort = 'startedDate',
        order = 'desc',
        watchStatus,
        minRating,
        maxRating,
        tags,
        search,
        isFavorite
    } = req.query;

    // Build query
    const query = { isPublic: true };

    // If authenticated user, show their TV shows
    if (req.user) {
        query.addedBy = req.user._id;
        delete query.isPublic;
    }

    // Filters
    if (watchStatus) {
        query.watchStatus = watchStatus;
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
    const [tvShows, totalCount] = await Promise.all([
        TVShow.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('addedBy', 'username profile.displayName'),
        TVShow.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    ApiResponse.paginated(res, tvShows, {
        currentPage: pageNum,
        totalPages,
        totalShows: totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
    });
});

/**
 * @desc    Get single TV show by ID
 * @route   GET /api/tvshows/:id
 * @access  Public
 */
export const getTVShow = asyncHandler(async (req, res) => {
    const tvShow = await TVShow.findById(req.params.id)
        .populate('addedBy', 'username profile.displayName');

    if (!tvShow) {
        throw ApiError.notFound('TV show not found');
    }

    if (!tvShow.isPublic && (!req.user || !tvShow.addedBy._id.equals(req.user._id))) {
        throw ApiError.forbidden('You do not have access to this TV show');
    }

    ApiResponse.success(res, { tvShow });
});

/**
 * @desc    Get TV show by TMDB ID
 * @route   GET /api/tvshows/tmdb/:tmdbId
 * @access  Public
 */
export const getTVShowByTMDBId = asyncHandler(async (req, res) => {
    const tvShow = await TVShow.findByTMDBId(parseInt(req.params.tmdbId))
        .populate('addedBy', 'username profile.displayName');

    if (!tvShow) {
        throw ApiError.notFound('TV show not found');
    }

    if (!tvShow.isPublic && (!req.user || !tvShow.addedBy._id.equals(req.user._id))) {
        throw ApiError.forbidden('You do not have access to this TV show');
    }

    ApiResponse.success(res, { tvShow });
});

/**
 * @desc    Add new TV show
 * @route   POST /api/tvshows
 * @access  Private
 */
export const createTVShow = asyncHandler(async (req, res) => {
    const {
        tmdbId, myRating, watchStatus, currentSeason, currentEpisode,
        startedDate, completedDate, myReview, tags, isFavorite, notes, isPublic
    } = req.body;

    // Check if TV show already exists
    const existingShow = await TVShow.findByTMDBId(tmdbId);
    if (existingShow) {
        throw ApiError.conflict('TV show already exists in your collection');
    }

    // Fetch TV show details from TMDB
    let tmdbData;
    try {
        tmdbData = await tmdbService.getTVShowDetails(tmdbId);
    } catch (error) {
        throw ApiError.badRequest('Failed to fetch TV show data from TMDB');
    }

    // Create TV show
    const tvShow = await TVShow.create({
        ...tmdbData,
        myRating,
        watchStatus: watchStatus || 'watching',
        currentSeason: currentSeason || 1,
        currentEpisode: currentEpisode || 1,
        startedDate: startedDate || new Date(),
        completedDate,
        myReview,
        tags: tags || [],
        isFavorite: isFavorite || false,
        notes,
        isPublic: isPublic !== false,
        addedBy: req.user._id
    });

    ApiResponse.created(res, { tvShow }, 'TV show added successfully');
});

/**
 * @desc    Update TV show
 * @route   PUT /api/tvshows/:id
 * @access  Private
 */
export const updateTVShow = asyncHandler(async (req, res) => {
    let tvShow = await TVShow.findById(req.params.id);

    if (!tvShow) {
        throw ApiError.notFound('TV show not found');
    }

    // Check ownership
    if (!tvShow.addedBy.equals(req.user._id)) {
        throw ApiError.forbidden('You can only update your own TV shows');
    }

    // Allowed fields to update
    const allowedFields = [
        'myRating', 'watchStatus', 'currentSeason', 'currentEpisode',
        'startedDate', 'completedDate', 'myReview', 'tags',
        'isFavorite', 'rewatchCount', 'notes', 'isPublic'
    ];

    const updates = {};
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    // Auto set completedDate if watchStatus is completed
    if (updates.watchStatus === 'completed' && !updates.completedDate) {
        updates.completedDate = new Date();
    }

    tvShow = await TVShow.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('addedBy', 'username profile.displayName');

    ApiResponse.success(res, { tvShow }, 'TV show updated successfully');
});

/**
 * @desc    Delete TV show
 * @route   DELETE /api/tvshows/:id
 * @access  Private
 */
export const deleteTVShow = asyncHandler(async (req, res) => {
    const tvShow = await TVShow.findById(req.params.id);

    if (!tvShow) {
        throw ApiError.notFound('TV show not found');
    }

    // Check ownership
    if (!tvShow.addedBy.equals(req.user._id) && req.user.role !== 'admin') {
        throw ApiError.forbidden('You can only delete your own TV shows');
    }

    await tvShow.deleteOne();

    ApiResponse.success(res, null, 'TV show deleted successfully');
});

/**
 * @desc    Get all unique tags
 * @route   GET /api/tvshows/tags
 * @access  Public
 */
export const getAllTags = asyncHandler(async (req, res) => {
    const query = { isPublic: true };

    if (req.user) {
        query.addedBy = req.user._id;
        delete query.isPublic;
    }

    const tags = await TVShow.distinct('tags', query);

    ApiResponse.success(res, { tags: tags.sort() });
});

/**
 * @desc    Bulk update TV shows
 * @route   PATCH /api/tvshows/bulk
 * @access  Private
 */
export const bulkUpdate = asyncHandler(async (req, res) => {
    const { tvShowIds, updates } = req.body;

    if (!Array.isArray(tvShowIds) || tvShowIds.length === 0) {
        throw ApiError.badRequest('TV show IDs array is required');
    }

    const allowedFields = ['isFavorite', 'isPublic', 'tags', 'watchStatus'];
    const safeUpdates = {};

    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            safeUpdates[field] = updates[field];
        }
    });

    const result = await TVShow.updateMany(
        {
            _id: { $in: tvShowIds },
            addedBy: req.user._id
        },
        { $set: safeUpdates }
    );

    ApiResponse.success(res, {
        modifiedCount: result.modifiedCount
    }, `${result.modifiedCount} TV shows updated`);
});
