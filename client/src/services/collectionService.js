import api from './api';

const collectionService = {
    /**
     * Get all user's collections
     */
    async getCollections() {
        const response = await api.get('/collections');
        return response.data;
    },

    /**
     * Get single collection with movies
     */
    async getCollection(id) {
        const response = await api.get(`/collections/${id}`);
        return response.data;
    },

    /**
     * Create new collection
     */
    async createCollection(data) {
        const response = await api.post('/collections', data);
        return response.data;
    },

    /**
     * Update collection
     */
    async updateCollection(id, data) {
        const response = await api.put(`/collections/${id}`, data);
        return response.data;
    },

    /**
     * Delete collection
     */
    async deleteCollection(id) {
        const response = await api.delete(`/collections/${id}`);
        return response.data;
    },

    /**
     * Add movie to collection
     */
    async addMovie(collectionId, movieId, note = '') {
        const response = await api.post(`/collections/${collectionId}/movies`, {
            movieId,
            note
        });
        return response.data;
    },

    /**
     * Remove movie from collection
     */
    async removeMovie(collectionId, movieId) {
        const response = await api.delete(`/collections/${collectionId}/movies/${movieId}`);
        return response.data;
    },

    /**
     * Reorder movies in collection
     */
    async reorderMovies(collectionId, movieIds) {
        const response = await api.put(`/collections/${collectionId}/reorder`, {
            movieIds
        });
        return response.data;
    },

    /**
     * Get collections containing a movie
     */
    async getMovieCollections(movieId) {
        const response = await api.get(`/collections/movie/${movieId}`);
        return response.data;
    },

    /**
     * Get collection templates
     */
    async getTemplates() {
        const response = await api.get('/collections/templates');
        return response.data;
    }
};

export default collectionService;
