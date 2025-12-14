import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tvShowService from '../services/tvShowService';

/**
 * Hook for fetching TV shows with filters
 */
export function useTVShows(params = {}) {
    return useQuery({
        queryKey: ['tvshows', params],
        queryFn: () => tvShowService.getTVShows(params),
    });
}

/**
 * Hook for fetching a single TV show
 */
export function useTVShow(id) {
    return useQuery({
        queryKey: ['tvshow', id],
        queryFn: () => tvShowService.getTVShow(id),
        enabled: !!id,
    });
}

/**
 * Hook for fetching TV show by TMDB ID
 */
export function useTVShowByTMDBId(tmdbId) {
    return useQuery({
        queryKey: ['tvshow', 'tmdb', tmdbId],
        queryFn: () => tvShowService.getTVShowByTMDBId(tmdbId),
        enabled: !!tmdbId,
    });
}

/**
 * Hook for creating a TV show
 */
export function useCreateTVShow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => tvShowService.addTVShow(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tvshows'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });
}

/**
 * Hook for updating a TV show
 */
export function useUpdateTVShow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => tvShowService.updateTVShow(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['tvshows'] });
            queryClient.invalidateQueries({ queryKey: ['tvshow', id] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });
}

/**
 * Hook for deleting a TV show
 */
export function useDeleteTVShow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => tvShowService.deleteTVShow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tvshows'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });
}

/**
 * Hook for fetching all TV show tags
 */
export function useTVShowTags() {
    return useQuery({
        queryKey: ['tvshow-tags'],
        queryFn: () => tvShowService.getTags(),
    });
}

/**
 * Hook for searching TMDB TV shows
 */
export function useSearchTMDBTV(query, page = 1, year = null) {
    return useQuery({
        queryKey: ['tmdb-tv-search', query, page, year],
        queryFn: () => tvShowService.searchTMDB(query, page, year),
        enabled: !!query && query.length >= 2,
    });
}

/**
 * Hook for fetching TMDB TV show details
 */
export function useTMDBTVDetails(tmdbId) {
    return useQuery({
        queryKey: ['tmdb-tv', tmdbId],
        queryFn: () => tvShowService.getTMDBDetails(tmdbId),
        enabled: !!tmdbId,
    });
}

/**
 * Hook for fetching trending TV shows
 */
export function useTrendingTV(timeWindow = 'week', page = 1) {
    return useQuery({
        queryKey: ['trending-tv', timeWindow, page],
        queryFn: () => tvShowService.getTrending(timeWindow, page),
    });
}

/**
 * Hook for fetching popular TV shows
 */
export function usePopularTV(page = 1) {
    return useQuery({
        queryKey: ['popular-tv', page],
        queryFn: () => tvShowService.getPopular(page),
    });
}

/**
 * Hook for fetching TV show videos
 */
export function useTVShowVideos(tmdbId) {
    return useQuery({
        queryKey: ['tvshow-videos', tmdbId],
        queryFn: () => tvShowService.getVideos(tmdbId),
        enabled: !!tmdbId,
    });
}

/**
 * Hook for fetching TV show watch providers
 */
export function useTVShowProviders(tmdbId, region = 'US') {
    return useQuery({
        queryKey: ['tvshow-providers', tmdbId, region],
        queryFn: () => tvShowService.getWatchProviders(tmdbId, region),
        enabled: !!tmdbId,
    });
}
