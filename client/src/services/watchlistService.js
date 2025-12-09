import api from './api';

const watchlistService = {
    /**
     * Get all watchlist items with optional filters
     */
    getWatchlist: async (params = {}) => {
        const response = await api.get('/watchlist', { params });
        return response.data.data;
    },

    /**
     * Get watchlist statistics
     */
    getStats: async () => {
        const response = await api.get('/watchlist/stats');
        return response.data.data;
    },

    /**
     * Get single watchlist item
     */
    getWatchlistItem: async (id) => {
        const response = await api.get(`/watchlist/${id}`);
        return response.data.data;
    },

    /**
     * Add movie to watchlist
     */
    addToWatchlist: async (data) => {
        const response = await api.post('/watchlist', data);
        return response.data.data;
    },

    /**
     * Update watchlist item
     */
    updateWatchlistItem: async (id, data) => {
        const response = await api.put(`/watchlist/${id}`, data);
        return response.data.data;
    },

    /**
     * Quick priority update
     */
    updatePriority: async (id, priority) => {
        const response = await api.patch(`/watchlist/${id}/priority`, { priority });
        return response.data.data;
    },

    /**
     * Remove from watchlist
     */
    removeFromWatchlist: async (id) => {
        const response = await api.delete(`/watchlist/${id}`);
        return response.data.data;
    },

    /**
     * Move watchlist item to watched movies
     */
    moveToWatched: async (id, movieData) => {
        const response = await api.post(`/watchlist/${id}/move-to-watched`, movieData);
        return response.data.data;
    },

    /**
     * Check if movie exists in watchlist or watched
     */
    checkMovieStatus: async (tmdbId) => {
        const response = await api.get(`/watchlist/check/${tmdbId}`);
        return response.data.data;
    }
};

export default watchlistService;
