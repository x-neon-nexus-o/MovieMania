import { useState } from 'react';
import { Check, Plus, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCollections, useAddMovieToCollection, useCreateCollection } from '../../hooks/useCollections';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function AddToCollectionModal({ isOpen, onClose, movieId, movieTitle }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const { data, isLoading } = useCollections();
    const addToCollection = useAddMovieToCollection();
    const createCollection = useCreateCollection();

    const collections = data?.collections || [];

    const handleAddToCollection = async (collectionId, collectionName) => {
        try {
            await addToCollection.mutateAsync({ collectionId, movieId });
            toast.success(`Added to ${collectionName}`);
            onClose();
        } catch (error) {
            if (error.message?.includes('already in collection')) {
                toast.error('Already in this collection');
            } else {
                toast.error('Failed to add to collection');
            }
        }
    };

    const handleCreateAndAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            const result = await createCollection.mutateAsync({ name: newName.trim() });
            await addToCollection.mutateAsync({
                collectionId: result.collection._id,
                movieId
            });
            toast.success(`Created "${newName}" and added movie`);
            setNewName('');
            setIsCreating(false);
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to create collection');
        }
    };

    // Check if movie is in each collection
    const isInCollection = (collection) => {
        return collection.movies?.some(m =>
            m.movie?._id === movieId || m.movie === movieId
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add to Collection" size="sm">
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add "{movieTitle}" to a collection
                </p>

                {/* Collections List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">Loading...</div>
                    ) : collections.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            No collections yet. Create one below!
                        </div>
                    ) : (
                        <AnimatePresence>
                            {collections.map((collection) => {
                                const inCollection = isInCollection(collection);
                                return (
                                    <motion.button
                                        key={collection._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={() => !inCollection && handleAddToCollection(collection._id, collection.name)}
                                        disabled={inCollection || addToCollection.isPending}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${inCollection
                                                ? 'bg-primary-50 dark:bg-primary-900/20 cursor-default'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                            style={{ backgroundColor: collection.color + '20' }}
                                        >
                                            {collection.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {collection.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {collection.movieCount || collection.movies?.length || 0} movies
                                            </p>
                                        </div>
                                        {inCollection && (
                                            <Check className="w-5 h-5 text-primary-500" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
                    </div>
                </div>

                {/* Create New */}
                {isCreating ? (
                    <form onSubmit={handleCreateAndAdd} className="flex gap-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="New collection name"
                            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            autoFocus
                            maxLength={100}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            isLoading={createCollection.isPending}
                            disabled={!newName.trim()}
                        >
                            Create
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsCreating(false);
                                setNewName('');
                            }}
                        >
                            Cancel
                        </Button>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        <FolderPlus className="w-5 h-5" />
                        <span className="font-medium">Create new collection</span>
                    </button>
                )}
            </div>
        </Modal>
    );
}
