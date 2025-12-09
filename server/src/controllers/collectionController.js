import Collection from '../models/Collection.js';
import Movie from '../models/Movie.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get user's collections
 * @route   GET /api/collections
 * @access  Private
 */
export const getCollections = asyncHandler(async (req, res) => {
    const collections = await Collection.getUserCollections(req.user._id);

    ApiResponse.success(res, { collections });
});

/**
 * @desc    Get single collection with movies
 * @route   GET /api/collections/:id
 * @access  Private/Public (if public collection)
 */
export const getCollection = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const collection = await Collection.findById(id)
        .populate({
            path: 'movies.movie',
            select: 'title posterPath year myRating tmdbId runtime overview tmdbGenres'
        })
        .populate('createdBy', 'username');

    if (!collection) {
        throw ApiError.notFound('Collection not found');
    }

    // Check access
    if (!collection.isPublic &&
        (!req.user || collection.createdBy._id.toString() !== req.user._id.toString())) {
        throw ApiError.forbidden('Access denied');
    }

    ApiResponse.success(res, { collection });
});

/**
 * @desc    Create new collection
 * @route   POST /api/collections
 * @access  Private
 */
export const createCollection = asyncHandler(async (req, res) => {
    const { name, description, emoji, color, isPublic, type, smartRules } = req.body;

    // Check for duplicate name
    const existing = await Collection.findOne({
        createdBy: req.user._id,
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existing) {
        throw ApiError.badRequest('A collection with this name already exists');
    }

    const collection = await Collection.create({
        name,
        description,
        emoji: emoji || '🎬',
        color: color || '#6366f1',
        isPublic: isPublic || false,
        type: type || 'manual',
        smartRules: smartRules || {},
        createdBy: req.user._id
    });

    ApiResponse.created(res, { collection });
});

/**
 * @desc    Update collection
 * @route   PUT /api/collections/:id
 * @access  Private (owner only)
 */
export const updateCollection = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, emoji, color, isPublic, isPinned, coverImage } = req.body;

    const collection = await Collection.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!collection) {
        throw ApiError.notFound('Collection not found');
    }

    // Update fields
    if (name !== undefined) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (emoji !== undefined) collection.emoji = emoji;
    if (color !== undefined) collection.color = color;
    if (isPublic !== undefined) collection.isPublic = isPublic;
    if (isPinned !== undefined) collection.isPinned = isPinned;
    if (coverImage !== undefined) collection.coverImage = coverImage;

    await collection.save();

    ApiResponse.success(res, { collection });
});

/**
 * @desc    Delete collection
 * @route   DELETE /api/collections/:id
 * @access  Private (owner only)
 */
export const deleteCollection = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const collection = await Collection.findOneAndDelete({
        _id: id,
        createdBy: req.user._id
    });

    if (!collection) {
        throw ApiError.notFound('Collection not found');
    }

    ApiResponse.success(res, { message: 'Collection deleted' });
});

/**
 * @desc    Add movie to collection
 * @route   POST /api/collections/:id/movies
 * @access  Private (owner only)
 */
export const addMovieToCollection = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { movieId, note } = req.body;

    const collection = await Collection.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!collection) {
        throw ApiError.notFound('Collection not found');
    }

    // Verify movie exists and belongs to user
    const movie = await Movie.findOne({
        _id: movieId,
        addedBy: req.user._id
    });

    if (!movie) {
        throw ApiError.notFound('Movie not found');
    }

    // Check if already in collection
    const exists = collection.movies.some(
        m => m.movie.toString() === movieId
    );

    if (exists) {
        throw ApiError.badRequest('Movie already in collection');
    }

    collection.movies.push({ movie: movieId, note });
    await collection.save();

    // Return updated collection with populated movies
    await collection.populate({
        path: 'movies.movie',
        select: 'title posterPath year myRating'
    });

    ApiResponse.success(res, { collection });
});

/**
 * @desc    Remove movie from collection
 * @route   DELETE /api/collections/:id/movies/:movieId
 * @access  Private (owner only)
 */
export const removeMovieFromCollection = asyncHandler(async (req, res) => {
    const { id, movieId } = req.params;

    const collection = await Collection.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!collection) {
        throw ApiError.notFound('Collection not found');
    }

    collection.movies = collection.movies.filter(
        m => m.movie.toString() !== movieId
    );

    await collection.save();

    ApiResponse.success(res, { collection });
});

/**
 * @desc    Reorder movies in collection
 * @route   PUT /api/collections/:id/reorder
 * @access  Private (owner only)
 */
export const reorderMovies = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { movieIds } = req.body; // Array of movie IDs in new order

    const collection = await Collection.findOne({
        _id: id,
        createdBy: req.user._id
    });

    if (!collection) {
        throw ApiError.notFound('Collection not found');
    }

    // Create a map of movie data
    const movieMap = new Map();
    collection.movies.forEach(m => {
        movieMap.set(m.movie.toString(), m);
    });

    // Reorder based on movieIds
    const reordered = movieIds
        .filter(id => movieMap.has(id))
        .map(id => movieMap.get(id));

    collection.movies = reordered;
    await collection.save();

    ApiResponse.success(res, { collection });
});

/**
 * @desc    Get movie's collections
 * @route   GET /api/collections/movie/:movieId
 * @access  Private
 */
export const getMovieCollections = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const collections = await Collection.find({
        createdBy: req.user._id,
        'movies.movie': movieId
    }).select('name emoji color');

    ApiResponse.success(res, { collections });
});

/**
 * @desc    Get collection templates/suggestions
 * @route   GET /api/collections/templates
 * @access  Private
 */
export const getTemplates = asyncHandler(async (req, res) => {
    const templates = [
        {
            name: 'Favorites',
            emoji: '❤️',
            description: 'Your all-time favorite movies',
            smartRules: { favorites: true },
            color: '#ef4444'
        },
        {
            name: 'Top Rated',
            emoji: '⭐',
            description: 'Movies you rated 4.5 or higher',
            smartRules: { minRating: 4.5 },
            color: '#f59e0b'
        },
        {
            name: 'Sci-Fi Collection',
            emoji: '🚀',
            description: 'Science fiction adventures',
            smartRules: { genres: ['Science Fiction'] },
            color: '#3b82f6'
        },
        {
            name: 'Horror Nights',
            emoji: '👻',
            description: 'Scary movies for brave souls',
            smartRules: { genres: ['Horror'] },
            color: '#7c3aed'
        },
        {
            name: 'Comedy Gold',
            emoji: '😂',
            description: 'Movies that made you laugh',
            smartRules: { genres: ['Comedy'] },
            color: '#22c55e'
        },
        {
            name: 'Classic Films',
            emoji: '🎞️',
            description: 'Movies from before 1980',
            smartRules: { yearRange: { start: 1900, end: 1979 } },
            color: '#78716c'
        },
        {
            name: '90s Nostalgia',
            emoji: '📼',
            description: 'Best of the 90s',
            smartRules: { yearRange: { start: 1990, end: 1999 } },
            color: '#ec4899'
        }
    ];

    ApiResponse.success(res, { templates });
});
