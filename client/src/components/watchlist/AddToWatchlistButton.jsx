import { useState } from 'react';
import { Bookmark, Check, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useAddToWatchlist, useMovieStatus } from '../../hooks/useWatchlist';
import AddToWatchlistModal from './AddToWatchlistModal';

/**
 * Button to add a movie to watchlist from TMDB search results
 * Shows different states: add, loading, already in watchlist, already watched
 */
export default function AddToWatchlistButton({ movie, size = 'md', variant = 'default' }) {
    const { isAuthenticated } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const addToWatchlist = useAddToWatchlist();

    // Check current status (only if authenticated)
    const { data: status, isLoading: statusLoading } = useMovieStatus(
        isAuthenticated ? (movie.tmdbId || movie.id) : null
    );

    const handleClick = (e) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to use watchlist');
            return;
        }

        if (status?.inWatched) {
            toast('You already watched this movie!', { icon: '🎬' });
            return;
        }

        if (status?.inWatchlist) {
            toast('Already in your watchlist', { icon: '📋' });
            return;
        }

        setIsModalOpen(true);
    };

    const handleAdd = async (data) => {
        try {
            await addToWatchlist.mutateAsync(data);
            toast.success('Added to watchlist!');
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message || 'Failed to add to watchlist');
        }
    };

    const sizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    // Determine button state and appearance
    let buttonContent;
    let buttonClass = sizeClasses[size];

    if (statusLoading) {
        buttonContent = (
            <Bookmark className={`${iconSizes[size]} text-gray-400 animate-pulse`} />
        );
        buttonClass += ' bg-gray-100 dark:bg-gray-800 cursor-wait';
    } else if (status?.inWatched) {
        buttonContent = (
            <Eye className={`${iconSizes[size]} text-green-500 fill-green-500`} />
        );
        buttonClass += ' bg-green-50 dark:bg-green-900/20';
    } else if (status?.inWatchlist) {
        buttonContent = (
            <Check className={`${iconSizes[size]} text-primary-500`} />
        );
        buttonClass += ' bg-primary-50 dark:bg-primary-900/20';
    } else {
        buttonContent = (
            <Bookmark className={`${iconSizes[size]} text-gray-500 hover:text-primary-600 transition-colors`} />
        );
        buttonClass += ' bg-white/80 dark:bg-gray-800/80 hover:bg-primary-50 dark:hover:bg-primary-900/20';
    }

    return (
        <>
            <button
                onClick={handleClick}
                className={`rounded-lg backdrop-blur-sm transition-all ${buttonClass}`}
                title={
                    status?.inWatched
                        ? 'Already watched'
                        : status?.inWatchlist
                            ? 'In watchlist'
                            : 'Add to watchlist'
                }
                disabled={statusLoading || addToWatchlist.isPending}
            >
                {buttonContent}
            </button>

            <AddToWatchlistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                movie={movie}
                onAdd={handleAdd}
                isLoading={addToWatchlist.isPending}
            />
        </>
    );
}
