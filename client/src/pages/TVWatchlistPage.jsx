import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tv, Plus, Search, Trash2, Play, Clock, Star, Filter,
    ChevronDown, AlertCircle, Sparkles, Calendar, ArrowUpRight
} from 'lucide-react';
import { useTVWatchlist, useTVWatchlistStats, useRemoveFromTVWatchlist, useStartWatchingTV, useUpdateTVWatchlistPriority } from '../hooks/useTVWatchlist';
import { useAuth } from '../context/AuthContext';
import { getPosterUrl } from '../utils/helpers';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const priorityConfig = {
    high: { label: 'High', color: 'bg-red-500', textColor: 'text-red-500', bgLight: 'bg-red-100 dark:bg-red-900/30' },
    medium: { label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-500', bgLight: 'bg-amber-100 dark:bg-amber-900/30' },
    low: { label: 'Low', color: 'bg-green-500', textColor: 'text-green-500', bgLight: 'bg-green-100 dark:bg-green-900/30' }
};

function TVWatchlistCard({ item, onRemove, onStartWatching, onPriorityChange }) {
    const [showActions, setShowActions] = useState(false);
    const priority = priorityConfig[item.priority] || priorityConfig.medium;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex">
                {/* Poster */}
                <div className="relative w-24 sm:w-32 flex-shrink-0">
                    <img
                        src={getPosterUrl(item.posterPath)}
                        alt={item.name}
                        className="w-full h-full object-cover aspect-poster"
                    />
                    {/* Priority Badge */}
                    <div className={`absolute top-2 left-2 ${priority.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                        {priority.label}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                    <div className="flex-1">
                        <Link
                            to={`/tv/watchlist/${item._id}`}
                            className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1"
                        >
                            {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span>{item.year || 'TBA'}</span>
                            {item.numberOfSeasons && (
                                <>
                                    <span>•</span>
                                    <span>{item.numberOfSeasons} Season{item.numberOfSeasons !== 1 ? 's' : ''}</span>
                                </>
                            )}
                        </div>

                        {/* Genres */}
                        {item.tmdbGenres?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {item.tmdbGenres.slice(0, 2).map(genre => (
                                    <span
                                        key={genre.id}
                                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* TMDB Rating */}
                        {item.tmdbRating && (
                            <div className="flex items-center gap-1 mt-2">
                                <Star className="w-4 h-4 text-amber-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.tmdbRating.toFixed(1)}
                                </span>
                            </div>
                        )}

                        {/* Notes */}
                        {item.notes && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                📝 {item.notes}
                            </p>
                        )}
                    </div>

                    {/* Priority Selector */}
                    <div className="flex items-center gap-2 mt-3">
                        {['high', 'medium', 'low'].map(p => (
                            <button
                                key={p}
                                onClick={() => onPriorityChange(item._id, p)}
                                className={`text-xs px-2 py-1 rounded-full transition-all ${item.priority === p
                                    ? `${priorityConfig[p].color} text-white`
                                    : `${priorityConfig[p].bgLight} ${priorityConfig[p].textColor} hover:opacity-80`
                                    }`}
                            >
                                {priorityConfig[p].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <AnimatePresence>
                    {showActions && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-2 top-2 flex flex-col gap-2"
                        >
                            <button
                                onClick={() => onStartWatching(item._id)}
                                className="p-2 rounded-lg bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors"
                                title="Start Watching"
                            >
                                <Play className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onRemove(item._id)}
                                className="p-2 rounded-lg bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                                title="Remove"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default function TVWatchlistPage() {
    const [priority, setPriority] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const { isAuthenticated } = useAuth();

    const { data, isLoading, error } = useTVWatchlist({
        priority: priority || undefined,
        sort,
        order
    });

    const { data: stats } = useTVWatchlistStats();
    const removeFromWatchlist = useRemoveFromTVWatchlist();
    const startWatching = useStartWatchingTV();
    const updatePriority = useUpdateTVWatchlistPriority();

    const handleRemove = async (id) => {
        try {
            await removeFromWatchlist.mutateAsync(id);
            toast.success('Removed from watchlist');
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const handleStartWatching = async (id) => {
        try {
            await startWatching.mutateAsync({ id, data: {} });
            toast.success('Started watching! Check your TV Shows page.');
        } catch (error) {
            toast.error(error.message || 'Failed to start watching');
        }
    };

    const handlePriorityChange = async (id, newPriority) => {
        try {
            await updatePriority.mutateAsync({ id, priority: newPriority });
        } catch (error) {
            toast.error('Failed to update priority');
        }
    };



    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <Tv className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Login Required
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Sign in to manage your TV watchlist
                </p>
                <Link to="/login">
                    <Button>Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 text-white overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Animated gradient orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <h1 className="text-4xl font-display font-bold">
                                    TV Watchlist
                                </h1>
                            </div>
                            <p className="text-cyan-100 text-lg">
                                Shows you're planning to watch
                            </p>
                        </div>

                        <Link to="/tv/watchlist/add">
                            <Button
                                leftIcon={<Plus className="w-5 h-5" />}
                                className="bg-white text-blue-700 hover:bg-cyan-50"
                            >
                                Add TV Show
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold">{stats.total || 0}</div>
                                <div className="text-sm text-cyan-200">Total Shows</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-red-400">{stats.highPriority || 0}</div>
                                <div className="text-sm text-cyan-200">High Priority</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-amber-400">{stats.mediumPriority || 0}</div>
                                <div className="text-sm text-cyan-200">Medium Priority</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-green-400">{stats.lowPriority || 0}</div>
                                <div className="text-sm text-cyan-200">Low Priority</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" className="fill-gray-50 dark:fill-gray-950" />
                    </svg>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
                    </div>
                    <div className="flex gap-2">
                        {['', 'high', 'medium', 'low'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priority === p
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {p === '' ? 'All' : priorityConfig[p].label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-gray-500">Sort:</span>
                        <select
                            value={`${sort}-${order}`}
                            onChange={(e) => {
                                const [s, o] = e.target.value.split('-');
                                setSort(s);
                                setOrder(o);
                            }}
                            className="input py-2 text-sm"
                        >
                            <option value="createdAt-desc">Recently Added</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="priority-desc">Priority High→Low</option>
                            <option value="priority-asc">Priority Low→High</option>
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-20">
                        <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Failed to load watchlist
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && data?.items?.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 mb-6">
                            <Clock className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {priority ? `No ${priorityConfig[priority].label} Priority Shows` : 'Your TV Watchlist is Empty'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            {priority
                                ? 'Try selecting a different priority filter'
                                : 'Start building your queue of TV shows to watch next!'}
                        </p>
                        {!priority && (
                            <Link to="/tv/watchlist/add">
                                <Button
                                    leftIcon={<Plus className="w-5 h-5" />}
                                >
                                    Add Your First Show
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                )}

                {/* Watchlist Grid */}
                {!isLoading && data?.items?.length > 0 && (
                    <motion.div layout className="grid gap-4 md:grid-cols-2">
                        <AnimatePresence>
                            {data.items.map(item => (
                                <TVWatchlistCard
                                    key={item._id}
                                    item={item}
                                    onRemove={handleRemove}
                                    onStartWatching={handleStartWatching}
                                    onPriorityChange={handlePriorityChange}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>

        </div>
    );
}
