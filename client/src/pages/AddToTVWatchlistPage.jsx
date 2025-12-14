import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Tv, Calendar, AlertCircle, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAddToTVWatchlist } from '../hooks/useTVWatchlist';
import tvShowService from '../services/tvShowService';
import TVSearchModal from '../components/tv/TVSearchModal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getPosterUrl } from '../utils/helpers';

const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'bg-red-500', description: 'Watch ASAP' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-amber-500', description: 'Watch when free' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-500', description: 'No rush' }
];

const sourceOptions = [
    { value: 'friend', label: 'Friend Recommendation' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'trailer', label: 'Saw Trailer' },
    { value: 'article', label: 'Article/Review' },
    { value: 'recommendation', label: 'App Recommendation' },
    { value: 'other', label: 'Other' }
];

export default function AddToTVWatchlistPage() {
    const [selectedShow, setSelectedShow] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoadingShow, setIsLoadingShow] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const addToWatchlist = useAddToTVWatchlist();

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            priority: 'medium',
            source: 'other',
            notes: '',
            recommendedBy: '',
            targetStartDate: ''
        }
    });

    const selectedPriority = watch('priority');

    // Check if tmdbId is in URL params
    useEffect(() => {
        const tmdbId = searchParams.get('tmdbId');
        if (tmdbId) {
            loadShowFromTmdb(parseInt(tmdbId));
        } else {
            setIsSearchOpen(true);
        }
    }, [searchParams]);

    const loadShowFromTmdb = async (tmdbId) => {
        setIsLoadingShow(true);
        try {
            const response = await tvShowService.getTmdbTVShowDetails(tmdbId);
            setSelectedShow(response.data);
        } catch (error) {
            toast.error('Failed to load TV show details');
            setIsSearchOpen(true);
        } finally {
            setIsLoadingShow(false);
        }
    };

    const handleShowSelect = (show) => {
        setSelectedShow({
            ...show,
            tmdbId: show.id,
            name: show.name,
            posterPath: show.poster_path,
            backdropPath: show.backdrop_path,
            firstAirDate: show.first_air_date,
            overview: show.overview,
            tmdbRating: show.vote_average
        });
        setIsSearchOpen(false);
    };

    const onSubmit = async (data) => {
        if (!selectedShow) {
            toast.error('Please select a TV show');
            return;
        }

        try {
            await addToWatchlist.mutateAsync({
                tmdbId: selectedShow.tmdbId || selectedShow.id,
                priority: data.priority,
                notes: data.notes,
                source: data.source,
                recommendedBy: data.recommendedBy,
                targetStartDate: data.targetStartDate || undefined
            });
            toast.success('Added to TV watchlist!');
            navigate('/tv/watchlist');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to watchlist');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    Add to TV Watchlist
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Save a TV show to watch later
                </p>
            </div>

            {/* Loading */}
            {isLoadingShow && (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {/* No show selected */}
            {!isLoadingShow && !selectedShow && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-900/30 mb-6">
                        <Tv className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Search for a TV Show
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Find the show you want to add to your watchlist
                    </p>
                    <Button
                        onClick={() => setIsSearchOpen(true)}
                        leftIcon={<Search className="w-5 h-5" />}
                    >
                        Search TV Shows
                    </Button>
                </motion.div>
            )}

            {/* Form */}
            {!isLoadingShow && selectedShow && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Show Preview */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24">
                                <div className="card overflow-hidden">
                                    <img
                                        src={getPosterUrl(selectedShow.posterPath || selectedShow.poster_path)}
                                        alt={selectedShow.name}
                                        className="w-full aspect-poster object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                            {selectedShow.name}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {selectedShow.firstAirDate || selectedShow.first_air_date
                                                ? new Date(selectedShow.firstAirDate || selectedShow.first_air_date).getFullYear()
                                                : 'TBA'}
                                        </p>
                                        {selectedShow.tmdbRating && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Star className="w-4 h-4 text-amber-400 fill-current" />
                                                <span className="text-sm font-medium">
                                                    {selectedShow.tmdbRating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                        {selectedShow.overview && (
                                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                                                {selectedShow.overview}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedShow(null);
                                        setIsSearchOpen(true);
                                    }}
                                    className="w-full mt-4 text-center text-sm text-primary-600 hover:text-primary-700"
                                >
                                    Change TV Show
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="md:col-span-2">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Priority Level *
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {priorityOptions.map(option => (
                                            <label
                                                key={option.value}
                                                className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${selectedPriority === option.value
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    {...register('priority')}
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`w-4 h-4 rounded-full ${option.color} mb-2`} />
                                                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                        {option.label}
                                                    </span>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {option.description}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Source */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        How did you hear about it?
                                    </label>
                                    <select className="input" {...register('source')}>
                                        {sourceOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Recommended By */}
                                <Input
                                    label="Recommended By"
                                    placeholder="Who recommended this show?"
                                    {...register('recommendedBy')}
                                />

                                {/* Target Start Date */}
                                <Input
                                    label="Target Start Date"
                                    type="date"
                                    leftIcon={<Calendar className="w-5 h-5" />}
                                    {...register('targetStartDate')}
                                />

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Why do you want to watch this? Any thoughts..."
                                        className="input resize-none"
                                        {...register('notes')}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        isLoading={addToWatchlist.isPending}
                                        className="w-full md:w-auto"
                                    >
                                        Add to Watchlist
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Search Modal */}
            <TVSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={handleShowSelect}
            />
        </div>
    );
}
