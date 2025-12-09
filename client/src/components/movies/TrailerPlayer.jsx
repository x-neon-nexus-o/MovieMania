import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Maximize2, Minimize2, AlertCircle, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

/**
 * TrailerPlayer - YouTube trailer embed with thumbnail preview
 */
export default function TrailerPlayer({ tmdbId, title }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);

    const { data: videoData, isLoading, error } = useQuery({
        queryKey: ['movie-videos', tmdbId],
        queryFn: async () => {
            const response = await api.get(`/tmdb/movie/${tmdbId}/videos`);
            // api.js interceptor already returns response.data, so we access .data directly
            return response.data;
        },
        enabled: !!tmdbId,
        staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    });

    const trailer = videoData?.primary;
    const hasTrailer = videoData?.hasTrailer;

    if (isLoading) {
        return (
            <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse flex items-center justify-center">
                <Film className="w-12 h-12 text-gray-400" />
            </div>
        );
    }

    if (error || !hasTrailer) {
        return (
            <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">No trailer available</p>
            </div>
        );
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`;
    const thumbnailFallback = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;

    return (
        <div className={`trailer-container ${isTheaterMode ? 'fixed inset-0 z-50 bg-black' : 'relative'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between mb-3 ${isTheaterMode ? 'absolute top-4 left-4 right-4 z-10' : ''}`}>
                <h3 className={`text-lg font-semibold ${isTheaterMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {trailer.official && '✓ '}Official Trailer
                </h3>
                {isPlaying && (
                    <button
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className={`p-2 rounded-lg transition-colors ${isTheaterMode
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        title={isTheaterMode ? 'Exit theater mode' : 'Theater mode'}
                    >
                        {isTheaterMode ? (
                            <Minimize2 className="w-5 h-5" />
                        ) : (
                            <Maximize2 className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Player Container */}
            <div className={`relative overflow-hidden rounded-xl ${isTheaterMode ? 'absolute inset-0 m-auto max-w-5xl max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'w-full aspect-video'
                }`}>
                <AnimatePresence mode="wait">
                    {!isPlaying ? (
                        <motion.div
                            key="thumbnail"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 cursor-pointer group"
                            onClick={() => setIsPlaying(true)}
                        >
                            {/* Thumbnail */}
                            <img
                                src={thumbnailUrl}
                                alt={`${title} trailer`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.src = thumbnailFallback;
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-20 h-20 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center shadow-2xl transition-colors"
                                >
                                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                </motion.div>
                            </div>

                            {/* Trailer Name */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-sm truncate">
                                    {trailer.name}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="player"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0"
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                                title={`${title} Trailer`}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Close button for theater mode */}
            {isTheaterMode && (
                <button
                    onClick={() => {
                        setIsTheaterMode(false);
                        setIsPlaying(false);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                    Close
                </button>
            )}

            {/* Multiple trailers indicator */}
            {videoData?.all?.length > 1 && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    +{videoData.all.length - 1} more {videoData.all.length - 1 === 1 ? 'video' : 'videos'} available
                </p>
            )}
        </div>
    );
}
