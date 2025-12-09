import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Film,
    TrendingUp,
    Heart,
    User,
    Smile,
    RefreshCw,
    ExternalLink,
    Info
} from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

export default function RecommendationsPage() {
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['recommendations'],
        queryFn: async () => {
            const response = await api.get('/recommendations');
            return response.data;
        },
        staleTime: 1000 * 60 * 10 // 10 minutes cache
    });

    if (isLoading) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Unable to load recommendations
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error.message || 'Please try again later'}
                </p>
                <Button onClick={() => refetch()}>Try Again</Button>
            </div>
        );
    }

    const recommendations = data?.recommendations || [];
    const profile = data?.profile;
    const stats = data?.stats;

    // Group recommendations by source for display
    const bySource = {
        'Your Taste': recommendations.filter(r => r.whyRecommended?.includes('Your Taste')),
        'Similar Movies': recommendations.filter(r => r.whyRecommended?.includes('Similar Movies')),
        'Trending Now': recommendations.filter(r => r.whyRecommended?.includes('Trending Now'))
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-amber-500" />
                            For You
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Personalized recommendations based on your taste profile
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => refetch()}
                        isLoading={isFetching}
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        Refresh
                    </Button>
                </div>
            </motion.div>

            {/* Taste Profile Summary */}
            {profile && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10 card p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-500" />
                        Your Taste Profile
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Top Genres */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Top Genres
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(profile.topGenres || []).map((genre, i) => (
                                    <span
                                        key={genre.name}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${i === 0
                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Favorite Directors */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Favorite Directors
                            </h3>
                            <div className="space-y-1">
                                {(profile.favoriteDirectors || []).map((director) => (
                                    <p key={director.name} className="text-sm text-gray-900 dark:text-white">
                                        {director.name}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Movies Rated
                            </h3>
                            <p className="text-3xl font-bold text-primary-600">
                                {profile.totalRated || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Recommendation Signal Stats */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-8 flex flex-wrap gap-4 text-xs text-gray-500"
                >
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        {stats.contentBased} from taste
                    </span>
                    <span className="flex items-center gap-1">
                        <Film className="w-3 h-3 text-blue-400" />
                        {stats.tmdbSimilar} similar
                    </span>
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-purple-400" />
                        {stats.peopleBased} from directors
                    </span>
                    <span className="flex items-center gap-1">
                        <Smile className="w-3 h-3 text-green-400" />
                        {stats.mood} mood-based
                    </span>
                    <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-amber-400" />
                        {stats.trending} trending
                    </span>
                </motion.div>
            )}

            {/* Recommendations Grid */}
            {recommendations.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Film className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Not enough data yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Rate more movies to get personalized recommendations!
                    </p>
                    <Link to="/add">
                        <Button>Add Movies</Button>
                    </Link>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                    {recommendations.map((movie, index) => (
                        <motion.div
                            key={movie.tmdbId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <Link
                                to={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg">
                                    {movie.posterPath ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Film className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
                                                <ExternalLink className="w-3 h-3" />
                                                View on TMDB
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                                                <Info className="w-3 h-3" />
                                                {movie.whyRecommended}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Badge */}
                                    {movie.tmdbRating > 0 && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                                            ⭐ {movie.tmdbRating?.toFixed(1)}
                                        </div>
                                    )}

                                    {/* Score Badge */}
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600/90 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                                        {movie.score}%
                                    </div>
                                </div>

                                <div className="mt-2 px-1">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                                        {movie.title}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {movie.year || 'N/A'}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
