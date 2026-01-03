import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

const getColor = (rating) => {
    if (rating >= 9) return 'bg-emerald-600';
    if (rating >= 8) return 'bg-emerald-500';
    if (rating >= 7) return 'bg-yellow-500';
    if (rating >= 6) return 'bg-orange-500';
    return 'bg-red-500';
};

export default function EpisodeHeatmap({ episodes, isLoading }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [selectedSeason, setSelectedSeason] = useState('all');

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

                {isMobile && (
                    <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

            <div className="space-y-4">
                {filteredSeasons.map(([seasonNum, eps], idx) => (
                    <motion.div
                        key={seasonNum}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Season {seasonNum}
                        </p>
                        <div className={`grid gap-2 ${isMobile ? 'grid-cols-6' : 'flex flex-wrap'}`}>
                            {eps.map((ep) => (
                                <motion.div
                                    key={`${seasonNum}-${ep.episodeNumber}`}
                                    whileHover={{ scale: 1.15 }}
                                    className={`${getColor(ep.voteAverage)} ${isMobile ? 'aspect-square' : 'w-8 h-8'} rounded flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all hover:ring-2 hover:ring-offset-2 hover:ring-primary-500`}
                                    title={`S${seasonNum}E${ep.episodeNumber}: ${ep.name} (${ep.voteAverage.toFixed(1)})`}
                                >
                                    {ep.episodeNumber}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
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
