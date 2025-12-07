import MovieCard from './MovieCard';
import MovieSkeleton from './MovieSkeleton';
import { Film } from 'lucide-react';

export default function MovieGrid({
    movies = [],
    isLoading = false,
    showActions = false,
    onEdit,
    onDelete,
    emptyMessage = 'No movies found',
}) {
    if (isLoading) {
        return <MovieSkeleton count={10} />;
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <Film className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {emptyMessage}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your filters or add some movies to your collection.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
                <MovieCard
                    key={movie._id}
                    movie={movie}
                    index={index}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
