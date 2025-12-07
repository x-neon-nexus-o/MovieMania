// API URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const POSTER_SIZES = {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
};

export const BACKDROP_SIZES = {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
};

// Sort options
export const SORT_OPTIONS = [
    { value: 'watchedDate', label: 'Date Watched' },
    { value: 'myRating', label: 'My Rating' },
    { value: 'title', label: 'Title' },
    { value: 'year', label: 'Release Year' },
    { value: 'createdAt', label: 'Date Added' },
];

// Rating options (0-5 in 0.5 increments)
export const RATING_OPTIONS = [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
];

// Navigation links
export const NAV_LINKS = [
    { path: '/', label: 'Movies' },
    { path: '/stats', label: 'Stats' },
];

export const AUTH_NAV_LINKS = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/add', label: 'Add Movie' },
];

// Placeholder image
export const PLACEHOLDER_POSTER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"%3E%3Crect fill="%231f2937" width="300" height="450"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="24" text-anchor="middle" x="150" y="225"%3ENo Poster%3C/text%3E%3C/svg%3E';
