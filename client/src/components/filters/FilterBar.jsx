import { useState } from 'react';
import { Search, SlidersHorizontal, X, Star, Calendar, Tag, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import { cn } from '../../utils/helpers';
import { SORT_OPTIONS } from '../../utils/constants';

export default function FilterBar({
    filters,
    onFilterChange,
    tags = [],
    showFilters = true,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            minRating: '',
            maxRating: '',
            yearMin: '',
            yearMax: '',
            tags: '',
            isFavorite: '',
            sort: 'watchedDate',
            order: 'desc',
        });
    };

    const hasActiveFilters =
        filters.minRating ||
        filters.maxRating ||
        filters.yearMin ||
        filters.yearMax ||
        filters.tags ||
        filters.isFavorite;

    return (
        <div className="space-y-4">
            {/* Search and Toggle Row */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        placeholder="Search movies..."
                        value={filters.search || ''}
                        onChange={(e) => handleChange('search', e.target.value)}
                        leftIcon={<Search className="w-5 h-5" />}
                        rightIcon={
                            filters.search && (
                                <button onClick={() => handleChange('search', '')}>
                                    <X className="w-5 h-5" />
                                </button>
                            )
                        }
                    />
                </div>

                {showFilters && (
                    <Button
                        variant={isExpanded || hasActiveFilters ? 'primary' : 'secondary'}
                        onClick={() => setIsExpanded(!isExpanded)}
                        leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                    >
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1.5 w-2 h-2 rounded-full bg-white" />
                        )}
                    </Button>
                )}
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
                {isExpanded && showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="card p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Rating Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Rating Range
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            min="0"
                                            max="5"
                                            step="0.5"
                                            value={filters.minRating || ''}
                                            onChange={(e) => handleChange('minRating', e.target.value)}
                                            leftIcon={<Star className="w-4 h-4" />}
                                        />
                                        <span className="text-gray-400">-</span>
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            min="0"
                                            max="5"
                                            step="0.5"
                                            value={filters.maxRating || ''}
                                            onChange={(e) => handleChange('maxRating', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Year Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Year Range
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="From"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            value={filters.yearMin || ''}
                                            onChange={(e) => handleChange('yearMin', e.target.value)}
                                            leftIcon={<Calendar className="w-4 h-4" />}
                                        />
                                        <span className="text-gray-400">-</span>
                                        <Input
                                            type="number"
                                            placeholder="To"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            value={filters.yearMax || ''}
                                            onChange={(e) => handleChange('yearMax', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sort || 'watchedDate'}
                                        onChange={(e) => handleChange('sort', e.target.value)}
                                        className="input"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Order
                                    </label>
                                    <select
                                        value={filters.order || 'desc'}
                                        onChange={(e) => handleChange('order', e.target.value)}
                                        className="input"
                                    >
                                        <option value="desc">Descending</option>
                                        <option value="asc">Ascending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    const currentTags = filters.tags ? filters.tags.split(',') : [];
                                                    const newTags = currentTags.includes(tag)
                                                        ? currentTags.filter((t) => t !== tag)
                                                        : [...currentTags, tag];
                                                    handleChange('tags', newTags.filter(Boolean).join(','));
                                                }}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                                    filters.tags?.split(',').includes(tag)
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Filters */}
                            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() =>
                                        handleChange('isFavorite', filters.isFavorite === 'true' ? '' : 'true')
                                    }
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                                        filters.isFavorite === 'true'
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    )}
                                >
                                    <Heart className={cn('w-4 h-4', filters.isFavorite === 'true' && 'fill-current')} />
                                    Favorites Only
                                </button>

                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
