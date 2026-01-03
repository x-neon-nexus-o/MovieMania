import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

const getColor = (rating) => {
    if (!rating || rating === 0) return 'bg-gray-300 dark:bg-gray-600';
    if (rating >= 9) return 'bg-emerald-600';
    if (rating >= 8) return 'bg-emerald-500';
    if (rating >= 7) return 'bg-yellow-500';
    if (rating >= 6) return 'bg-orange-500';
    return 'bg-red-500';
};

export default function EpisodeHeatmap({ episodes, isLoading }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [selectedSeason, setSelectedSeason] = useState('all');
    const [ratingSource, setRatingSource] = useState('imdb'); // 'imdb' or 'tmdb'

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const seasonGroups = useMemo(() => {
        const groups = {};
        episodes?.forEach((season) => {
            groups[season.seasonNumber] = season.episodes;
        });
        return groups;
    }, [episodes]);

    const filteredSeasons = useMemo(() => {
        if (selectedSeason === 'all') return Object.entries(seasonGroups);
        return Object.entries(seasonGroups).filter(([num]) => num === selectedSeason);
    }, [seasonGroups, selectedSeason]);

    // Find max episodes in any season for column headers
    const maxEpisodes = useMemo(() => {
        let max = 0;
        Object.values(seasonGroups).forEach((eps) => {
            if (eps.length > max) max = eps.length;
        });
        return Math.min(max, 25); // Cap at 25 for header display
    }, [seasonGroups]);

    const getRating = (ep) => {
        if (ratingSource === 'imdb' && ep.imdbRating) return ep.imdbRating;
        return ep.voteAverage || 0;
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="animate-spin text-primary-500" size={32} />
                </div>
            </div>
        );
    }

    if (!episodes || episodes.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Episode Quality Heatmap
                </h3>
                <div className="flex justify-center items-center h-40 text-gray-500 dark:text-gray-400">
                    No episode data available
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Episode Quality Heatmap
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Rating Source Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setRatingSource('imdb')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${ratingSource === 'imdb'
                                    ? 'bg-yellow-500 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            IMDb
                        </button>
                        <button
                            onClick={() => setRatingSource('tmdb')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${ratingSource === 'tmdb'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            TMDB
                        </button>
                    </div>

                    {isMobile && (
                        <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">All Seasons</option>
                            {Object.keys(seasonGroups).map((seasonNum) => (
                                <option key={seasonNum} value={seasonNum}>
                                    Season {seasonNum}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Heatmap Grid with Headers */}
            <div className="overflow-x-auto">
                <table className="min-w-max">
                    {/* Column Headers (Episode Numbers) */}
                    <thead>
                        <tr>
                            <th className="w-12 pr-2"></th>
                            {Array.from({ length: maxEpisodes }, (_, i) => (
                                <th
                                    key={i}
                                    className="w-14 h-8 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                                >
                                    {i + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSeasons.map(([seasonNum, eps], idx) => (
                            <motion.tr
                                key={seasonNum}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                {/* Row Header (Season Number) */}
                                <td className="pr-3 text-sm font-medium text-gray-700 dark:text-gray-300 align-middle">
                                    {seasonNum}
                                </td>
                                {/* Episode Cells */}
                                {eps.map((ep) => {
                                    const rating = getRating(ep);
                                    return (
                                        <td key={ep.episodeNumber} className="p-1">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className={`${getColor(rating)} w-14 h-10 rounded flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-all hover:ring-2 hover:ring-offset-2 hover:ring-primary-500 shadow-md`}
                                                title={`S${seasonNum}E${ep.episodeNumber}: ${ep.name}\nTMDB: ${ep.voteAverage?.toFixed(1) || 'N/A'}${ep.imdbRating ? `\nIMDb: ${ep.imdbRating.toFixed(1)}` : ''}`}
                                            >
                                                {rating > 0 ? rating.toFixed(1) : '—'}
                                            </motion.div>
                                        </td>
                                    );
                                })}
                                {/* Empty cells for alignment */}
                                {Array.from({ length: maxEpisodes - eps.length }, (_, i) => (
                                    <td key={`empty-${i}`} className="p-1">
                                        <div className="w-14 h-10 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-sm">
                                            —
                                        </div>
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">9.0+</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">8.0-9.0</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">7.0-8.0</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">6.0-7.0</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-300">&lt;6.0</span>
                </div>
            </div>
        </motion.div>
    );
}
