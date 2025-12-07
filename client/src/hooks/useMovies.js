import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import movieService from '../services/movieService';

/**
 * Hook for fetching movies with filters
 */
export function useMovies(params = {}) {
    return useQuery({
        queryKey: ['movies', params],
        queryFn: () => movieService.getMovies(params),
    });
}

/**
 * Hook for fetching a single movie
 */
export function useMovie(id) {
    return useQuery({
        queryKey: ['movie', id],
        queryFn: () => movieService.getMovie(id),
        enabled: !!id,
    });
}

/**
 * Hook for creating a movie
 */
export function useCreateMovie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => movieService.createMovie(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });
}

/**
 * Hook for updating a movie
 */
export function useUpdateMovie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => movieService.updateMovie(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            queryClient.invalidateQueries({ queryKey: ['movie', id] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });
}

/**
 * Hook for deleting a movie
 */
export function useDeleteMovie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => movieService.deleteMovie(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        },
    });
}

/**
 * Hook for fetching all tags
 */
export function useTags() {
    return useQuery({
        queryKey: ['tags'],
        queryFn: () => movieService.getTags(),
    });
}
