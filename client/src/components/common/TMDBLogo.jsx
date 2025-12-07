import { cn } from '../../utils/helpers';

export default function TMDBLogo({ className = '', height = 'h-4', width = 'w-auto' }) {
    return (
        <img
            src="/TMDB Logo.svg"
            alt="The Movie Database (TMDB)"
            className={cn(height, width, className)}
        />
    );
}
