import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTVShow, useUpdateTVShow } from '../hooks/useTVShows';
import TVShowForm from '../components/tv/TVShowForm';
import { PageLoader } from '../components/common/LoadingSpinner';

export default function EditTVShowPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useTVShow(id);
    const updateTVShow = useUpdateTVShow();

    const tvShow = data?.tvShow;

    const handleSubmit = async (formData) => {
        try {
            await updateTVShow.mutateAsync({ id, data: formData });
            toast.success('TV show updated!');
            navigate(`/tv/${id}`);
        } catch (error) {
            toast.error(error.message || 'Failed to update TV show');
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
                <p className="text-gray-600 dark:text-gray-400">
                    The TV show you're looking for doesn't exist.
                </p>
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
                    Edit TV Show
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Update your rating, progress, and review for {tvShow.name}.
                </p>
            </div>

            {/* Form */}
            <TVShowForm
                tvShow={tvShow}
                onSubmit={handleSubmit}
                isLoading={updateTVShow.isPending}
                isEditing={true}
            />
        </div>
    );
}
