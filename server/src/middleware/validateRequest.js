import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to validate request using express-validator
 * Must be used after validation chain
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        // Get first error message for the main message
        const firstError = errorMessages[0].message;

        return res.status(400).json({
            success: false,
            message: firstError,
            errors: errorMessages
        });
    }

    next();
};

export default validateRequest;
