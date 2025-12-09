import { useState } from 'react';
import { X, Eye, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPosterUrl, formatDate } from '../../utils/helpers';
import { StarRating } from '../common/StarRating';
import Button from '../common/Button';

export default function MoveToWatchedModal({ isOpen, onClose, item, onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        myRating: 3,
        myReview: '',
        watchedDate: new Date().toISOString().split('T')[0],
        isFavorite: false,
        tags: []
    });
    const [tagInput, setTagInput] = useState('');

    if (!isOpen || !item) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            id: item._id,
            movieData: {
                ...formData,
                watchedDate: new Date(formData.watchedDate)
            }
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim()) && formData.tags.length < 10) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

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
                    className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-start gap-4 p-6 border-b border-gray-200 dark:border-gray-800">
                        <img
                            src={getPosterUrl(item.posterPath, 'small')}
                            alt={item.title}
                            className="w-16 h-24 object-cover rounded-lg shadow"
                        />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Mark as Watched
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 truncate">
                                {item.title} ({item.year})
                            </p>
                            {item.notes && (
                                <p className="text-sm text-gray-500 italic mt-1 line-clamp-1">
                                    Note: {item.notes}
                                </p>
                            )}
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
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Your Rating *
                            </label>
                            <div className="flex items-center gap-4">
                                <StarRating
                                    rating={formData.myRating}
                                    size="lg"
                                    interactive
                                    onRatingChange={(rating) => handleChange('myRating', rating)}
                                />
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formData.myRating.toFixed(1)}
                                </span>
                            </div>
                        </div>

                        {/* Watched Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                When did you watch it?
                            </label>
                            <input
                                type="date"
                                value={formData.watchedDate}
                                onChange={(e) => handleChange('watchedDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Review */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Review (Optional)
                            </label>
                            <textarea
                                value={formData.myReview}
                                onChange={(e) => handleChange('myReview', e.target.value)}
                                placeholder="What did you think of it?"
                                rows={3}
                                maxLength={2000}
                                className="input-field resize-none"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tags (Optional)
                            </label>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type and press Enter to add"
                                className="input-field"
                            />
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-primary-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Favorite Toggle */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleChange('isFavorite', !formData.isFavorite)}
                                className={`p-3 rounded-xl border-2 transition-all ${formData.isFavorite
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <Star
                                    className={`w-5 h-5 ${formData.isFavorite
                                            ? 'text-red-500 fill-red-500'
                                            : 'text-gray-400'
                                        }`}
                                />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Add to favorites
                            </span>
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
                                leftIcon={<Eye className="w-4 h-4" />}
                                className="flex-1"
                            >
                                Mark as Watched
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
