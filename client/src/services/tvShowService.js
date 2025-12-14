import api from './api';

const tvShowService = {
    /**
     * Get all TV shows with optional filters
     */
    async getTVShows(params = {}) {
        const response = await api.get('/tvshows', { params });
        return response.data;
    },

    /**
     * Get TV show by ID
     */
    async getTVShow(id) {
        const response = await api.get(`/tvshows/${id}`);
        return response.data;
    },

    /**
     * Get TV show by TMDB ID
     */
    async getTVShowByTMDBId(tmdbId) {
        const response = await api.get(`/tvshows/tmdb/${tmdbId}`);
        return response.data;
    },

    /**
     * Add new TV show
     */
    async addTVShow(tvShowData) {
        const response = await api.post('/tvshows', tvShowData);
        return response.data;
    },

    /**
     * Update TV show
     */
    async updateTVShow(id, updates) {
        const response = await api.put(`/tvshows/${id}`, updates);
        return response.data;
    },

    /**
     * Delete TV show
     */
    async deleteTVShow(id) {
        const response = await api.delete(`/tvshows/${id}`);
        return response.data;
    },

    /**
     * Get all unique tags
     */
    async getTags() {
        const response = await api.get('/tvshows/tags');
        return response.data;
    },

    /**
     * Bulk update TV shows
     */
    async bulkUpdate(tvShowIds, updates) {
        const response = await api.patch('/tvshows/bulk', { tvShowIds, updates });
        return response.data;
    },

    /**
     * Search TMDB TV shows
     */
    async searchTMDB(query, page = 1, year = null) {
        const params = { query, page };
        if (year) params.year = year;

        const response = await api.get('/tmdb/tv/search', { params });
        return response.data;
    },

    /**
     * Get TMDB TV show details
     */
    async getTMDBDetails(tmdbId) {
        const response = await api.get(`/tmdb/tv/${tmdbId}`);
        return response.data;
    },

    /**
     * Get trending TV shows from TMDB
     */
    async getTrending(timeWindow = 'week', page = 1) {
        const response = await api.get('/tmdb/tv/trending', {
            params: { timeWindow, page },
        });
        return response.data;
    },

    /**
     * Get popular TV shows from TMDB
     */
    async getPopular(page = 1) {
        const response = await api.get('/tmdb/tv/popular', {
            params: { page },
        });
        return response.data;
    },

    /**
     * Get TV show videos
     */
    async getVideos(tmdbId) {
        const response = await api.get(`/tmdb/tv/${tmdbId}/videos`);
        return response.data;
    },

    /**
     * Get TV show watch providers
     */
    async getWatchProviders(tmdbId, region = 'US') {
        const response = await api.get(`/tmdb/tv/${tmdbId}/providers`, {
            params: { region },
        });
        return response.data;
    },

    /**
     * Get TV show recommendations
     */
    async getRecommendations(tmdbId) {
        const response = await api.get(`/tmdb/tv/${tmdbId}/recommendations`);
        return response.data;
    },
};

export default tvShowService;
