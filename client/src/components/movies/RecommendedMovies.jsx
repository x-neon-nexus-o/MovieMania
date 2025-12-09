import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Film, Sparkles, ExternalLink } from 'lucide-react';
import api from '../../services/api';

/**
 * Display recommended movies based on a given movie
 */
export default function RecommendedMovies({ tmdbId, currentMovieId }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['recommendations', tmdbId],
        queryFn: async () => {
            const response = await api.get(`/tmdb/movie/${tmdbId}/recommendations`);
            return response.data;
        },
        enabled: !!tmdbId,
        staleTime: 1000 * 60 * 30 // 30 minutes cache
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recommended For You
                    </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-[2/3] rounded-xl bg-gray-200 dark:bg-gray-800" />
                            <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !data?.results || data.results.length === 0) {
        return null; // Silently hide if no recommendations
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recommended For You
                    </h3>
                </div>
                <span className="text-sm text-gray-500">
                    Based on this movie
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.results.slice(0, 6).map((movie, index) => (
                    <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            to={`https://www.themoviedb.org/movie/${movie.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                        >
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <div className="flex items-center gap-1 text-white text-xs">
                                            <ExternalLink className="w-3 h-3" />
                                            View on TMDB
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Badge */}
                                {movie.tmdbRating > 0 && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-xs font-medium text-white">
                                        ⭐ {movie.tmdbRating.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            <div className="mt-2">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                                    {movie.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
