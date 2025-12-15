import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.genAI = null;
        this.model = null;

        if (this.apiKey) {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        } else {
            console.warn('GEMINI_API_KEY is not set in environment variables. AI features will be disabled.');
        }
    }

    async makeRequestWithRetry(operation, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (error.message.includes('429') && i < maxRetries - 1) {
                    const delay = Math.pow(2, i) * 1000 + (Math.random() * 500);
                    console.warn(`Gemini API 429 hit. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }

    cleanJson(text) {
        try {
            // First try simple markdown cleanup
            const simple = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(simple);
        } catch (e) {
            // If that fails, try to find the first '{' and last '}' or '[' and ']'
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            const firstBracket = text.indexOf('[');
            const lastBracket = text.lastIndexOf(']');

            let start = -1;
            let end = -1;

            if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
                start = firstBrace;
                end = lastBrace;
            } else if (firstBracket !== -1) {
                start = firstBracket;
                end = lastBracket;
            }

            if (start !== -1 && end !== -1) {
                const substring = text.substring(start, end + 1);
                return JSON.parse(substring);
            }
            throw new Error(`Failed to parse JSON from AI response: ${text.substring(0, 100)}...`);
        }
    }

    async generateReviewDraft(movieTitle, rating, genres) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Write a short, engaging movie review for "${movieTitle}" (Genres: ${genres.join(', ')}). 
            The rating is ${rating}/5. 
            Keep it under 100 words. 
            Focus on why someone might give this rating.
            Do not include spoilers.`;

            const result = await this.model.generateContent(prompt);
            return result.response.text();
        });
    }

    async expandThoughts(bulletPoints) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Expand these bullet points into a cohesive movie review paragraph. 
            Maintain the original tone.
            
            Bullet points:
            ${bulletPoints}
            
            Output only the paragraph.`;

            const result = await this.model.generateContent(prompt);
            return result.response.text();
        });
    }

    async removeSpoilers(reviewText) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Rewrite the following movie review to remove any major plot spoilers while keeping the sentiment and opinion intact.
            If there are no spoilers, return the text as is.
            
            Review:
            "${reviewText}"`;

            const result = await this.model.generateContent(prompt);
            return result.response.text();
        });
    }

    async analyzeSentiment(text) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Analyze the sentiment of this movie review.
            Return a JSON object with:
            - sentiment: "positive", "negative", or "neutral"
            - score: number between 0 (negative) and 100 (positive)
            - keyPhrases: array of strings (top 3 phrases)
            
            Review:
            "${text}"
            
            Return ONLY the JSON.`;

            const result = await this.model.generateContent(prompt);
            return this.cleanJson(result.response.text());
        });
    }

    async suggestTags(reviewText) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Suggest 5 relevant tags for this movie review. 
            Tags should be single words or short phrases (max 2 words).
            Return purely a JSON array of strings.
            
            Review:
            "${reviewText}"`;

            const result = await this.model.generateContent(prompt);
            return this.cleanJson(result.response.text());
        });
    }

    async parseNaturalQuery(query) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Parse this natural language movie/TV search query into structured search parameters.
            Query: "${query}"
            
            Return a JSON object with:
            - type: "movie", "tv", or "mixed"
            - genres: array of genre strings (e.g. "Action", "Comedy")
            - yearRange: { start: number, end: number } or null
            - rating: { min: number } or null
            - keywords: array of strings
            - sortBy: "popularity.desc", "vote_average.desc", "primary_release_date.desc"
            - mood: string (inferred mood if any)
            
            Return ONLY the JSON.`;

            const result = await this.model.generateContent(prompt);
            return this.cleanJson(result.response.text());
        });
    }

    async findSimilarMovies(movieTitle, modifier) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Suggest 5 movies that are similar to "${movieTitle}" but are specifically "${modifier}".
            Return a JSON array of objects with:
            - title: string
            - reason: short explanation (max 1 sentence)
            
            Return ONLY the JSON.`;

            const result = await this.model.generateContent(prompt);
            return this.cleanJson(result.response.text());
        });
    }

    async predictRating(userTaste, movieData) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Predict a rating (0-5 stars) for the movie "${movieData.title}" based on this user's taste profile.
            
            User Taste:
            - Favorite Genres: ${userTaste.favoriteGenres.join(', ')}
            - Average Rating: ${userTaste.avgRating}
            - Top Keywords: ${userTaste.keywords.join(', ')}
            
            Movie Data:
            - Genres: ${movieData.genres.join(', ')}
            - Overview: ${movieData.overview}
            - Vote Average: ${movieData.voteAverage}
            
            Return a JSON object with:
            - predictedRating: number (0.0 to 5.0)
            - confidence: number (0.0 to 1.0)
            - reasoning: short explanation (max 1 sentence)
            
            Return ONLY the JSON.`;

            const result = await this.model.generateContent(prompt);
            return this.cleanJson(result.response.text());
        });
    }

    async calculateTasteMatch(userTaste, movieData) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Calculate a "Taste Match" percentage for this user and movie.
            
            User Taste: ${JSON.stringify(userTaste)}
            Movie: "${movieData.title}" (Genres: ${movieData.genres.join(', ')})
            
            Return a JSON object with:
            - matchPercentage: number (0 to 100)
            - factors: array of strings (top 3 matching factors)
            
            Return ONLY the JSON.`;

            const result = await this.model.generateContent(prompt);
            return this.cleanJson(result.response.text());
        });
    }

    async generateInsights(userProfile) {
        return this.makeRequestWithRetry(async () => {
            if (!this.model) throw new Error('AI service not initialized');

            const prompt = `Generate 4 fun, personalized insights about this user's movie taste.
            
            User Statistics:
            - Total Movies: ${userProfile.totalMovies}
            - Favorite Genres: ${userProfile.favoriteGenres.join(', ')}
            - Top Directors: ${userProfile.topDirectors.join(', ')}
            - Top Actors: ${userProfile.topActors.join(', ')}
            - Average Rating: ${userProfile.avgRating}
            - Watch Patterns: ${userProfile.watchPatterns}
            
            Return a JSON array of objects with:
            - title: Catchy title (e.g. "Nolan Superfan", "Weekend Warrior")
            - description: One sentence explanation
            - icon: Suggested icon name (one of: "Trophy", "Flame", "Clock", "Heart", "Zap", "Brain")
            - type: "stat" or "fun-fact"
            
            Return ONLY the JSON.`;

            const result = await this.model.generateContent(prompt);
            return this.cleanJson(result.response.text());
        });
    }
}

export default new GeminiService();
