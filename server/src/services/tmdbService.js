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

    // Alias for recommendation service
    async getTrendingMovies(page = 1) {
        return this.getTrending('week', page);
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

    // Alias for recommendation service
    async getPopularMovies(page = 1) {
        return this.getPopular(page);
    }

    /**
     * Discover movies with custom filters
     * @param {Object} params - Filter parameters
     * @returns {Promise<Object>} Discovered movies
     */
    async discoverMovies(params = {}) {
        try {
            const response = await this.client.get('/discover/movie', {
                params: {
                    ...params,
                    page: params.page || 1
                }
            });

            return {
                results: response.data.results.map(this.formatMovieResult),
                page: response.data.page,
                totalPages: response.data.total_pages,
                totalResults: response.data.total_results
            };
        } catch (error) {
            console.error('Error discovering movies:', error);
            return { results: [], page: 1, totalPages: 0, totalResults: 0 };
        }
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
     * Get movie videos (trailers, teasers)
     * @param {number} tmdbId - TMDB movie ID
     * @returns {Promise<Object>} Video data with primary trailer and all videos
     */
    async getMovieVideos(tmdbId) {
        try {
            const response = await this.client.get(`/movie/${tmdbId}/videos`, {
                params: {
                    language: 'en-US'
                }
            });

            const videos = response.data.results || [];

            // Find official trailer (prioritize)
            const officialTrailer = videos.find(
                v => v.type === 'Trailer' &&
                    v.official === true &&
                    v.site === 'YouTube'
            );

            // Fallback to any trailer
            const anyTrailer = videos.find(
                v => v.type === 'Trailer' && v.site === 'YouTube'
            );

            // Get all trailers and teasers
            const allVideos = videos.filter(
                v => ['Trailer', 'Teaser'].includes(v.type) &&
                    v.site === 'YouTube'
            ).map(v => ({
                key: v.key,
                name: v.name,
                type: v.type,
                official: v.official,
                publishedAt: v.published_at
            }));

            const primary = officialTrailer || anyTrailer;

            return {
                primary: primary ? {
                    key: primary.key,
                    name: primary.name,
                    type: primary.type,
                    official: primary.official
                } : null,
                all: allVideos,
                hasTrailer: Boolean(primary)
            };
        } catch (error) {
            console.error('Error fetching videos:', error);
            return { primary: null, all: [], hasTrailer: false };
        }
    }

    /**
     * Get watch providers (streaming availability) for a movie
     * @param {number} tmdbId - TMDB movie ID
     * @param {string} region - Region code (e.g., 'US', 'IN', 'GB')
     * @returns {Promise<Object>} Watch provider data
     */
    async getWatchProviders(tmdbId, region = 'US') {
        try {
            const response = await this.client.get(`/movie/${tmdbId}/watch/providers`);

            // Get providers for the specified region, fallback to US
            const results = response.data.results || {};
            const regionData = results[region] || results['US'] || null;

            if (!regionData) {
                return {
                    region,
                    available: false,
                    link: null,
                    flatrate: [], // Subscription streaming
                    rent: [],     // Rent options
                    buy: [],      // Purchase options
                    free: []      // Free with ads
                };
            }

            // Format provider data
            const formatProviders = (providers = []) =>
                providers.map(p => ({
                    id: p.provider_id,
                    name: p.provider_name,
                    logo: p.logo_path ? `${this.imageBaseUrl}/w92${p.logo_path}` : null,
                    priority: p.display_priority
                })).sort((a, b) => a.priority - b.priority);

            return {
                region,
                available: true,
                link: regionData.link,
                flatrate: formatProviders(regionData.flatrate),
                rent: formatProviders(regionData.rent),
                buy: formatProviders(regionData.buy),
                free: formatProviders(regionData.free)
            };
        } catch (error) {
            console.error('Error fetching watch providers:', error);
            return {
                region,
                available: false,
                link: null,
                flatrate: [],
                rent: [],
                buy: [],
                free: []
            };
        }
    }

    /**
     * Get movie recommendations based on a movie
     * @param {number} tmdbId - TMDB movie ID
     * @param {number} page - Page number
     * @returns {Promise<Object>} Recommended movies
     */
    async getRecommendations(tmdbId, page = 1) {
        try {
            const response = await this.client.get(`/movie/${tmdbId}/recommendations`, {
                params: { page }
            });

            return {
                results: response.data.results.slice(0, 12).map(this.formatMovieResult),
                page: response.data.page,
                totalPages: response.data.total_pages,
                totalResults: response.data.total_results
            };
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return {
                results: [],
                page: 1,
                totalPages: 0,
                totalResults: 0
            };
        }
    }

    /**
     * Get similar movies
     * @param {number} tmdbId - TMDB movie ID
     * @param {number} page - Page number
     * @returns {Promise<Object>} Similar movies
     */
    async getSimilarMovies(tmdbId, page = 1) {
        try {
            const response = await this.client.get(`/movie/${tmdbId}/similar`, {
                params: { page }
            });

            return {
                results: response.data.results.slice(0, 12).map(this.formatMovieResult),
                page: response.data.page,
                totalPages: response.data.total_pages,
                totalResults: response.data.total_results
            };
        } catch (error) {
            console.error('Error fetching similar movies:', error);
            return {
                results: [],
                page: 1,
                totalPages: 0,
                totalResults: 0
            };
        }
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

    // ==================== TV SHOW METHODS ====================

    /**
     * Search TV shows by query
     * @param {string} query - Search query
     * @param {number} page - Page number
     * @param {number} year - Optional first air year filter
     * @returns {Promise<Object>} Search results
     */
    async searchTVShows(query, page = 1, year = null) {
        const params = {
            query,
            page,
            include_adult: false
        };

        if (year) {
            params.first_air_date_year = year;
        }

        const response = await this.client.get('/search/tv', { params });

        return {
            results: response.data.results.map(this.formatTVShowResult),
            page: response.data.page,
            totalPages: response.data.total_pages,
            totalResults: response.data.total_results
        };
    }

    /**
     * Get TV show details by TMDB ID
     * @param {number} tmdbId - TMDB TV show ID
     * @returns {Promise<Object>} TV show details
     */
    async getTVShowDetails(tmdbId) {
        const response = await this.client.get(`/tv/${tmdbId}`, {
            params: {
                append_to_response: 'credits'
            }
        });

        return this.formatTVShowDetails(response.data);
    }

    /**
     * Get trending TV shows
     * @param {string} timeWindow - 'day' or 'week'
     * @param {number} page - Page number
     * @returns {Promise<Object>} Trending TV shows
     */
    async getTrendingTVShows(timeWindow = 'week', page = 1) {
        const response = await this.client.get(`/trending/tv/${timeWindow}`, {
            params: { page }
        });

        return {
            results: response.data.results.map(this.formatTVShowResult),
            page: response.data.page,
            totalPages: response.data.total_pages,
            totalResults: response.data.total_results
        };
    }

    /**
     * Get popular TV shows
     * @param {number} page - Page number
     * @returns {Promise<Object>} Popular TV shows
     */
    async getPopularTVShows(page = 1) {
        const response = await this.client.get('/tv/popular', {
            params: { page }
        });

        return {
            results: response.data.results.map(this.formatTVShowResult),
            page: response.data.page,
            totalPages: response.data.total_pages,
            totalResults: response.data.total_results
        };
    }

    /**
     * Discover TV shows with custom filters
     * @param {Object} params - Filter parameters
     * @returns {Promise<Object>} Discovered TV shows
     */
    async discoverTVShows(params = {}) {
        try {
            const response = await this.client.get('/discover/tv', {
                params: {
                    ...params,
                    page: params.page || 1
                }
            });

            return {
                results: response.data.results.map(this.formatTVShowResult),
                page: response.data.page,
                totalPages: response.data.total_pages,
                totalResults: response.data.total_results
            };
        } catch (error) {
            console.error('Error discovering TV shows:', error);
            return { results: [], page: 1, totalPages: 0, totalResults: 0 };
        }
    }

    /**
     * Get TV show videos (trailers, teasers)
     * @param {number} tmdbId - TMDB TV show ID
     * @returns {Promise<Object>} Video data
     */
    async getTVShowVideos(tmdbId) {
        try {
            const response = await this.client.get(`/tv/${tmdbId}/videos`, {
                params: { language: 'en-US' }
            });

            const videos = response.data.results || [];

            const officialTrailer = videos.find(
                v => v.type === 'Trailer' && v.official === true && v.site === 'YouTube'
            );

            const anyTrailer = videos.find(
                v => v.type === 'Trailer' && v.site === 'YouTube'
            );

            const allVideos = videos.filter(
                v => ['Trailer', 'Teaser', 'Opening Credits'].includes(v.type) && v.site === 'YouTube'
            ).map(v => ({
                key: v.key,
                name: v.name,
                type: v.type,
                official: v.official,
                publishedAt: v.published_at
            }));

            const primary = officialTrailer || anyTrailer;

            return {
                primary: primary ? {
                    key: primary.key,
                    name: primary.name,
                    type: primary.type,
                    official: primary.official
                } : null,
                all: allVideos,
                hasTrailer: Boolean(primary)
            };
        } catch (error) {
            console.error('Error fetching TV show videos:', error);
            return { primary: null, all: [], hasTrailer: false };
        }
    }

    /**
     * Get watch providers for a TV show
     * @param {number} tmdbId - TMDB TV show ID
     * @param {string} region - Region code
     * @returns {Promise<Object>} Watch provider data
     */
    async getTVWatchProviders(tmdbId, region = 'US') {
        try {
            const response = await this.client.get(`/tv/${tmdbId}/watch/providers`);

            const results = response.data.results || {};
            const regionData = results[region] || results['US'] || null;

            if (!regionData) {
                return {
                    region,
                    available: false,
                    link: null,
                    flatrate: [],
                    rent: [],
                    buy: [],
                    free: []
                };
            }

            const formatProviders = (providers = []) =>
                providers.map(p => ({
                    id: p.provider_id,
                    name: p.provider_name,
                    logo: p.logo_path ? `${this.imageBaseUrl}/w92${p.logo_path}` : null,
                    priority: p.display_priority
                })).sort((a, b) => a.priority - b.priority);

            return {
                region,
                available: true,
                link: regionData.link,
                flatrate: formatProviders(regionData.flatrate),
                rent: formatProviders(regionData.rent),
                buy: formatProviders(regionData.buy),
                free: formatProviders(regionData.free)
            };
        } catch (error) {
            console.error('Error fetching TV watch providers:', error);
            return {
                region,
                available: false,
                link: null,
                flatrate: [],
                rent: [],
                buy: [],
                free: []
            };
        }
    }

    /**
     * Get TV show recommendations
     * @param {number} tmdbId - TMDB TV show ID
     * @param {number} page - Page number
     * @returns {Promise<Object>} Recommended TV shows
     */
    async getTVShowRecommendations(tmdbId, page = 1) {
        try {
            const response = await this.client.get(`/tv/${tmdbId}/recommendations`, {
                params: { page }
            });

            return {
                results: response.data.results.slice(0, 12).map(this.formatTVShowResult),
                page: response.data.page,
                totalPages: response.data.total_pages,
                totalResults: response.data.total_results
            };
        } catch (error) {
            console.error('Error fetching TV recommendations:', error);
            return { results: [], page: 1, totalPages: 0, totalResults: 0 };
        }
    }

    /**
     * Format TV show result from search/trending
     * @param {Object} show - Raw TMDB TV show data
     * @returns {Object} Formatted TV show data
     */
    formatTVShowResult(show) {
        return {
            tmdbId: show.id,
            name: show.name,
            originalName: show.original_name,
            firstAirDate: show.first_air_date,
            year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
            posterPath: show.poster_path,
            backdropPath: show.backdrop_path,
            overview: show.overview,
            tmdbRating: show.vote_average,
            tmdbVoteCount: show.vote_count,
            genreIds: show.genre_ids
        };
    }

    /**
     * Format detailed TV show data
     * @param {Object} show - Raw TMDB TV show details
     * @returns {Object} Formatted TV show details
     */
    formatTVShowDetails(show) {
        // Get creators
        const creators = show.created_by?.map(creator => creator.name) || [];

        // Get top 5 cast members
        const cast = show.credits?.cast?.slice(0, 5).map(actor => actor.name) || [];

        // Format networks
        const networks = show.networks?.map(network => ({
            id: network.id,
            name: network.name,
            logoPath: network.logo_path
        })) || [];

        return {
            tmdbId: show.id,
            name: show.name,
            originalName: show.original_name,
            firstAirDate: show.first_air_date,
            lastAirDate: show.last_air_date,
            year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
            posterPath: show.poster_path,
            backdropPath: show.backdrop_path,
            overview: show.overview,
            numberOfSeasons: show.number_of_seasons,
            numberOfEpisodes: show.number_of_episodes,
            episodeRunTime: show.episode_run_time,
            status: show.status,
            tmdbGenres: show.genres,
            tmdbRating: show.vote_average,
            tmdbVoteCount: show.vote_count,
            networks,
            creators,
            cast,
            tagline: show.tagline,
            inProduction: show.in_production,
            type: show.type,
            homepage: show.homepage
        };
    }
}

export default new TMDBService();

