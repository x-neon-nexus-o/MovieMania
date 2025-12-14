import api from './api';

const tvWatchlistService = {
    // Get all TV watchlist items
    getTVWatchlist: async (params = {}) => {
        const response = await api.get('/watchlist-tv', { params });
        return response.data;
    },

    // Get watchlist statistics
    getStats: async () => {
        const response = await api.get('/watchlist-tv/stats');
        return response.data;
    },

    // Get single watchlist item
    getItem: async (id) => {
        const response = await api.get(`/watchlist-tv/${id}`);
        return response.data;
    },

    // Add TV show to watchlist
    addToWatchlist: async (data) => {
        const response = await api.post('/watchlist-tv', data);
        return response.data;
    },

    // Update watchlist item
    updateItem: async (id, data) => {
        const response = await api.put(`/watchlist-tv/${id}`, data);
        return response.data;
    },

    // Update priority
    updatePriority: async (id, priority) => {
        const response = await api.patch(`/watchlist-tv/${id}/priority`, { priority });
        return response.data;
    },

    // Remove from watchlist
    removeFromWatchlist: async (id) => {
        const response = await api.delete(`/watchlist-tv/${id}`);
        return response.data;
    },

    // Start watching (move to tracking)
    startWatching: async (id, data = {}) => {
        const response = await api.post(`/watchlist-tv/${id}/start-watching`, data);
        return response.data;
    },

    // Check TV show status
    checkStatus: async (tmdbId) => {
        const response = await api.get(`/watchlist-tv/check/${tmdbId}`);
        return response.data;
    }
};

export default tvWatchlistService;
