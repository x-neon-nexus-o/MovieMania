import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { episodeService } from '../services/episodeService';
import { toast } from 'react-hot-toast';

/**
 * Hook for fetching all episodes for a TV show
 */
export function useEpisodes(tmdbShowId) {
    return useQuery({
        queryKey: ['episodes', tmdbShowId],
        queryFn: () => episodeService.getAllEpisodes(tmdbShowId),
        enabled: !!tmdbShowId,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

/**
 * Hook for fetching episodes for a specific season
 */
export function useSeasonEpisodes(tmdbShowId, seasonNumber) {
    return useQuery({
        queryKey: ['episodes', tmdbShowId, 'season', seasonNumber],
        queryFn: () => episodeService.getSeasonEpisodes(tmdbShowId, seasonNumber),
        enabled: !!tmdbShowId && seasonNumber !== undefined && seasonNumber !== null,
    });
}

/**
 * Hook for fetching show analytics
 */
export function useShowAnalytics(tmdbShowId) {
    return useQuery({
        queryKey: ['analytics', tmdbShowId],
        queryFn: () => episodeService.getShowAnalytics(tmdbShowId),
        enabled: !!tmdbShowId,
        staleTime: 1000 * 60 * 30, // 30 minutes
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
            queryClient.invalidateQueries({ queryKey: ['episodes', variables.tmdbShowId] });
            queryClient.invalidateQueries({ queryKey: ['analytics', variables.tmdbShowId] });
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
            queryClient.invalidateQueries({ queryKey: ['episodes', tmdbShowId] });
            queryClient.invalidateQueries({ queryKey: ['analytics', tmdbShowId] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to sync episodes');
        },
    });
}
