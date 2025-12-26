import axios from 'axios';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
// Mocking tmdbService import
const tmdbService = {
    getMovieDetails: async () => ({
        title: 'Mock Movie',
        original_title: 'Mock Movie',
        release_date: '2023-01-01',
        poster_path: '/mock.jpg',
        backdrop_path: '/mock_back.jpg',
        overview: 'Mock overview',
        runtime: 120,
        genres: [{ name: 'Action' }],
        vote_average: 8.0,
        vote_count: 100
    })
};

class TraktService {
    constructor() {
        this.baseUrl = 'https://api.trakt.tv';
        this.clientId = process.env.TRAKT_CLIENT_ID;
        this.clientSecret = process.env.TRAKT_CLIENT_SECRET;
        this.redirectUri = process.env.TRAKT_REDIRECT_URI || 'http://localhost:5173/settings/integrations/trakt/callback';
    }

    /**
     * Exchange authorization code for tokens
     */
    async exchangeCode(code, userId) {
        try {
            const response = await axios.post(`${this.baseUrl}/oauth/token`, {
                code,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'authorization_code'
            });

            const { access_token, refresh_token, created_at, expires_in } = response.data;
            const expiresAt = new Date((created_at + expires_in) * 1000);

            // Get user profile from Trakt
            const profileRes = await axios.get(`${this.baseUrl}/users/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                    'trakt-api-version': '2',
                    'trakt-api-key': this.clientId
                }
            });

            // Update user with tokens
            await User.findByIdAndUpdate(userId, {
                'integrations.trakt': {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    tokenExpiresAt: expiresAt,
                    username: profileRes.data.username
                }
            });

            return { username: profileRes.data.username };
        } catch (error) {
            console.error('Trakt auth error:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with Trakt');
        }
    }

    /**
     * Sync watched history from Trakt to local DB
     */
    async syncHistory(userId) {
        const user = await User.findById(userId);
        if (!user.integrations?.trakt?.accessToken) {
            throw new Error('Trakt not connected');
        }

        const token = user.integrations.trakt.accessToken;
        let syncedCount = 0;

        try {
            // Get watched history (movies)
            // Limit to 100 for MVP, can implement pagination later
            const response = await axios.get(`${this.baseUrl}/sync/history/movies?limit=100`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'trakt-api-version': '2',
                    'trakt-api-key': this.clientId
                }
            });

            for (const item of response.data) {
                const tmdbId = item.movie.ids.tmdb;
                const watchedAt = new Date(item.watched_at);

                // Skip if no TMDB ID
                if (!tmdbId) continue;

                // Check if we already have this movie
                const existing = await Movie.findOne({ tmdbId, addedBy: userId });

                if (existing) {
                    // Update if syncedFrom is trakt or manual (optional conflict resolution)
                    // For now, minimal touch
                    continue;
                }

                // Fetch details from TMDB to populate local record
                const movieDetails = await tmdbService.getMovieDetails(tmdbId);

                // Create new movie record
                await Movie.create({
                    tmdbId,
                    title: movieDetails.title,
                    originalTitle: movieDetails.original_title,
                    year: new Date(movieDetails.release_date).getFullYear(),
                    releaseDate: movieDetails.release_date,
                    posterPath: movieDetails.poster_path,
                    backdropPath: movieDetails.backdrop_path,
                    overview: movieDetails.overview,
                    runtime: movieDetails.runtime,
                    tmdbGenres: movieDetails.genres,
                    tmdbRating: movieDetails.vote_average,
                    tmdbVoteCount: movieDetails.vote_count,
                    // Default values for synced items
                    myRating: 0, // Trakt history doesn't include rating, need separate call
                    watchedDate: watchedAt,
                    addedBy: userId,
                    syncedFrom: 'trakt',
                    externalIds: {
                        traktId: item.movie.ids.trakt
                    }
                });
                syncedCount++;
            }

            // Update last sync time
            await User.findByIdAndUpdate(userId, {
                'integrations.trakt.lastSync': new Date()
            });

            return { syncedCount };

        } catch (error) {
            console.error('Trakt sync error:', error.response?.data || error.message);
            throw new Error('Failed to sync history from Trakt');
        }
    }
}

export default new TraktService();
