import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/environment.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw ApiError.unauthorized('Access denied. No token provided.');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, env.jwtSecret);

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            throw ApiError.unauthorized('User not found.');
        }

        if (!user.isActive) {
            throw ApiError.unauthorized('User account is deactivated.');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw ApiError.unauthorized('Invalid token.');
        }
        if (error.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Token expired.');
        }
        throw error;
    }
});

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, env.jwtSecret);
            const user = await User.findById(decoded.userId).select('-password');
            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Silently ignore invalid tokens for optional auth
        }
    }

    next();
});

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw ApiError.unauthorized('Access denied.');
        }

        if (!roles.includes(req.user.role)) {
            throw ApiError.forbidden('You do not have permission to perform this action.');
        }

        next();
    };
};

/**
 * Admin only middleware
 */
export const adminOnly = authorize('admin');
