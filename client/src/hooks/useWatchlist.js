import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import watchlistService from '../services/watchlistService';

/**
 * Hook to fetch watchlist items
 */
export function useWatchlist(params = {}) {
    return useQuery({
        queryKey: ['watchlist', params],
        queryFn: () => watchlistService.getWatchlist(params),
    });
}

/**
 * Hook to fetch watchlist statistics
 */
export function useWatchlistStats() {
    return useQuery({
        queryKey: ['watchlist', 'stats'],
        queryFn: () => watchlistService.getStats(),
    });
}

/**
 * Hook to fetch single watchlist item
 */
export function useWatchlistItem(id) {
    return useQuery({
        queryKey: ['watchlist', id],
        queryFn: () => watchlistService.getWatchlistItem(id),
        enabled: !!id,
    });
}

/**
 * Hook to check movie status (in watchlist or watched)
 */
export function useMovieStatus(tmdbId) {
    return useQuery({
        queryKey: ['movieStatus', tmdbId],
        queryFn: () => watchlistService.checkMovieStatus(tmdbId),
        enabled: !!tmdbId,
    });
}

/**
 * Hook to add movie to watchlist
 */
export function useAddToWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => watchlistService.addToWatchlist(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });
}

/**
 * Hook to update watchlist item
 */
export function useUpdateWatchlistItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => watchlistService.updateWatchlistItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });
}

/**
 * Hook to update priority
 */
export function useUpdatePriority() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, priority }) => watchlistService.updatePriority(id, priority),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });
}

/**
 * Hook to remove from watchlist
 */
export function useRemoveFromWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => watchlistService.removeFromWatchlist(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });
}

/**
 * Hook to move watchlist item to watched
 */
export function useMoveToWatched() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, movieData }) => watchlistService.moveToWatched(id, movieData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });
}
