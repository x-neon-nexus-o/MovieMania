const priorityConfig = {
    high: {
        color: 'bg-red-500',
        textColor: 'text-white',
        icon: '🔥',
        label: 'Must Watch'
    },
    medium: {
        color: 'bg-amber-500',
        textColor: 'text-white',
        icon: '⭐',
        label: 'Want to Watch'
    },
    low: {
        color: 'bg-gray-400',
        textColor: 'text-white',
        icon: '💭',
        label: 'Maybe'
    }
};

export default function PriorityBadge({ priority, showLabel = false, size = 'sm' }) {
    const config = priorityConfig[priority] || priorityConfig.medium;

    const sizeClasses = {
        xs: 'text-xs px-1.5 py-0.5',
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${config.textColor} ${sizeClasses[size]}`}
        >
            <span>{config.icon}</span>
            {showLabel && <span>{config.label}</span>}
        </span>
    );
}

export { priorityConfig };
