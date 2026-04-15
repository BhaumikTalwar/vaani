// @ts-check

import { API_ENDPOINTS } from "../../constants/endpoints.js";
import { JsonCodec } from "../codec.js";
import { CsrfManager, DefaultCsrfManager } from "./csrfManager.js";
import {
    ApiError,
    NetworkError,
    AuthError,
    ForbiddenError,
    ValidationError,
    NotFoundError,
    TimeoutError,
    AbortError,
} from "./errors.js";

/** @import {Codec} from '../codec.js' */

/**
 * @typedef {object} RequestConfig
 * @property {string} [method] - HTTP method
 * @property {any} [body] - Request body
 * @property {Record<string, string>} [headers] - Additional headers
 * @property {number} [timeout] - Timeout in ms
 * @property {AbortSignal} [signal] - Abort signal
 * @property {boolean} [skipCsrf] - Skip CSRF token
 * @property {boolean} [skipAuth401Handling] - Skip automatic 401 handling
 * @property {number} [retries] - Number of retries for network errors
 * @property {boolean} [_retry] - Internal use: indicates a retry after refresh
 */

/**
 * @typedef {object} ApiResponse
 * @property {any} data - Response data
 * @property {number} status - HTTP status
 * @property {Headers} headers - Response headers
 * @property {boolean} ok - Success flag
 */

/**
 * @class
 * @classdesc The base Api client class
 * @author Bhaumik Talwar
 */
export class ApiClient {

    /** @type {string} */
    #baseURL;

    /** @type {Record<string, string>} */
    #defaultHeaders;

    /** @type {number} */
    #defaultTimeout;

    /** @type {import("../codec.js").Codec} */
    #codec;

    /** @type {CsrfManager} */
    #csrfmanager = DefaultCsrfManager;

    /** @type {(() => void) | null} */
    #onSessionExpired = null;

    /** @type {Promise<void> | null} */
    #refreshPromise = null;

    /** @type {Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>>} */
    #requestInterceptors = [];

    /** @type {Array<(response: ApiResponse) => ApiResponse | Promise<ApiResponse>>} */
    #responseInterceptors = [];

    /** @type {Array<(error: Error) => Error | Promise<Error>>} */
    #errorInterceptors = [];

    /**
     * Api Client config
     * @param {object} config the Api Client config
     * @param {string} config.baseURL - Base URL for all requests
     * @param {Record<string, string>} [config.headers] - Default headers
     * @param {number} [config.timeout] - Default timeout in ms
     * @param {import("../codec.js").Codec} [config.codec] - Codec (json/MsgPack)
     */
    constructor(config) {
        this.#baseURL = config.baseURL.replace(/\/$/, "");
        this.#defaultHeaders = config.headers || {};
        this.#defaultTimeout = config.timeout || 30000;
        this.#codec = config.codec || JsonCodec;
    }

    /**
     * Set Codec (JSON, MessagePack)
     * @param {import("../codec.js").Codec} codec the coodec to use
     * @returns {ApiClient} for chaining
     */
    setCodec(codec) {
        this.#codec = codec;
        return this;
    }

    /**
     * Set the custom Csrf Manager if any
     * @param {CsrfManager} csrfMan the csrfManager
     * @returns {ApiClient} for chaining
     */
    setCsrfManager(csrfMan) {
        this.#csrfmanager = csrfMan;
        return this;
    }

    /**
     * Set session expired handler
     * @param {() => void} fn session expire handler
     * @returns {ApiClient} for chaining
     */
    setSessionExpiredHandler(fn) {
        this.#onSessionExpired = fn;
        return this;
    }

    /**
     * Add request interceptor
     * @param {(config: RequestConfig) => RequestConfig | Promise<RequestConfig>} interceptor interceptor to add
     * @returns {ApiClient} for chaining
     */
    addRequestInterceptor(interceptor) {
        this.#requestInterceptors.push(interceptor);
        return this;
    }

    /**
     * Add response interceptor
     * @param {(response: ApiResponse) => ApiResponse | Promise<ApiResponse>} interceptor interceptor to add
     * @returns {ApiClient} for chaining
     */
    addResponseInterceptor(interceptor) {
        this.#responseInterceptors.push(interceptor);
        return this;
    }

    /**
     * Add error interceptor
     * @param {(error: Error) => Error | Promise<Error>} interceptor interceptor to add
     * @returns {ApiClient} for chaining
     */
    addErrorInterceptor(interceptor) {
        this.#errorInterceptors.push(interceptor);
        return this;
    }

    /**
     * GET request
     * @param {string} url the url
     * @param {RequestConfig} [config] tehconfig for request
     * @returns {Promise<ApiResponse>} the response
     */
    async get(url, config = {}) {
        return this.request(url, { ...config, method: "GET" });
    }

    /**
     * POST request
     * @param {string} url the url
     * @param {any} [data] the post data
     * @param {RequestConfig} [config] tehconfig for request
     * @returns {Promise<ApiResponse>} the response
     */
    async post(url, data, config = {}) {
        return this.request(url, { ...config, method: "POST", body: data });
    }

    /**
     * PUT request
     * @param {string} url the url
     * @param {any} [data] the  data
     * @param {RequestConfig} [config] tehconfig for request
     * @returns {Promise<ApiResponse>} the response
     */
    async put(url, data, config = {}) {
        return this.request(url, { ...config, method: "PUT", body: data });
    }

    /**
     * PATCH request
     * @param {string} url the url
     * @param {any} [data] the  data
     * @param {RequestConfig} [config] tehconfig for request
     * @returns {Promise<ApiResponse>} the response
     */
    async patch(url, data, config = {}) {
        return this.request(url, { ...config, method: "PATCH", body: data });
    }

    /**
     * DELETE request
     * @param {string} url the url
     * @param {RequestConfig} [config] tehconfig for request
     * @returns {Promise<ApiResponse>} the response
     */
    async delete(url, config = {}) {
        return this.request(url, { ...config, method: "DELETE" });
    }

    /**
     * Main request method
     * @param {string} url the url
     * @param {RequestConfig} [config] tehconfig for request
     * @returns {Promise<ApiResponse>} the response
     */
    async request(url, config = {}) {
        try {
            let finalConfig = { ...config };
            for (const interceptor of this.#requestInterceptors) {
                finalConfig = await interceptor(finalConfig);
            }

            const response = await this.#makeRequest(url, finalConfig);

            let finalResponse = response;
            for (const interceptor of this.#responseInterceptors) {
                finalResponse = await interceptor(finalResponse);
            }

            return finalResponse;

        } catch (/** @type {unknown} */ error) {
            /** @type {Error} */
            let finalError =
                error instanceof Error
                    ? error
                    : new Error("Unknown error");

            for (const interceptor of this.#errorInterceptors) {
                finalError = await interceptor(finalError);
            }

            if (
                finalError instanceof AuthError &&
                !config._retry &&
                !config.skipAuth401Handling
            ) {
                try {
                    if (!this.#refreshPromise) {
                        this.#refreshPromise = this.#refreshToken()
                            .finally(() => {
                                this.#refreshPromise = null;
                            });
                    }

                    await this.#refreshPromise;
                    return await this.request(url, { ...config, _retry: true });

                } catch (refreshError) {
                    this.#onSessionExpired?.();
                    throw refreshError;
                }
            }

            if (finalError instanceof AuthError && !config.skipAuth401Handling) {
                this.#onSessionExpired?.();
            }

            throw finalError;
        }
    }

    /**
     * Make the actual HTTP request
     * @param {string} url the url
     * @param {RequestConfig} config tehconfig for request
     * @returns {Promise<ApiResponse>} the response
     */
    async #makeRequest(url, config) {
        const method = config.method || "GET";
        const timeout = config.timeout || this.#defaultTimeout;
        const retries = config.retries || 0;

        /** @type {{[key :string] : string}}*/
        let csrfHeader = {};
        if (!config.skipCsrf && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
            csrfHeader = this.#csrfmanager.getHeader() ?? {};
        }

        const headers = {
            ...this.#defaultHeaders,
            ...config.headers,
            ...csrfHeader,
        };

        if (this.#codec?.accept && !headers["Accept"]) {
            headers["Accept"] = this.#codec.accept;
        }

        /** @type {BodyInit | undefined} */
        let body = undefined;
        if (config.body !== undefined && method !== "GET" && method !== "HEAD") {
            if (config.body instanceof FormData || config.body instanceof Blob) {
                body = config.body;
            } else {
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = this.#codec.contentType;
                }

                let encoded = this.#codec.encode(config.body);
                if (encoded instanceof Promise) {
                    encoded = await encoded;
                }
                if (encoded instanceof Uint8Array) {
                    body = encoded.buffer;
                } else {
                    body = encoded;
                }
            }
        }

        const controller = new AbortController();
        const signal = AbortSignal.any(
            [controller.signal, config.signal].filter(Boolean),
        );

        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const fullUrl = url.startsWith("http") ? url : `${this.#baseURL}${url}`;

            const response = await fetch(fullUrl, {
                method,
                headers,
                body,
                signal,
                credentials: "include",
            });

            clearTimeout(timeoutId);

            const data = await this.#parseResponse(response);
            if (!response.ok) {
                throw this.#createErrorFromResponse(response, data);
            }

            return {
                data,
                status: response.status,
                headers: response.headers,
                ok: response.ok,
            };

        } catch (error) {
            clearTimeout(timeoutId);

            /** @type {Error} */
            const err =
                error instanceof Error
                    ? error
                    : new Error("Unknown error");

            if (err.name === "AbortError") {
                throw new AbortError("Request was aborted");
            }

            if (controller.signal.aborted) {
                throw new TimeoutError(`Request timeout after ${timeout}ms`);
            }

            if (err instanceof TypeError || err.message.includes("fetch")) {
                if (retries > 0) {
                    await this.#delay(Math.pow(2, 3 - retries) * 1000);
                    return this.#makeRequest(url, { ...config, retries: retries - 1 });
                }
                throw new NetworkError("Network error occurred", err);
            }

            throw err;
        }
    }

    /**
     * Parse response based on content type
     * @param {Response} response the response
     * @returns {Promise<any>} parsed resonse
     */
    async #parseResponse(response) {
        const contentType = response.headers.get("content-type") || "";

        if (response.status === 204 ||
            response.headers.get("content-length") === "0") {
            return null;
        }

        if (this.#codec?.supports?.(contentType)) {
            return this.#codec.decode(await response.arrayBuffer());
        }

        if (contentType.startsWith("text/")) {
            return await response.text();
        }

        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    /**
     * Create appropriate error from response
     * @param {Response} response the response
     * @param {any} data the data to wrqp in error
     * @returns {Error} teh new error
     */
    #createErrorFromResponse(response, data) {
        const message = data?.message || data?.error || `Request failed with status ${response.status}`;

        switch (response.status) {
            case 401:
                return new AuthError(message, data);
            case 403:
                return new ForbiddenError(message, data);
            case 404:
                return new NotFoundError(message, data);
            case 400:
            case 422:
                return new ValidationError(message, data, response.status);
            default:
                return new ApiError(message, response.status, data);
        }
    }

    /**
     * delay utility for retries
     * @param {number} ms delay in ms
     * @returns {Promise<void>} delay promise
     */
    async #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * The refresh function to call refresh
     * @returns {Promise<ApiResponse>}
     */
    async #refreshToken() {
        return this.#makeRequest(API_ENDPOINTS.Refresh, {
            method: "POST",
            skipAuth401Handling: true,
            skipCsrf: true,
        });
    }

}
