import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMovie, useUpdateMovie } from '../hooks/useMovies';
import MovieForm from '../components/movies/MovieForm';
import { PageLoader } from '../components/common/LoadingSpinner';

export default function EditMoviePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useMovie(id);
    const updateMovie = useUpdateMovie();

    const handleSubmit = async (formData) => {
        try {
            // Remove tmdbId from update data (can't change it)
            const { tmdbId, ...updateData } = formData;

            await updateMovie.mutateAsync({ id, data: updateData });
            toast.success('Movie updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Failed to update movie');
        }
    };

    if (isLoading) {
        return <PageLoader />;
    }

    if (error || !data?.movie) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Movie Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The movie you're looking for doesn't exist or you don't have permission to edit it.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-primary-600 hover:text-primary-500"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

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
                    Edit Movie
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Update your rating and review for {data.movie.title}.
                </p>
            </div>

            {/* Form */}
            <MovieForm
                movie={data.movie}
                onSubmit={handleSubmit}
                isLoading={updateMovie.isPending}
                isEditing={true}
            />
        </div>
    );
}
