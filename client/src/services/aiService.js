import api from './api';

const aiService = {
    // Generate a review draft based on rating and title
    generateReviewDraft: async (movieTitle, rating, genres) => {
        const response = await api.post('/ai/review/generate', {
            movieTitle,
            rating,
            genres
        });
        return response.data.draft;
    },

    // Expand bullet points into a full review
    expandThoughts: async (bulletPoints) => {
        const response = await api.post('/ai/review/expand', {
            bulletPoints
        });
        return response.data.review;
    },

    // Remove spoilers from review text
    removeSpoilers: async (reviewText) => {
        const response = await api.post('/ai/review/spoiler-free', {
            reviewText
        });
        return response.data.cleanText;
    },

    // Analyze sentiment of review text
    analyzeSentiment: async (text) => {
        const response = await api.post('/ai/review/analyze', {
            text
        });
        return response.data;
    },

    // Suggest tags based on review content
    suggestTags: async (reviewText) => {
        const response = await api.post('/ai/review/suggest-tags', {
            reviewText
        });
        return response.data;
    },

    // Natural language search
    smartSearch: async (query) => {
        const response = await api.post('/ai/search', {
            query
        });
        return response.data;
    },

    // Predict rating for a movie
    predictRating: async (tmdbId, type = 'movie') => {
        const response = await api.get(`/ai/predict/rating/${tmdbId}/${type}`);
        return response.data;
    },

    // Calculate taste match percentage
    getTasteMatch: async (tmdbId, type = 'movie') => {
        const response = await api.get(`/ai/predict/match/${tmdbId}/${type}`);
        return response.data;
    },

    // Get auto-generated insights
    getAutoInsights: async () => {
        const response = await api.get('/ai/insights/dashboard');
        return response.data;
    }
};

export default aiService;
