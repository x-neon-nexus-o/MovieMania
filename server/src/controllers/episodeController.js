import Episode from '../models/Episode.js';
import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Helper: Retry a function with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRetryable = error.code === 'ECONNRESET' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'ENOTFOUND' ||
                (error.response && error.response.status >= 500);

            if (!isRetryable || attempt === maxRetries - 1) {
                throw error;
            }

            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Get all episodes for a TV show (grouped by season)
 */
export const getAllEpisodes = async (req, res) => {
    try {
        const { tmdbShowId } = req.params;
        const showId = parseInt(tmdbShowId);

        // Check if we have episodes in DB
        let episodes = await Episode.find({ tmdbShowId: showId }).sort({
            seasonNumber: 1,
            episodeNumber: 1,
        });

        // If no episodes, try to sync from TMDB (but don't fail if it doesn't work)
        if (episodes.length === 0) {
            try {
                await syncEpisodesFromTMDB(showId);
                episodes = await Episode.find({ tmdbShowId: showId }).sort({
                    seasonNumber: 1,
                    episodeNumber: 1,
                });
            } catch (syncError) {
                console.error('TMDB sync failed, returning empty data:', syncError.message);
                // Return empty data instead of failing completely
                return res.json({
                    success: true,
                    seasons: [],
                    totalEpisodes: 0,
                    syncError: 'Could not fetch episode data from TMDB. Please try again later.',
                });
            }
        }

        // Group by season
        const seasons = {};
        episodes.forEach((ep) => {
            if (!seasons[ep.seasonNumber]) {
                seasons[ep.seasonNumber] = {
                    seasonNumber: ep.seasonNumber,
                    episodes: [],
                };
            }
            seasons[ep.seasonNumber].episodes.push(ep);
        });

        res.json({
            success: true,
            seasons: Object.values(seasons),
            totalEpisodes: episodes.length,
        });
    } catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch episodes' });
    }
};

/**
 * Get episodes for a specific season
 */
export const getSeasonEpisodes = async (req, res) => {
    try {
        const { tmdbShowId, seasonNumber } = req.params;
        const showId = parseInt(tmdbShowId);
        const season = parseInt(seasonNumber);

        const episodes = await Episode.find({
            tmdbShowId: showId,
            seasonNumber: season,
        }).sort({ episodeNumber: 1 });

        res.json({
            success: true,
            seasonNumber: season,
            episodes,
        });
    } catch (error) {
        console.error('Error fetching season episodes:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch season episodes' });
    }
};

/**
 * Get analytics for a TV show
 */
export const getShowAnalytics = async (req, res) => {
    try {
        const { tmdbShowId } = req.params;
        const showId = parseInt(tmdbShowId);

        // Ensure we have episodes
        const episodeCount = await Episode.countDocuments({ tmdbShowId: showId });
        if (episodeCount === 0) {
            try {
                await syncEpisodesFromTMDB(showId);
            } catch (syncError) {
                console.error('TMDB sync failed:', syncError.message);
                return res.status(503).json({
                    success: false,
                    message: 'Could not fetch episode data from TMDB. Please try again later.'
                });
            }
        }

        // Get all episodes for calculations
        const episodes = await Episode.find({ tmdbShowId: showId });

        if (episodes.length === 0) {
            return res.status(404).json({ success: false, message: 'No episodes found' });
        }

        // Calculate season averages
        const seasonAverages = await Episode.getShowAnalytics(showId);

        // Calculate overall stats
        const totalEpisodes = episodes.length;
        const avgRating = episodes.reduce((sum, ep) => sum + ep.voteAverage, 0) / totalEpisodes;

        // Find best and worst episodes
        const sortedByRating = [...episodes].sort((a, b) => b.voteAverage - a.voteAverage);
        const bestEpisode = sortedByRating[0];
        const worstEpisode = sortedByRating[sortedByRating.length - 1];

        // Calculate trend (comparing first half vs second half)
        const midpoint = Math.floor(episodes.length / 2);
        const firstHalf = episodes.slice(0, midpoint);
        const secondHalf = episodes.slice(midpoint);
        const firstHalfAvg = firstHalf.reduce((sum, ep) => sum + ep.voteAverage, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, ep) => sum + ep.voteAverage, 0) / secondHalf.length;

        let trend = 'stable';
        if (secondHalfAvg - firstHalfAvg > 0.3) trend = 'improving';
        else if (firstHalfAvg - secondHalfAvg > 0.3) trend = 'declining';

        res.json({
            success: true,
            totalEpisodes,
            averageRating: avgRating.toFixed(2),
            seasonAverages: seasonAverages.map((s) => ({
                seasonNumber: s._id,
                episodeCount: s.episodeCount,
                averageRating: s.averageRating,
                maxRating: s.maxRating,
                minRating: s.minRating,
            })),
            bestEpisode: {
                season: bestEpisode.seasonNumber,
                episode: bestEpisode.episodeNumber,
                name: bestEpisode.name,
                rating: bestEpisode.voteAverage,
            },
            worstEpisode: {
                season: worstEpisode.seasonNumber,
                episode: worstEpisode.episodeNumber,
                name: worstEpisode.name,
                rating: worstEpisode.voteAverage,
            },
            trend,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
    }
};

/**
 * Rate an episode
 */
export const rateEpisode = async (req, res) => {
    try {
        const { tmdbShowId } = req.params;
        const { seasonNumber, episodeNumber, rating } = req.body;
        const userId = req.user._id;

        if (rating < 0 || rating > 10) {
            return res.status(400).json({ success: false, message: 'Rating must be between 0 and 10' });
        }

        const episode = await Episode.findOne({
            tmdbShowId: parseInt(tmdbShowId),
            seasonNumber: parseInt(seasonNumber),
            episodeNumber: parseInt(episodeNumber),
        });

        if (!episode) {
            return res.status(404).json({ success: false, message: 'Episode not found' });
        }

        // Check if user already rated
        const existingRating = episode.userRatings.find(
            (r) => r.userId.toString() === userId.toString()
        );

        if (existingRating) {
            existingRating.rating = rating;
            existingRating.ratedAt = new Date();
        } else {
            episode.userRatings.push({ userId, rating });
        }

        await episode.save();

        res.json({
            success: true,
            message: 'Episode rated successfully',
            averageUserRating: episode.cachedAnalytics.averageUserRating,
        });
    } catch (error) {
        console.error('Error rating episode:', error);
        res.status(500).json({ success: false, message: 'Failed to rate episode' });
    }
};

/**
 * Sync episodes from TMDB
 */
export const syncEpisodes = async (req, res) => {
    try {
        const { tmdbShowId } = req.params;
        const showId = parseInt(tmdbShowId);

        await syncEpisodesFromTMDB(showId);

        const episodes = await Episode.find({ tmdbShowId: showId }).sort({
            seasonNumber: 1,
            episodeNumber: 1,
        });

        res.json({
            success: true,
            message: 'Episodes synced successfully',
            episodeCount: episodes.length,
        });
    } catch (error) {
        console.error('Error syncing episodes:', error);
        res.status(500).json({ success: false, message: 'Failed to sync episodes. Please check your network connection.' });
    }
};

/**
 * Helper: Sync episodes from TMDB API with retry logic
 */
async function syncEpisodesFromTMDB(tmdbShowId) {
    // Get show details with retry
    const showResponse = await retryWithBackoff(async () => {
        return axios.get(`${TMDB_BASE_URL}/tv/${tmdbShowId}`, {
            params: { api_key: TMDB_API_KEY },
            timeout: 10000, // 10 second timeout
        });
    });

    const show = showResponse.data;
    const numberOfSeasons = show.number_of_seasons;

    // Fetch each season's episodes
    for (let seasonNum = 1; seasonNum <= numberOfSeasons; seasonNum++) {
        try {
            const seasonResponse = await retryWithBackoff(async () => {
                return axios.get(
                    `${TMDB_BASE_URL}/tv/${tmdbShowId}/season/${seasonNum}`,
                    {
                        params: { api_key: TMDB_API_KEY },
                        timeout: 10000,
                    }
                );
            });

            const season = seasonResponse.data;

            // Upsert each episode
            for (const ep of season.episodes) {
                await Episode.findOneAndUpdate(
                    {
                        tmdbShowId,
                        seasonNumber: seasonNum,
                        episodeNumber: ep.episode_number,
                    },
                    {
                        tmdbShowId,
                        seasonNumber: seasonNum,
                        episodeNumber: ep.episode_number,
                        name: ep.name,
                        overview: ep.overview || '',
                        airDate: ep.air_date ? new Date(ep.air_date) : null,
                        voteAverage: ep.vote_average || 0,
                        voteCount: ep.vote_count || 0,
                        stillPath: ep.still_path,
                        runtime: ep.runtime || 0,
                    },
                    { upsert: true, new: true }
                );
            }
        } catch (seasonError) {
            console.error(`Error fetching season ${seasonNum}:`, seasonError.message);
            // Continue with other seasons even if one fails
        }
    }
}
