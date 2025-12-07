import { cn } from '../../utils/helpers';

export default function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    'animate-spin rounded-full border-2 border-primary-200 border-t-primary-600',
                    sizes[size]
                )}
            />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="xl" className="mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    );
}

export function ButtonLoader() {
    return (
        <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
