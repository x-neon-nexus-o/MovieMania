import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    profile: {
        displayName: {
            type: String,
            maxlength: 50
        },
        avatar: String,
        bio: {
            type: String,
            maxlength: 500
        }
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        publicProfile: {
            type: Boolean,
            default: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    integrations: {
        trakt: {
            accessToken: String,
            refreshToken: String,
            tokenExpiresAt: Date,
            username: String,
            lastSync: Date
        }
    },
    lastLogin: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

/**
 * Pre-save hook to hash password
 */
userSchema.pre('save', async function (next) {
    // Only hash password if it was modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Hash password with 12 salt rounds
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare password method
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Get public profile (exclude sensitive data)
 */
userSchema.methods.toPublicProfile = function () {
    return {
        id: this._id,
        username: this.username,
        profile: this.profile,
        createdAt: this.createdAt
    };
};

const User = mongoose.model('User', userSchema);

export default User;
