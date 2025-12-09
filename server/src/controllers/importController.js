import Movie from '../models/Movie.js';
import tmdbService from '../services/tmdbService.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Parse CSV string into array of objects
 */
const parseCSV = (csvString) => {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return [];

    // Parse header - handle both comma and quoted fields
    const parseRow = (row) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = parseRow(lines[i]);
        const obj = {};
        headers.forEach((header, idx) => {
            obj[header] = values[idx]?.replace(/^["']|["']$/g, '') || '';
        });
        data.push(obj);
    }

    return data;
};

/**
 * Detect import format (Letterboxd or IMDb)
 */
const detectFormat = (headers) => {
    const headerStr = headers.join(',').toLowerCase();

    if (headerStr.includes('letterboxd')) {
        return 'letterboxd';
    }
    if (headerStr.includes('const') || headerStr.includes('imdb')) {
        return 'imdb';
    }
    if (headerStr.includes('name') && headerStr.includes('year') && headerStr.includes('rating')) {
        return 'letterboxd'; // Letterboxd diary/watchlist format
    }
    if (headerStr.includes('title') && headerStr.includes('year')) {
        return 'generic';
    }
    return 'unknown';
};

/**
 * @desc    Import movies from CSV file
 * @route   POST /api/import
 * @access  Private
 */
export const importMovies = asyncHandler(async (req, res) => {
    const { csvData, skipDuplicates = true } = req.body;

    if (!csvData) {
        throw ApiError.badRequest('CSV data is required');
    }

    const rows = parseCSV(csvData);

    if (rows.length === 0) {
        throw ApiError.badRequest('No valid data found in CSV');
    }

    const headers = Object.keys(rows[0]);
    const format = detectFormat(headers);

    const results = {
        total: rows.length,
        imported: 0,
        skipped: 0,
        failed: 0,
        errors: []
    };

    for (const row of rows) {
        try {
            // Extract movie info based on format
            let title, year, rating, watchedDate;

            if (format === 'letterboxd') {
                // Letterboxd diary format: Date,Name,Year,Letterboxd URI,Rating
                // Letterboxd watchlist: Name,Year,Letterboxd URI
                title = row.name || row.title || '';
                year = parseInt(row.year) || null;
                rating = row.rating ? parseFloat(row.rating) : null;
                watchedDate = row.date || row['watched date'] || null;
            } else if (format === 'imdb') {
                // IMDb format: Const,Your Rating,Date Rated,Title,URL,Title Type,IMDb Rating,Runtime,Year,Genres,Num Votes,Release Date,Directors
                title = row.title || '';
                year = parseInt(row.year) || null;
                rating = row['your rating'] ? parseFloat(row['your rating']) / 2 : null; // IMDb is 1-10, we use 0.5-5
                watchedDate = row['date rated'] || null;
            } else {
                // Generic format
                title = row.title || row.name || '';
                year = parseInt(row.year) || null;
                rating = row.rating ? parseFloat(row.rating) : null;
                watchedDate = row.date || row['watched date'] || null;
            }

            if (!title) {
                results.failed++;
                results.errors.push({ title: 'Unknown', error: 'No title found' });
                continue;
            }

            // Search TMDB for the movie
            const searchResults = await tmdbService.searchMovies(title, 1, year);

            if (!searchResults.results || searchResults.results.length === 0) {
                results.failed++;
                results.errors.push({ title, error: 'Not found on TMDB' });
                continue;
            }

            // Get the best match (first result or match by year)
            let match = searchResults.results[0];
            if (year) {
                const yearMatch = searchResults.results.find(m => {
                    const mYear = m.releaseDate ? new Date(m.releaseDate).getFullYear() : null;
                    return mYear === year;
                });
                if (yearMatch) match = yearMatch;
            }

            // Check for duplicates
            if (skipDuplicates) {
                const existing = await Movie.findOne({
                    tmdbId: match.id,
                    addedBy: req.user._id
                });

                if (existing) {
                    results.skipped++;
                    continue;
                }
            }

            // Get full movie details from TMDB
            const movieDetails = await tmdbService.getMovieDetails(match.id);

            // Create movie entry
            await Movie.create({
                title: movieDetails.title,
                tmdbId: movieDetails.tmdbId,
                imdbId: movieDetails.imdbId,
                year: movieDetails.year,
                overview: movieDetails.overview,
                posterPath: movieDetails.posterPath,
                backdropPath: movieDetails.backdropPath,
                tmdbGenres: movieDetails.genres,
                runtime: movieDetails.runtime,
                tmdbRating: movieDetails.tmdbRating,
                tmdbVoteCount: movieDetails.tmdbVoteCount,
                director: movieDetails.director,
                cast: movieDetails.cast,
                tagline: movieDetails.tagline,
                myRating: rating || 0,
                watchedDate: watchedDate ? new Date(watchedDate) : new Date(),
                addedBy: req.user._id,
                isPublic: true
            });

            results.imported++;

            // Small delay to avoid hitting TMDB rate limits
            await new Promise(resolve => setTimeout(resolve, 250));

        } catch (error) {
            results.failed++;
            results.errors.push({
                title: row.name || row.title || 'Unknown',
                error: error.message
            });
        }
    }

    ApiResponse.success(res, results, `Import complete: ${results.imported} movies imported`);
});

/**
 * @desc    Get import format info
 * @route   GET /api/import/formats
 * @access  Public
 */
export const getImportFormats = asyncHandler(async (req, res) => {
    ApiResponse.success(res, {
        supportedFormats: [
            {
                name: 'Letterboxd',
                description: 'Export from Letterboxd.com (diary.csv or watchlist.csv)',
                fields: ['Name', 'Year', 'Rating', 'Date'],
                howToExport: 'Go to Settings > Import & Export > Export Your Data'
            },
            {
                name: 'IMDb',
                description: 'Export from IMDb.com (ratings.csv)',
                fields: ['Title', 'Year', 'Your Rating', 'Date Rated'],
                howToExport: 'Go to Your Ratings > ⋯ Menu > Export'
            },
            {
                name: 'MovieMania',
                description: 'Re-import your MovieMania export',
                fields: ['title', 'year', 'myRating', 'watchedDate'],
                howToExport: 'Dashboard > Export > JSON or CSV'
            }
        ]
    });
});
