import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function testSmartSearch() {
    const query = "Sci-fi movies like Interstellar from 2010s";

    const prompt = `Parse this natural language movie/TV search query into structured search parameters.
    Query: "${query}"
    
    Return a JSON object with:
    - type: "movie", "tv", or "mixed"
    - genres: array of genre strings (e.g. "Action", "Comedy")
    - yearRange: { start: number, end: number } or null
    - rating: { min: number } or null
    - keywords: array of strings
    - sortBy: "popularity.desc", "vote_average.desc", "primary_release_date.desc"
    - mood: string (inferred mood if any)
    
    Return ONLY the JSON.`;

    try {
        console.log("Sending query...");
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        console.log("Raw Response:");
        console.log(response);

        const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        console.log("Parsed JSON:");
        console.log(JSON.stringify(parsed, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

testSmartSearch();
