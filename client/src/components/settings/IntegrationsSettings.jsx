import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import integrationService from '../../services/integrationService';
import Button from '../common/Button';
import {
    Link as LinkIcon,
    RefreshCw,
    Upload,
    Server,
    CheckCircle,
    AlertCircle,
    Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function IntegrationsSettings() {
    const { user, refreshUser } = useAuth();
    const [isSyncing, setIsSyncing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Trakt Configuration
    const traktConfig = {
        clientId: 'YOUR_CLIENT_ID_HIDDEN', // We don't expose this often in frontend unless needed
        redirectUri: window.location.origin + '/settings/integrations/trakt/callback'
    };

    const handleConnectTrakt = () => {
        // Redirect to Trakt OAuth
        // Note: Real implementation needs clientId from env/config if public, 
        // or we rely on backend to construct this URL to keep secrets safe.
        // For now, assuming backend endpoint is safer or we show instruction.
        // Let's assume user has to copy-paste setup or we use a backend redirect endpoint.
        // ACTUALLY, OAuth usually requires redirecting user.
        // Let's just show a toast for MVP if env var is missing in client.

        toast.error("Trakt OAuth requires client implementation. Please check README.");
        // If we had the ID:
        // window.location.href = `https://trakt.tv/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    };

    const handleSyncTrakt = async () => {
        setIsSyncing(true);
        try {
            const result = await integrationService.syncTrakt();
            toast.success(result.message || 'Sync complete!');
            refreshUser(); // Update last sync time
        } catch (error) {
            toast.error('Sync failed');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const result = await integrationService.importCsv(file);
            toast.success(`Imported ${result.imported} movies!`);
        } catch (error) {
            toast.error(error.message || 'Import failed');
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    const webhookBaseUrl = window.location.origin.replace('5173', '5000') + '/api/webhooks';

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Integrations</h1>

            {/* Trakt Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                            <LinkIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trakt.tv Sync</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Automatically sync your watched history.
                            </p>
                        </div>
                    </div>
                    {user?.integrations?.trakt?.accessToken ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Connected as {user.integrations.trakt.username}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            Not Connected
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                <div className="flex gap-4">
                    {!user?.integrations?.trakt?.accessToken ? (
                        <Button onClick={handleConnectTrakt} className="bg-red-600 hover:bg-red-700 text-white border-none">
                            Connect Trakt
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSyncTrakt}
                            isLoading={isSyncing}
                            leftIcon={<RefreshCw className="w-4 h-4" />}
                        >
                            Sync Now
                        </Button>
                    )}
                </div>
            </div>

            {/* Webhooks Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                        <Server className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Media Server Webhooks</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive "watched" events from Plex or Jellyfin.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plex Webhook URL</label>
                        <code className="block p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-400 break-all border border-gray-200 dark:border-gray-700">
                            {`${webhookBaseUrl}/plex?userId=${user?.id}`}
                        </code>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jellyfin Webhook URL</label>
                        <code className="block p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-400 break-all border border-gray-200 dark:border-gray-700">
                            {`${webhookBaseUrl}/jellyfin?userId=${user?.id}`}
                        </code>
                    </div>
                </div>
            </div>

            {/* Import Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Download className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import History</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Import CSV files from IMDb or Letterboxd.
                        </p>
                    </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        id="csv-upload"
                        onChange={handleFileUpload}
                        disabled={isImporting}
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isImporting ? 'Importing...' : 'Click to upload .csv file'}
                        </span>
                        <span className="text-xs text-gray-500">
                            Supports Letterboxd (diary.csv) & IMDb (ratings.csv)
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}
