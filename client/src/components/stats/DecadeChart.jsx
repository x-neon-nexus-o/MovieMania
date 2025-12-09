import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Color palette for decades
const DECADE_COLORS = {
    '1950s': '#9ca3af',
    '1960s': '#f59e0b',
    '1970s': '#f97316',
    '1980s': '#ef4444',
    '1990s': '#8b5cf6',
    '2000s': '#3b82f6',
    '2010s': '#06b6d4',
    '2020s': '#22c55e'
};

export default function DecadeChart({ data, height = 250 }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No decade data available
            </div>
        );
    }

    const chartData = data.map(item => ({
        ...item,
        fill: DECADE_COLORS[item.decade] || '#6366f1'
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{item.decade}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        🎬 {item.count} movie{item.count !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        ⭐ {item.avgRating} avg rating
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        🕒 {Math.round(item.totalRuntime / 60)}h total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height }}
        >
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                        dataKey="decade"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        className="text-gray-400"
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        className="text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
