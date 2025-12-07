import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateMovie } from '../hooks/useMovies';
import MovieForm from '../components/movies/MovieForm';
import TMDBSearchModal from '../components/tmdb/TMDBSearchModal';
import Button from '../components/common/Button';

export default function AddMoviePage() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(true);
    const navigate = useNavigate();
    const createMovie = useCreateMovie();

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
        setIsSearchOpen(false);
    };

    const handleSubmit = async (data) => {
        try {
            await createMovie.mutateAsync(data);
            toast.success('Movie added to your collection!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Failed to add movie');
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
                    Add Movie
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Search for a movie and add it to your collection.
                </p>
            </div>

            {/* Content */}
            {!selectedMovie ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
                        <Search className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Search for a Movie
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Find the movie you want to add from TMDB's database.
                    </p>
                    <Button onClick={() => setIsSearchOpen(true)} leftIcon={<Search className="w-5 h-5" />}>
                        Search Movies
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
                                setSelectedMovie(null);
                                setIsSearchOpen(true);
                            }}
                        >
                            Change Movie
                        </Button>
                    </div>

                    <MovieForm
                        movie={selectedMovie}
                        onSubmit={handleSubmit}
                        isLoading={createMovie.isPending}
                    />
                </motion.div>
            )}

            {/* Search Modal */}
            <TMDBSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={handleMovieSelect}
            />
        </div>
    );
}
