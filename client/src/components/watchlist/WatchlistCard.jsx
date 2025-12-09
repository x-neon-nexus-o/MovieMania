import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosterUrl, formatRuntime } from '../../utils/helpers';
import PriorityBadge from './PriorityBadge';

export default function WatchlistCard({ item, onPriorityChange, onRemove, onMoveToWatched }) {
    const [showMenu, setShowMenu] = useState(false);

    const handlePriorityChange = (newPriority) => {
        if (newPriority !== item.priority) {
            onPriorityChange(item._id, newPriority);
        }
        setShowMenu(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card group relative overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={getPosterUrl(item.posterPath, 'medium') || '/placeholder-movie.png'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Priority Badge */}
                <div className="absolute top-2 left-2">
                    <PriorityBadge priority={item.priority} />
                </div>

                {/* TMDB Rating */}
                {item.tmdbRating > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                        ⭐ {item.tmdbRating.toFixed(1)}
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onMoveToWatched(item)}
                            className="flex-1 flex items-center justify-center gap-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Mark Watched
                        </button>
                        <button
                            onClick={() => onRemove(item._id)}
                            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                    {item.title}
                </h3>

                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.year && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.year}
                        </span>
                    )}
                    {item.runtime > 0 && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatRuntime(item.runtime)}
                        </span>
                    )}
                </div>

                {/* Genres */}
                {item.tmdbGenres && item.tmdbGenres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.tmdbGenres.slice(0, 2).map((genre) => (
                            <span
                                key={genre.id}
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Notes Preview */}
                {item.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 italic">
                        "{item.notes}"
                    </p>
                )}

                {/* Days since added */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-gray-400">
                        Added {item.daysSinceAdded === 0 ? 'today' : `${item.daysSinceAdded} days ago`}
                    </span>
                </div>
            </div>

            {/* Priority Quick Change */}
            <div className="absolute top-2 right-12">
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-10">
                            <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Priority
                            </div>
                            {['high', 'medium', 'low'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePriorityChange(p)}
                                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 capitalize ${item.priority === p ? 'text-primary-600 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
