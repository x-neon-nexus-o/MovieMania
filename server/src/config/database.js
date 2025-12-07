import mongoose from 'mongoose';
import env from './environment.js';

/**
 * MongoDB connection with retry logic
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.mongodbUri, {
            // These options are no longer needed in Mongoose 6+
            // but kept for compatibility
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);

        // Retry connection after 5 seconds
        console.log('🔄 Retrying connection in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return connectDB();
    }
};

/**
 * Graceful shutdown handler
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};

export { connectDB, disconnectDB };
