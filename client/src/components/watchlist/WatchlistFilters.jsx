import { Filter, SortAsc, SortDesc } from 'lucide-react';

const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: '🔥 High' },
    { value: 'medium', label: '⭐ Medium' },
    { value: 'low', label: '💭 Low' },
];

const sortOptions = [
    { value: 'createdAt', label: 'Date Added' },
    { value: 'targetWatchDate', label: 'Watch By Date' },
    { value: 'title', label: 'Title' },
    { value: 'year', label: 'Release Year' },
    { value: 'priority', label: 'Priority' },
];

export default function WatchlistFilters({ filters, onChange }) {
    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    const toggleOrder = () => {
        handleChange('order', filters.order === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Priority Filter */}
            <div className="relative">
                <select
                    value={filters.priority || ''}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                >
                    {priorityOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Sort By */}
            <div className="relative">
                <select
                    value={filters.sort || 'createdAt'}
                    onChange={(e) => handleChange('sort', e.target.value)}
                    className="appearance-none pr-8 py-2.5 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            Sort by: {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort Order Toggle */}
            <button
                onClick={toggleOrder}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title={filters.order === 'asc' ? 'Ascending' : 'Descending'}
            >
                {filters.order === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                ) : (
                    <SortDesc className="w-4 h-4" />
                )}
            </button>

            {/* Clear Filters */}
            {(filters.priority || filters.sort !== 'createdAt' || filters.order !== 'desc') && (
                <button
                    onClick={() => onChange({ priority: '', sort: 'createdAt', order: 'desc' })}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}
