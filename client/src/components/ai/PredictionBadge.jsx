import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Percent, Star, Loader2, Info } from 'lucide-react';
import aiService from '../../services/aiService';

export default function PredictionBadge({ tmdbId, type = 'movie', showMatch = true, showRating = true }) {
    const [prediction, setPrediction] = useState(null);
    const [match, setMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const promises = [];
                if (showRating) promises.push(aiService.predictRating(tmdbId, type));
                if (showMatch) promises.push(aiService.getTasteMatch(tmdbId, type));

                const results = await Promise.allSettled(promises);

                if (isMounted) {
                    if (showRating && results[0].status === 'fulfilled') {
                        setPrediction(results[0].value);
                    }
                    if (showMatch) {
                        const matchIndex = showRating ? 1 : 0;
                        if (results[matchIndex]?.status === 'fulfilled') {
                            setMatch(results[matchIndex].value);
                        }
                    }
                }
            } catch (error) {
                console.error('Prediction load error', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (tmdbId) fetchData();

        return () => { isMounted = false; };
    }, [tmdbId, type, showMatch, showRating]);

    if (!prediction && !match && !isLoading) return null;

    return (
        <div className="flex items-center gap-2">
            {isLoading ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20">
                    <Loader2 className="w-3 h-3 text-primary-500 animate-spin" />
                    <span className="text-xs text-primary-600 dark:text-primary-400">AI Analyzing...</span>
                </div>
            ) : (
                <div
                    className="relative group cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <div className="flex items-center gap-2">
                        {match && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${match.matchPercentage >= 80
                                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                                        : match.matchPercentage >= 50
                                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800'
                                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                                    }`}
                            >
                                <Percent className="w-3 h-3" />
                                {match.matchPercentage}% Match
                            </motion.div>
                        )}

                        {prediction && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 text-xs font-medium"
                            >
                                <Brain className="w-3 h-3" />
                                Predicted: {prediction.predictedRating.toFixed(1)}
                            </motion.div>
                        )}
                    </div>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 text-left pointer-events-none"
                            >
                                <div className="space-y-2">
                                    {match && (
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                                Based on your taste
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                                                Matches your love for {match.factors?.join(', ')}
                                            </p>
                                        </div>
                                    )}
                                    {prediction && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    AI Prediction
                                                </div>
                                                <div className="text-xs text-primary-500 font-medium">
                                                    {(prediction.confidence * 100).toFixed(0)}% Confidence
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                                                {prediction.reasoning}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute left-4 bottom-[-6px] w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 transform rotate-45"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
