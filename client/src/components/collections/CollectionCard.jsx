import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Pin } from 'lucide-react';
import { getPosterUrl } from '../../utils/helpers';

export default function CollectionCard({ collection, index = 0 }) {
    const { _id, name, emoji, color, movies, isPinned, movieCount } = collection;

    // Get first 4 movie posters for preview
    const previewMovies = movies?.slice(0, 4) || [];
    const count = movieCount || movies?.length || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
        >
            <Link
                to={`/collections/${_id}`}
                className="block card overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
                {/* Cover Images Grid */}
                <div
                    className="relative h-40 overflow-hidden"
                    style={{ backgroundColor: color || '#6366f1' }}
                >
                    {previewMovies.length > 0 ? (
                        <div className="absolute inset-0 grid grid-cols-2 gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {previewMovies.map((item, i) => (
                                <div key={i} className="overflow-hidden">
                                    {item.movie?.posterPath ? (
                                        <img
                                            src={getPosterUrl(item.movie.posterPath, 'small')}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                            <Film className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* Fill empty slots */}
                            {[...Array(4 - previewMovies.length)].map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="bg-black/20"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl opacity-50">{emoji}</span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Pinned Badge */}
                    {isPinned && (
                        <div className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                            <Pin className="w-3.5 h-3.5 text-white" fill="currentColor" />
                        </div>
                    )}

                    {/* Movie Count */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white font-medium">
                        {count} {count === 1 ? 'movie' : 'movies'}
                    </div>
                </div>

                {/* Info */}
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{emoji}</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {name}
                        </h3>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
