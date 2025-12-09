import Movie from '../models/Movie.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Export user's movies as JSON or CSV
 * @route   GET /api/movies/export
 * @access  Private
 */
export const exportMovies = asyncHandler(async (req, res) => {
    const { format = 'json' } = req.query;

    // Get all user's movies
    const movies = await Movie.find({ addedBy: req.user._id })
        .sort({ watchedDate: -1 })
        .lean();

    // Format movie data for export
    const exportData = movies.map(movie => ({
        title: movie.title,
        year: movie.year,
        tmdbId: movie.tmdbId,
        imdbId: movie.imdbId || '',
        myRating: movie.myRating,
        watchedDate: movie.watchedDate ? new Date(movie.watchedDate).toISOString().split('T')[0] : '',
        myReview: movie.myReview || '',
        tags: (movie.tags || []).join(', '),
        isFavorite: movie.isFavorite ? 'Yes' : 'No',
        rewatchCount: movie.rewatchCount || 0,
        notes: movie.notes || '',
        genres: (movie.tmdbGenres || []).map(g => g.name).join(', '),
        runtime: movie.runtime || 0,
        director: movie.director || '',
        tmdbRating: movie.tmdbRating || 0,
        posterPath: movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : ''
    }));

    if (format === 'csv') {
        // Generate CSV
        const headers = [
            'Title',
            'Year',
            'TMDB ID',
            'IMDB ID',
            'My Rating',
            'Watched Date',
            'My Review',
            'Tags',
            'Favorite',
            'Rewatch Count',
            'Notes',
            'Genres',
            'Runtime (min)',
            'Director',
            'TMDB Rating',
            'Poster URL'
        ];

        const escapeCSV = (value) => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = [
            headers.join(','),
            ...exportData.map(movie => [
                escapeCSV(movie.title),
                escapeCSV(movie.year),
                escapeCSV(movie.tmdbId),
                escapeCSV(movie.imdbId),
                escapeCSV(movie.myRating),
                escapeCSV(movie.watchedDate),
                escapeCSV(movie.myReview),
                escapeCSV(movie.tags),
                escapeCSV(movie.isFavorite),
                escapeCSV(movie.rewatchCount),
                escapeCSV(movie.notes),
                escapeCSV(movie.genres),
                escapeCSV(movie.runtime),
                escapeCSV(movie.director),
                escapeCSV(movie.tmdbRating),
                escapeCSV(movie.posterPath)
            ].join(','))
        ];

        const csv = csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="moviemania-export-${Date.now()}.csv"`);
        return res.send(csv);
    }

    // Default: JSON format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="moviemania-export-${Date.now()}.json"`);

    return res.json({
        exportDate: new Date().toISOString(),
        totalMovies: exportData.length,
        movies: exportData
    });
});

/**
 * @desc    Get export stats (preview before export)
 * @route   GET /api/movies/export/stats
 * @access  Private
 */
export const getExportStats = asyncHandler(async (req, res) => {
    const count = await Movie.countDocuments({ addedBy: req.user._id });

    ApiResponse.success(res, {
        totalMovies: count,
        availableFormats: ['json', 'csv']
    });
});
