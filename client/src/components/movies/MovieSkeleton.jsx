import { cn } from '../../utils/helpers';

export default function MovieSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(count)].map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="card overflow-hidden">
                        {/* Poster skeleton */}
                        <div className="aspect-poster bg-gray-200 dark:bg-gray-800" />

                        {/* Info skeleton */}
                        <div className="p-4 space-y-3">
                            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                            <div className="flex gap-2">
                                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
                                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function MovieCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="card overflow-hidden">
                <div className="aspect-poster bg-gray-200 dark:bg-gray-800" />
                <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}
