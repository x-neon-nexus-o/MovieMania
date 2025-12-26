import dotenv from 'dotenv';
import GeminiService from './src/services/geminiService.js';

dotenv.config();

const runVerification = async () => {
    console.log('🤖 Starting Gemini AI Verification...');

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('❌ GEMINI_API_KEY is missing in .env');
        }
        console.log('✅ GEMINI_API_KEY found.');

        // Test 1: Simple Generation
        console.log('\n🧪 Test 1: Testing generateReviewDraft...');
        const draft = await GeminiService.generateReviewDraft('Inception', 5, ['Sci-Fi', 'Thriller']);
        console.log('📝 Generated Draft:', draft);
        if (!draft || draft.length < 10) throw new Error('Failed to generate draft review');
        console.log('✅ Test 1 Passed.');

        // Test 2: Structured Output Analysis
        console.log('\n🧪 Test 2: Testing analyzeSentiment...');
        const sentiment = await GeminiService.analyzeSentiment('This movie was absolutely mind-blowing! A masterpiece.');
        console.log('📊 Analysis Result:', sentiment);
        if (!sentiment.sentiment || typeof sentiment.score !== 'number') throw new Error('Invalid sediment analysis structure');
        console.log('✅ Test 2 Passed.');

        console.log('\n🎉 All AI Tests Passed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
        process.exit(1);
    }
};

runVerification();
