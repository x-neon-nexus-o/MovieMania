import api from './api';

const statsService = {
    /**
     * Get overall statistics
     */
    async getStats() {
        const response = await api.get('/stats');
        return response.data;
    },

    /**
     * Get stats by year
     */
    async getStatsByYear() {
        const response = await api.get('/stats/by-year');
        return response.data;
    },

    /**
     * Get rating distribution
     */
    async getStatsByRating() {
        const response = await api.get('/stats/by-rating');
        return response.data;
    },

    /**
     * Get stats by genre
     */
    async getStatsByGenre() {
        const response = await api.get('/stats/by-genre');
        return response.data;
    },

    /**
     * Get watching timeline
     */
    async getTimeline() {
        const response = await api.get('/stats/timeline');
        return response.data;
    },

    /**
     * Get top tags
     */
    async getTopTags(limit = 20) {
        const response = await api.get('/stats/tags', {
            params: { limit },
        });
        return response.data;
    },
};

export default statsService;
