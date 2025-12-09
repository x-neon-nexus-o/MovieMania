import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Edit2,
    Trash2,
    Share2,
    Pin,
    MoreVertical,
    Film,
    Star,
    Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useCollection,
    useUpdateCollection,
    useDeleteCollection,
    useRemoveMovieFromCollection
} from '../hooks/useCollections';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { getPosterUrl, formatRuntime } from '../utils/helpers';
import { StarRating } from '../components/common/StarRating';

export default function CollectionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const { data, isLoading, error } = useCollection(id);
    const updateCollection = useUpdateCollection();
    const deleteCollection = useDeleteCollection();
    const removeMovie = useRemoveMovieFromCollection();

    const collection = data?.collection;
    const isOwner = user && collection?.createdBy?._id === user?.id;

    const handleTogglePin = async () => {
        try {
            await updateCollection.mutateAsync({
                id,
                data: { isPinned: !collection.isPinned }
            });
            toast.success(collection.isPinned ? 'Unpinned' : 'Pinned to top');
        } catch (error) {
            toast.error('Failed to update collection');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCollection.mutateAsync(id);
            toast.success('Collection deleted');
            navigate('/collections');
        } catch (error) {
            toast.error('Failed to delete collection');
        }
    };

    const handleRemoveMovie = async (movieId) => {
        try {
            await removeMovie.mutateAsync({ collectionId: id, movieId });
            toast.success('Movie removed from collection');
        } catch (error) {
            toast.error('Failed to remove movie');
        }
    };

    if (isLoading) {
        return <PageLoader />;
    }

    if (error || !collection) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Collection not found
                </h1>
                <Link to="/collections" className="text-primary-600 hover:underline">
                    Back to collections
                </Link>
            </div>
        );
    }

    const movies = collection.movies || [];
    const totalRuntime = movies.reduce((sum, m) => sum + (m.movie?.runtime || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/collections"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Collections
                </Link>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                style={{ backgroundColor: collection.color + '20' }}
                            >
                                {collection.emoji}
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {collection.name}
                                    {collection.isPinned && (
                                        <Pin className="w-5 h-5 text-amber-500" fill="currentColor" />
                                    )}
                                </h1>
                                {collection.description && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {collection.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Film className="w-4 h-4" />
                                {movies.length} movies
                            </span>
                            {totalRuntime > 0 && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatRuntime(totalRuntime)}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* Actions */}
                    {isOwner && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex gap-2"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleTogglePin}
                                leftIcon={<Pin className="w-4 h-4" fill={collection.isPinned ? 'currentColor' : 'none'} />}
                            >
                                {collection.isPinned ? 'Unpin' : 'Pin'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                leftIcon={<Trash2 className="w-4 h-4" />}
                            >
                                Delete
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Movies Grid */}
            {movies.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
                >
                    <Film className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        This collection is empty
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Add movies from your library to this collection
                    </p>
                    <Link to="/">
                        <Button>Browse Movies</Button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map((item, index) => (
                        <motion.div
                            key={item.movie?._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="group relative"
                        >
                            <Link
                                to={`/movie/${item.movie?._id}`}
                                className="block card overflow-hidden"
                            >
                                {/* Poster */}
                                <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-800">
                                    {item.movie?.posterPath ? (
                                        <img
                                            src={getPosterUrl(item.movie.posterPath, 'medium')}
                                            alt={item.movie.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Film className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Rating Badge */}
                                    {item.movie?.myRating && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-medium text-white flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                                            {item.movie.myRating}
                                        </div>
                                    )}

                                    {/* Remove Button (Owner only) */}
                                    {isOwner && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveMovie(item.movie?._id);
                                            }}
                                            className="absolute top-2 left-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-white" />
                                        </button>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                        {item.movie?.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.movie?.year}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Collection"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete "{collection.name}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteCollection.isPending}
                            className="flex-1"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
