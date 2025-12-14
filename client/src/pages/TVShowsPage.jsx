import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Tv, Search, Filter, TrendingUp, Clock, CheckCircle2, Pause, X as XIcon, BookmarkPlus } from 'lucide-react';
import { useTVShows, useDeleteTVShow } from '../hooks/useTVShows';
import { useAuth } from '../context/AuthContext';
import TVShowGrid from '../components/tv/TVShowGrid';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const statusFilters = [
    { value: '', label: 'All Shows', icon: Tv, color: 'text-gray-600' },
    { value: 'watching', label: 'Watching', icon: TrendingUp, color: 'text-blue-500' },
    { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-green-500' },
    { value: 'on-hold', label: 'On Hold', icon: Pause, color: 'text-yellow-500' },
    { value: 'dropped', label: 'Dropped', icon: XIcon, color: 'text-red-500' },
    { value: 'plan-to-watch', label: 'Plan to Watch', icon: BookmarkPlus, color: 'text-purple-500' },
];

const sortOptions = [
    { value: 'startedDate-desc', label: 'Recently Started' },
    { value: 'startedDate-asc', label: 'Oldest Started' },
    { value: 'myRating-desc', label: 'Highest Rated' },
    { value: 'myRating-asc', label: 'Lowest Rated' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'updatedAt-desc', label: 'Recently Updated' },
];

export default function TVShowsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('startedDate');
    const [sortOrder, setSortOrder] = useState('desc');

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const deleteTVShow = useDeleteTVShow();

    const { data, isLoading, error } = useTVShows({
        search: searchQuery || undefined,
        watchStatus: statusFilter || undefined,
        sort: sortBy,
        order: sortOrder,
    });

    const handleEdit = (tvShow) => {
        navigate(`/tv/edit/${tvShow._id}`);
    };

    const handleDelete = async (tvShow) => {
        if (window.confirm(`Delete "${tvShow.name}" from your collection?`)) {
            try {
                await deleteTVShow.mutateAsync(tvShow._id);
                toast.success('TV show deleted');
            } catch (error) {
                toast.error('Failed to delete TV show');
            }
        }
    };

    const tvShows = data?.items || [];
    const pagination = data?.pagination;

    // Calculate stats from pagination
    const stats = {
        total: pagination?.totalShows || 0,
        watching: 0,
        completed: 0,
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900 text-white overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Animated gradient orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6 border border-white/20">
                            <Tv className="w-4 h-4" />
                            <span>Personal TV Tracker</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                            My TV Shows
                        </h1>

                        <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-8">
                            Track every series you're watching, rate episodes, and never lose track of your progress.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 md:gap-12">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold">{stats.total}</div>
                                <div className="text-sm text-purple-200">Total Shows</div>
                            </motion.div>
                            <div className="w-px h-12 bg-white/20" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-300" />
                                    <span className="text-lg font-semibold">Currently</span>
                                </div>
                                <div className="text-sm text-purple-200">Watching</div>
                            </motion.div>
                        </div>

                        {/* Add Button */}
                        {isAuthenticated && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8"
                            >
                                <Button
                                    onClick={() => navigate('/tv/add')}
                                    leftIcon={<Plus className="w-5 h-5" />}
                                    className="bg-white text-purple-700 hover:bg-purple-50 shadow-xl shadow-purple-900/30"
                                >
                                    Add TV Show
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-gray-50 dark:fill-gray-950" />
                    </svg>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search and Sort Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search TV shows..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-5 h-5" />}
                                rightIcon={searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="hover:text-gray-700">
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                )}
                            />
                        </div>

                        <select
                            className="input w-full sm:w-52"
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [sort, order] = e.target.value.split('-');
                                setSortBy(sort);
                                setSortOrder(order);
                            }}
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter Chips */}
                    <div className="flex flex-wrap gap-2">
                        {statusFilters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = statusFilter === filter.value;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setStatusFilter(filter.value)}
                                    className={`
                                        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                                        transition-all duration-200-
                                        ${isActive
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : filter.color}`} />
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Results Count */}
                {!isLoading && tvShows.length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Showing {tvShows.length} of {pagination?.totalShows || 0} shows
                        {statusFilter && ` • Filtered by: ${statusFilters.find(f => f.value === statusFilter)?.label}`}
                    </p>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500">Failed to load TV shows</p>
                    </div>
                ) : tvShows.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 mb-6">
                            <Tv className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {statusFilter ? 'No shows found' : 'No TV shows yet'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {statusFilter
                                ? `You don't have any shows marked as "${statusFilters.find(f => f.value === statusFilter)?.label}"`
                                : isAuthenticated
                                    ? "Start tracking your favorite TV shows by adding one to your collection."
                                    : "Sign in to start tracking your TV shows."}
                        </p>
                        {isAuthenticated && !statusFilter && (
                            <Button
                                onClick={() => navigate('/tv/add')}
                                leftIcon={<Plus className="w-5 h-5" />}
                                size="lg"
                            >
                                Add Your First Show
                            </Button>
                        )}
                        {statusFilter && (
                            <Button
                                variant="secondary"
                                onClick={() => setStatusFilter('')}
                            >
                                Clear Filter
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <TVShowGrid
                        tvShows={tvShows}
                        showActions={isAuthenticated}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </section>
        </div>
    );
}
