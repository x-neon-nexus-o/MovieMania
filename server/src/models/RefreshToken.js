import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Auto-delete after 7 days (TTL index)
    },
    userAgent: String,
    ipAddress: String,
    isRevoked: {
        type: Boolean,
        default: false
    }
});

// Indexes
refreshTokenSchema.index({ token: 1 }, { unique: true });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

/**
 * Static: Find valid token
 */
refreshTokenSchema.statics.findValidToken = function (token) {
    return this.findOne({
        token,
        isRevoked: false,
        expiresAt: { $gt: new Date() }
    });
};

/**
 * Static: Revoke all tokens for a user
 */
refreshTokenSchema.statics.revokeAllUserTokens = function (userId) {
    return this.updateMany(
        { userId, isRevoked: false },
        { isRevoked: true }
    );
};

/**
 * Static: Clean up expired tokens
 */
refreshTokenSchema.statics.cleanupExpired = function () {
    return this.deleteMany({
        $or: [
            { expiresAt: { $lt: new Date() } },
            { isRevoked: true }
        ]
    });
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
