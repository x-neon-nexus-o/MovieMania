import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Color intensity based on movie count
const getIntensity = (count, max) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = Math.min(count / max, 1);
    if (intensity < 0.25) return 'bg-primary-200 dark:bg-primary-900';
    if (intensity < 0.5) return 'bg-primary-400 dark:bg-primary-700';
    if (intensity < 0.75) return 'bg-primary-600 dark:bg-primary-500';
    return 'bg-primary-700 dark:bg-primary-400';
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HeatmapChart({ data, year }) {
    const { weeks, maxCount } = useMemo(() => {
        if (!data || Object.keys(data).length === 0) {
            return { weeks: [], maxCount: 1 };
        }

        // Generate all dates for the year
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        // Find max count for intensity calculation
        const maxCount = Math.max(1, ...Object.values(data).map(d => d.count));

        const weeks = [];
        let currentWeek = [];

        // Pad the first week with empty cells
        const firstDayOfWeek = startDate.getDay();
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push(null);
        }

        // Generate each day
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayData = data[dateStr] || { count: 0 };

            currentWeek.push({
                date: dateStr,
                count: dayData.count,
                avgRating: dayData.avgRating,
                day: currentDate.getDate(),
                month: currentDate.getMonth()
            });

            if (currentDate.getDay() === 6) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Add remaining days
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return { weeks, maxCount };
    }, [data, year]);

    if (weeks.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                No activity data for {year}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto"
        >
            {/* Month labels */}
            <div className="flex mb-2 ml-8">
                {MONTHS.map((month, i) => (
                    <div
                        key={month}
                        className="text-xs text-gray-500 dark:text-gray-400"
                        style={{ width: `${100 / 12}%`, minWidth: 30 }}
                    >
                        {month}
                    </div>
                ))}
            </div>

            <div className="flex gap-0.5">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 mr-2">
                    {DAYS.map((day, i) => (
                        <div
                            key={day}
                            className="h-3 w-6 text-xs text-gray-500 dark:text-gray-400 flex items-center"
                        >
                            {i % 2 === 1 ? day.slice(0, 1) : ''}
                        </div>
                    ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex gap-0.5">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-0.5">
                            {week.map((day, dayIndex) => (
                                day === null ? (
                                    <div key={dayIndex} className="w-3 h-3" />
                                ) : (
                                    <motion.div
                                        key={day.date}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: weekIndex * 0.01 }}
                                        className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${getIntensity(day.count, maxCount)}`}
                                        title={`${day.date}: ${day.count} movie${day.count !== 1 ? 's' : ''}${day.avgRating ? ` (★${day.avgRating})` : ''}`}
                                    />
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
                <div className="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-900" />
                <div className="w-3 h-3 rounded-sm bg-primary-400 dark:bg-primary-700" />
                <div className="w-3 h-3 rounded-sm bg-primary-600 dark:bg-primary-500" />
                <div className="w-3 h-3 rounded-sm bg-primary-700 dark:bg-primary-400" />
                <span>More</span>
            </div>
        </motion.div>
    );
}
