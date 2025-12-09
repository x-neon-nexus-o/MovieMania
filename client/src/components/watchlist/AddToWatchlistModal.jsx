import { useState } from 'react';
import { X, Bookmark, Calendar, MessageSquare, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPosterUrl } from '../../utils/helpers';
import Button from '../common/Button';

const sourceOptions = [
    { value: 'friend', label: 'Friend Recommendation' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'trailer', label: 'Saw Trailer' },
    { value: 'article', label: 'Article/Review' },
    { value: 'recommendation', label: 'Algorithm Recommendation' },
    { value: 'other', label: 'Other' },
];

export default function AddToWatchlistModal({ isOpen, onClose, movie, onAdd, isLoading }) {
    const [formData, setFormData] = useState({
        priority: 'medium',
        notes: '',
        source: 'other',
        recommendedBy: '',
        targetWatchDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            tmdbId: movie.tmdbId || movie.id,
            ...formData,
            targetWatchDate: formData.targetWatchDate || null
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen || !movie) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-start gap-4 p-6 border-b border-gray-200 dark:border-gray-800">
                        <img
                            src={getPosterUrl(movie.posterPath || movie.poster_path, 'small')}
                            alt={movie.title}
                            className="w-16 h-24 object-cover rounded-lg shadow"
                        />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                Add to Watchlist
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 truncate">
                                {movie.title} ({movie.year || new Date(movie.release_date).getFullYear()})
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority Level
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'high', label: '🔥 Must Watch', color: 'red' },
                                    { value: 'medium', label: '⭐ Want to Watch', color: 'amber' },
                                    { value: 'low', label: '💭 Maybe', color: 'gray' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleChange('priority', option.value)}
                                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.priority === option.value
                                                ? option.value === 'high'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                    : option.value === 'medium'
                                                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                                        : 'border-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <MessageSquare className="w-4 h-4 inline mr-1" />
                                Notes (Optional)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                placeholder="Why do you want to watch this?"
                                rows={2}
                                maxLength={500}
                                className="input-field resize-none"
                            />
                        </div>

                        {/* Source and Recommended By */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    How did you hear about it?
                                </label>
                                <select
                                    value={formData.source}
                                    onChange={(e) => handleChange('source', e.target.value)}
                                    className="input-field"
                                >
                                    {sourceOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.source === 'friend' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        Recommended By
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.recommendedBy}
                                        onChange={(e) => handleChange('recommendedBy', e.target.value)}
                                        placeholder="Friend's name"
                                        className="input-field"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Target Watch Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Watch By (Optional)
                            </label>
                            <input
                                type="date"
                                value={formData.targetWatchDate}
                                onChange={(e) => handleChange('targetWatchDate', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="input-field"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                leftIcon={<Bookmark className="w-4 h-4" />}
                                className="flex-1"
                            >
                                Add to Watchlist
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
