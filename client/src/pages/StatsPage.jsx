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
    BarChart3
} from 'lucide-react';
import statsService from '../services/statsService';
import { PageLoader } from '../components/common/LoadingSpinner';
import { StarRating } from '../components/common/StarRating';
import { getPosterUrl, formatRuntime } from '../utils/helpers';

export default function StatsPage() {
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

    const { data: tagsData } = useQuery({
        queryKey: ['stats', 'tags'],
        queryFn: () => statsService.getTopTags(10),
    });

    if (statsLoading) {
        return <PageLoader />;
    }

    const statCards = [
        {
            icon: Film,
            label: 'Total Movies',
            value: stats?.totalMovies || 0,
            color: 'primary',
        },
        {
            icon: Star,
            label: 'Average Rating',
            value: stats?.averageRating?.toFixed(1) || '—',
            color: 'accent',
        },
        {
            icon: Heart,
            label: 'Favorites',
            value: stats?.favoriteCount || 0,
            color: 'red',
        },
        {
            icon: Clock,
            label: 'Total Watch Time',
            value: `${stats?.totalRuntimeHours || 0}h`,
            color: 'green',
        },
    ];

    const ratingDistribution = ratingData?.ratingDistribution || {};
    const genres = genreData?.byGenre || [];
    const topTags = tagsData?.topTags || [];

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
                        Analytics
                    </div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                        Your Movie Stats
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover insights about your movie watching habits and preferences.
                    </p>
                </motion.div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6 text-center"
                    >
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Rating Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent-500" />
                        Rating Distribution
                    </h2>
                    <div className="space-y-3">
                        {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map((rating) => {
                            const count = ratingDistribution[rating] || 0;
                            const maxCount = Math.max(...Object.values(ratingDistribution), 1);
                            const percentage = (count / maxCount) * 100;

                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {rating}
                                    </div>
                                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="h-full bg-gradient-to-r from-accent-400 to-accent-500 rounded-full"
                                        />
                                    </div>
                                    <div className="w-8 text-sm text-gray-500 dark:text-gray-400 text-right">
                                        {count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Top Genres */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Top Genres
                    </h2>
                    {genres.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No genre data available yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {genres.slice(0, 8).map((genre, index) => {
                                const maxCount = genres[0]?.count || 1;
                                const percentage = (genre.count / maxCount) * 100;

                                return (
                                    <div key={genre._id} className="flex items-center gap-3">
                                        <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                                            {genre._id}
                                        </div>
                                        <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                                                className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                                            />
                                        </div>
                                        <div className="w-8 text-sm text-gray-500 dark:text-gray-400 text-right">
                                            {genre.count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Top Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
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
                                    transition={{ delay: 0.6 + index * 0.05 }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
                                    style={{
                                        fontSize: `${Math.max(0.75, 1 - index * 0.05)}rem`,
                                    }}
                                >
                                    {tag._id}
                                    <span className="text-xs text-gray-500">({tag.count})</span>
                                </motion.span>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Top Rated */}
                {stats?.topRatedMovie && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card p-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Top Rated Movie
                        </h2>
                        <div className="flex gap-4">
                            <img
                                src={getPosterUrl(stats.topRatedMovie.posterPath, 'small')}
                                alt={stats.topRatedMovie.title}
                                className="w-20 h-30 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {stats.topRatedMovie.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    {stats.topRatedMovie.year}
                                </p>
                                <StarRating rating={stats.topRatedMovie.myRating} size="sm" showValue />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
