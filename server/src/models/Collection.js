import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    // Basic Info
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Visual
    emoji: {
        type: String,
        default: '🎬'
    },
    coverImage: {
        type: String // URL or movie poster path
    },
    color: {
        type: String,
        default: '#6366f1' // primary color
    },

    // Movies in collection (references to Movie model)
    movies: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        note: {
            type: String,
            maxlength: 200
        }
    }],

    // Collection Type
    type: {
        type: String,
        enum: ['manual', 'smart'],
        default: 'manual'
    },

    // Smart Collection Rules (for auto-populating)
    smartRules: {
        genres: [String],
        minRating: Number,
        maxRating: Number,
        yearRange: {
            start: Number,
            end: Number
        },
        tags: [String],
        favorites: Boolean
    },

    // Settings
    isPublic: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },

    // Ownership
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
collectionSchema.index({ createdBy: 1, name: 1 });
collectionSchema.index({ createdBy: 1, isPinned: -1, updatedAt: -1 });

// Virtual for movie count
collectionSchema.virtual('movieCount').get(function () {
    return this.movies?.length || 0;
});

// Virtual for cover from first movie
collectionSchema.virtual('autoCover').get(function () {
    if (this.coverImage) return this.coverImage;
    if (this.movies?.length > 0 && this.movies[0].movie?.posterPath) {
        return this.movies[0].movie.posterPath;
    }
    return null;
});

// Static: Get user's collections with movie counts
collectionSchema.statics.getUserCollections = async function (userId, options = {}) {
    const { includePinned = true, limit } = options;

    let query = this.find({ createdBy: userId });

    if (includePinned) {
        query = query.sort({ isPinned: -1, updatedAt: -1 });
    } else {
        query = query.sort({ updatedAt: -1 });
    }

    if (limit) {
        query = query.limit(limit);
    }

    return query.populate({
        path: 'movies.movie',
        select: 'title posterPath year myRating'
    });
};

// Instance method: Add movie to collection
collectionSchema.methods.addMovie = async function (movieId, note = '') {
    const exists = this.movies.some(
        m => m.movie.toString() === movieId.toString()
    );

    if (exists) {
        throw new Error('Movie already in collection');
    }

    this.movies.push({ movie: movieId, note });
    return this.save();
};

// Instance method: Remove movie from collection
collectionSchema.methods.removeMovie = async function (movieId) {
    this.movies = this.movies.filter(
        m => m.movie.toString() !== movieId.toString()
    );
    return this.save();
};

// Pre-save: Update cover from first movie if not set
collectionSchema.pre('save', async function (next) {
    if (!this.coverImage && this.movies.length > 0) {
        await this.populate('movies.movie', 'posterPath');
        if (this.movies[0]?.movie?.posterPath) {
            this.coverImage = this.movies[0].movie.posterPath;
        }
    }
    next();
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
