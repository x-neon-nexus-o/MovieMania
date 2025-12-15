import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Film, Star, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
import tmdbService from '../../services/tmdbService';
import { getPosterUrl } from '../../utils/helpers';
import PredictionBadge from '../ai/PredictionBadge';

export default function TMDBSearchModal({ isOpen, onClose, onSelect }) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 300);

    const { data, isLoading, error } = useQuery({
        queryKey: ['tmdb-search', debouncedQuery],
        queryFn: () => tmdbService.searchMovies(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
    });

    // Clear search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    const handleSelect = (movie) => {
        onSelect(movie);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Search Movie"
            size="lg"
        >
            <div className="space-y-4">
                {/* Search Input */}
                <Input
                    placeholder="Search for a movie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-5 h-5" />}
                    rightIcon={
                        searchQuery && (
                            <button onClick={() => setSearchQuery('')}>
                                <X className="w-5 h-5" />
                            </button>
                        )
                    }
                    autoFocus
                />

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {isLoading && (
                        <div className="py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8 text-red-500">
                            Failed to search movies. Please try again.
                        </div>
                    )}

                    {!isLoading && !error && searchQuery.length < 2 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Enter at least 2 characters to search</p>
                        </div>
                    )}

                    {!isLoading && !error && data?.results?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No movies found for "{searchQuery}"</p>
                        </div>
                    )}

                    <AnimatePresence mode="popLayout">
                        {data?.results?.map((movie, index) => (
                            <motion.div
                                key={movie.tmdbId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <button
                                    onClick={() => handleSelect(movie)}
                                    className="w-full flex gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    {/* Poster */}
                                    <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        {movie.posterPath ? (
                                            <img
                                                src={getPosterUrl(movie.posterPath, 'small')}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Film className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {movie.title}
                                        </h4>

                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {movie.year && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {movie.year}
                                                </span>
                                            )}
                                            {movie.tmdbRating > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-accent-500" />
                                                    {movie.tmdbRating.toFixed(1)}
                                                </span>
                                            )}
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <PredictionBadge tmdbId={movie.tmdbId} type="movie" showRating={true} showMatch={true} />
                                            </div>
                                        </div>

                                        {movie.overview && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {movie.overview}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
}
