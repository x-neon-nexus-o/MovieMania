import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowLeft,
    Star,
    Calendar,
    Heart,
    Edit2,
    Trash2,
    Tag,
    ExternalLink,
    Tv,
    Play,
    BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTVShow, useDeleteTVShow } from '../hooks/useTVShows';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import { StarRating } from '../components/common/StarRating';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ShareButton from '../components/common/ShareButton';
import { getPosterUrl, getBackdropUrl, formatDate } from '../utils/helpers';

const statusConfig = {
    'watching': {
        label: 'Currently Watching',
        bgClass: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
        iconColor: 'text-blue-400',
    },
    'completed': {
        label: 'Completed',
        bgClass: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
        iconColor: 'text-green-400',
    },
    'on-hold': {
        label: 'On Hold',
        bgClass: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
        iconColor: 'text-yellow-400',
    },
    'dropped': {
        label: 'Dropped',
        bgClass: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
        iconColor: 'text-red-400',
    },
    'plan-to-watch': {
        label: 'Plan to Watch',
        bgClass: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
        iconColor: 'text-purple-400',
    },
};

export default function TVShowDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, isLoading, error } = useTVShow(id);
    const deleteTVShow = useDeleteTVShow();

    const tvShow = data?.tvShow;

    const isOwner = user && tvShow?.addedBy?._id === user?.id;

    // Get status config
    const status = statusConfig[tvShow?.watchStatus] || statusConfig['watching'];

    // Calculate progress
    const totalEpisodes = tvShow?.numberOfEpisodes || 0;
    const episodesPerSeason = tvShow?.numberOfSeasons ? Math.ceil(totalEpisodes / tvShow.numberOfSeasons) : 0;
    const watchedEpisodes = totalEpisodes > 0
        ? Math.min(((tvShow?.currentSeason - 1) * episodesPerSeason) + (tvShow?.currentEpisode || 0), totalEpisodes)
        : 0;
    const progressPercent = totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0;

    const handleDelete = async () => {
        try {
            await deleteTVShow.mutateAsync(id);
            toast.success('TV show deleted');
            navigate('/tv');
        } catch (error) {
            toast.error('Failed to delete TV show');
        }
    };

    if (isLoading) {
        return <PageLoader />;
    }

    if (error || !tvShow) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    TV Show Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The TV show you're looking for doesn't exist.
                </p>
                <Link to="/tv" className="text-primary-600 hover:text-primary-500">
                    Browse TV Shows
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Backdrop */}
            {tvShow.backdropPath && (
                <div className="relative h-[40vh] md:h-[50vh] -mt-16 pt-16">
                    <div className="absolute inset-0">
                        <img
                            src={getBackdropUrl(tvShow.backdropPath)}
                            alt={tvShow.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/90 dark:from-gray-950/90 via-transparent to-transparent" />
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-1"
                    >
                        <div className="sticky top-24">
                            <img
                                src={getPosterUrl(tvShow.posterPath)}
                                alt={tvShow.name}
                                className="w-full rounded-2xl shadow-2xl"
                            />

                            {/* Actions */}
                            {isOwner && (
                                <div className="mt-4 space-y-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => navigate(`/tv/edit/${tvShow._id}`)}
                                            leftIcon={<Edit2 className="w-4 h-4" />}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsDeleteModalOpen(true)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 lg:col-span-3 space-y-6"
                    >
                        {/* Title Section */}
                        <div>
                            <div className="flex items-start gap-3">
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
                                    {tvShow.name}
                                </h1>
                                {tvShow.isFavorite && (
                                    <Heart className="w-8 h-8 text-red-500 fill-red-500 flex-shrink-0" />
                                )}
                                <div className="ml-auto flex-shrink-0">
                                    <ShareButton
                                        title={tvShow.name}
                                        description={`I'm watching "${tvShow.name}" and rated it ${tvShow.myRating}/5 stars! 📺`}
                                    />
                                </div>
                            </div>
                            {tvShow.originalName && tvShow.originalName !== tvShow.name && (
                                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                                    {tvShow.originalName}
                                </p>
                            )}
                        </div>

                        {/* Watch Status Badge */}
                        <div>
                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-lg ${status.bgClass}`}>
                                <Tv className="w-5 h-5" />
                                {status.label}
                            </span>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-5 h-5" />
                                {tvShow.year || (tvShow.firstAirDate && new Date(tvShow.firstAirDate).getFullYear())}
                            </span>
                            {tvShow.numberOfSeasons && (
                                <span className="flex items-center gap-1">
                                    <Tv className="w-5 h-5" />
                                    {tvShow.numberOfSeasons} Seasons
                                </span>
                            )}
                            {tvShow.numberOfEpisodes && (
                                <span className="flex items-center gap-1">
                                    <Play className="w-5 h-5" />
                                    {tvShow.numberOfEpisodes} Episodes
                                </span>
                            )}
                            {tvShow.tmdbId && (
                                <a
                                    href={`https://www.themoviedb.org/tv/${tvShow.tmdbId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-primary-600"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    TMDB
                                </a>
                            )}
                            {tvShow.tmdbId && (
                                <Link
                                    to={`/tv/${tvShow.tmdbId}/analytics`}
                                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Analytics
                                </Link>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="card p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Watch Progress</h3>
                                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{progressPercent}%</span>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Season {tvShow.currentSeason}, Episode {tvShow.currentEpisode}
                                </span>
                                {tvShow.numberOfSeasons && tvShow.numberOfEpisodes && (
                                    <span className="text-gray-500">
                                        / {tvShow.numberOfSeasons}S • {tvShow.numberOfEpisodes}E total
                                    </span>
                                )}
                            </div>
                            {/* Progress Bar */}
                            {totalEpisodes > 0 && (
                                <div className="relative">
                                    <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${tvShow.watchStatus === 'completed'
                                                ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                                                : 'bg-gradient-to-r from-primary-500 to-primary-600'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>E1</span>
                                        <span>{watchedEpisodes} / {totalEpisodes} episodes</span>
                                        <span>E{totalEpisodes}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ratings */}
                        <div className="flex flex-wrap gap-6">
                            <div className="card p-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">My Rating</p>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={tvShow.myRating} size="lg" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {tvShow.myRating?.toFixed(1) || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {tvShow.tmdbRating && (
                                <div className="card p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">TMDB Rating</p>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {tvShow.tmdbRating.toFixed(1)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({tvShow.tmdbVoteCount?.toLocaleString()} votes)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Started/Completed Dates */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="card p-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Started On</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {formatDate(tvShow.startedDate, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            {tvShow.completedDate && (
                                <div className="card p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed On</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatDate(tvShow.completedDate, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Networks */}
                        {tvShow.networks && tvShow.networks.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Networks</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tvShow.networks.map((network) => (
                                        <span
                                            key={network.id}
                                            className="badge bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        >
                                            {network.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Genres */}
                        {tvShow.tmdbGenres && tvShow.tmdbGenres.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tvShow.tmdbGenres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="badge bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {tvShow.tags && tvShow.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                                    <Tag className="w-4 h-4" />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tvShow.tags.map((tag) => (
                                        <span key={tag} className="badge badge-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        {tvShow.overview && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Overview
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {tvShow.overview}
                                </p>
                            </div>
                        )}

                        {/* My Review */}
                        {tvShow.myReview && (
                            <div className="card p-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    My Review
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {tvShow.myReview}
                                </p>
                            </div>
                        )}

                        {/* Cast */}
                        {tvShow.cast && tvShow.cast.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Cast
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {tvShow.cast.join(', ')}
                                </p>
                            </div>
                        )}

                        {/* Creators */}
                        {tvShow.creators && tvShow.creators.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Created By
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {tvShow.creators.join(', ')}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete TV Show"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete <strong>{tvShow.name}</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteTVShow.isPending}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
