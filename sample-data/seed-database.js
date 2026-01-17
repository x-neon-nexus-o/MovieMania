/**
 * MongoDB Seed Script for MovieMania
 * 
 * Usage:
 *   1. Set your MONGODB_URI environment variable
 *   2. Run: node sample-data/seed-database.js
 * 
 * This will clear existing data and insert sample data.
 * Use with caution in production!
 */

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load sample data
const sampleData = JSON.parse(
    readFileSync(join(__dirname, 'sample-mongodb-data.json'), 'utf-8')
);

// Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviemania';

// Define schemas (simplified for seeding)
const userSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const movieSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const tvShowSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const episodeSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const watchlistMovieSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const watchlistTVShowSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const collectionSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);
const TVShow = mongoose.model('TVShow', tvShowSchema);
const Episode = mongoose.model('Episode', episodeSchema);
const WatchlistMovie = mongoose.model('WatchlistMovie', watchlistMovieSchema);
const WatchlistTVShow = mongoose.model('WatchlistTVShow', watchlistTVShowSchema);
const Collection = mongoose.model('Collection', collectionSchema);

// Helper to convert string IDs to ObjectIds
function convertIds(data, idFields = ['_id', 'addedBy', 'createdBy']) {
    return data.map(item => {
        const converted = { ...item };
        idFields.forEach(field => {
            if (converted[field] && typeof converted[field] === 'string') {
                converted[field] = new mongoose.Types.ObjectId(converted[field]);
            }
        });
        // Handle nested userId in ratings
        if (converted.userRatings) {
            converted.userRatings = converted.userRatings.map(rating => ({
                ...rating,
                userId: new mongoose.Types.ObjectId(rating.userId)
            }));
        }
        // Handle nested movie references in collections
        if (converted.movies && Array.isArray(converted.movies)) {
            converted.movies = converted.movies.map(m => ({
                ...m,
                movie: new mongoose.Types.ObjectId(m.movie)
            }));
        }
        return converted;
    });
}

async function seedDatabase() {
    console.log('🌱 MovieMania Database Seeder\n');
    console.log(`📦 Connecting to: ${MONGODB_URI}\n`);

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Confirmation prompt for safety
        console.log('⚠️  WARNING: This will DELETE all existing data!\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Movie.deleteMany({}),
            TVShow.deleteMany({}),
            Episode.deleteMany({}),
            WatchlistMovie.deleteMany({}),
            WatchlistTVShow.deleteMany({}),
            Collection.deleteMany({})
        ]);
        console.log('✅ Cleared all collections\n');

        // Insert sample data
        console.log('📥 Inserting sample data...\n');

        // Users
        const users = convertIds(sampleData.users);
        await User.insertMany(users);
        console.log(`   ✅ Users: ${users.length} documents`);

        // Movies
        const movies = convertIds(sampleData.movies);
        await Movie.insertMany(movies);
        console.log(`   ✅ Movies: ${movies.length} documents`);

        // TV Shows
        const tvshows = convertIds(sampleData.tvshows);
        await TVShow.insertMany(tvshows);
        console.log(`   ✅ TV Shows: ${tvshows.length} documents`);

        // Episodes
        const episodes = convertIds(sampleData.episodes, ['_id']);
        await Episode.insertMany(episodes);
        console.log(`   ✅ Episodes: ${episodes.length} documents`);

        // Watchlist Movies
        const watchlistMovies = convertIds(sampleData.watchlistmovies);
        await WatchlistMovie.insertMany(watchlistMovies);
        console.log(`   ✅ Watchlist Movies: ${watchlistMovies.length} documents`);

        // Watchlist TV Shows
        const watchlistTVShows = convertIds(sampleData.watchlisttvshows);
        await WatchlistTVShow.insertMany(watchlistTVShows);
        console.log(`   ✅ Watchlist TV Shows: ${watchlistTVShows.length} documents`);

        // Collections
        const collections = convertIds(sampleData.collections, ['_id', 'createdBy']);
        await Collection.insertMany(collections);
        console.log(`   ✅ Collections: ${collections.length} documents`);

        console.log('\n🎉 Database seeded successfully!\n');
        console.log('📋 Summary:');
        console.log('   - 2 Users (johndoe & janedoe)');
        console.log('   - 5 Movies (Fight Club, Inception, Pulp Fiction, Interstellar, The Matrix)');
        console.log('   - 4 TV Shows (Breaking Bad, Rick and Morty, Game of Thrones, Stranger Things)');
        console.log('   - 4 Episodes (Breaking Bad & Stranger Things samples)');
        console.log('   - 3 Watchlist Movies');
        console.log('   - 2 Watchlist TV Shows');
        console.log('   - 3 Collections');
        console.log('\n🔐 Test Credentials:');
        console.log('   - Username: johndoe | Email: johndoe@example.com');
        console.log('   - Username: janedoe | Email: janedoe@example.com');
        console.log('   - Password: (you\'ll need to register or update with bcrypt hash)');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run seeder
seedDatabase();
