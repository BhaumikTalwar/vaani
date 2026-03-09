// @ts-check

/**
 * Base API Error
 */
export class ApiError extends Error {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     * @param {number} [status] http statts
     * @param {any} [data] any data
     */
    constructor(message, status, data) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
        this.isApiError = true;
    }
}

/**
 * Network Error (no response from server)
 */
export class NetworkError extends Error {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     * @param {Error} [originalError] the original error for wrapping
     */
    constructor(message, originalError) {
        super(message);
        this.name = "NetworkError";
        this.originalError = originalError;
        this.isNetworkError = true;
    }
}

/**
 * Authentication Error (401)
 */
export class AuthError extends ApiError {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     * @param {any} [data] any data
     */
    constructor(message, data) {
        super(message, 401, data);
        this.name = "AuthError";
        this.isAuthError = true;
    }
}

/**
 * Authorization Error (403)
 */
export class ForbiddenError extends ApiError {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     * @param {any} [data] any data
     */
    constructor(message, data) {
        super(message, 403, data);
        this.name = "ForbiddenError";
        this.isForbiddenError = true;
    }
}

/**
 * Validation Error (400, 422)
 */
export class ValidationError extends ApiError {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     * @param {any} [data] any data
     * @param {number} [status] http status
     */
    constructor(message, data, status = 400) {
        super(message, status, data);
        this.name = "ValidationError";
        this.isValidationError = true;
    }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     * @param {any} [data] any data
     */
    constructor(message, data) {
        super(message, 404, data);
        this.name = "NotFoundError";
        this.isNotFoundError = true;
    }
}

/**
 * Timeout Error
 */
export class TimeoutError extends Error {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     */
    constructor(message = "Request timeout") {
        super(message);
        this.name = "TimeoutError";
        this.isTimeoutError = true;
    }
}

/**
 * Abort Error (request was cancelled)
 */
export class AbortError extends Error {
    /**
     * Constructire funcfor error
     * @param {string} message msg for the error
     */
    constructor(message = "Request aborted") {
        super(message);
        this.name = "AbortError";
        this.isAbortError = true;
    }
}
