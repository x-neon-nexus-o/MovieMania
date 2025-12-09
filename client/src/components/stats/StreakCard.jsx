import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, TrendingUp } from 'lucide-react';

export default function StreakCard({ data }) {
    if (!data) return null;

    const streakItems = [
        {
            icon: Flame,
            label: 'Current Streak',
            value: data.currentStreak,
            suffix: 'weeks',
            color: data.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400',
            bgColor: data.currentStreak > 0 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'
        },
        {
            icon: Trophy,
            label: 'Longest Streak',
            value: data.longestStreak,
            suffix: 'weeks',
            color: 'text-amber-500',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30'
        },
        {
            icon: TrendingUp,
            label: 'Avg Per Month',
            value: data.avgMoviesPerMonth,
            suffix: 'movies',
            color: 'text-blue-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            icon: Zap,
            label: 'Last Watch',
            value: data.daysSinceLastWatch,
            suffix: data.daysSinceLastWatch === 1 ? 'day ago' : 'days ago',
            color: data.daysSinceLastWatch <= 7 ? 'text-green-500' : 'text-gray-400',
            bgColor: data.daysSinceLastWatch <= 7 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
        >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Watching Streaks
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {streakItems.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                    >
                        <div className={`inline-flex p-3 rounded-xl ${item.bgColor} mb-2`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {item.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.suffix}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {item.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
