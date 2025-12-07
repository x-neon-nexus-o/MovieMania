import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * Display star rating (read-only)
 */
export function StarRating({ rating, maxStars = 5, size = 'md', showValue = false, className = '' }) {
    const sizes = {
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className={cn('flex items-center gap-0.5', className)}>
            {[...Array(maxStars)].map((_, index) => {
                if (index < fullStars) {
                    return (
                        <Star
                            key={index}
                            className={cn(sizes[size], 'fill-accent-500 text-accent-500')}
                        />
                    );
                } else if (index === fullStars && hasHalfStar) {
                    return (
                        <div key={index} className="relative">
                            <Star className={cn(sizes[size], 'text-gray-300 dark:text-gray-600')} />
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                <Star className={cn(sizes[size], 'fill-accent-500 text-accent-500')} />
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <Star
                            key={index}
                            className={cn(sizes[size], 'text-gray-300 dark:text-gray-600')}
                        />
                    );
                }
            })}
            {showValue && (
                <span className="ml-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}

/**
 * Interactive star rating input
 */
export function StarRatingInput({
    value,
    onChange,
    maxStars = 5,
    allowHalf = true,
    size = 'lg',
    className = '',
}) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-7 h-7',
        lg: 'w-9 h-9',
    };

    const handleClick = (starIndex, isHalf = false) => {
        const newRating = starIndex + (isHalf ? 0.5 : 1);
        onChange(newRating === value ? 0 : newRating);
    };

    return (
        <div className={cn('flex items-center gap-1', className)}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const halfValue = index + 0.5;
                const isFull = value >= starValue;
                const isHalf = value >= halfValue && value < starValue;

                return (
                    <button
                        key={index}
                        type="button"
                        className="relative focus:outline-none group"
                        onClick={() => handleClick(index)}
                    >
                        {/* Base star (empty) */}
                        <Star
                            className={cn(
                                sizes[size],
                                'transition-all duration-150',
                                isFull || isHalf
                                    ? 'fill-accent-500 text-accent-500'
                                    : 'text-gray-300 dark:text-gray-600 group-hover:text-accent-300'
                            )}
                        />

                        {/* Half star overlay */}
                        {allowHalf && (
                            <button
                                type="button"
                                className="absolute inset-0 w-1/2 overflow-hidden"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick(index, true);
                                }}
                            >
                                <Star
                                    className={cn(
                                        sizes[size],
                                        'transition-all duration-150',
                                        value >= halfValue
                                            ? 'fill-accent-500 text-accent-500'
                                            : 'text-transparent'
                                    )}
                                />
                            </button>
                        )}
                    </button>
                );
            })}
            <span className="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-300 min-w-[3rem]">
                {value > 0 ? value.toFixed(1) : '—'}
            </span>
        </div>
    );
}
