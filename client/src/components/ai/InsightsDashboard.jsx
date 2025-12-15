import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Flame, Clock, Heart, Zap, Brain, Loader2 } from 'lucide-react';
import aiService from '../../services/aiService';
import Button from '../common/Button';

// Icon mapping
const ICONS = {
    Trophy, Flame, Clock, Heart, Zap, Brain
};

export default function InsightsDashboard() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const result = await aiService.getAutoInsights();
                setData(result);
            } catch (err) {
                setError('Failed to load insights');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return null; // Fail silently for dashboard widgets usually
    }

    if (!data?.ready) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                    <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Unlock AI Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                    {data?.message || "Rate at least 5 movies to get personalized AI insights about your viewing habits!"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Viewing DNA
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.insights.map((insight, index) => {
                    const Icon = ICONS[insight.icon] || Sparkles;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {insight.type === 'stat' ? 'Stat' : 'Fun Fact'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {insight.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {insight.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
