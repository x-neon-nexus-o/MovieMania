import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileJson, FileSpreadsheet, Loader2, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ExportModal({ isOpen, onClose }) {
    const [format, setFormat] = useState('json');
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await api.get(`/export?format=${format}`, {
                responseType: 'blob'
            });

            // Create download link
            const blob = new Blob([response], {
                type: format === 'csv' ? 'text/csv' : 'application/json'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `moviemania-export-${Date.now()}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setExportComplete(true);
            toast.success(`Movies exported as ${format.toUpperCase()}!`);

            // Reset and close after delay
            setTimeout(() => {
                setExportComplete(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export movies');
        } finally {
            setIsExporting(false);
        }
    };

    if (!isOpen) return null;

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
                    className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                                <Download className="w-5 h-5 text-primary-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Export Movies
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Export your entire movie collection with ratings, reviews, and metadata.
                        </p>

                        {/* Format Selection */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Choose Format
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                {/* JSON Option */}
                                <button
                                    onClick={() => setFormat('json')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${format === 'json'
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <FileJson className={`w-8 h-8 ${format === 'json' ? 'text-primary-600' : 'text-gray-400'
                                        }`} />
                                    <span className={`font-medium ${format === 'json' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        JSON
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Best for backups
                                    </span>
                                </button>

                                {/* CSV Option */}
                                <button
                                    onClick={() => setFormat('csv')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${format === 'csv'
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <FileSpreadsheet className={`w-8 h-8 ${format === 'csv' ? 'text-primary-600' : 'text-gray-400'
                                        }`} />
                                    <span className={`font-medium ${format === 'csv' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        CSV
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        For spreadsheets
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Export Info */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Includes:
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Title, Year, TMDB/IMDB IDs</li>
                                <li>• Your Ratings & Reviews</li>
                                <li>• Watch Dates & Tags</li>
                                <li>• Favorites & Rewatch Counts</li>
                                <li>• Genres & Director Info</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Exporting...
                                </>
                            ) : exportComplete ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Exported!
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Export as {format.toUpperCase()}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
