import { jest } from '@jest/globals'; // Only if using Jest, but for standalone node script, we'll manually mock axios logic if possible or just test structure.
import TraktService from './src/services/traktService.js';
import axios from 'axios';

// Simple mock for axios
const originalPost = axios.post;
const originalGet = axios.get;

const mockAxios = () => {
    console.log('🎭 Mocking Axios for Trakt simulation...');

    axios.post = async (url, data) => {
        if (url.includes('/oauth/token')) {
            console.log('✅ Trakt Token Exchange called');
            return {
                data: {
                    access_token: 'mock_access_token',
                    refresh_token: 'mock_refresh_token',
                    created_at: Math.floor(Date.now() / 1000),
                    expires_in: 7200
                }
            };
        }
        return originalPost(url, data);
    };

    axios.get = async (url, config) => {
        if (url.includes('/users/me')) {
            console.log('✅ Trakt Profile Fetch called');
            return {
                data: { username: 'test_trakt_user' }
            };
        }
        if (url.includes('/sync/history/movies')) {
            console.log('✅ Trakt History Fetch called');
            return {
                data: [
                    {
                        watched_at: new Date().toISOString(),
                        movie: {
                            ids: { tmdb: 550, trakt: 12345 }, // Fight Club
                            title: 'Fight Club',
                            year: 1999
                        }
                    }
                ]
            };
        }
        // Mock TMDB service behavior if needed, or let it fail gently
        return originalGet(url, config);
    };
};

const runVerification = async () => {
    console.log('🚀 Starting Trakt Integration Verification...');

    // Check if Service exists
    if (!TraktService) {
        throw new Error('TraktService not found');
    }
    console.log('✅ TraktService loaded');

    // We can't easily run full integration test without DB connection,
    // so we'll just verify the class structure and methods exist.
    if (typeof TraktService.exchangeCode !== 'function') throw new Error('exchangeCode missing');
    if (typeof TraktService.syncHistory !== 'function') throw new Error('syncHistory missing');

    console.log('✅ API Methods present');
    console.log('🎉 Trakt Service Structure Verification Passed!');

    console.log('\n⚠️  Note: Full end-to-end verification requires a running DB and active Trakt credentials.');
    console.log('For now, we confirmed the code logic is imported correctly.');

    process.exit(0);
};

runVerification();
