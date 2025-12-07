import axios from 'axios';
import env from '../config/environment.js';

/**
 * TMDB API Service
 * Handles all communication with The Movie Database API
 */
class TMDBService {
    constructor() {
        this.client = axios.create({
            baseURL: env.tmdbBaseUrl,
            params: {
                api_key: env.tmdbApiKey
            }
        });

        this.imageBaseUrl = 'https://image.tmdb.org/t/p';
    }

    /**
     * Search movies by query
     * @param {string} query - Search query
     * @param {number} page - Page number
     * @param {number} year - Optional release year filter
     * @returns {Promise<Object>} Search results
     */
    async searchMovies(query, page = 1, year = null) {
        const params = {
            query,
            page,
            include_adult: false
        };

        if (year) {
            params.year = year;
        }

        const response = await this.client.get('/search/movie', { params });

        return {
            results: response.data.results.map(this.formatMovieResult),
            page: response.data.page,
            totalPages: response.data.total_pages,
            totalResults: response.data.total_results
        };
    }

    /**
     * Get movie details by TMDB ID
     * @param {number} tmdbId - TMDB movie ID
     * @returns {Promise<Object>} Movie details
     */
    async getMovieDetails(tmdbId) {
        const response = await this.client.get(`/movie/${tmdbId}`, {
            params: {
                append_to_response: 'credits'
            }
        });

        return this.formatMovieDetails(response.data);
    }

    /**
     * Get trending movies
     * @param {string} timeWindow - 'day' or 'week'
     * @param {number} page - Page number
     * @returns {Promise<Object>} Trending movies
     */
    async getTrending(timeWindow = 'week', page = 1) {
        const response = await this.client.get(`/trending/movie/${timeWindow}`, {
            params: { page }
        });

        return {
            results: response.data.results.map(this.formatMovieResult),
            page: response.data.page,
            totalPages: response.data.total_pages,
            totalResults: response.data.total_results
        };
    }

    /**
     * Get popular movies
     * @param {number} page - Page number
     * @returns {Promise<Object>} Popular movies
     */
    async getPopular(page = 1) {
        const response = await this.client.get('/movie/popular', {
            params: { page }
        });

        return {
            results: response.data.results.map(this.formatMovieResult),
            page: response.data.page,
            totalPages: response.data.total_pages,
            totalResults: response.data.total_results
        };
    }

    /**
     * Format movie result from search/trending
     * @param {Object} movie - Raw TMDB movie data
     * @returns {Object} Formatted movie data
     */
    formatMovieResult(movie) {
        return {
            tmdbId: movie.id,
            title: movie.title,
            originalTitle: movie.original_title,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
            overview: movie.overview,
            tmdbRating: movie.vote_average,
            tmdbVoteCount: movie.vote_count,
            genreIds: movie.genre_ids
        };
    }

    /**
     * Format detailed movie data
     * @param {Object} movie - Raw TMDB movie details
     * @returns {Object} Formatted movie details
     */
    formatMovieDetails(movie) {
        // Get director from credits
        const director = movie.credits?.crew?.find(
            person => person.job === 'Director'
        );

        // Get top 5 cast members
        const cast = movie.credits?.cast?.slice(0, 5).map(actor => actor.name) || [];

        return {
            tmdbId: movie.id,
            title: movie.title,
            originalTitle: movie.original_title,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
            overview: movie.overview,
            runtime: movie.runtime,
            tmdbGenres: movie.genres,
            tmdbRating: movie.vote_average,
            tmdbVoteCount: movie.vote_count,
            director: director?.name || null,
            cast,
            tagline: movie.tagline,
            budget: movie.budget,
            revenue: movie.revenue,
            status: movie.status,
            imdbId: movie.imdb_id
        };
    }

    /**
     * Get full image URL
     * @param {string} path - Image path from TMDB
     * @param {string} size - Image size (w92, w185, w342, w500, w780, original)
     * @returns {string|null} Full image URL
     */
    getImageUrl(path, size = 'w500') {
        if (!path) return null;
        return `${this.imageBaseUrl}/${size}${path}`;
    }
}

export default new TMDBService();
