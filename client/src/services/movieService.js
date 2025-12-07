import api from './api';

const movieService = {
    /**
     * Get all movies with filters
     */
    async getMovies(params = {}) {
        const response = await api.get('/movies', { params });
        return response.data;
    },

    /**
     * Get single movie by ID
     */
    async getMovie(id) {
        const response = await api.get(`/movies/${id}`);
        return response.data;
    },

    /**
     * Get movie by TMDB ID
     */
    async getMovieByTMDBId(tmdbId) {
        const response = await api.get(`/movies/tmdb/${tmdbId}`);
        return response.data;
    },

    /**
     * Create new movie
     */
    async createMovie(data) {
        const response = await api.post('/movies', data);
        return response.data;
    },

    /**
     * Update movie
     */
    async updateMovie(id, data) {
        const response = await api.put(`/movies/${id}`, data);
        return response.data;
    },

    /**
     * Delete movie
     */
    async deleteMovie(id) {
        const response = await api.delete(`/movies/${id}`);
        return response.data;
    },

    /**
     * Get all unique tags
     */
    async getTags() {
        const response = await api.get('/movies/tags');
        return response.data;
    },

    /**
     * Bulk update movies
     */
    async bulkUpdate(movieIds, updates) {
        const response = await api.patch('/movies/bulk/update', {
            movieIds,
            updates,
        });
        return response.data;
    },
};

export default movieService;
