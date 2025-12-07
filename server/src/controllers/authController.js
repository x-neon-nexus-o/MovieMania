import { body } from 'express-validator';
import User from '../models/User.js';
import tokenService from '../services/tokenService.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Validation rules for registration
 */
export const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
];

/**
 * Validation rules for login
 */
export const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
            throw ApiError.conflict('Email already registered');
        }
        throw ApiError.conflict('Username already taken');
    }

    // Create user
    const user = await User.create({
        username,
        email,
        password
    });

    // Generate tokens
    const { accessToken, refreshToken } = await tokenService.generateTokenPair(user, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
    });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    ApiResponse.created(res, {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        accessToken
    }, 'Registration successful');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isActive) {
        throw ApiError.unauthorized('Account is deactivated');
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = await tokenService.generateTokenPair(user, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    ApiResponse.success(res, {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: user.profile
        },
        accessToken
    }, 'Login successful');
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (requires refresh token cookie)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw ApiError.unauthorized('No refresh token');
    }

    // Verify refresh token
    const tokenDoc = await tokenService.verifyRefreshToken(refreshToken);

    if (!tokenDoc) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    // Get user
    const user = await User.findById(tokenDoc.userId);

    if (!user || !user.isActive) {
        throw ApiError.unauthorized('User not found or inactive');
    }

    // Generate new access token
    const accessToken = tokenService.generateAccessToken(user);

    ApiResponse.success(res, { accessToken }, 'Token refreshed');
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
        // Revoke refresh token
        await tokenService.revokeRefreshToken(refreshToken);
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    ApiResponse.success(res, null, 'Logged out successfully');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    ApiResponse.success(res, {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: user.profile,
            preferences: user.preferences,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        }
    });
});

/**
 * @desc    Update current user profile
 * @route   PATCH /api/auth/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const allowedFields = ['profile', 'preferences'];
    const updates = {};

    // Only allow specific fields to be updated
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    ApiResponse.success(res, {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: user.profile,
            preferences: user.preferences
        }
    }, 'Profile updated');
});

/**
 * @desc    Change password
 * @route   PATCH /api/auth/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
        throw ApiError.unauthorized('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens (force re-login on other devices)
    await tokenService.revokeAllUserTokens(user._id);

    ApiResponse.success(res, null, 'Password changed successfully');
});
