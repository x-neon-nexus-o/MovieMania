import WatchlistTVShow from '../models/WatchlistTVShow.js';
import TVShow from '../models/TVShow.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import tmdbService from '../services/tmdbService.js';

/**
 * @desc    Get all TV watchlist items for the user
 * @route   GET /api/watchlist-tv
 * @access  Private
 */
export const getTVWatchlist = asyncHandler(async (req, res) => {
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
    const validSortFields = ['createdAt', 'targetStartDate', 'priority', 'name', 'numberOfSeasons'];
    if (validSortFields.includes(sort)) {
        sortObj[sort] = order === 'asc' ? 1 : -1;
    } else {
        sortObj.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
        WatchlistTVShow.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit)),
        WatchlistTVShow.countDocuments(query)
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
 * @desc    Get TV watchlist statistics
 * @route   GET /api/watchlist-tv/stats
 * @access  Private
 */
export const getTVWatchlistStats = asyncHandler(async (req, res) => {
    const stats = await WatchlistTVShow.getStatistics(req.user._id);
    ApiResponse.success(res, stats);
});

/**
 * @desc    Get single TV watchlist item
 * @route   GET /api/watchlist-tv/:id
 * @access  Private
 */
export const getTVWatchlistItem = asyncHandler(async (req, res) => {
    const item = await WatchlistTVShow.findOne({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!item) {
        return ApiResponse.notFound(res, 'TV watchlist item not found');
    }

    ApiResponse.success(res, { item });
});

/**
 * @desc    Add TV show to watchlist
 * @route   POST /api/watchlist-tv
 * @access  Private
 */
export const addToTVWatchlist = asyncHandler(async (req, res) => {
    const { tmdbId, priority, notes, source, recommendedBy, targetStartDate } = req.body;

    // Check if already in watchlist
    const existingWatchlist = await WatchlistTVShow.findOne({
        tmdbId,
        addedBy: req.user._id
    });

    if (existingWatchlist) {
        return ApiResponse.error(res, 'TV show already in your watchlist', 409);
    }

    // Check if already watching
    const existingWatching = await TVShow.findOne({
        tmdbId,
        addedBy: req.user._id
    });

    if (existingWatching) {
        return ApiResponse.error(res, 'You are already tracking this TV show', 409);
    }

    // Fetch TV show details from TMDB
    const showDetails = await tmdbService.getTVShowDetails(tmdbId);

    const watchlistItem = await WatchlistTVShow.create({
        tmdbId: showDetails.tmdbId,
        name: showDetails.name,
        firstAirDate: showDetails.firstAirDate,
        posterPath: showDetails.posterPath,
        backdropPath: showDetails.backdropPath,
        overview: showDetails.overview,
        numberOfSeasons: showDetails.numberOfSeasons,
        numberOfEpisodes: showDetails.numberOfEpisodes,
        status: showDetails.status,
        tmdbGenres: showDetails.tmdbGenres,
        tmdbRating: showDetails.tmdbRating,
        networks: showDetails.networks,
        priority: priority || 'medium',
        notes,
        source: source || 'other',
        recommendedBy,
        targetStartDate,
        addedBy: req.user._id
    });

    ApiResponse.created(res, {
        message: 'Added to TV watchlist',
        item: watchlistItem
    });
});

/**
 * @desc    Update TV watchlist item
 * @route   PUT /api/watchlist-tv/:id
 * @access  Private
 */
export const updateTVWatchlistItem = asyncHandler(async (req, res) => {
    const { priority, notes, source, recommendedBy, targetStartDate } = req.body;

    const item = await WatchlistTVShow.findOne({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!item) {
        return ApiResponse.notFound(res, 'TV watchlist item not found');
    }

    // Update allowed fields
    if (priority) item.priority = priority;
    if (notes !== undefined) item.notes = notes;
    if (source) item.source = source;
    if (recommendedBy !== undefined) item.recommendedBy = recommendedBy;
    if (targetStartDate !== undefined) item.targetStartDate = targetStartDate;

    await item.save();

    ApiResponse.success(res, {
        message: 'TV watchlist item updated',
        item
    });
});

/**
 * @desc    Quick priority update
 * @route   PATCH /api/watchlist-tv/:id/priority
 * @access  Private
 */
export const updateTVPriority = asyncHandler(async (req, res) => {
    const { priority } = req.body;

    if (!['high', 'medium', 'low'].includes(priority)) {
        return ApiResponse.error(res, 'Invalid priority value', 400);
    }

    const item = await WatchlistTVShow.findOneAndUpdate(
        { _id: req.params.id, addedBy: req.user._id },
        { priority },
        { new: true }
    );

    if (!item) {
        return ApiResponse.notFound(res, 'TV watchlist item not found');
    }

    ApiResponse.success(res, { item });
});

/**
 * @desc    Remove from TV watchlist
 * @route   DELETE /api/watchlist-tv/:id
 * @access  Private
 */
export const removeFromTVWatchlist = asyncHandler(async (req, res) => {
    const item = await WatchlistTVShow.findOneAndDelete({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!item) {
        return ApiResponse.notFound(res, 'TV watchlist item not found');
    }

    ApiResponse.success(res, { message: 'Removed from TV watchlist' });
});

/**
 * @desc    Move TV watchlist item to tracking
 * @route   POST /api/watchlist-tv/:id/start-watching
 * @access  Private
 */
export const startWatching = asyncHandler(async (req, res) => {
    const { myRating, myReview, startedDate, tags, isFavorite } = req.body;

    // Find watchlist item
    const watchlistItem = await WatchlistTVShow.findOne({
        _id: req.params.id,
        addedBy: req.user._id
    });

    if (!watchlistItem) {
        return ApiResponse.notFound(res, 'TV watchlist item not found');
    }

    // Check if TV show already exists in tracking
    const existingShow = await TVShow.findOne({
        tmdbId: watchlistItem.tmdbId,
        addedBy: req.user._id
    });

    if (existingShow) {
        // Remove from watchlist and return existing
        await WatchlistTVShow.findByIdAndDelete(watchlistItem._id);
        return ApiResponse.error(res, 'TV show already in your tracking list', 409);
    }

    // Create tracked TV show
    const tvShow = await TVShow.create({
        tmdbId: watchlistItem.tmdbId,
        name: watchlistItem.name,
        firstAirDate: watchlistItem.firstAirDate,
        posterPath: watchlistItem.posterPath,
        backdropPath: watchlistItem.backdropPath,
        overview: watchlistItem.overview,
        numberOfSeasons: watchlistItem.numberOfSeasons,
        numberOfEpisodes: watchlistItem.numberOfEpisodes,
        status: watchlistItem.status,
        tmdbGenres: watchlistItem.tmdbGenres,
        tmdbRating: watchlistItem.tmdbRating,
        networks: watchlistItem.networks,
        myRating: myRating || 0,
        watchStatus: 'watching',
        currentSeason: 1,
        currentEpisode: 1,
        myReview: myReview || '',
        startedDate: startedDate || new Date(),
        tags: tags || [],
        isFavorite: isFavorite || false,
        notes: watchlistItem.notes,
        addedBy: req.user._id
    });

    // Remove from watchlist
    await WatchlistTVShow.findByIdAndDelete(watchlistItem._id);

    ApiResponse.created(res, {
        message: 'Started watching TV show',
        tvShow
    });
});

/**
 * @desc    Check if TV show exists in watchlist or tracking
 * @route   GET /api/watchlist-tv/check/:tmdbId
 * @access  Private
 */
export const checkTVShowStatus = asyncHandler(async (req, res) => {
    const { tmdbId } = req.params;

    const [inWatchlist, inTracking] = await Promise.all([
        WatchlistTVShow.findOne({ tmdbId: parseInt(tmdbId), addedBy: req.user._id }),
        TVShow.findOne({ tmdbId: parseInt(tmdbId), addedBy: req.user._id })
    ]);

    ApiResponse.success(res, {
        inWatchlist: !!inWatchlist,
        inTracking: !!inTracking,
        watchlistId: inWatchlist?._id || null,
        trackingId: inTracking?._id || null
    });
});
