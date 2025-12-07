import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates that all required environment variables are present
 */
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'REFRESH_TOKEN_SECRET',
    'TMDB_API_KEY'
];

const validateEnv = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

// Validate on import in production
if (process.env.NODE_ENV === 'production') {
    validateEnv();
}

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,

    // MongoDB
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/moviemania',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret-change-in-production',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

    // TMDB
    tmdbApiKey: process.env.TMDB_API_KEY || '',
    tmdbBaseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',

    // CORS
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100
};

export default env;
export { validateEnv };
