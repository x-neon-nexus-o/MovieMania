import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Tv, Star, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../common/Modal';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
import tvShowService from '../../services/tvShowService';
import { getPosterUrl } from '../../utils/helpers';

export default function TVSearchModal({ isOpen, onClose, onSelect }) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 300);

    const { data, isLoading, error } = useQuery({
        queryKey: ['tmdb-tv-search', debouncedQuery],
        queryFn: () => tvShowService.searchTMDB(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
    });

    // Clear search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    const handleSelect = async (show) => {
        // Fetch full details before selecting
        try {
            const details = await tvShowService.getTMDBDetails(show.tmdbId);
            onSelect(details.tvShow || details);
            onClose();
        } catch (err) {
            // Fallback to basic data
            onSelect(show);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Search TV Show"
            size="lg"
        >
            <div className="space-y-4">
                {/* Search Input */}
                <Input
                    placeholder="Search for a TV show..."
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
                            Failed to search TV shows. Please try again.
                        </div>
                    )}

                    {!isLoading && !error && searchQuery.length < 2 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <Tv className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Enter at least 2 characters to search</p>
                        </div>
                    )}

                    {!isLoading && !error && data?.results?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <Tv className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No TV shows found for "{searchQuery}"</p>
                        </div>
                    )}

                    <AnimatePresence mode="popLayout">
                        {data?.results?.map((show, index) => (
                            <motion.div
                                key={show.tmdbId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <button
                                    onClick={() => handleSelect(show)}
                                    className="w-full flex gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    {/* Poster */}
                                    <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        {show.posterPath ? (
                                            <img
                                                src={getPosterUrl(show.posterPath, 'small')}
                                                alt={show.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Tv className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {show.name}
                                        </h4>

                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {show.year && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {show.year}
                                                </span>
                                            )}
                                            {show.tmdbRating > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-accent-500" />
                                                    {show.tmdbRating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>

                                        {show.overview && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {show.overview}
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
