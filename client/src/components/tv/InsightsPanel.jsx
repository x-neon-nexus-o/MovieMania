import { Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import aiService from '../../services/aiService';

export default function InsightsPanel({ analytics, showName }) {
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateInsights = useCallback(async () => {
        if (!analytics) return;

        setIsLoading(true);
        setError(null);

        try {
            const prompt = `Analyze these TV show analytics for "${showName || 'this show'}" and provide 3 key insights in a concise format:

Total Episodes: ${analytics.totalEpisodes}
Average Rating: ${analytics.averageRating}/10
Best Episode: S${analytics.bestEpisode.season}E${analytics.bestEpisode.episode} - "${analytics.bestEpisode.name}" (${analytics.bestEpisode.rating})
Worst Episode: S${analytics.worstEpisode.season}E${analytics.worstEpisode.episode} - "${analytics.worstEpisode.name}" (${analytics.worstEpisode.rating})
Quality Trend: ${analytics.trend}

Season Averages:
${analytics.seasonAverages?.map(s => `Season ${s.seasonNumber}: ${s.averageRating.toFixed(2)}/10`).join('\n')}

Provide insights about:
1. Overall quality and consistency
2. Best/worst performing seasons
3. Notable patterns or trends

Be concise and actionable. Use bullet points.`;

            const response = await aiService.generateContent(prompt);
            setInsights(response);
        } catch (err) {
            console.error('Error generating insights:', err);
            setError('Failed to generate insights. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [analytics, showName]);

    useEffect(() => {
        if (analytics && !insights) {
            generateInsights();
        }
    }, [analytics, insights, generateInsights]);

    if (!analytics) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/30 dark:to-indigo-900/30 rounded-xl p-6 shadow-lg border border-primary-200 dark:border-primary-800"
        >
            <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-400/20 rounded-lg flex-shrink-0">
                    <Lightbulb className="text-yellow-500" size={24} />
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            AI Insights
                        </h3>
                        <button
                            onClick={generateInsights}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? 'Generating...' : 'Regenerate'}
                        </button>
                    </div>

                    {isLoading && !insights && (
                        <div className="flex items-center gap-3 py-8">
                            <Loader2 className="animate-spin text-primary-500" size={24} />
                            <p className="text-gray-600 dark:text-gray-400">Generating AI insights...</p>
                        </div>
                    )}

                    {error && (
                        <div className="py-4 text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {insights && (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {insights}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
