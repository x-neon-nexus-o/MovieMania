import api from './api';

export const episodeService = {
    /**
     * Get all episodes for a TV show (grouped by season)
     */
    async getAllEpisodes(tmdbShowId) {
        const response = await api.get(`/episodes/${tmdbShowId}`);
        return response.data;
    },

    /**
     * Get episodes for a specific season
     */
    async getSeasonEpisodes(tmdbShowId, seasonNumber) {
        const response = await api.get(`/episodes/${tmdbShowId}/season/${seasonNumber}`);
        return response.data;
    },

    /**
     * Get analytics for a TV show
     */
    async getShowAnalytics(tmdbShowId) {
        const response = await api.get(`/episodes/${tmdbShowId}/analytics`);
        return response.data;
    },

    /**
     * Rate an episode
     */
    async rateEpisode(tmdbShowId, seasonNumber, episodeNumber, rating) {
        if (rating < 0 || rating > 10) {
            throw new Error('Rating must be between 0 and 10');
        }

        const response = await api.post(`/episodes/${tmdbShowId}/rate`, {
            seasonNumber,
            episodeNumber,
            rating,
        });
        return response.data;
    },

    /**
     * Sync episodes from TMDB
     */
    async syncEpisodes(tmdbShowId) {
        const response = await api.post(`/episodes/${tmdbShowId}/sync`);
        return response.data;
    },
};

export default episodeService;
