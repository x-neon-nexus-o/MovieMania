import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Heart, Globe, Lock, Tag, Tv, Play } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { StarRatingInput } from '../common/StarRating';
import { getPosterUrl } from '../../utils/helpers';

const tvShowFormSchema = z.object({
    myRating: z.number().min(0).max(5),
    watchStatus: z.enum(['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch']),
    currentSeason: z.number().min(1).default(1),
    currentEpisode: z.number().min(1).default(1),
    startedDate: z.string().min(1, 'Please select a date'),
    completedDate: z.string().optional(),
    myReview: z.string().max(2000, 'Review cannot exceed 2000 characters').optional(),
    tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
    isFavorite: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    notes: z.string().max(1000).optional(),
});

const watchStatusOptions = [
    { value: 'watching', label: 'Currently Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' },
    { value: 'plan-to-watch', label: 'Plan to Watch' },
];

export default function TVShowForm({
    tvShow, // TMDB TV show data or existing TV show
    onSubmit,
    isLoading,
    isEditing = false,
}) {
    const [tagInput, setTagInput] = useState('');

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(tvShowFormSchema),
        defaultValues: {
            myRating: tvShow?.myRating || 0,
            watchStatus: tvShow?.watchStatus || 'watching',
            currentSeason: tvShow?.currentSeason || 1,
            currentEpisode: tvShow?.currentEpisode || 1,
            startedDate: tvShow?.startedDate
                ? new Date(tvShow.startedDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
            completedDate: tvShow?.completedDate
                ? new Date(tvShow.completedDate).toISOString().split('T')[0]
                : '',
            myReview: tvShow?.myReview || '',
            tags: tvShow?.tags || [],
            isFavorite: tvShow?.isFavorite || false,
            isPublic: tvShow?.isPublic !== false,
            notes: tvShow?.notes || '',
        },
    });

    const tags = watch('tags') || [];
    const isFavorite = watch('isFavorite');
    const isPublic = watch('isPublic');
    const watchStatus = watch('watchStatus');

    const handleAddTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && tags.length < 10 && !tags.includes(tagInput.trim())) {
            setValue('tags', [...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setValue(
            'tags',
            tags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleFormSubmit = (data) => {
        onSubmit({
            ...data,
            tmdbId: tvShow.tmdbId || tvShow.id,
        });
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {/* TV Show Info Preview */}
            <div className="md:col-span-1">
                <div className="sticky top-24">
                    <div className="card overflow-hidden">
                        <img
                            src={getPosterUrl(tvShow.posterPath || tvShow.poster_path)}
                            alt={tvShow.name}
                            className="w-full aspect-poster object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {tvShow.name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {tvShow.year || (tvShow.first_air_date && new Date(tvShow.first_air_date).getFullYear())}
                            </p>
                            {tvShow.numberOfSeasons && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {tvShow.numberOfSeasons} Seasons • {tvShow.numberOfEpisodes} Episodes
                                </p>
                            )}
                            {tvShow.overview && (
                                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                                    {tvShow.overview}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Your Rating *
                        </label>
                        <Controller
                            name="myRating"
                            control={control}
                            render={({ field }) => (
                                <StarRatingInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    maxStars={5}
                                    allowHalf={true}
                                />
                            )}
                        />
                        {errors.myRating && (
                            <p className="mt-1.5 text-sm text-red-500">{errors.myRating.message}</p>
                        )}
                    </div>

                    {/* Watch Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Watch Status *
                        </label>
                        <select
                            className="input"
                            {...register('watchStatus')}
                        >
                            {watchStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Season/Episode Progress */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Current Season
                            </label>
                            <div className="relative">
                                <Tv className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    min="1"
                                    max={tvShow.numberOfSeasons || 100}
                                    className="input pl-10"
                                    {...register('currentSeason', { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Current Episode
                            </label>
                            <div className="relative">
                                <Play className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    min="1"
                                    className="input pl-10"
                                    {...register('currentEpisode', { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Started Date */}
                    <Input
                        label="Date Started *"
                        type="date"
                        leftIcon={<Calendar className="w-5 h-5" />}
                        error={errors.startedDate?.message}
                        {...register('startedDate')}
                    />

                    {/* Completed Date (shown only if status is completed) */}
                    {watchStatus === 'completed' && (
                        <Input
                            label="Date Completed"
                            type="date"
                            leftIcon={<Calendar className="w-5 h-5" />}
                            error={errors.completedDate?.message}
                            {...register('completedDate')}
                        />
                    )}

                    {/* Review */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Your Review
                        </label>
                        <textarea
                            rows={4}
                            placeholder="What did you think about this TV show?"
                            className="input resize-none"
                            {...register('myReview')}
                        />
                        {errors.myReview && (
                            <p className="mt-1.5 text-sm text-red-500">{errors.myReview.message}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Add a tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                                    leftIcon={<Tag className="w-5 h-5" />}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleAddTag}
                                disabled={!tagInput.trim() || tags.length >= 10}
                            >
                                Add
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="mt-1 text-sm text-gray-500">{tags.length}/10 tags</p>
                    </div>

                    {/* Private Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Private Notes
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Personal notes (only visible to you)"
                            className="input resize-none"
                            {...register('notes')}
                        />
                    </div>

                    {/* Options */}
                    <div className="flex flex-wrap gap-4">
                        {/* Favorite Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only"
                                {...register('isFavorite')}
                            />
                            <div
                                className={`p-2 rounded-lg transition-colors ${isFavorite
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Add to Favorites
                            </span>
                        </label>

                        {/* Public Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only"
                                {...register('isPublic')}
                            />
                            <div
                                className={`p-2 rounded-lg transition-colors ${isPublic
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-500'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                    }`}
                            >
                                {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isPublic ? 'Public' : 'Private'}
                            </span>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                            {isEditing ? 'Update TV Show' : 'Add to Collection'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
