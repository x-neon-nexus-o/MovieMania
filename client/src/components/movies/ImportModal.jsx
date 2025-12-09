import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileUp, Loader2, CheckCircle, AlertCircle, Film } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ImportModal({ isOpen, onClose, onSuccess }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [skipDuplicates, setSkipDuplicates] = useState(true);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.json'))) {
            setFile(droppedFile);
            setResults(null);
        } else {
            toast.error('Please upload a CSV or JSON file');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResults(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setIsImporting(true);
        setResults(null);

        try {
            const csvData = await file.text();

            const response = await api.post('/import', {
                csvData,
                skipDuplicates
            });

            setResults(response.data);

            if (response.data.imported > 0) {
                toast.success(`Imported ${response.data.imported} movies!`);
                onSuccess?.();
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error(error.message || 'Failed to import movies');
        } finally {
            setIsImporting(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setResults(null);
        onClose();
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
                    onClick={handleClose}
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
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
                                <Upload className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Import Movies
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {!results ? (
                            <>
                                {/* Drop Zone */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : file
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.json"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {file ? (
                                        <div className="space-y-2">
                                            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <FileUp className="w-12 h-12 mx-auto text-gray-400" />
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Drop your file here
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                or click to browse
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Options */}
                                <div className="mt-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={skipDuplicates}
                                            onChange={(e) => setSkipDuplicates(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Skip movies already in my collection
                                        </span>
                                    </label>
                                </div>

                                {/* Supported Formats */}
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Supported Sources:
                                    </h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>• <strong>Letterboxd</strong> - diary.csv or watchlist.csv</li>
                                        <li>• <strong>IMDb</strong> - ratings.csv export</li>
                                        <li>• <strong>MovieMania</strong> - your previous export</li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            /* Results */
                            <div className="space-y-4">
                                <div className="text-center py-4">
                                    {results.imported > 0 ? (
                                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                                    ) : (
                                        <AlertCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
                                    )}
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Import Complete
                                    </h3>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                        <p className="text-2xl font-bold text-green-600">{results.imported}</p>
                                        <p className="text-xs text-gray-500">Imported</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{results.skipped}</p>
                                        <p className="text-xs text-gray-500">Skipped</p>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                        <p className="text-2xl font-bold text-red-600">{results.failed}</p>
                                        <p className="text-xs text-gray-500">Failed</p>
                                    </div>
                                </div>

                                {results.errors && results.errors.length > 0 && (
                                    <div className="max-h-32 overflow-y-auto p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                                            Errors:
                                        </p>
                                        <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                                            {results.errors.slice(0, 5).map((err, idx) => (
                                                <li key={idx}>• {err.title}: {err.error}</li>
                                            ))}
                                            {results.errors.length > 5 && (
                                                <li>... and {results.errors.length - 5} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                        {!results ? (
                            <button
                                onClick={handleImport}
                                disabled={!file || isImporting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Importing... (this may take a while)
                                    </>
                                ) : (
                                    <>
                                        <Film className="w-5 h-5" />
                                        Import Movies
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleClose}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                            >
                                Done
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
