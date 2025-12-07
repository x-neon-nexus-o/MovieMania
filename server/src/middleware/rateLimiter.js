import rateLimit from 'express-rate-limit';
import env from '../config/environment.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
    windowMs: env.rateLimitWindowMs, // 15 minutes
    max: env.rateLimitMaxRequests, // 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Stricter rate limiter for auth routes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // Don't count successful requests
});

/**
 * Rate limiter for TMDB proxy routes
 * More lenient since these are read-only
 */
export const tmdbLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: {
        success: false,
        message: 'Too many TMDB requests, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
