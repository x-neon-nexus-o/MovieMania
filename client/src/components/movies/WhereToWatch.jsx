import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tv, ShoppingCart, DollarSign, ExternalLink, Globe, ChevronDown } from 'lucide-react';
import api from '../../services/api';

const REGIONS = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' }
];

export default function WhereToWatch({ tmdbId }) {
    const [region, setRegion] = useState('IN'); // Default to India
    const [showRegionPicker, setShowRegionPicker] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['watch-providers', tmdbId, region],
        queryFn: async () => {
            // axios interceptor already returns response.data (the full API response)
            // which is { success, message, data: { available, flatrate, ... } }
            const response = await api.get(`/tmdb/movie/${tmdbId}/providers`, {
                params: { region }
            });
            // response IS already { success, message, data: {...} } from the interceptor
            // so response.data gives us the actual providers data
            return response.data;
        },
        enabled: !!tmdbId,
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
    });

    const currentRegion = REGIONS.find(r => r.code === region) || REGIONS[0];

    if (!tmdbId) return null;

    const ProviderSection = ({ title, icon: Icon, providers, color }) => {
        if (!providers || providers.length === 0) return null;

        return (
            <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm font-medium ${color}`}>
                    <Icon className="w-4 h-4" />
                    {title}
                </div>
                <div className="flex flex-wrap gap-2">
                    {providers.map((provider) => (
                        <motion.div
                            key={provider.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                        >
                            <img
                                src={provider.logo}
                                alt={provider.name}
                                className="w-10 h-10 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                title={provider.name}
                            />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {provider.name}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
        >
            {/* Header with Region Selector */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-primary-500" />
                    Where to Watch
                </h3>

                {/* Region Picker */}
                <div className="relative">
                    <button
                        onClick={() => setShowRegionPicker(!showRegionPicker)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                        <span>{currentRegion.flag}</span>
                        <span className="hidden sm:inline">{currentRegion.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showRegionPicker ? 'rotate-180' : ''}`} />
                    </button>

                    {showRegionPicker && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-[180px]"
                        >
                            {REGIONS.map((r) => (
                                <button
                                    key={r.code}
                                    onClick={() => {
                                        setRegion(r.code);
                                        setShowRegionPicker(false);
                                    }}
                                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${region === r.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <span>{r.flag}</span>
                                    <span>{r.name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                </div>
            ) : error ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Failed to load streaming info
                </p>
            ) : !data || (!data.flatrate?.length && !data.free?.length && !data.rent?.length && !data.buy?.length) ? (
                <div className="text-center py-6">
                    <Globe className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Not available for streaming in {currentRegion.name}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Try selecting a different region
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Streaming (Subscription) */}
                    <ProviderSection
                        title="Stream"
                        icon={Tv}
                        providers={data.flatrate}
                        color="text-green-600 dark:text-green-400"
                    />

                    {/* Free with Ads */}
                    <ProviderSection
                        title="Free"
                        icon={Tv}
                        providers={data.free}
                        color="text-blue-600 dark:text-blue-400"
                    />

                    {/* Rent */}
                    <ProviderSection
                        title="Rent"
                        icon={DollarSign}
                        providers={data.rent}
                        color="text-amber-600 dark:text-amber-400"
                    />

                    {/* Buy */}
                    <ProviderSection
                        title="Buy"
                        icon={ShoppingCart}
                        providers={data.buy}
                        color="text-purple-600 dark:text-purple-400"
                    />

                    {/* JustWatch Attribution */}
                    {data.link && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <a
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View on JustWatch
                            </a>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Data provided by JustWatch
                            </p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
