import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Tv } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateTVShow } from '../hooks/useTVShows';
import TVShowForm from '../components/tv/TVShowForm';
import TVSearchModal from '../components/tv/TVSearchModal';
import Button from '../components/common/Button';

export default function AddTVShowPage() {
    const [selectedShow, setSelectedShow] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(true);
    const navigate = useNavigate();
    const createTVShow = useCreateTVShow();

    const handleShowSelect = (show) => {
        setSelectedShow(show);
        setIsSearchOpen(false);
    };

    const handleSubmit = async (data) => {
        try {
            await createTVShow.mutateAsync(data);
            toast.success('TV show added to your collection!');
            navigate('/tv');
        } catch (error) {
            toast.error(error.message || 'Failed to add TV show');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    Add TV Show
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Search for a TV show and add it to your collection.
                </p>
            </div>

            {/* Content */}
            {!selectedShow ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
                        <Tv className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Search for a TV Show
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Find the TV show you want to add from TMDB's database.
                    </p>
                    <Button onClick={() => setIsSearchOpen(true)} leftIcon={<Search className="w-5 h-5" />}>
                        Search TV Shows
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add Your Review
                        </h2>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setSelectedShow(null);
                                setIsSearchOpen(true);
                            }}
                        >
                            Change Show
                        </Button>
                    </div>

                    <TVShowForm
                        tvShow={selectedShow}
                        onSubmit={handleSubmit}
                        isLoading={createTVShow.isPending}
                    />
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
