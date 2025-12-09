import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Film,
    Star,
    Heart,
    Clock,
    Calendar,
    TrendingUp,
    Tag,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Users,
    Clapperboard
} from 'lucide-react';
import statsService from '../services/statsService';
import { PageLoader } from '../components/common/LoadingSpinner';
import { StarRating } from '../components/common/StarRating';
import { getPosterUrl, formatRuntime } from '../utils/helpers';

// Chart Components
import GenrePieChart from '../components/stats/GenrePieChart';
import RatingBarChart from '../components/stats/RatingBarChart';
import TimelineChart from '../components/stats/TimelineChart';
import HeatmapChart from '../components/stats/HeatmapChart';
import DecadeChart from '../components/stats/DecadeChart';
import StatCard from '../components/stats/StatCard';
import StreakCard from '../components/stats/StreakCard';

export default function StatsPage() {
    const [heatmapYear, setHeatmapYear] = useState(new Date().getFullYear());

    // Fetch all stats data
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => statsService.getStats(),
    });

    const { data: ratingData } = useQuery({
        queryKey: ['stats', 'by-rating'],
        queryFn: () => statsService.getStatsByRating(),
    });

    const { data: genreData } = useQuery({
        queryKey: ['stats', 'by-genre'],
        queryFn: () => statsService.getStatsByGenre(),
    });

    const { data: timelineData } = useQuery({
        queryKey: ['stats', 'timeline'],
        queryFn: () => statsService.getTimeline(),
    });

    const { data: decadeData } = useQuery({
        queryKey: ['stats', 'by-decade'],
        queryFn: () => statsService.getStatsByDecade(),
    });

    const { data: heatmapData } = useQuery({
        queryKey: ['stats', 'heatmap', heatmapYear],
        queryFn: () => statsService.getHeatmap(heatmapYear),
    });

    const { data: streaksData } = useQuery({
        queryKey: ['stats', 'streaks'],
        queryFn: () => statsService.getStreaks(),
    });

    const { data: creditsData } = useQuery({
        queryKey: ['stats', 'credits'],
        queryFn: () => statsService.getCreditStats(),
    });

    const { data: tagsData } = useQuery({
        queryKey: ['stats', 'tags'],
        queryFn: () => statsService.getTopTags(10),
    });

    if (statsLoading) {
        return <PageLoader />;
    }

    const ratingDistribution = ratingData?.ratingDistribution || {};
    const genres = genreData?.byGenre || [];
    const timeline = timelineData?.timeline || [];
    const decades = decadeData?.byDecade || [];
    const heatmap = heatmapData?.heatmap || {};
    const topTags = tagsData?.topTags || [];
    const directors = creditsData?.topDirectors || [];
    const actors = creditsData?.topActors || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm mb-4">
                        <BarChart3 className="w-4 h-4" />
                        Analytics Dashboard
                    </div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                        Your Movie Stats
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover insights about your movie watching habits and preferences.
                    </p>
                </motion.div>
            </div>

            {/* Main Stat Cards - Enhanced */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={Film}
                    label="Total Movies"
                    value={stats?.totalMovies || 0}
                    subValue={stats?.mostWatchedYear ? `Most from ${stats.mostWatchedYear}` : null}
                    color="primary"
                    delay={0}
                />
                <StatCard
                    icon={Star}
                    label="Average Rating"
                    value={stats?.averageRating?.toFixed(1) || '—'}
                    subValue={`Range: ${stats?.minRating || 0} - ${stats?.maxRating || 5}`}
                    color="amber"
                    delay={1}
                />
                <StatCard
                    icon={Heart}
                    label="Favorites"
                    value={stats?.favoriteCount || 0}
                    color="red"
                    delay={2}
                />
                <StatCard
                    icon={Clock}
                    label="Watch Time"
                    value={`${stats?.totalRuntimeHours || 0}h`}
                    subValue={stats?.totalRuntimeHours ? `≈ ${Math.round((stats?.totalRuntimeHours || 0) / 24)} days` : null}
                    color="green"
                    delay={3}
                />
            </div>

            {/* Streak Card */}
            {streaksData && (
                <div className="mb-8">
                    <StreakCard data={streaksData} />
                </div>
            )}

            {/* Timeline Chart */}
            {timeline.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-500" />
                        Watching Timeline
                    </h2>
                    <TimelineChart data={timeline} height={300} />
                </motion.div>
            )}

            {/* Heatmap */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6 mb-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary-500" />
                        Activity Heatmap
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setHeatmapYear(y => y - 1)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-center">
                            {heatmapYear}
                        </span>
                        <button
                            onClick={() => setHeatmapYear(y => Math.min(y + 1, new Date().getFullYear()))}
                            disabled={heatmapYear >= new Date().getFullYear()}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <HeatmapChart data={heatmap} year={heatmapYear} />
            </motion.div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Genre Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Genre Distribution
                    </h2>
                    <GenrePieChart data={genres} height={300} />
                </motion.div>

                {/* Rating Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Rating Distribution
                    </h2>
                    <RatingBarChart data={ratingDistribution} height={300} />
                </motion.div>

                {/* Decade Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clapperboard className="w-5 h-5 text-purple-500" />
                        Movies by Decade
                    </h2>
                    <DecadeChart data={decades} height={250} />
                </motion.div>

                {/* Top Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-green-500" />
                        Top Tags
                    </h2>
                    {topTags.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No tags added yet.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {topTags.map((tag, index) => (
                                <motion.span
                                    key={tag._id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.05 }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors cursor-default"
                                >
                                    {tag._id}
                                    <span className="text-xs text-gray-500">({tag.count})</span>
                                </motion.span>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Credits Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Top Directors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Favorite Directors
                    </h2>
                    {directors.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No director data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {directors.slice(0, 5).map((director, index) => (
                                <div key={director.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {director.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{director.count} films</span>
                                        <span className="text-amber-500">★ {director.avgRating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Top Actors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-pink-500" />
                        Favorite Actors
                    </h2>
                    {actors.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No actor data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {actors.slice(0, 5).map((actor, index) => (
                                <div key={actor.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {actor.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{actor.count} films</span>
                                        <span className="text-amber-500">★ {actor.avgRating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Top Rated Movie Card */}
            {stats?.topRatedMovie && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Your Top Rated Movie
                    </h2>
                    <div className="flex gap-6">
                        <img
                            src={getPosterUrl(stats.topRatedMovie.posterPath, 'medium')}
                            alt={stats.topRatedMovie.title}
                            className="w-32 h-48 object-cover rounded-xl shadow-lg"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {stats.topRatedMovie.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {stats.topRatedMovie.year}
                            </p>
                            <StarRating rating={stats.topRatedMovie.myRating} size="lg" showValue />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
