// @ts-check

/**
 * @class CsrfManager
 * @classdesc Manages CSRF token from cookies
 * @author Bhaumik Talwar
 */
export class CsrfManager {
    /** @type {string} */
    #cookieName;

    /** @type {string} */
    #headerName;

    /**
     * Construtir func for manager
     * @param {string} [cookieName] - Name of the CSRF cookie (set by server)
     * @param {string} [headerName] - Name of the CSRF header (to be set by client)
     */
    constructor(cookieName = "csrf_token", headerName = "X-CSRF-Token") {
        this.#cookieName = cookieName;
        this.#headerName = headerName;
    }

    /**
     * Get CSRF token from cookie
     * @returns {string | null} the csrf token set by tthe server
     */
    getToken() {
        const cookies = document.cookie.split(";");

        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === this.#cookieName) {
                return decodeURIComponent(value);
            }
        }

        return null;
    }

    /**
     * Get the header name for CSRF
     * @returns {string} header name
     */
    getHeaderName() {
        return this.#headerName;
    }

    /**
     * Check if CSRF token exists
     * @returns {boolean} if csrf token is set by server
     */
    hasToken() {
        return this.getToken() !== null;
    }

    /**
     * Get CSRF header object ready to merge into request headers
     * @returns {{ [key: string]: string } | null} complete header to be set for non -get reqs
     */
    getHeader() {
        const token = this.getToken();
        if (!token) return null;

        return {
            [this.#headerName]: token,
        };
    }
}

/**
 * @constant
 * @type {CsrfManager}
 */
export const DefaultCsrfManager = new CsrfManager();
