import { AnimatePresence, motion } from 'framer-motion';
import WatchlistCard from './WatchlistCard';
import { Clapperboard, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WatchlistGrid({ items, onPriorityChange, onRemove, onMoveToWatched, isLoading }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                    <Clapperboard className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Your watchlist is empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Start building your watchlist by adding movies you want to watch later.
                </p>
                <Link
                    to="/add"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Browse Movies
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
                {items.map((item) => (
                    <WatchlistCard
                        key={item._id}
                        item={item}
                        onPriorityChange={onPriorityChange}
                        onRemove={onRemove}
                        onMoveToWatched={onMoveToWatched}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
