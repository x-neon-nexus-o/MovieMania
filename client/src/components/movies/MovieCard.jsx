import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Calendar, Edit2, Trash2 } from 'lucide-react';
import { cn, getPosterUrl, formatDate } from '../../utils/helpers';
import { StarRating } from '../common/StarRating';

export default function MovieCard({
    movie,
    index = 0,
    showActions = false,
    onEdit,
    onDelete,
    onToggleFavorite,
}) {
    const posterUrl = getPosterUrl(movie.posterPath);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
        >
            <Link to={`/movie/${movie._id}`} className="block">
                <div className="card card-hover overflow-hidden">
                    {/* Poster */}
                    <div className="relative aspect-poster overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <img
                            src={posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Quick actions */}
                            {showActions && (
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onEdit?.(movie);
                                        }}
                                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onDelete?.(movie);
                                        }}
                                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Favorite badge */}
                        {movie.isFavorite && (
                            <div className="absolute top-3 left-3">
                                <div className="p-2 rounded-full bg-red-500 text-white shadow-lg">
                                    <Heart className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        )}

                        {/* Rating badge */}
                        <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm">
                                    <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
                                    <span className="font-semibold">{movie.myRating.toFixed(1)}</span>
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm">
                                    {movie.year}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {movie.title}
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Watched {formatDate(movie.watchedDate)}</span>
                        </div>

                        {/* Tags */}
                        {movie.tags && movie.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                                {movie.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="badge badge-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {movie.tags.length > 3 && (
                                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                        +{movie.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
