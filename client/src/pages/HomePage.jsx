import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, TrendingUp } from 'lucide-react';
import { useMovies, useTags } from '../hooks/useMovies';
import MovieGrid from '../components/movies/MovieGrid';
import FilterBar from '../components/filters/FilterBar';
import Button from '../components/common/Button';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize filters from URL params
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        minRating: searchParams.get('minRating') || '',
        maxRating: searchParams.get('maxRating') || '',
        yearMin: searchParams.get('yearMin') || '',
        yearMax: searchParams.get('yearMax') || '',
        tags: searchParams.get('tags') || '',
        isFavorite: searchParams.get('isFavorite') || '',
        sort: searchParams.get('sort') || 'watchedDate',
        order: searchParams.get('order') || 'desc',
    });

    const [page, setPage] = useState(1);

    // Build query params
    const queryParams = {
        page,
        limit: 20,
        ...Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '')
        ),
    };

    const { data, isLoading, error } = useMovies(queryParams);
    const { data: tagsData } = useTags();

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'watchedDate' && value !== 'desc') {
                params.set(key, value);
            }
        });
        setSearchParams(params, { replace: true });
        setPage(1); // Reset page on filter change
    }, [filters, setSearchParams]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const movies = data?.items || [];
    const pagination = data?.pagination;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDIwIEwgMjAgMjAgMjAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZ3JpZCkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-50" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6">
                            <Film className="w-4 h-4" />
                            <span>Personal Movie Tracker</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                            My Watched Movies
                        </h1>

                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8">
                            Track every film you've watched, rate them, and discover your viewing patterns.
                        </p>

                        {pagination && (
                            <div className="flex items-center justify-center gap-8 text-center">
                                <div>
                                    <div className="text-3xl font-bold">{pagination.totalMovies}</div>
                                    <div className="text-sm text-primary-200">Movies Watched</div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="mb-8">
                    <FilterBar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        tags={tagsData?.tags || []}
                    />
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">Failed to load movies</p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                )}

                {/* Movie Grid */}
                <MovieGrid
                    movies={movies}
                    isLoading={isLoading}
                    emptyMessage="No movies found. Start adding some!"
                />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <Button
                            variant="secondary"
                            disabled={!pagination.hasPrev}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>

                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        <Button
                            variant="secondary"
                            disabled={!pagination.hasNext}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}
