import api from './api';

const tmdbService = {
    /**
     * Search TMDB movies
     */
    async searchMovies(query, page = 1, year = null) {
        const params = { query, page };
        if (year) params.year = year;

        const response = await api.get('/tmdb/search', { params });
        return response.data;
    },

    /**
     * Get TMDB movie details
     */
    async getMovieDetails(tmdbId) {
        const response = await api.get(`/tmdb/movie/${tmdbId}`);
        return response.data;
    },

    /**
     * Get trending movies
     */
    async getTrending(timeWindow = 'week', page = 1) {
        const response = await api.get('/tmdb/trending', {
            params: { timeWindow, page },
        });
        return response.data;
    },

    /**
     * Get popular movies
     */
    async getPopular(page = 1) {
        const response = await api.get('/tmdb/popular', {
            params: { page },
        });
        return response.data;
    },

    /**
     * Get poster URL
     */
    getPosterUrl(path, size = 'w500') {
        if (!path) return null;
        return `https://image.tmdb.org/t/p/${size}${path}`;
    },

    /**
     * Get backdrop URL
     */
    getBackdropUrl(path, size = 'w1280') {
        if (!path) return null;
        return `https://image.tmdb.org/t/p/${size}${path}`;
    },
};

export default tmdbService;
