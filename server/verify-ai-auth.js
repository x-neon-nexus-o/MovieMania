import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './src/models/User.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;
const MONGODB_URI = process.env.MONGODB_URI;

const runVerification = async () => {
    console.log('🔐 Starting Authenticated API Verification...');

    try {
        // 1. Connect to DB to get a user
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // 2. Find or Create User
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            console.log('Creating test user...');
            user = await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                isActive: true
            });
        }
        const userId = user._id;
        console.log(`Using user: ${userId}`);

        // 3. Generate Token
        // Assuming JWT_SECRET is in env
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated.');

        // 4. Test generateReviewDraft Endpoint
        console.log('\n🧪 Testing POST /api/ai/review/generate...');
        const payload = {
            movieTitle: 'The Matrix',
            rating: 5,
            genres: ['Sci-Fi', 'Action']
        };

        try {
            const res = await axios.post(`${BASE_URL}/ai/review/generate`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Response Status:', res.status);
            console.log('📝 Response Data:', JSON.stringify(res.data, null, 2));

            if (!res.data.data.draft) throw new Error('No draft returned');

        } catch (apiError) {
            console.error('❌ API Call Failed:', apiError.response ? apiError.response.data : apiError.message);
            throw apiError;
        }

        console.log('\n🎉 Authenticated API Test Passed!');
        mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
        if (mongoose.connection.readyState === 1) mongoose.disconnect();
        process.exit(1);
    }
};

runVerification();
