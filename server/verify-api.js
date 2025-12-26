import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const runVerification = async () => {
    console.log(`🌐 Starting API Verification at ${BASE_URL}...`);

    try {
        // Test 1: Health Check
        console.log('\n🧪 Test 1: Checking Health Endpoint...');
        const healthRes = await axios.get(`${BASE_URL}/health`);
        console.log('Response:', healthRes.data);
        if (healthRes.status !== 200 || healthRes.data.status !== 'ok') {
            throw new Error('Health check failed');
        }
        console.log('✅ Test 1 Passed.');

        console.log('\n🎉 API Basic Health Verification Passed!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ API Verification Failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('⚠️  Is the server running? Make sure to start the server first.');
        }
        process.exit(1);
    }
};

runVerification();
