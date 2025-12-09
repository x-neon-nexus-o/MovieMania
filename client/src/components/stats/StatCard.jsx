import { motion } from 'framer-motion';

export default function StatCard({
    icon: Icon,
    label,
    value,
    subValue,
    trend,
    color = 'primary',
    delay = 0
}) {
    const colorClasses = {
        primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
        red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
        gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1 }}
            className="card p-5 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                        {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {label}
                </p>
                {subValue && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {subValue}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
