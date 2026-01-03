import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, X, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useShowAnalytics } from '../hooks/useEpisodes';
import { useSearchTMDBTV } from '../hooks/useTVShows';
import { useDebounce } from '../hooks/useDebounce';
import { PageLoader } from '../components/common/LoadingSpinner';

const CHART_COLORS = ['#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#3B82F6'];

export default function CompareShowsPage() {
    const [selectedShows, setSelectedShows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 300);

    const { data: searchResults, isLoading: isSearching } = useSearchTMDBTV(debouncedQuery);

    const handleAddShow = useCallback((show) => {
        if (selectedShows.length >= 5) {
            return;
        }
        if (!selectedShows.find((s) => s.id === show.id)) {
            setSelectedShows([...selectedShows, { id: show.id, name: show.name, poster: show.poster_path }]);
        }
        setSearchQuery('');
    }, [selectedShows]);

    const handleRemoveShow = useCallback((showId) => {
        setSelectedShows(selectedShows.filter((s) => s.id !== showId));
    }, [selectedShows]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Compare TV Shows
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add up to 5 shows to compare their ratings and quality trends.
                    </p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Add Shows to Compare ({selectedShows.length}/5)
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search TV shows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={selectedShows.length >= 5}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        />

                        {/* Search Results Dropdown */}
                        {searchQuery && searchResults?.results?.length > 0 && (
                            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                                {searchResults.results.slice(0, 8).map((show) => (
                                    <button
                                        key={show.id}
                                        onClick={() => handleAddShow(show)}
                                        disabled={selectedShows.find((s) => s.id === show.id)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-left"
                                    >
                                        {show.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${show.poster_path}`}
                                                alt={show.name}
                                                className="w-10 h-14 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-14 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                                <BarChart3 className="text-gray-400" size={16} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{show.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {show.first_air_date?.split('-')[0] || 'Unknown year'}
                                            </p>
                                        </div>
                                        <Plus className="ml-auto text-primary-500" size={20} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Selected Shows */}
                {selectedShows.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Selected Shows
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <AnimatePresence mode="popLayout">
                                {selectedShows.map((show, idx) => (
                                    <motion.div
                                        key={show.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full"
                                        style={{ backgroundColor: `${CHART_COLORS[idx]}20`, borderColor: CHART_COLORS[idx], borderWidth: 2 }}
                                    >
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx] }} />
                                        <span className="text-gray-900 dark:text-white font-medium">{show.name}</span>
                                        <button
                                            onClick={() => handleRemoveShow(show.id)}
                                            className="ml-1 hover:text-red-500 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* Comparison Charts */}
                {selectedShows.length >= 2 && (
                    <ComparisonCharts shows={selectedShows} />
                )}

                {selectedShows.length === 1 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Add at least one more show to see the comparison.
                    </div>
                )}

                {selectedShows.length === 0 && (
                    <div className="text-center py-12">
                        <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
                        <p className="text-gray-500 dark:text-gray-400">
                            Search and add shows above to start comparing.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ComparisonCharts({ shows }) {
    // Fetch analytics for all selected shows
    const analyticsQueries = shows.map((show) => ({
        showId: show.id,
        showName: show.name,
        ...useShowAnalytics(show.id),
    }));

    const isLoading = analyticsQueries.some((q) => q.isLoading);
    const allData = analyticsQueries.filter((q) => q.data?.success);

    if (isLoading) {
        return <PageLoader />;
    }

    if (allData.length < 2) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Could not load analytics for all shows. Please try different shows.
            </div>
        );
    }

    // Prepare comparison data
    const overviewData = allData.map((show, idx) => ({
        name: show.showName,
        rating: parseFloat(show.data.averageRating),
        episodes: show.data.totalEpisodes,
        trend: show.data.trend,
        color: CHART_COLORS[idx],
    }));

    // Prepare season-by-season comparison (align by season number)
    const maxSeasons = Math.max(...allData.map((s) => s.data.seasonAverages?.length || 0));
    const seasonData = [];
    for (let i = 0; i < maxSeasons; i++) {
        const point = { season: `S${i + 1}` };
        allData.forEach((show) => {
            const seasonAvg = show.data.seasonAverages?.[i];
            point[show.showName] = seasonAvg ? parseFloat(seasonAvg.averageRating.toFixed(2)) : null;
        });
        seasonData.push(point);
    }

    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {overviewData.map((show) => (
                    <div
                        key={show.name}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                        style={{ borderLeft: `4px solid ${show.color}` }}
                    >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                            {show.name}
                        </h4>
                        <p className="text-3xl font-bold" style={{ color: show.color }}>
                            {show.rating.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {show.episodes} episodes • {show.trend === 'improving' ? '📈' : show.trend === 'declining' ? '📉' : '➡️'} {show.trend}
                        </p>
                    </div>
                ))}
            </motion.div>

            {/* Season-by-Season Line Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Season-by-Season Comparison
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={seasonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis
                            dataKey="season"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                            }}
                        />
                        <Legend />
                        {allData.map((show, idx) => (
                            <Line
                                key={show.showName}
                                type="monotone"
                                dataKey={show.showName}
                                stroke={CHART_COLORS[idx]}
                                strokeWidth={2}
                                dot={{ fill: CHART_COLORS[idx], r: 4 }}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
}
