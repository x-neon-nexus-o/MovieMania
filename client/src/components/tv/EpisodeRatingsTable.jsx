import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EpisodeRatingsTable({ episodes, isLoading }) {
    const [expandedSeasons, setExpandedSeasons] = useState({});

    const toggleSeason = (seasonNumber) => {
        setExpandedSeasons((prev) => ({
            ...prev,
            [seasonNumber]: !prev[seasonNumber],
        }));
    };

    const expandAll = () => {
        const allExpanded = {};
        episodes?.forEach((season) => {
            allExpanded[season.seasonNumber] = true;
        });
        setExpandedSeasons(allExpanded);
    };

    const collapseAll = () => {
        setExpandedSeasons({});
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!episodes || episodes.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Episode Ratings by Season
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No episode data available
                </p>
            </div>
        );
    }

    const getRatingColor = (rating) => {
        if (rating >= 9) return 'text-emerald-500';
        if (rating >= 8) return 'text-emerald-400';
        if (rating >= 7) return 'text-yellow-500';
        if (rating >= 6) return 'text-orange-500';
        return 'text-red-500';
    };

    const getRatingBg = (rating) => {
        if (rating >= 9) return 'bg-emerald-500/10';
        if (rating >= 8) return 'bg-emerald-400/10';
        if (rating >= 7) return 'bg-yellow-500/10';
        if (rating >= 6) return 'bg-orange-500/10';
        return 'bg-red-500/10';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Episode Ratings by Season
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={expandAll}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        Expand All
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                        onClick={collapseAll}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {episodes.map((season) => {
                    const isExpanded = expandedSeasons[season.seasonNumber];
                    const seasonAvg =
                        season.episodes.reduce((sum, ep) => sum + ep.voteAverage, 0) /
                        season.episodes.length;

                    return (
                        <div
                            key={season.seasonNumber}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                            {/* Season Header */}
                            <button
                                onClick={() => toggleSeason(season.seasonNumber)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        Season {season.seasonNumber}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {season.episodes.length} episodes
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className={`font-bold ${getRatingColor(seasonAvg)}`}>
                                            {seasonAvg.toFixed(1)}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </button>

                            {/* Episodes List */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {season.episodes.map((episode) => (
                                                <div
                                                    key={episode.episodeNumber}
                                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                                                            E{episode.episodeNumber}
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white truncate">
                                                            {episode.name}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-1 px-3 py-1 rounded-full ${getRatingBg(
                                                            episode.voteAverage
                                                        )}`}
                                                    >
                                                        <Star
                                                            className={`w-4 h-4 ${getRatingColor(
                                                                episode.voteAverage
                                                            )} fill-current`}
                                                        />
                                                        <span
                                                            className={`font-bold text-sm ${getRatingColor(
                                                                episode.voteAverage
                                                            )}`}
                                                        >
                                                            {episode.voteAverage.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
