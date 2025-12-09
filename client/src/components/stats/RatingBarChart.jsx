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

// Rating color scale (bad to good)
const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#22c55e'; // green
    if (rating >= 4) return '#84cc16';   // lime
    if (rating >= 3.5) return '#eab308'; // yellow
    if (rating >= 3) return '#f97316';   // orange
    if (rating >= 2) return '#ef4444';   // red
    return '#dc2626'; // dark red
};

export default function RatingBarChart({ data, height = 250 }) {
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No rating data available
            </div>
        );
    }

    // Format data for recharts - create array of all possible ratings
    const chartData = [];
    for (let r = 0.5; r <= 5; r += 0.5) {
        chartData.push({
            rating: r.toFixed(1),
            count: data[r] || 0,
            fill: getRatingColor(r)
        });
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">
                        ⭐ {item.rating} stars
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.count} movie{item.count !== 1 ? 's' : ''}
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
                        dataKey="rating"
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
