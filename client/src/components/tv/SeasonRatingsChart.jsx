import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SeasonRatingsChart({ analytics, isLoading }) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="animate-spin text-primary-500" size={32} />
                </div>
            </div>
        );
    }

    const data = analytics?.seasonAverages?.map((season) => ({
        name: `Season ${season.seasonNumber}`,
        rating: parseFloat(season.averageRating.toFixed(2)),
        episodes: season.episodeCount,
    })) || [];

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Season Ratings Overview
                </h3>
                <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
                    No season data available
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
                    <p className="font-semibold">{label}</p>
                    <p className="text-primary-400">Rating: {payload[0].value.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">{payload[0].payload.episodes} episodes</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Season Ratings Overview
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                        domain={[0, 10]}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        axisLine={{ stroke: '#4B5563' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                        dataKey="rating"
                        fill="url(#colorGradient)"
                        name="Average Rating"
                        radius={[8, 8, 0, 0]}
                    />
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
