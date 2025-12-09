import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCollections, useCreateCollection, useCollectionTemplates } from '../hooks/useCollections';
import { PageLoader } from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import CollectionCard from '../components/collections/CollectionCard';
import CreateCollectionModal from '../components/collections/CreateCollectionModal';

export default function CollectionsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, isLoading, error } = useCollections();
    const { data: templatesData } = useCollectionTemplates();
    const createCollection = useCreateCollection();

    const collections = data?.collections || [];
    const templates = templatesData?.templates || [];

    const handleCreate = async (formData) => {
        try {
            await createCollection.mutateAsync(formData);
            toast.success('Collection created!');
            setIsCreateModalOpen(false);
        } catch (error) {
            toast.error(error.message || 'Failed to create collection');
        }
    };

    const handleCreateFromTemplate = async (template) => {
        try {
            await createCollection.mutateAsync({
                name: template.name,
                description: template.description,
                emoji: template.emoji,
                color: template.color,
                type: 'smart',
                smartRules: template.smartRules
            });
            toast.success(`Created "${template.name}" collection!`);
        } catch (error) {
            toast.error(error.message || 'Failed to create collection');
        }
    };

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                            <FolderOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                            My Collections
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Organize your movies into custom collections
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        leftIcon={<Plus className="w-5 h-5" />}
                    >
                        New Collection
                    </Button>
                </motion.div>
            </div>

            {/* Collections Grid */}
            {collections.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                        <FolderOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No collections yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Create collections to organize your movies by theme, genre, mood, or any way you like!
                    </p>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        leftIcon={<Plus className="w-5 h-5" />}
                    >
                        Create Your First Collection
                    </Button>

                    {/* Templates */}
                    {templates.length > 0 && (
                        <div className="mt-12">
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Quick Start Templates
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                                {templates.slice(0, 4).map((template) => (
                                    <button
                                        key={template.name}
                                        onClick={() => handleCreateFromTemplate(template)}
                                        className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-left"
                                    >
                                        <span className="text-2xl">{template.emoji}</span>
                                        <p className="font-medium text-gray-900 dark:text-white mt-2">
                                            {template.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {template.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {collections.map((collection, index) => (
                        <CollectionCard
                            key={collection._id}
                            collection={collection}
                            index={index}
                        />
                    ))}

                    {/* Create New Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: collections.length * 0.05 }}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-full min-h-[200px] card flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
                    >
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </div>
                        <span className="font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            New Collection
                        </span>
                    </motion.button>
                </div>
            )}

            {/* Create Modal */}
            <CreateCollectionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
                isLoading={createCollection.isPending}
            />
        </div>
    );
}
