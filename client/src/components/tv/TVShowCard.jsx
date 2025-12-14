import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Edit2, Trash2, Play, Tv } from 'lucide-react';
import { cn, getPosterUrl } from '../../utils/helpers';

// Watch status badge configuration with gradients
const statusConfig = {
    'watching': {
        label: 'Watching',
        bgClass: 'bg-gradient-to-r from-blue-500 to-blue-600',
        iconBg: 'bg-blue-500/20',
        dotColor: 'bg-blue-400',
    },
    'completed': {
        label: 'Completed',
        bgClass: 'bg-gradient-to-r from-emerald-500 to-green-600',
        iconBg: 'bg-green-500/20',
        dotColor: 'bg-green-400',
    },
    'on-hold': {
        label: 'On Hold',
        bgClass: 'bg-gradient-to-r from-amber-500 to-yellow-600',
        iconBg: 'bg-yellow-500/20',
        dotColor: 'bg-yellow-400',
    },
    'dropped': {
        label: 'Dropped',
        bgClass: 'bg-gradient-to-r from-red-500 to-rose-600',
        iconBg: 'bg-red-500/20',
        dotColor: 'bg-red-400',
    },
    'plan-to-watch': {
        label: 'Plan to Watch',
        bgClass: 'bg-gradient-to-r from-purple-500 to-violet-600',
        iconBg: 'bg-purple-500/20',
        dotColor: 'bg-purple-400',
    },
};

export default function TVShowCard({
    tvShow,
    index = 0,
    showActions = false,
    onEdit,
    onDelete,
    onToggleFavorite,
}) {
    const posterUrl = getPosterUrl(tvShow.posterPath);
    const status = statusConfig[tvShow.watchStatus] || statusConfig['watching'];

    // Calculate watch progress percentage
    const totalEpisodes = tvShow.numberOfEpisodes || 0;
    const watchedEpisodes = totalEpisodes > 0
        ? Math.min(
            ((tvShow.currentSeason - 1) * Math.ceil(totalEpisodes / (tvShow.numberOfSeasons || 1))) + tvShow.currentEpisode,
            totalEpisodes
        )
        : 0;
    const progressPercent = totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className="group"
        >
            <Link to={`/tv/${tvShow._id}`} className="block">
                <div className="card card-hover overflow-hidden relative">
                    {/* Poster */}
                    <div className="relative aspect-poster overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
                        <img
                            src={posterUrl}
                            alt={tvShow.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Hover overlay with actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {showActions && (
                                <div className="absolute top-3 right-3 flex gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onEdit?.(tvShow);
                                        }}
                                        className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onDelete?.(tvShow);
                                        }}
                                        className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-red-500/80 transition-all duration-200 hover:scale-110"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Favorite badge */}
                        {tvShow.isFavorite && (
                            <div className="absolute top-3 left-3 animate-pulse">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30">
                                    <Heart className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        )}

                        {/* Watch status badge */}
                        <div className="absolute top-3 right-3 group-hover:opacity-0 transition-opacity duration-200">
                            <span className={cn(
                                'px-2.5 py-1 rounded-lg text-xs font-semibold text-white shadow-lg flex items-center gap-1.5',
                                status.bgClass
                            )}>
                                <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', status.dotColor)} />
                                {status.label}
                            </span>
                        </div>

                        {/* Bottom info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            {/* Rating and Progress */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-sm">{tvShow.myRating?.toFixed(1) || '—'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-sm">
                                    <Tv className="w-3.5 h-3.5" />
                                    <span className="font-medium">S{tvShow.currentSeason || 1}E{tvShow.currentEpisode || 1}</span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            {tvShow.watchStatus !== 'plan-to-watch' && totalEpisodes > 0 && (
                                <div className="relative">
                                    <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className={cn(
                                                'h-full rounded-full',
                                                tvShow.watchStatus === 'completed'
                                                    ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                                                    : 'bg-gradient-to-r from-primary-400 to-primary-600'
                                            )}
                                        />
                                    </div>
                                    <span className="absolute right-0 -top-5 text-[10px] text-white/70 font-medium">
                                        {progressPercent}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-3.5">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm">
                            {tvShow.name}
                        </h3>

                        {/* Year and Seasons */}
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">
                                {tvShow.year || (tvShow.firstAirDate && new Date(tvShow.firstAirDate).getFullYear())}
                            </span>
                            {tvShow.numberOfSeasons && (
                                <>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <span>{tvShow.numberOfSeasons} {tvShow.numberOfSeasons === 1 ? 'Season' : 'Seasons'}</span>
                                </>
                            )}
                        </div>

                        {/* Tags */}
                        {tvShow.tags && tvShow.tags.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1">
                                {tvShow.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {tvShow.tags.length > 2 && (
                                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                                        +{tvShow.tags.length - 2}
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
