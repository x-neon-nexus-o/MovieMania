import { TMDB_IMAGE_BASE_URL, POSTER_SIZES, BACKDROP_SIZES, PLACEHOLDER_POSTER } from './constants';

/**
 * Get full poster URL from TMDB path
 */
export function getPosterUrl(path, size = 'large') {
    if (!path) return PLACEHOLDER_POSTER;
    const sizeValue = POSTER_SIZES[size] || POSTER_SIZES.large;
    return `${TMDB_IMAGE_BASE_URL}/${sizeValue}${path}`;
}

/**
 * Get full backdrop URL from TMDB path
 */
export function getBackdropUrl(path, size = 'large') {
    if (!path) return null;
    const sizeValue = BACKDROP_SIZES[size] || BACKDROP_SIZES.large;
    return `${TMDB_IMAGE_BASE_URL}/${sizeValue}${path}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date, options = {}) {
    if (!date) return 'Unknown';

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    };

    return new Date(date).toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format runtime in minutes to hours and minutes
 */
export function formatRuntime(minutes) {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
    if (!num) return '0';
    return num.toLocaleString('en-US');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get year from date string
 */
export function getYear(date) {
    if (!date) return null;
    return new Date(date).getFullYear();
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return sum / numbers.length;
}

/**
 * Generate star rating array (filled, half, empty)
 */
export function getStarRating(rating, maxStars = 5) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < maxStars; i++) {
        if (i < fullStars) {
            stars.push('full');
        } else if (i === fullStars && hasHalfStar) {
            stars.push('half');
        } else {
            stars.push('empty');
        }
    }

    return stars;
}

/**
 * Slugify string for URLs
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Class name helper (like clsx/classnames)
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
