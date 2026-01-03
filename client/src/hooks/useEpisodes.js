import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { episodeService } from '../services/episodeService';
import { toast } from 'react-hot-toast';

/**
 * Hook for fetching all episodes for a TV show
 */
export function useEpisodes(tmdbShowId) {
    return useQuery({
        queryKey: ['episodes', String(tmdbShowId)],
        queryFn: () => episodeService.getAllEpisodes(tmdbShowId),
        enabled: !!tmdbShowId,
        staleTime: 1000 * 60 * 5, // 5 minutes (reduced from 24 hours)
        refetchOnMount: 'always',
    });
}

/**
 * Hook for fetching episodes for a specific season
 */
export function useSeasonEpisodes(tmdbShowId, seasonNumber) {
    return useQuery({
        queryKey: ['episodes', String(tmdbShowId), 'season', seasonNumber],
        queryFn: () => episodeService.getSeasonEpisodes(tmdbShowId, seasonNumber),
        enabled: !!tmdbShowId && seasonNumber !== undefined && seasonNumber !== null,
    });
}

/**
 * Hook for fetching show analytics
 */
export function useShowAnalytics(tmdbShowId) {
    return useQuery({
        queryKey: ['analytics', String(tmdbShowId)],
        queryFn: () => episodeService.getShowAnalytics(tmdbShowId),
        enabled: !!tmdbShowId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnMount: 'always',
    });
}

/**
 * Hook for rating an episode
 */
export function useRateEpisode() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tmdbShowId, seasonNumber, episodeNumber, rating }) =>
            episodeService.rateEpisode(tmdbShowId, seasonNumber, episodeNumber, rating),
        onSuccess: (_, variables) => {
            toast.success('Episode rated successfully!');
            queryClient.invalidateQueries({ queryKey: ['episodes', String(variables.tmdbShowId)] });
            queryClient.invalidateQueries({ queryKey: ['analytics', String(variables.tmdbShowId)] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to rate episode');
        },
    });
}

/**
 * Hook for syncing episodes from TMDB
 */
export function useSyncEpisodes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tmdbShowId) => episodeService.syncEpisodes(tmdbShowId),
        onSuccess: (_, tmdbShowId) => {
            toast.success('Episodes synced successfully!');
            // Force refetch by removing cached data first
            queryClient.removeQueries({ queryKey: ['episodes', String(tmdbShowId)] });
            queryClient.removeQueries({ queryKey: ['analytics', String(tmdbShowId)] });
            // Then invalidate to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['episodes'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to sync episodes');
        },
    });
}
