import { Router } from 'express';
import {
    register,
    login,
    refreshAccessToken,
    logout,
    getMe,
    updateProfile,
    changePassword,
    registerValidation,
    loginValidation
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateProfile);
router.patch('/password', authenticate, changePassword);

export default router;
