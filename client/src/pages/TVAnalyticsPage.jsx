import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, BarChart3, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShowAnalytics, useEpisodes, useSyncEpisodes } from '../hooks/useEpisodes';
import { useTVShowByTMDBId } from '../hooks/useTVShows';
import SeasonRatingsChart from '../components/TV/SeasonRatingsChart';
import EpisodeHeatmap from '../components/TV/EpisodeHeatmap';
import AnalyticsSummary from '../components/TV/AnalyticsSummary';
import EpisodeRatingsTable from '../components/TV/EpisodeRatingsTable';
import InsightsPanel from '../components/TV/InsightsPanel';
import { PageLoader } from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export default function TVAnalyticsPage() {
    const { tmdbShowId } = useParams();
    const showId = parseInt(tmdbShowId);

    const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useShowAnalytics(showId);
    const { data: episodesData, isLoading: episodesLoading } = useEpisodes(showId);
    const { data: showData } = useTVShowByTMDBId(showId);
    const syncMutation = useSyncEpisodes();

    const analytics = analyticsData?.success ? analyticsData : null;
    const episodes = episodesData?.success ? episodesData : null;
    const showDetails = showData?.tvShow;
    const mongoId = showDetails?._id;

    const handleExport = async (format) => {
        const showName = showDetails?.name?.replace(/\s+/g, '-').toLowerCase() || 'tv-analytics';

        try {
            switch (format) {
                case 'json': {
                    const jsonData = JSON.stringify({ analytics, episodes }, null, 2);
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${showName}-analytics.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    toast.success('Exported as JSON');
                    break;
                }
                case 'csv': {
                    if (!episodes?.seasons) {
                        toast.error('No episode data to export');
                        return;
                    }
                    let csv = 'Season,Episode,Name,Rating,Vote Count\n';
                    episodes.seasons.forEach((season) => {
                        season.episodes.forEach((ep) => {
                            csv += `${season.seasonNumber},${ep.episodeNumber},"${ep.name.replace(/"/g, '""')}",${ep.voteAverage},${ep.voteCount}\n`;
                        });
                    });
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${showName}-episodes.csv`;
                    link.click();
                    URL.revokeObjectURL(url);
                    toast.success('Exported as CSV');
                    break;
                }
                case 'image': {
                    toast.loading('Generating image...');
                    const element = document.getElementById('analytics-container');
                    if (!element) {
                        toast.dismiss();
                        toast.error('Could not capture analytics');
                        return;
                    }
                    const canvas = await html2canvas(element, {
                        scale: 2,
                        backgroundColor: '#f9fafb',
                        logging: false,
                    });
                    canvas.toBlob((blob) => {
                        toast.dismiss();
                        if (blob) {
                            saveAs(blob, `${showName}-analytics.png`);
                            toast.success('Exported as Image');
                        } else {
                            toast.error('Failed to generate image');
                        }
                    }, 'image/png');
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            console.error('Export failed:', error);
            toast.error(`Export failed: ${error.message}`);
        }
    };

    const handleSync = () => {
        syncMutation.mutate(showId);
    };

    if (analyticsLoading && episodesLoading) {
        return <PageLoader />;
    }

    // Show error page only for actual network/API errors, not just empty data
    const hasNetworkError = analyticsError && !analyticsData;
    const hasApiError = analyticsData && analyticsData.success === false;

    if (hasNetworkError || hasApiError) {
        const errorMessage = hasApiError
            ? analyticsData.message
            : 'We couldn\'t load analytics for this show.';

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        No Analytics Available
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {errorMessage}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleSync}
                            disabled={syncMutation.isPending}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium transition"
                        >
                            <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                            {syncMutation.isPending ? 'Syncing...' : 'Try Syncing from TMDB'}
                        </button>
                        <Link
                            to={mongoId ? `/tv/${mongoId}` : -1}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition"
                        >
                            <ArrowLeft size={18} />
                            Back to Show
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                >
                    <div>
                        <Link
                            to={mongoId ? `/tv/${mongoId}` : `/tv`}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2 transition"
                        >
                            <ArrowLeft size={18} />
                            Back to {showDetails?.name || 'Show'}
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {showDetails?.name || 'TV Show'} Analytics
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleSync}
                            disabled={syncMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                        >
                            <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                            Sync
                        </button>
                        <button
                            onClick={() => handleExport('json')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                        >
                            <Download size={18} />
                            JSON
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                        >
                            <Download size={18} />
                            CSV
                        </button>
                        <button
                            onClick={() => handleExport('image')}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                        >
                            <Image size={18} />
                            Image
                        </button>
                    </div>
                </motion.div>

                {/* Analytics Content */}
                <div id="analytics-container" className="space-y-8">
                    {analytics && <AnalyticsSummary analytics={analytics} />}

                    <SeasonRatingsChart analytics={analytics} isLoading={analyticsLoading} />

                    <EpisodeHeatmap episodes={episodes?.seasons} isLoading={episodesLoading} />

                    <EpisodeRatingsTable episodes={episodes?.seasons} isLoading={episodesLoading} />

                    {analytics && (
                        <InsightsPanel analytics={analytics} showName={showDetails?.name} />
                    )}
                </div>
            </div>
        </div>
    );
}
