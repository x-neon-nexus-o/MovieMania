import WatchlistMovie from '../models/WatchlistMovie.js';
import Movie from '../models/Movie.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import tmdbService from '../services/tmdbService.js';

/**
 * @desc    Get all watchlist items for the user
 * @route   GET /api/watchlist
 * @access  Private
 */
export const getWatchlist = asyncHandler(async (req, res) => {
    const { priority, genre, sort = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;

    const query = { addedBy: req.user._id };

    // Filter by priority
    if (priority && ['high', 'medium', 'low'].includes(priority)) {
        query.priority = priority;
    }

    // Filter by genre
    if (genre) {
        query['tmdbGenres.name'] = { $regex: genre, $options: 'i' };
    }

    // Build sort object
    const sortObj = {};
    const validSortFields = ['createdAt', 'targetWatchDate', 'priority', 'title', 'year'];
    if (validSortFields.includes(sort)) {
        // Priority needs special handling for custom order
        if (sort === 'priority') {
            sortObj.priority = order === 'asc' ? 1 : -1;
        } else {
            sortObj[sort] = order === 'asc' ? 1 : -1;
        }
    } else {
        sortObj.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
        WatchlistMovie.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit)),
        WatchlistMovie.countDocuments(query)
    ]);

    ApiResponse.success(res, {
        items,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

/**
 * @desc    Get watchlist statistics
 * @route   GET /api/watchlist/stats
 * @access  Private
 */
export const getWatchlistStats = asyncHandler(async (req, res) => {
    const stats = await WatchlistMovie.getStatistics(req.user._id);
    ApiResponse.success(res, stats);
});

/**
 * @desc    Get single watchlist item
 * @route   GET /api/watchlist/:id
 * @access  Private
 */
export const getWatchlistItem = asyncHandler(async (req, res) => {
    const item = await WatchlistMovie.findOne({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!item) {
        return ApiResponse.notFound(res, 'Watchlist item not found');
    }

    ApiResponse.success(res, { item });
});

/**
 * @desc    Add movie to watchlist
 * @route   POST /api/watchlist
 * @access  Private
 */
export const addToWatchlist = asyncHandler(async (req, res) => {
    const { tmdbId, priority, notes, source, recommendedBy, targetWatchDate } = req.body;

    // Check if already in watchlist
    const existingWatchlist = await WatchlistMovie.findOne({
        tmdbId,
        addedBy: req.user._id
    });

    if (existingWatchlist) {
        return ApiResponse.error(res, 'Movie already in your watchlist', 409);
    }

    // Check if already watched
    const existingWatched = await Movie.findOne({
        tmdbId,
        addedBy: req.user._id
    });

    if (existingWatched) {
        return ApiResponse.error(res, 'You have already watched this movie', 409);
    }

    // Fetch movie details from TMDB
    const movieDetails = await tmdbService.getMovieDetails(tmdbId);

    const watchlistItem = await WatchlistMovie.create({
        tmdbId: movieDetails.tmdbId,
        title: movieDetails.title,
        originalTitle: movieDetails.originalTitle,
        year: movieDetails.year,
        posterPath: movieDetails.posterPath,
        backdropPath: movieDetails.backdropPath,
        overview: movieDetails.overview,
        runtime: movieDetails.runtime,
        tmdbGenres: movieDetails.tmdbGenres,
        tmdbRating: movieDetails.tmdbRating,
        releaseDate: movieDetails.releaseDate,
        priority: priority || 'medium',
        notes,
        source: source || 'other',
        recommendedBy,
        targetWatchDate,
        addedBy: req.user._id
    });

    ApiResponse.created(res, {
        message: 'Added to watchlist',
        item: watchlistItem
    });
});

/**
 * @desc    Update watchlist item
 * @route   PUT /api/watchlist/:id
 * @access  Private
 */
export const updateWatchlistItem = asyncHandler(async (req, res) => {
    const { priority, notes, source, recommendedBy, targetWatchDate } = req.body;

    const item = await WatchlistMovie.findOne({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!item) {
        return ApiResponse.notFound(res, 'Watchlist item not found');
    }

    // Update allowed fields
    if (priority) item.priority = priority;
    if (notes !== undefined) item.notes = notes;
    if (source) item.source = source;
    if (recommendedBy !== undefined) item.recommendedBy = recommendedBy;
    if (targetWatchDate !== undefined) item.targetWatchDate = targetWatchDate;

    await item.save();

    ApiResponse.success(res, {
        message: 'Watchlist item updated',
        item
    });
});

/**
 * @desc    Quick priority update
 * @route   PATCH /api/watchlist/:id/priority
 * @access  Private
 */
export const updatePriority = asyncHandler(async (req, res) => {
    const { priority } = req.body;

    if (!['high', 'medium', 'low'].includes(priority)) {
        return ApiResponse.error(res, 'Invalid priority value', 400);
    }

    const item = await WatchlistMovie.findOneAndUpdate(
        { _id: req.params.id, addedBy: req.user._id },
        { priority },
        { new: true }
    );

    if (!item) {
        return ApiResponse.notFound(res, 'Watchlist item not found');
    }

    ApiResponse.success(res, { item });
});

/**
 * @desc    Remove from watchlist
 * @route   DELETE /api/watchlist/:id
 * @access  Private
 */
export const removeFromWatchlist = asyncHandler(async (req, res) => {
    const item = await WatchlistMovie.findOneAndDelete({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!item) {
        return ApiResponse.notFound(res, 'Watchlist item not found');
    }

    ApiResponse.success(res, { message: 'Removed from watchlist' });
});

/**
 * @desc    Move watchlist item to watched movies
 * @route   POST /api/watchlist/:id/move-to-watched
 * @access  Private
 */
export const moveToWatched = asyncHandler(async (req, res) => {
    const { myRating, myReview, watchedDate, tags, isFavorite } = req.body;

    // Find watchlist item
    const watchlistItem = await WatchlistMovie.findOne({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!watchlistItem) {
        return ApiResponse.notFound(res, 'Watchlist item not found');
    }

    // Check if movie already exists in watched
    const existingMovie = await Movie.findOne({
        tmdbId: watchlistItem.tmdbId,
        addedBy: req.user._id
    });

    if (existingMovie) {
        // Remove from watchlist and return existing
        await WatchlistMovie.findByIdAndDelete(watchlistItem._id);
        return ApiResponse.error(res, 'Movie already in your watched collection', 409);
    }

    // Create watched movie
    const movie = await Movie.create({
        tmdbId: watchlistItem.tmdbId,
        title: watchlistItem.title,
        year: watchlistItem.year,
        posterPath: watchlistItem.posterPath,
        backdropPath: watchlistItem.backdropPath,
        overview: watchlistItem.overview,
        runtime: watchlistItem.runtime,
        tmdbGenres: watchlistItem.tmdbGenres,
        tmdbRating: watchlistItem.tmdbRating,
        releaseDate: watchlistItem.releaseDate,
        myRating: myRating || 3,
        myReview: myReview || '',
        watchedDate: watchedDate || new Date(),
        tags: tags || [],
        isFavorite: isFavorite || false,
        notes: watchlistItem.notes,
        addedBy: req.user._id
    });

    // Remove from watchlist
    await WatchlistMovie.findByIdAndDelete(watchlistItem._id);

    ApiResponse.created(res, {
        message: 'Moved to watched movies',
        movie
    });
});

/**
 * @desc    Check if movie exists in watchlist or watched
 * @route   GET /api/watchlist/check/:tmdbId
 * @access  Private
 */
export const checkMovieStatus = asyncHandler(async (req, res) => {
    const { tmdbId } = req.params;

    const [inWatchlist, inWatched] = await Promise.all([
        WatchlistMovie.findOne({ tmdbId: parseInt(tmdbId), addedBy: req.user._id }),
        Movie.findOne({ tmdbId: parseInt(tmdbId), addedBy: req.user._id })
    ]);

    ApiResponse.success(res, {
        inWatchlist: !!inWatchlist,
        inWatched: !!inWatched,
        watchlistId: inWatchlist?._id || null,
        watchedId: inWatched?._id || null
    });
});
