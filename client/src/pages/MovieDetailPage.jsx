import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Star,
    Calendar,
    Clock,
    Heart,
    Edit2,
    Trash2,
    Tag,
    User,
    ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMovie, useDeleteMovie } from '../hooks/useMovies';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import { StarRating } from '../components/common/StarRating';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { getPosterUrl, getBackdropUrl, formatDate, formatRuntime } from '../utils/helpers';
import { useState } from 'react';

export default function MovieDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, isLoading, error } = useMovie(id);
    const deleteMovie = useDeleteMovie();

    const movie = data?.movie;

    const isOwner = user && movie?.addedBy?._id === user?.id;

    const handleDelete = async () => {
        try {
            await deleteMovie.mutateAsync(id);
            toast.success('Movie deleted');
            navigate('/');
        } catch (error) {
            toast.error('Failed to delete movie');
        }
    };

    if (isLoading) {
        return <PageLoader />;
    }

    if (error || !movie) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Movie Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The movie you're looking for doesn't exist.
                </p>
                <Link to="/" className="text-primary-600 hover:text-primary-500">
                    Browse Movies
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Backdrop */}
            {movie.backdropPath && (
                <div className="relative h-[40vh] md:h-[50vh] -mt-16 pt-16">
                    <div className="absolute inset-0">
                        <img
                            src={getBackdropUrl(movie.backdropPath)}
                            alt={movie.title}
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
                                src={getPosterUrl(movie.posterPath)}
                                alt={movie.title}
                                className="w-full rounded-2xl shadow-2xl"
                            />

                            {/* Actions */}
                            {isOwner && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => navigate(`/edit/${movie._id}`)}
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
                                    {movie.title}
                                </h1>
                                {movie.isFavorite && (
                                    <Heart className="w-8 h-8 text-red-500 fill-red-500 flex-shrink-0" />
                                )}
                            </div>
                            {movie.originalTitle && movie.originalTitle !== movie.title && (
                                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                                    {movie.originalTitle}
                                </p>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-5 h-5" />
                                {movie.year}
                            </span>
                            {movie.runtime && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-5 h-5" />
                                    {formatRuntime(movie.runtime)}
                                </span>
                            )}
                            {movie.director && (
                                <span className="flex items-center gap-1">
                                    <User className="w-5 h-5" />
                                    {movie.director}
                                </span>
                            )}
                            {movie.tmdbId && (
                                <a
                                    href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-primary-600"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    TMDB
                                </a>
                            )}
                        </div>

                        {/* Ratings */}
                        <div className="flex flex-wrap gap-6">
                            <div className="card p-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">My Rating</p>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={movie.myRating} size="lg" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {movie.myRating.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            {movie.tmdbRating && (
                                <div className="card p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">TMDB Rating</p>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {movie.tmdbRating.toFixed(1)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({movie.tmdbVoteCount?.toLocaleString()} votes)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Watched Date */}
                        <div className="card p-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Watched On</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {formatDate(movie.watchedDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Genres */}
                        {movie.tmdbGenres && movie.tmdbGenres.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.tmdbGenres.map((genre) => (
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
                        {movie.tags && movie.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                                    <Tag className="w-4 h-4" />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.tags.map((tag) => (
                                        <span key={tag} className="badge badge-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        {movie.overview && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Overview
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {movie.overview}
                                </p>
                            </div>
                        )}

                        {/* My Review */}
                        {movie.myReview && (
                            <div className="card p-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    My Review
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {movie.myReview}
                                </p>
                            </div>
                        )}

                        {/* Cast */}
                        {movie.cast && movie.cast.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Cast
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {movie.cast.join(', ')}
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
                title="Delete Movie"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete <strong>{movie.title}</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteMovie.isPending}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
