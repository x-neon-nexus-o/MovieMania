import Movie from '../models/Movie.js';
import User from '../models/User.js';
import tmdbService from '../services/tmdbService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const handlePlexWebhook = asyncHandler(async (req, res) => {
    // Plex sends a multipart payload, usually parsing 'payload' field as JSON
    // We assume body parser handles this or we access req.body.payload
    let payload = req.body.payload;

    if (typeof payload === 'string') {
        try {
            payload = JSON.parse(payload);
        } catch (e) {
            return ApiResponse.error(res, 'Invalid JSON payload', 400);
        }
    }

    if (!payload || !payload.Metadata) {
        // Just return 200 to acknowledge ping
        return res.status(200).send('OK');
    }

    const event = payload.event;
    const metadata = payload.Metadata;
    const account = payload.Account;

    // We only care about 'media.scrobble' (watched 90%+) or 'media.rate'
    if (event !== 'media.scrobble') {
        return res.status(200).send('Ignored event');
    }

    // Identify user by Plex username/email matching our User DB? 
    // Or use a user-specific webhook URL: /api/webhooks/plex?secret=USER_API_KEY
    // For MVP, we will rely on the query param 'userId' or 'secret' provided in the webhook URL setup

    const userId = req.query.userId; // Setup webhook as .../plex?userId=MONGODB_ID
    if (!userId) {
        return ApiResponse.error(res, 'Missing userId in query params', 400);
    }

    const title = metadata.title;
    const year = metadata.year;

    // Plex uses agents like 'com.plexapp.agents.imdb://tt12345' or 'tv.plex.agents.movie://12345'
    // We try to find by title/year first

    console.log(`[Plex] User ${userId} watched ${title} (${year})`);

    await processWatchedMovie(userId, title, year);

    res.status(200).send('Synced');
});

export const handleJellyfinWebhook = asyncHandler(async (req, res) => {
    const payload = req.body;

    // Jellyfin "ItemPlayed" or "PlaybackStop" with Played: true
    if (payload.NotificationType !== 'ItemPlayed' && payload.NotificationType !== 'PlaybackStop') {
        return res.status(200).send('Ignored');
    }

    if (payload.NotificationType === 'PlaybackStop' && !payload.Played) {
        return res.status(200).send('Not fully watched');
    }

    const userId = req.query.userId;
    if (!userId) {
        return ApiResponse.error(res, 'Missing userId in query params', 400);
    }

    const title = payload.Name;
    const year = payload.Year;

    console.log(`[Jellyfin] User ${userId} watched ${title} (${year})`);

    await processWatchedMovie(userId, title, year);

    res.status(200).send('Synced');
});

// Helper to sync movie
async function processWatchedMovie(userId, title, year) {
    // 1. Check if movie exists in user's library
    // Use flexible search logic

    // Search TMDB first to get accurate ID
    const searchRes = await tmdbService.searchMovies(title, 1, year);
    if (!searchRes.results || searchRes.results.length === 0) {
        console.log(`[Webhook] Could not find movie: ${title}`);
        return;
    }

    const match = searchRes.results[0];

    // Check if already in DB
    const existing = await Movie.findOne({
        tmdbId: match.tmdbId,
        addedBy: userId
    });

    if (existing) {
        // Update watched date if not set or update last watched?
        // For now, let's assuming webhook means "Just Watched"
        existing.watchedDate = new Date();
        existing.save();
    } else {
        // Import it
        const details = await tmdbService.getMovieDetails(match.tmdbId);

        await Movie.create({
            tmdbId: details.tmdbId,
            title: details.title,
            originalTitle: details.originalTitle,
            year: details.year,
            posterPath: details.posterPath,
            backdropPath: details.backdropPath,
            overview: details.overview,
            tmdbGenres: details.tmdbGenres,
            runtime: details.runtime,
            tmdbRating: details.tmdbRating,
            myRating: 0, // Automated add
            watchedDate: new Date(),
            addedBy: userId,
            syncedFrom: 'import', // or 'webhook'
            isPublic: true
        });
    }
}
