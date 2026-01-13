import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const results = [];
let output = '';

const log = (msg) => {
    console.log(msg);
    output += msg + '\n';
};

const test = async (name, fn) => {
    try {
        await fn();
        results.push({ name, status: 'PASS' });
        log(`PASS: ${name}`);
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        results.push({ name, status: 'FAIL', error: msg });
        log(`FAIL: ${name} - ${msg}`);
    }
};

const runAllTests = async () => {
    log('');
    log('============================================================');
    log('MovieMania API Comprehensive Health Check');
    log('============================================================');
    log(`Base URL: ${BASE_URL}`);
    log(`Time: ${new Date().toISOString()}`);
    log('');

    // ═══════════════════════════════════════════════════════════
    // 1. HEALTH CHECK
    // ═══════════════════════════════════════════════════════════
    log('--- HEALTH CHECK ---');

    await test('GET /health', async () => {
        const res = await axios.get(`${BASE_URL}/health`);
        if (res.data.status !== 'ok') throw new Error('Health check failed');
    });

    // ═══════════════════════════════════════════════════════════
    // 2. AUTH ROUTES (expect 400 for missing data)
    // ═══════════════════════════════════════════════════════════
    log('');
    log('--- AUTH ROUTES ---');

    await test('POST /auth/register (validation)', async () => {
        try {
            await axios.post(`${BASE_URL}/auth/register`, {});
        } catch (e) {
            if (e.response?.status === 400) return;
            throw e;
        }
    });

    await test('POST /auth/login (validation)', async () => {
        try {
            await axios.post(`${BASE_URL}/auth/login`, {});
        } catch (e) {
            if (e.response?.status === 400 || e.response?.status === 401) return;
            throw e;
        }
    });

    // ═══════════════════════════════════════════════════════════
    // 3. TMDB ROUTES - PUBLIC (no auth needed)
    // Note: API wraps response in { success, message, data }
    // ═══════════════════════════════════════════════════════════
    log('');
    log('--- TMDB PUBLIC ROUTES ---');

    await test('GET /tmdb/trending (movies)', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/trending`);
        // Response wrapped: { success, message, data: { results: [...] } }
        if (!res.data.success || !Array.isArray(res.data.data?.results)) {
            throw new Error('No trending data');
        }
    });

    await test('GET /tmdb/popular (movies)', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/popular`);
        if (!res.data.success || !Array.isArray(res.data.data?.results)) {
            throw new Error('No popular data');
        }
    });

    await test('GET /tmdb/movie/27205/videos (Inception)', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/movie/27205/videos`);
        // Videos may be in data.results or data directly
        if (!res.data.success) throw new Error('No video data');
    });

    await test('GET /tmdb/movie/27205/providers', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/movie/27205/providers`);
        if (!res.data.success) throw new Error('No provider data');
    });

    await test('GET /tmdb/movie/27205/recommendations', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/movie/27205/recommendations`);
        if (!res.data.success) throw new Error('No recommendation data');
    });

    await test('GET /tmdb/movie/27205/similar', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/movie/27205/similar`);
        if (!res.data.success) throw new Error('No similar data');
    });

    await test('GET /tmdb/tv/trending', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/tv/trending`);
        if (!res.data.success || !Array.isArray(res.data.data?.results)) {
            throw new Error('No TV trending data');
        }
    });

    await test('GET /tmdb/tv/popular', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/tv/popular`);
        if (!res.data.success || !Array.isArray(res.data.data?.results)) {
            throw new Error('No TV popular data');
        }
    });

    await test('GET /tmdb/tv/1396/videos (Breaking Bad)', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/tv/1396/videos`);
        if (!res.data.success) throw new Error('No TV video data');
    });

    await test('GET /tmdb/tv/1396/providers', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/tv/1396/providers`);
        if (!res.data.success) throw new Error('No TV provider data');
    });

    await test('GET /tmdb/tv/1396/recommendations', async () => {
        const res = await axios.get(`${BASE_URL}/tmdb/tv/1396/recommendations`);
        if (!res.data.success) throw new Error('No TV recommendation data');
    });

    // ═══════════════════════════════════════════════════════════
    // 4. TMDB PROTECTED ROUTES (require auth - expect 401)
    // ═══════════════════════════════════════════════════════════
    log('');
    log('--- TMDB PROTECTED ROUTES (expect 401) ---');

    await test('GET /tmdb/search (requires auth)', async () => {
        try {
            await axios.get(`${BASE_URL}/tmdb/search?query=test`);
            throw new Error('Should have returned 401');
        } catch (e) {
            if (e.response?.status === 401) return;
            throw e;
        }
    });

    await test('GET /tmdb/movie/:id (requires auth)', async () => {
        try {
            await axios.get(`${BASE_URL}/tmdb/movie/27205`);
            throw new Error('Should have returned 401');
        } catch (e) {
            if (e.response?.status === 401) return;
            throw e;
        }
    });

    await test('GET /tmdb/tv/search (requires auth)', async () => {
        try {
            await axios.get(`${BASE_URL}/tmdb/tv/search?query=test`);
            throw new Error('Should have returned 401');
        } catch (e) {
            if (e.response?.status === 401) return;
            throw e;
        }
    });

    await test('GET /tmdb/tv/:id (requires auth)', async () => {
        try {
            await axios.get(`${BASE_URL}/tmdb/tv/1396`);
            throw new Error('Should have returned 401');
        } catch (e) {
            if (e.response?.status === 401) return;
            throw e;
        }
    });

    // ═══════════════════════════════════════════════════════════
    // 5. PUBLIC/OPTIONAL-AUTH ROUTES (should work without auth)
    // ═══════════════════════════════════════════════════════════
    log('');
    log('--- PUBLIC ROUTES (optionalAuth) ---');

    await test('GET /movies', async () => {
        const res = await axios.get(`${BASE_URL}/movies`);
        if (!res.data.success) throw new Error('No movies data');
    });

    await test('GET /movies/tags', async () => {
        const res = await axios.get(`${BASE_URL}/movies/tags`);
        if (!res.data.success) throw new Error('No tags data');
    });

    await test('GET /tvshows', async () => {
        const res = await axios.get(`${BASE_URL}/tvshows`);
        if (!res.data.success) throw new Error('No TV shows data');
    });

    await test('GET /tvshows/tags', async () => {
        const res = await axios.get(`${BASE_URL}/tvshows/tags`);
        if (!res.data.success) throw new Error('No tags data');
    });

    await test('GET /stats', async () => {
        const res = await axios.get(`${BASE_URL}/stats`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/by-year', async () => {
        const res = await axios.get(`${BASE_URL}/stats/by-year`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/by-rating', async () => {
        const res = await axios.get(`${BASE_URL}/stats/by-rating`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/by-genre', async () => {
        const res = await axios.get(`${BASE_URL}/stats/by-genre`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/by-decade', async () => {
        const res = await axios.get(`${BASE_URL}/stats/by-decade`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/timeline', async () => {
        const res = await axios.get(`${BASE_URL}/stats/timeline`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/tags', async () => {
        const res = await axios.get(`${BASE_URL}/stats/tags`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/heatmap', async () => {
        const res = await axios.get(`${BASE_URL}/stats/heatmap`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/streaks', async () => {
        const res = await axios.get(`${BASE_URL}/stats/streaks`);
        if (!res.data.success) throw new Error('No stats data');
    });

    await test('GET /stats/credits', async () => {
        const res = await axios.get(`${BASE_URL}/stats/credits`);
        if (!res.data.success) throw new Error('No stats data');
    });

    // ═══════════════════════════════════════════════════════════
    // 6. PROTECTED ROUTES (require auth - expect 401)
    // ═══════════════════════════════════════════════════════════
    log('');
    log('--- PROTECTED ROUTES (expect 401) ---');

    const protectedEndpoints = [
        { method: 'get', path: '/watchlist', name: 'GET /watchlist' },
        { method: 'get', path: '/watchlist-tv', name: 'GET /watchlist-tv' },
        { method: 'get', path: '/collections', name: 'GET /collections' },
        { method: 'get', path: '/recommendations', name: 'GET /recommendations' },
        { method: 'get', path: '/export/movies', name: 'GET /export/movies' },
        { method: 'post', path: '/movies', name: 'POST /movies (create)' },
        { method: 'post', path: '/tvshows', name: 'POST /tvshows (create)' },
        { method: 'post', path: '/integrations/trakt/callback', name: 'POST /integrations/trakt/callback' },
        { method: 'post', path: '/integrations/trakt/sync', name: 'POST /integrations/trakt/sync' },
    ];

    for (const ep of protectedEndpoints) {
        await test(`${ep.name} (requires auth)`, async () => {
            try {
                await axios[ep.method](`${BASE_URL}${ep.path}`, {});
                throw new Error('Should have returned 401');
            } catch (e) {
                if (e.response?.status === 401) return;
                throw e;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 7. AI ROUTES
    // ═══════════════════════════════════════════════════════════
    log('');
    log('--- AI ROUTES ---');

    await test('POST /ai/search (requires auth)', async () => {
        try {
            await axios.post(`${BASE_URL}/ai/search`, { query: 'test' });
            throw new Error('Should have returned 401');
        } catch (e) {
            if (e.response?.status === 401) return;
            throw e;
        }
    });

    // ═══════════════════════════════════════════════════════════
    // 8. EPISODE ROUTES
    // ═══════════════════════════════════════════════════════════
    log('');
    log('--- EPISODE ROUTES ---');

    await test('GET /episodes/1396 (Breaking Bad)', async () => {
        const res = await axios.get(`${BASE_URL}/episodes/1396`);
        if (!res.data.success) throw new Error('No episode data');
    });

    await test('GET /episodes/1396/analytics', async () => {
        const res = await axios.get(`${BASE_URL}/episodes/1396/analytics`);
        if (!res.data.success) throw new Error('No analytics data');
    });

    // ═══════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════
    log('');
    log('============================================================');
    log('TEST SUMMARY');
    log('============================================================');

    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;

    log(`Passed: ${passed}`);
    log(`Failed: ${failed}`);
    log(`Total:  ${results.length}`);

    if (failed > 0) {
        log('');
        log('FAILED TESTS:');
        results.filter(r => r.status === 'FAIL').forEach(r => {
            log(`  - ${r.name}: ${r.error}`);
        });
    } else {
        log('');
        log('ALL TESTS PASSED!');
    }

    log('');
    log('============================================================');

    // Write to file
    fs.writeFileSync('api-test-results.txt', output);
    log('Results saved to api-test-results.txt');

    process.exit(failed > 0 ? 1 : 0);
};

runAllTests();
