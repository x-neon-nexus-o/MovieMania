import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, Loader2, Film, Tv, TrendingUp, Calendar, Hash } from 'lucide-react';
import aiService from '../../services/aiService';
import { Link, useNavigate } from 'react-router-dom';
import { getPosterUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EXAMPLE_QUERIES = [
    { text: "Comedies from the 90s like Friends", icon: <Tv className="w-3 h-3" /> },
    { text: "Sci-fi movies with Mind Bending plot", icon: <Film className="w-3 h-3" /> },
    { text: "Oscar winning dramas from 2023", icon: <TrendingUp className="w-3 h-3" /> },
];

export default function SmartSearchBar() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [aiParams, setAiParams] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setIsOpen(true);
        setResults(null);
        setAiParams(null);

        try {
            const data = await aiService.smartSearch(query);
            setResults(data.results);
            setAiParams(data.aiParams);
        } catch (error) {
            toast.error('Failed to perform smart search');
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = (text) => {
        setQuery(text);
        handleSearch({ preventDefault: () => { } });
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Ask specifically... e.g. '80s action movies like Terminator'"
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-sm focus:border-primary-500 focus:ring-0 transition-all text-gray-900 dark:text-white"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5 text-primary-500" />
                    )}
                </div>
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setResults(null);
                            setAiParams(null);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </form>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        {!results && !isLoading && (
                            <div className="p-4">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Try asking for
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {EXAMPLE_QUERIES.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleExampleClick(item.text)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm text-gray-600 dark:text-gray-300 rounded-full transition-colors border border-transparent hover:border-primary-100 dark:hover:border-primary-800"
                                        >
                                            {item.icon}
                                            {item.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {aiParams && (
                            <div className="px-4 py-3 bg-primary-50 dark:bg-primary-900/10 border-b border-primary-100 dark:border-primary-900/20">
                                <div className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-2 flex-wrap">
                                    <Sparkles className="w-3 h-3" />
                                    AI Interpreted:
                                    {aiParams.keywords?.map(k => (
                                        <span key={k} className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                                            {k}
                                        </span>
                                    ))}
                                    {aiParams.yearRange && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                                            <Calendar className="w-3 h-3" />
                                            {aiParams.yearRange.start}-{aiParams.yearRange.end}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {results && (
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {results.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        No matches found for your query
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {results.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={`/${item.media_type || 'movie'}/${item.id}`}
                                                className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <img
                                                    src={getPosterUrl(item.poster_path)}
                                                    alt={item.title || item.name}
                                                    className="w-12 h-18 object-cover rounded shadow-sm bg-gray-200"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                        {item.title || item.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                                                        <span>{(item.release_date || item.first_air_date)?.split('-')[0]}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center text-amber-500">
                                                            ★ {item.vote_average?.toFixed(1)}
                                                        </span>
                                                    </p>
                                                    {item.aiReason && (
                                                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-start gap-1">
                                                            <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                                                            {item.aiReason}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
