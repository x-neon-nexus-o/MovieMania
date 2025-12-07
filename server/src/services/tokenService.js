import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';
import env from '../config/environment.js';

/**
 * Token Service
 * Handles JWT generation and verification
 */
class TokenService {
    /**
     * Generate access token
     * @param {Object} user - User object
     * @returns {string} JWT access token
     */
    generateAccessToken(user) {
        return jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            env.jwtSecret,
            { expiresIn: env.jwtExpiresIn }
        );
    }

    /**
     * Generate refresh token and save to database
     * @param {Object} user - User object
     * @param {Object} metadata - Request metadata (userAgent, ip)
     * @returns {Promise<string>} Refresh token
     */
    async generateRefreshToken(user, metadata = {}) {
        // Generate random token
        const token = crypto.randomBytes(40).toString('hex');

        // Calculate expiry (7 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Save to database
        await RefreshToken.create({
            token,
            userId: user._id,
            expiresAt,
            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress
        });

        return token;
    }

    /**
     * Verify access token
     * @param {string} token - JWT token
     * @returns {Object} Decoded token payload
     */
    verifyAccessToken(token) {
        return jwt.verify(token, env.jwtSecret);
    }

    /**
     * Verify refresh token
     * @param {string} token - Refresh token
     * @returns {Promise<Object|null>} Token document or null
     */
    async verifyRefreshToken(token) {
        const refreshToken = await RefreshToken.findValidToken(token);
        return refreshToken;
    }

    /**
     * Revoke refresh token
     * @param {string} token - Refresh token to revoke
     */
    async revokeRefreshToken(token) {
        await RefreshToken.updateOne({ token }, { isRevoked: true });
    }

    /**
     * Revoke all tokens for a user
     * @param {string} userId - User ID
     */
    async revokeAllUserTokens(userId) {
        await RefreshToken.revokeAllUserTokens(userId);
    }

    /**
     * Generate both tokens
     * @param {Object} user - User object
     * @param {Object} metadata - Request metadata
     * @returns {Promise<Object>} Both tokens
     */
    async generateTokenPair(user, metadata = {}) {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user, metadata);

        return { accessToken, refreshToken };
    }
}

export default new TokenService();
