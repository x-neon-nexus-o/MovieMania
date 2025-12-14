import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tvWatchlistService from '../services/tvWatchlistService';

// Query keys
export const tvWatchlistKeys = {
    all: ['tvWatchlist'],
    lists: () => [...tvWatchlistKeys.all, 'list'],
    list: (params) => [...tvWatchlistKeys.lists(), params],
    details: () => [...tvWatchlistKeys.all, 'detail'],
    detail: (id) => [...tvWatchlistKeys.details(), id],
    stats: () => [...tvWatchlistKeys.all, 'stats'],
    status: (tmdbId) => [...tvWatchlistKeys.all, 'status', tmdbId],
};

// Get TV watchlist
export const useTVWatchlist = (params = {}) => {
    return useQuery({
        queryKey: tvWatchlistKeys.list(params),
        queryFn: () => tvWatchlistService.getTVWatchlist(params),
    });
};

// Get watchlist stats
export const useTVWatchlistStats = () => {
    return useQuery({
        queryKey: tvWatchlistKeys.stats(),
        queryFn: tvWatchlistService.getStats,
    });
};

// Get single item
export const useTVWatchlistItem = (id) => {
    return useQuery({
        queryKey: tvWatchlistKeys.detail(id),
        queryFn: () => tvWatchlistService.getItem(id),
        enabled: !!id,
    });
};

// Check TV show status
export const useTVShowStatus = (tmdbId) => {
    return useQuery({
        queryKey: tvWatchlistKeys.status(tmdbId),
        queryFn: () => tvWatchlistService.checkStatus(tmdbId),
        enabled: !!tmdbId,
    });
};

// Add to watchlist
export const useAddToTVWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tvWatchlistService.addToWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tvWatchlistKeys.all });
        },
    });
};

// Update watchlist item
export const useUpdateTVWatchlistItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => tvWatchlistService.updateItem(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: tvWatchlistKeys.all });
            queryClient.invalidateQueries({ queryKey: tvWatchlistKeys.detail(variables.id) });
        },
    });
};

// Update priority
export const useUpdateTVWatchlistPriority = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, priority }) => tvWatchlistService.updatePriority(id, priority),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tvWatchlistKeys.all });
        },
    });
};

// Remove from watchlist
export const useRemoveFromTVWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tvWatchlistService.removeFromWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tvWatchlistKeys.all });
        },
    });
};

// Start watching (move to tracking)
export const useStartWatchingTV = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => tvWatchlistService.startWatching(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tvWatchlistKeys.all });
            queryClient.invalidateQueries({ queryKey: ['tvShows'] });
        },
    });
};
