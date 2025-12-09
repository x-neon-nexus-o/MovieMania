import Movie from '../models/Movie.js';
import User from '../models/User.js';
import tmdbService from './tmdbService.js';

/**
 * Rich Recommendation Engine
 * Combines 5 signals: Content-Based, TMDB Similar, People-Based, Mood, Trending
 */
class RecommendationService {
    constructor() {
        this.weights = {
            contentBased: 40,
            tmdbSimilar: 25,
            peopleBased: 15,
            mood: 10,
            trending: 10
        };
    }

    /**
     * Build user's taste profile from their watched movies
     */
    async buildUserProfile(userId) {
        const watched = await Movie.find({
            addedBy: userId,
            myRating: { $gte: 3.5 }
        });

        if (watched.length === 0) {
            return null;
        }

        // Calculate genre preferences
        const genreScore = {};
        watched.forEach(movie => {
            if (movie.tmdbGenres && Array.isArray(movie.tmdbGenres)) {
                movie.tmdbGenres.forEach(genre => {
                    const genreName = genre.name || genre;
                    genreScore[genreName] = (genreScore[genreName] || 0) + (movie.myRating / 5);
                });
            }
        });

        // Normalize to 0-1
        const maxScore = Math.max(...Object.values(genreScore), 1);
        Object.keys(genreScore).forEach(g => {
            genreScore[g] = genreScore[g] / maxScore;
        });

        // Extract favorite directors
        const directorCounts = {};
        watched.forEach(movie => {
            if (movie.director) {
                directorCounts[movie.director] = (directorCounts[movie.director] || 0) + movie.myRating;
            }
        });
        const favoriteDirectors = Object.entries(directorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, score]) => ({ name, score }));

        // Extract favorite actors
        const actorCounts = {};
        watched.forEach(movie => {
            if (movie.cast && Array.isArray(movie.cast)) {
                movie.cast.slice(0, 5).forEach(actor => {
                    actorCounts[actor] = (actorCounts[actor] || 0) + movie.myRating;
                });
            }
        });
        const favoriteActors = Object.entries(actorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([name, score]) => ({ name, score }));

        // Get top genres for taste profile
        const topGenres = Object.entries(genreScore)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, score]) => ({ name, score }));

        return {
            genres: genreScore,
            topGenres,
            favoriteDirectors,
            favoriteActors,
            totalRated: watched.length,
            avgRating: watched.reduce((sum, m) => sum + m.myRating, 0) / watched.length,
            updatedAt: new Date()
        };
    }

    /**
     * Get content-based recommendations using TMDB discover
     */
    async getContentBased(userId, userProfile, watchedTmdbIds) {
        if (!userProfile || !userProfile.topGenres || userProfile.topGenres.length === 0) {
            return [];
        }

        try {
            // Get genre IDs for user's top genres
            const genreMap = {
                'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35,
                'Crime': 80, 'Documentary': 99, 'Drama': 18, 'Family': 10751,
                'Fantasy': 14, 'History': 36, 'Horror': 27, 'Music': 10402,
                'Mystery': 9648, 'Romance': 10749, 'Science Fiction': 878,
                'Thriller': 53, 'War': 10752, 'Western': 37
            };

            const topGenreIds = userProfile.topGenres
                .map(g => genreMap[g.name])
                .filter(Boolean)
                .slice(0, 3);

            if (topGenreIds.length === 0) {
                return [];
            }

            const results = await tmdbService.discoverMovies({
                with_genres: topGenreIds.join(','),
                sort_by: 'vote_average.desc',
                'vote_count.gte': 500,
                'vote_average.gte': 7.0
            });

            return (results.results || [])
                .filter(m => !watchedTmdbIds.includes(m.id))
                .slice(0, 30);
        } catch (error) {
            console.error('Error in content-based recommendations:', error);
            return [];
        }
    }

    /**
     * Get TMDB's built-in recommendations for user's top rated movies
     */
    async getTmdbRecommendations(userId, watchedTmdbIds) {
        try {
            const highRated = await Movie.find({
                addedBy: userId,
                myRating: { $gte: 4 }
            }).select('tmdbId').limit(10);

            if (highRated.length === 0) {
                return [];
            }

            const allRecs = [];
            for (const movie of highRated.slice(0, 5)) {
                try {
                    const recs = await tmdbService.getRecommendations(movie.tmdbId);
                    allRecs.push(...(recs.results || []));
                } catch (e) {
                    // Skip failed requests
                }
            }

            // Deduplicate and filter watched
            const seen = new Set();
            return allRecs
                .filter(m => {
                    if (seen.has(m.id) || watchedTmdbIds.includes(m.id)) return false;
                    seen.add(m.id);
                    return true;
                })
                .sort((a, b) => (b.tmdbRating || 0) - (a.tmdbRating || 0))
                .slice(0, 40);
        } catch (error) {
            console.error('Error in TMDB recommendations:', error);
            return [];
        }
    }

    /**
     * Get recommendations based on favorite directors and actors
     */
    async getPeopleBased(userId, userProfile, watchedTmdbIds) {
        if (!userProfile) return [];

        try {
            // Use TMDB discover with keywords/people
            // For simplicity, we'll use genre-based discover for directors' typical genres
            const genreMap = {
                'Christopher Nolan': '878,53', // Sci-fi, Thriller
                'Denis Villeneuve': '878,18', // Sci-fi, Drama
                'Martin Scorsese': '80,18', // Crime, Drama
                'Quentin Tarantino': '80,28', // Crime, Action
                'Steven Spielberg': '12,878', // Adventure, Sci-fi
                'David Fincher': '53,80', // Thriller, Crime
            };

            // Get movies similar to what user's favorite directors make
            const topDirector = userProfile.favoriteDirectors?.[0]?.name;
            const genres = genreMap[topDirector] || '18,53'; // Default: Drama, Thriller

            const results = await tmdbService.discoverMovies({
                with_genres: genres,
                sort_by: 'popularity.desc',
                'vote_average.gte': 7.0,
                'vote_count.gte': 300
            });

            return (results.results || [])
                .filter(m => !watchedTmdbIds.includes(m.id))
                .slice(0, 25);
        } catch (error) {
            console.error('Error in people-based recommendations:', error);
            return [];
        }
    }

    /**
     * Get mood-based recommendations analyzing recent watching patterns
     */
    async getMoodBased(userId, watchedTmdbIds) {
        try {
            const recent = await Movie.find({ addedBy: userId })
                .sort({ watchedDate: -1 })
                .limit(7);

            if (recent.length === 0) {
                return [];
            }

            const avgRating = recent.reduce((sum, m) => sum + (m.myRating || 0), 0) / recent.length;

            // Check for genre patterns
            const recentGenres = recent.flatMap(m =>
                (m.tmdbGenres || []).map(g => g.name || g)
            );
            const hasComedy = recentGenres.includes('Comedy');
            const hasDrama = recentGenres.includes('Drama');
            const hasAction = recentGenres.includes('Action');

            // Determine mood and recommend accordingly
            let genreIds = '18,53'; // Default: Drama, Thriller
            let sortBy = 'vote_average.desc';

            if (avgRating >= 4.2) {
                // User is enjoying movies - give them more of what works
                if (hasAction) genreIds = '28,12'; // Action, Adventure
                else if (hasDrama) genreIds = '18,10749'; // Drama, Romance
                else genreIds = '35,10751'; // Comedy, Family
            } else if (avgRating <= 2.8) {
                // User not enjoying recent picks - try something different
                genreIds = '35,16'; // Comedy, Animation (mood lift)
                sortBy = 'popularity.desc';
            } else if (!hasComedy && Math.random() > 0.5) {
                // Haven't watched comedy - suggest some
                genreIds = '35';
            }

            const results = await tmdbService.discoverMovies({
                with_genres: genreIds,
                sort_by: sortBy,
                'vote_average.gte': 7.0,
                'vote_count.gte': 200
            });

            return (results.results || [])
                .filter(m => !watchedTmdbIds.includes(m.id))
                .slice(0, 20);
        } catch (error) {
            console.error('Error in mood-based recommendations:', error);
            return [];
        }
    }

    /**
     * Get trending movies for serendipity
     */
    async getTrending(watchedTmdbIds) {
        try {
            const [trending, popular] = await Promise.all([
                tmdbService.getTrendingMovies(),
                tmdbService.getPopularMovies()
            ]);

            const combined = [
                ...(trending.results || []),
                ...(popular.results || [])
            ];

            // Deduplicate
            const seen = new Set();
            return combined
                .filter(m => {
                    if (seen.has(m.id) || watchedTmdbIds.includes(m.id)) return false;
                    seen.add(m.id);
                    return true;
                })
                .slice(0, 30);
        } catch (error) {
            console.error('Error fetching trending:', error);
            return [];
        }
    }

    /**
     * Master recommendation endpoint - blend all signals
     */
    async getRecommendations(userId, type = 'home') {
        // Get user's watched movies to filter
        const watched = await Movie.find({ addedBy: userId }).select('tmdbId');
        const watchedTmdbIds = watched.map(m => m.tmdbId);

        // Build or get user profile
        const userProfile = await this.buildUserProfile(userId);

        // Fetch all signal sources in parallel
        const [contentBased, tmdbRecs, peopleBased, moodBased, trending] = await Promise.all([
            this.getContentBased(userId, userProfile, watchedTmdbIds),
            this.getTmdbRecommendations(userId, watchedTmdbIds),
            this.getPeopleBased(userId, userProfile, watchedTmdbIds),
            this.getMoodBased(userId, watchedTmdbIds),
            this.getTrending(watchedTmdbIds)
        ]);

        // Score and blend
        const scored = {};

        const boost = (movie, score, source) => {
            const id = movie.id || movie.tmdbId;
            if (!id) return;

            if (!scored[id]) {
                scored[id] = {
                    movie: this.formatMovie(movie),
                    score: 0,
                    sources: []
                };
            }
            scored[id].score += score;
            if (!scored[id].sources.includes(source)) {
                scored[id].sources.push(source);
            }
        };

        // Apply weights
        contentBased.forEach(m => boost(m, this.weights.contentBased, 'Your Taste'));
        tmdbRecs.forEach(m => boost(m, this.weights.tmdbSimilar * ((m.tmdbRating || 7) / 10), 'Similar Movies'));
        peopleBased.forEach(m => boost(m, this.weights.peopleBased, 'Favorite Directors'));
        moodBased.forEach(m => boost(m, this.weights.mood, 'Current Mood'));
        trending.forEach(m => boost(m, this.weights.trending * ((m.popularity || 50) / 100), 'Trending Now'));

        // Sort and prepare final list
        const final = Object.values(scored)
            .sort((a, b) => b.score - a.score)
            .slice(0, 30)
            .map(item => ({
                ...item.movie,
                score: Math.round(item.score),
                whyRecommended: item.sources.join(' + ')
            }));

        return {
            recommendations: final,
            profile: userProfile ? {
                topGenres: userProfile.topGenres?.slice(0, 3),
                favoriteDirectors: userProfile.favoriteDirectors?.slice(0, 3),
                totalRated: userProfile.totalRated
            } : null,
            stats: {
                contentBased: contentBased.length,
                tmdbSimilar: tmdbRecs.length,
                peopleBased: peopleBased.length,
                mood: moodBased.length,
                trending: trending.length,
                total: final.length
            }
        };
    }

    /**
     * Get "Because you watched X" recommendations for a specific movie
     */
    async getBecauseYouWatched(tmdbId, userId) {
        const watched = await Movie.find({ addedBy: userId }).select('tmdbId');
        const watchedTmdbIds = watched.map(m => m.tmdbId);

        try {
            const [similar, recs] = await Promise.all([
                tmdbService.getSimilarMovies(tmdbId),
                tmdbService.getRecommendations(tmdbId)
            ]);

            const combined = [
                ...(similar.results || []),
                ...(recs.results || [])
            ];

            const seen = new Set();
            return combined
                .filter(m => {
                    if (seen.has(m.id) || watchedTmdbIds.includes(m.id)) return false;
                    seen.add(m.id);
                    return true;
                })
                .slice(0, 12)
                .map(m => this.formatMovie(m));
        } catch (error) {
            console.error('Error in because-you-watched:', error);
            return [];
        }
    }

    /**
     * Format movie for response
     */
    formatMovie(movie) {
        return {
            id: movie.id || movie.tmdbId,
            tmdbId: movie.id || movie.tmdbId,
            title: movie.title,
            year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : movie.year,
            posterPath: movie.posterPath || movie.poster_path,
            backdropPath: movie.backdropPath || movie.backdrop_path,
            overview: movie.overview,
            tmdbRating: movie.tmdbRating || movie.vote_average,
            popularity: movie.popularity
        };
    }
}

export default new RecommendationService();
