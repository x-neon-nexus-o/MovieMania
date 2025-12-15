import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('Using API Key:', apiKey.substring(0, 10) + '...');
        // Note: listModels is on the genAI instance in some versions, or via model manager?
        // Actually, in 0.x SDK, it might not be directly exposed easily or requires specific call.
        // Let's try to just use a model we suspect and see if we can get model info, 
        // OR try the verify method if it exists.

        // Correct way to list models in v1beta SDK
        // There isn't a direct listModels helper in the high-level SDK sometimes, 
        // but let's try to access the underlying client if possible or just try a standard request.

        // Actually, for debug, let's just try to generate content with a few common names and see which one doesn't error 404.

        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-1.0-pro',
            'gemini-pro',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash-001'
        ];

        console.log('Testing models...');

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello');
                const response = result.response.text();
                console.log(`✅ SUCCESS: ${modelName}`);
                console.log('Response:', response);
                break; // Found one!
            } catch (error) {
                console.log(`❌ FAILED: ${modelName}`);
                if (error.message.includes('404')) {
                    console.log('   Reason: Not Found');
                } else {
                    console.log('   Reason:', error.message);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
