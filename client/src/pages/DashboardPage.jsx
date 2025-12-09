import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Film, Star, Heart, Clock, Trash2, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useMovies, useDeleteMovie } from '../hooks/useMovies';
import MovieGrid from '../components/movies/MovieGrid';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ExportModal from '../components/movies/ExportModal';
import ImportModal from '../components/movies/ImportModal';

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, movie: null });
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const { data, isLoading } = useMovies({ limit: 10, sort: 'createdAt', order: 'desc' });
    const deleteMovie = useDeleteMovie();

    const movies = data?.items || [];
    const stats = data?.pagination;

    const handleEdit = (movie) => {
        navigate(`/edit/${movie._id}`);
    };

    const handleDeleteClick = (movie) => {
        setDeleteModal({ isOpen: true, movie });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.movie) return;

        try {
            await deleteMovie.mutateAsync(deleteModal.movie._id);
            toast.success('Movie deleted successfully');
            setDeleteModal({ isOpen: false, movie: null });
        } catch (error) {
            toast.error(error.message || 'Failed to delete movie');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Welcome back, {user?.username}! Manage your movie collection.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<Upload className="w-5 h-5" />}
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        Import
                    </Button>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-5 h-5" />}
                        onClick={() => setIsExportModalOpen(true)}
                    >
                        Export
                    </Button>
                    <Link to="/add">
                        <Button leftIcon={<Plus className="w-5 h-5" />}>
                            Add Movie
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <Film className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats?.totalMovies || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Movies</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Favorites</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Watch Hours</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Movies */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Recently Added
                    </h2>
                    <Link to="/" className="text-sm text-primary-600 hover:text-primary-500">
                        View All →
                    </Link>
                </div>

                <MovieGrid
                    movies={movies}
                    isLoading={isLoading}
                    showActions={true}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    emptyMessage="No movies yet. Add your first movie!"
                />
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, movie: null })}
                title="Delete Movie"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete <strong>{deleteModal.movie?.title}</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, movie: null })}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirm}
                            isLoading={deleteMovie.isPending}
                            leftIcon={<Trash2 className="w-4 h-4" />}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />

            {/* Import Modal */}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
}
