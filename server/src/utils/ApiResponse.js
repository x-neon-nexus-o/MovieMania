/**
 * Standardized API Response class
 * Provides consistent response format across all endpoints
 */
class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    /**
     * Send response
     * @param {Response} res - Express response object
     */
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data
        });
    }

    // Factory methods for common responses
    static success(res, data, message = 'Success') {
        return new ApiResponse(200, data, message).send(res);
    }

    static created(res, data, message = 'Created successfully') {
        return new ApiResponse(201, data, message).send(res);
    }

    static noContent(res) {
        return res.status(204).send();
    }

    static paginated(res, items, pagination, message = 'Success') {
        return new ApiResponse(200, { items, pagination }, message).send(res);
    }

    static error(res, message = 'Internal Server Error', statusCode = 500, errors = []) {
        return res.status(statusCode).json({
            success: false,
            message: message,
            errors: errors,
            data: null
        });
    }
}

export default ApiResponse;
