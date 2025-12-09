import { useState } from 'react';
import { X, Palette, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const EMOJI_OPTIONS = ['🎬', '❤️', '⭐', '🚀', '👻', '😂', '🎞️', '📼', '🎭', '🏆', '🌟', '💎', '🔥', '🎪', '🌙', '🎯'];
const COLOR_OPTIONS = ['#6366f1', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#78716c'];

export default function CreateCollectionModal({ isOpen, onClose, onSubmit, isLoading }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [emoji, setEmoji] = useState('🎬');
    const [color, setColor] = useState('#6366f1');
    const [isPublic, setIsPublic] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [showColors, setShowColors] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSubmit({
            name: name.trim(),
            description: description.trim(),
            emoji,
            color,
            isPublic
        });
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setEmoji('🎬');
        setColor('#6366f1');
        setIsPublic(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create Collection" size="md">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name and Emoji */}
                <div className="flex gap-3">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojis(!showEmojis)}
                            className="w-14 h-14 text-2xl rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors flex items-center justify-center"
                            style={{ backgroundColor: color + '20' }}
                        >
                            {emoji}
                        </button>

                        {showEmojis && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-16 left-0 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 grid grid-cols-4 gap-2"
                            >
                                {EMOJI_OPTIONS.map((e) => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => {
                                            setEmoji(e);
                                            setShowEmojis(false);
                                        }}
                                        className={`w-10 h-10 text-xl rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${emoji === e ? 'bg-primary-100 dark:bg-primary-900/30' : ''
                                            }`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <div className="flex-1">
                        <Input
                            placeholder="Collection name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                            required
                            autoFocus
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <textarea
                        placeholder="Add a description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:outline-none focus:border-primary-500 resize-none text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>

                {/* Color Picker */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Theme Color
                    </label>
                    <div className="flex gap-2 mt-2">
                        {COLOR_OPTIONS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                                    }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                {/* Public Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${isPublic ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
                        }`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isPublic ? 'translate-x-5' : ''
                            }`} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Make this collection public
                    </span>
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={!name.trim() || isLoading}
                        className="flex-1"
                    >
                        Create Collection
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
