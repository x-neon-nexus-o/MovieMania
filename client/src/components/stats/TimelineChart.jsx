import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TimelineChart({ data, height = 300 }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No timeline data available
            </div>
        );
    }

    // Format data for recharts and reverse (oldest to newest)
    const chartData = data
        .map(item => ({
            date: `${MONTHS[item._id.month - 1]} ${item._id.year}`,
            count: item.count,
            avgRating: Math.round(item.avgRating * 10) / 10,
            month: item._id.month,
            year: item._id.year
        }))
        .reverse();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                        🎬 {item.count} movie{item.count !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        ⭐ {item.avgRating} avg rating
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
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        className="text-gray-400"
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        className="text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
