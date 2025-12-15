import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import geminiService from '../services/geminiService.js';
import tmdbService from '../services/tmdbService.js';

// TMDB Genre ID mapping
const GENRE_MAP = {
    'Action': 28,
    'Adventure': 12,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'History': 36,
    'Horror': 27,
    'Music': 10402,
    'Mystery': 9648,
    'Romance': 10749,
    'Science Fiction': 878,
    'Sci-Fi': 878,
    'TV Movie': 10770,
    'Thriller': 53,
    'War': 10752,
    'Western': 37
};

export const smartSearch = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return ApiResponse.error(res, 'Search query is required', 400);
    }

    try {
        // 1. Parse natural language query
        const aiParams = await geminiService.parseNaturalQuery(query);

        let results = [];

        // 2. Check if it's a "like X but Y" query
        if (query.toLowerCase().includes('like') && query.toLowerCase().includes('but')) {
            const parts = query.toLowerCase().split('but');
            const targetMovie = parts[0].replace('like', '').trim();
            const modifier = parts[1].trim();

            const similar = await geminiService.findSimilarMovies(targetMovie, modifier);
            // Search specifically for these suggested titles
            results = await Promise.all(similar.map(async (item) => {
                const search = await tmdbService.searchMovies(item.title);
                if (search.results && search.results.length > 0) {
                    return {
                        ...search.results[0],
                        aiReason: item.reason
                    };
                }
                return null;
            }));
            results = results.filter(Boolean);
        } else {
            // 3. Build discovery parameters from AI interpretation
            const discoveryParams = {
                page: 1,
                sort_by: aiParams.sortBy || 'popularity.desc'
            };

            // Map genres to IDs
            if (aiParams.genres && aiParams.genres.length > 0) {
                const genreIds = aiParams.genres
                    .map(g => GENRE_MAP[g] || GENRE_MAP[g.replace('-', ' ')])
                    .filter(Boolean);

                if (genreIds.length > 0) {
                    discoveryParams.with_genres = genreIds.join(',');
                }
            }

            // Add year range
            if (aiParams.yearRange) {
                discoveryParams['primary_release_date.gte'] = `${aiParams.yearRange.start}-01-01`;
                discoveryParams['primary_release_date.lte'] = `${aiParams.yearRange.end}-12-31`;
            }

            // Add minimum rating
            if (aiParams.rating && aiParams.rating.min) {
                discoveryParams['vote_average.gte'] = aiParams.rating.min;
            }

            // Try discovery first
            const discovery = await tmdbService.discoverMovies(discoveryParams);

            if (discovery.results && discovery.results.length > 0) {
                results = discovery.results;
            } else {
                // Fallback to keyword search
                const keyword = aiParams.keywords?.[0] || query.split(' ').slice(0, 3).join(' ');
                const searchResults = await tmdbService.searchMovies(keyword);
                results = searchResults.results || [];
            }
        }

        ApiResponse.success(res, {
            results,
            aiParams,
            message: `Found ${results.length} matches based on your query`
        });
    } catch (error) {
        console.error('Smart Search Error:', error);
        ApiResponse.error(res, 'Failed to perform smart search', 503);
    }
});
