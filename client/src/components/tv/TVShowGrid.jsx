import TVShowCard from './TVShowCard';

export default function TVShowGrid({
    tvShows = [],
    showActions = false,
    onEdit,
    onDelete,
    onToggleFavorite,
    emptyMessage = 'No TV shows found',
}) {
    if (tvShows.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {tvShows.map((tvShow, index) => (
                <TVShowCard
                    key={tvShow._id}
                    tvShow={tvShow}
                    index={index}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
}
