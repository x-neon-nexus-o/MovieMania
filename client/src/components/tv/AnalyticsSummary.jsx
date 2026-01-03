import { TrendingUp, TrendingDown, Minus, Star, Film, Award, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsSummary({ analytics }) {
    if (!analytics) return null;

    const getTrendIcon = () => {
        switch (analytics.trend) {
            case 'improving':
                return <TrendingUp className="text-emerald-500" size={24} />;
            case 'declining':
                return <TrendingDown className="text-red-500" size={24} />;
            default:
                return <Minus className="text-yellow-500" size={24} />;
        }
    };

    const getTrendLabel = () => {
        switch (analytics.trend) {
            case 'improving':
                return { text: 'Improving', color: 'text-emerald-500' };
            case 'declining':
                return { text: 'Declining', color: 'text-red-500' };
            default:
                return { text: 'Stable', color: 'text-yellow-500' };
        }
    };

    const trendInfo = getTrendLabel();

    const cards = [
        {
            icon: <Film className="text-primary-500" size={24} />,
            label: 'Total Episodes',
            value: analytics.totalEpisodes,
            subtext: null,
        },
        {
            icon: <Star className="text-yellow-500" size={24} />,
            label: 'Average Rating',
            value: analytics.averageRating,
            subtext: '/10',
        },
        {
            icon: <Award className="text-emerald-500" size={24} />,
            label: 'Best Episode',
            value: `S${analytics.bestEpisode.season}E${analytics.bestEpisode.episode}`,
            subtext: analytics.bestEpisode.name,
            extra: `★ ${analytics.bestEpisode.rating.toFixed(1)}`,
        },
        {
            icon: getTrendIcon(),
            label: 'Quality Trend',
            value: trendInfo.text,
            valueClass: trendInfo.color,
            subtext: null,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {card.label}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <p className={`text-3xl font-bold ${card.valueClass || 'text-gray-900 dark:text-white'}`}>
                                    {card.value}
                                </p>
                                {card.subtext && !card.extra && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {card.subtext}
                                    </span>
                                )}
                            </div>
                            {card.subtext && card.extra && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[150px]">
                                    {card.subtext}
                                </p>
                            )}
                            {card.extra && (
                                <p className="text-sm font-bold text-yellow-500 mt-1">
                                    {card.extra}
                                </p>
                            )}
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {card.icon}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
