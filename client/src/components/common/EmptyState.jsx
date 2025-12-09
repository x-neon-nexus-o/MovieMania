import { motion } from 'framer-motion';
import { Film, FolderOpen, BarChart3, Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Reusable empty state component with customizable illustrations and actions
 */
export default function EmptyState({
    type = 'default',
    title,
    description,
    action,
    actionLabel,
    className = ''
}) {
    const illustrations = {
        movies: {
            icon: Film,
            defaultTitle: 'No movies yet',
            defaultDescription: 'Start by adding your first watched movie to track your viewing history.',
            color: 'text-primary-500',
            bgColor: 'bg-primary-100 dark:bg-primary-900/30'
        },
        collections: {
            icon: FolderOpen,
            defaultTitle: 'No collections',
            defaultDescription: 'Create your first collection to organize your movies into themed lists.',
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
        },
        watchlist: {
            icon: Bookmark,
            defaultTitle: 'Watchlist is empty',
            defaultDescription: 'Add movies you want to watch later to keep track of them.',
            color: 'text-amber-500',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30'
        },
        stats: {
            icon: BarChart3,
            defaultTitle: 'No statistics yet',
            defaultDescription: 'Watch and log some movies to see your viewing statistics.',
            color: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/30'
        },
        search: {
            icon: Search,
            defaultTitle: 'No results found',
            defaultDescription: 'Try adjusting your search or filters to find what you\'re looking for.',
            color: 'text-gray-500',
            bgColor: 'bg-gray-100 dark:bg-gray-800'
        },
        default: {
            icon: Film,
            defaultTitle: 'Nothing here',
            defaultDescription: 'There\'s nothing to show at the moment.',
            color: 'text-gray-500',
            bgColor: 'bg-gray-100 dark:bg-gray-800'
        }
    };

    const config = illustrations[type] || illustrations.default;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-16 px-4 ${className}`}
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${config.bgColor} mb-6`}
            >
                <Icon className={`w-12 h-12 ${config.color}`} />
            </motion.div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title || config.defaultTitle}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {description || config.defaultDescription}
            </p>

            {action && actionLabel && (
                typeof action === 'string' ? (
                    <Link
                        to={action}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                    >
                        {actionLabel}
                    </Link>
                ) : (
                    <button
                        onClick={action}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                    >
                        {actionLabel}
                    </button>
                )
            )}
        </motion.div>
    );
}
