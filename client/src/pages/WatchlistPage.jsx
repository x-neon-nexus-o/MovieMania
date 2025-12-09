import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Film, Clock, Flame, Star, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWatchlist, useWatchlistStats, useUpdatePriority, useRemoveFromWatchlist, useMoveToWatched } from '../hooks/useWatchlist';
import WatchlistGrid from '../components/watchlist/WatchlistGrid';
import WatchlistFilters from '../components/watchlist/WatchlistFilters';
import MoveToWatchedModal from '../components/watchlist/MoveToWatchedModal';
import { PageLoader } from '../components/common/LoadingSpinner';

export default function WatchlistPage() {
    const [filters, setFilters] = useState({
        priority: '',
        sort: 'createdAt',
        order: 'desc'
    });
    const [moveModalItem, setMoveModalItem] = useState(null);

    const { data: watchlistData, isLoading } = useWatchlist(filters);
    const { data: stats } = useWatchlistStats();
    const updatePriority = useUpdatePriority();
    const removeFromWatchlist = useRemoveFromWatchlist();
    const moveToWatched = useMoveToWatched();

    const handlePriorityChange = async (id, priority) => {
        try {
            await updatePriority.mutateAsync({ id, priority });
            toast.success('Priority updated');
        } catch (error) {
            toast.error('Failed to update priority');
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeFromWatchlist.mutateAsync(id);
            toast.success('Removed from watchlist');
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const handleMoveToWatched = (item) => {
        setMoveModalItem(item);
    };

    const handleMoveSubmit = async (data) => {
        try {
            await moveToWatched.mutateAsync(data);
            toast.success('Moved to watched collection!');
            setMoveModalItem(null);
        } catch (error) {
            toast.error(error.message || 'Failed to move');
        }
    };

    const statCards = [
        {
            icon: Film,
            label: 'Total',
            value: stats?.total || 0,
            color: 'primary'
        },
        {
            icon: Flame,
            label: 'Must Watch',
            value: stats?.highPriority || 0,
            color: 'red'
        },
        {
            icon: Star,
            label: 'Want to Watch',
            value: stats?.mediumPriority || 0,
            color: 'amber'
        },
        {
            icon: Sparkles,
            label: 'Maybe',
            value: stats?.lowPriority || 0,
            color: 'gray'
        }
    ];

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                        <Bookmark className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        My Watchlist
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Movies you want to watch, organized by priority.
                </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-4 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                            <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Top Genres */}
            {stats?.topGenres && stats.topGenres.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Top genres in your watchlist:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {stats.topGenres.map((genre) => (
                            <span
                                key={genre._id}
                                className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
                            >
                                {genre._id} ({genre.count})
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Filters */}
            <WatchlistFilters filters={filters} onChange={setFilters} />

            {/* Grid */}
            <WatchlistGrid
                items={watchlistData?.items || []}
                onPriorityChange={handlePriorityChange}
                onRemove={handleRemove}
                onMoveToWatched={handleMoveToWatched}
                isLoading={isLoading}
            />

            {/* Pagination Info */}
            {watchlistData?.pagination && watchlistData.pagination.total > 0 && (
                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Showing {watchlistData.items.length} of {watchlistData.pagination.total} movies
                </div>
            )}

            {/* Move to Watched Modal */}
            <MoveToWatchedModal
                isOpen={!!moveModalItem}
                onClose={() => setMoveModalItem(null)}
                item={moveModalItem}
                onSubmit={handleMoveSubmit}
                isLoading={moveToWatched.isPending}
            />
        </div>
    );
}
