import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import collectionService from '../services/collectionService';

/**
 * Get all user's collections
 */
export function useCollections() {
    return useQuery({
        queryKey: ['collections'],
        queryFn: () => collectionService.getCollections(),
    });
}

/**
 * Get single collection with movies
 */
export function useCollection(id) {
    return useQuery({
        queryKey: ['collections', id],
        queryFn: () => collectionService.getCollection(id),
        enabled: !!id,
    });
}

/**
 * Get collection templates
 */
export function useCollectionTemplates() {
    return useQuery({
        queryKey: ['collection-templates'],
        queryFn: () => collectionService.getTemplates(),
    });
}

/**
 * Create collection mutation
 */
export function useCreateCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => collectionService.createCollection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
}

/**
 * Update collection mutation
 */
export function useUpdateCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => collectionService.updateCollection(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            queryClient.invalidateQueries({ queryKey: ['collections', id] });
        },
    });
}

/**
 * Delete collection mutation
 */
export function useDeleteCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => collectionService.deleteCollection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
}

/**
 * Add movie to collection mutation
 */
export function useAddMovieToCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ collectionId, movieId, note }) =>
            collectionService.addMovie(collectionId, movieId, note),
        onSuccess: (_, { collectionId }) => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            queryClient.invalidateQueries({ queryKey: ['collections', collectionId] });
        },
    });
}

/**
 * Remove movie from collection mutation
 */
export function useRemoveMovieFromCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ collectionId, movieId }) =>
            collectionService.removeMovie(collectionId, movieId),
        onSuccess: (_, { collectionId }) => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            queryClient.invalidateQueries({ queryKey: ['collections', collectionId] });
        },
    });
}

/**
 * Reorder movies mutation
 */
export function useReorderMovies() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ collectionId, movieIds }) =>
            collectionService.reorderMovies(collectionId, movieIds),
        onSuccess: (_, { collectionId }) => {
            queryClient.invalidateQueries({ queryKey: ['collections', collectionId] });
        },
    });
}

/**
 * Get collections containing a movie
 */
export function useMovieCollections(movieId) {
    return useQuery({
        queryKey: ['movie-collections', movieId],
        queryFn: () => collectionService.getMovieCollections(movieId),
        enabled: !!movieId,
    });
}
