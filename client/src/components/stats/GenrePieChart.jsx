import {
    PieChart as RechartsPie,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

// Color palette for genres
const COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#eab308', '#84cc16',
    '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'
];

export default function GenrePieChart({ data, height = 300 }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No genre data available
            </div>
        );
    }

    // Format data for recharts
    const chartData = data.map((item, index) => ({
        name: item._id,
        value: item.count,
        avgRating: item.avgRating,
        fill: COLORS[index % COLORS.length]
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.value} movie{data.value !== 1 ? 's' : ''}
                    </p>
                    {data.avgRating && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            ★ {data.avgRating.toFixed(1)} avg
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height }}
        >
            <ResponsiveContainer>
                <RechartsPie>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value) => (
                            <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                        )}
                    />
                </RechartsPie>
            </ResponsiveContainer>
        </motion.div>
    );
}
