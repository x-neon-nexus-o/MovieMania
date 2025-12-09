import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Twitter, Facebook, Link2, Check, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Social sharing button with dropdown for multiple platforms
 */
export default function ShareButton({
    title,
    url,
    description = '',
    image = '',
    variant = 'default' // 'default' | 'icon'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = url || window.location.href;
    const shareText = description || `Check out "${title}" on MovieMania! 🎬`;

    const shareLinks = [
        {
            name: 'Twitter / X',
            icon: Twitter,
            color: 'hover:bg-black hover:text-white',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'hover:bg-blue-600 hover:text-white',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'hover:bg-green-500 hover:text-white',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        }
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => {
                setCopied(false);
                setIsOpen(false);
            }, 1500);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const handleShare = (link) => {
        window.open(link.url, '_blank', 'width=600,height=400');
        setIsOpen(false);
    };

    // Native share API for mobile
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: shareText,
                    url: shareUrl
                });
                setIsOpen(false);
            } catch (err) {
                // User cancelled or error
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            {variant === 'icon' ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Share"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            )}

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 z-50 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Share "{title?.slice(0, 20)}{title?.length > 20 ? '...' : ''}"
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Share Options */}
                            <div className="p-2">
                                {/* Native Share (mobile) */}
                                {navigator.share && (
                                    <button
                                        onClick={handleNativeShare}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        <span className="text-sm">Share via...</span>
                                    </button>
                                )}

                                {/* Social Links */}
                                {shareLinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => handleShare(link)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors ${link.color}`}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span className="text-sm">{link.name}</span>
                                    </button>
                                ))}

                                {/* Divider */}
                                <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

                                {/* Copy Link */}
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5 text-green-500" />
                                            <span className="text-sm text-green-600">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Link2 className="w-5 h-5" />
                                            <span className="text-sm">Copy Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
