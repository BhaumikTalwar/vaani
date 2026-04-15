// @ts-check

import { state } from "../core/state.js";
import { router } from "../core/router.js";
import { API_ENDPOINTS } from "../constants/endpoints.js";
import { AuthError } from "../core/ApiClient/errors.js";
import { ApiClient } from "../core/ApiClient/api.js";

/**
 * @typedef {'idle' | 'pending' | 'authenticated' | 'unauthenticated'} AuthStatus
 */

/**
 * @typedef {object} User
 * @property {string} id the user id
 * @property {string} email the user email
 * @property {string} first_name the first email
 * @property {string} last_name the last email
 * @property {string} avatar_url the avatar
 * @property {string[]} roles the user roles
 * @property {Record<string, any>} [meta] teh meta data
 */

/**
 * @typedef {object} AuthServiceConfig
 * @property {string} loginRoute the router route for login
 * @property {string} logoutRedirect the router route for redirect
 * @property {string} defaultAuthenticatedRedirect the default Authenticated rout
 * @property {string} unauthorizedRoute teh unauthorized route
 */

/**
 * @typedef {object} RequireAuthOptions
 * @property {string | string[]} [roles] roles needed
 * @property {boolean} [requireAll] if all roles needed
 * @property {string} [redirectTo] redirect to
 */

const AUTH_STATUS_KEY = "auth.status";
const AUTH_USER_KEY = "auth.user";
const AUTH_IS_AUTHENTICATED = "auth.isAuthenticated";

/**
 * @class AuthService
 * @classdesc The class for Auth Service also gives general guard funcs
 */
export class AuthService {

    /** @type {ApiClient} */
    #apiClient = null

    /** @type {boolean} */
    #initialized = false;

    /** @type {Readonly<AuthServiceConfig>} */
    #config;

    /**
     * @returns {Readonly<AuthServiceConfig>}
     */
    get config() {
        return this.#config;
    }

    /**
     * the construtore for the AuthService
     * @param {ApiClient} apiClient The Api Client to use
     * @param {Partial<AuthServiceConfig>} [config] the config
     */
    constructor(apiClient, config = {}) {
        if (apiClient === null) throw new Error("Api Client is Null")

        this.#apiClient = apiClient
        this.#config = Object.freeze({
            loginRoute: "/login",
            logoutRedirect: "/signin",
            defaultAuthenticatedRedirect: "/",
            unauthorizedRoute: "/unauthorized",
            ...config,
        });

        state.setBatch({
            [AUTH_STATUS_KEY]: /** @type {AuthStatus} */ ("idle"),
            [AUTH_USER_KEY]: null,
            [AUTH_IS_AUTHENTICATED]: false,
        });
    }

    /**
     * Initialize auth service (to be called once)
     * @returns {void}
     */
    initialize() {
        if (this.#initialized) return;

        this.#apiClient.setSessionExpiredHandler(() => {
            this.#handleSessionExpired();
        });

        this.#initialized = true;
    }

    /**
     * Restore session from server
     * @returns {Promise<void>}
     */
    async checkSession() {
        state.set(AUTH_STATUS_KEY, "pending");

        try {
            const res = await this.#apiClient.get(API_ENDPOINTS.Me);

            state.setBatch({
                [AUTH_USER_KEY]: res.data,
                [AUTH_IS_AUTHENTICATED]: true,
                [AUTH_STATUS_KEY]: "authenticated",
            });
        } catch (err) {
            this.#clearSession();

            if (!(err instanceof AuthError)) {
                //TODO:- Handler errror
            }
        }
    }

    /**
     * Authenticate user with credentials
     * @param {{ email: string, password: string }} credentials the creds
     * @returns {Promise<User>} teh user
     */
    async login(credentials) {
        await this.#apiClient.post(API_ENDPOINTS.Login, credentials);
        await this.checkSession();

        const user = this.getUser();
        if (!user) {
            throw new Error("Login succeeded but user could not be loaded");
        }

        return user;
    }

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            await this.#apiClient.post(API_ENDPOINTS.Logout, {});
        } catch (err) {
            console.warn("Logout request failed", err);
        } finally {
            this.#clearSession();
            router.navigate(this.#config.logoutRedirect, true);
        }
    }

    /**
     * Handle session expiry (401)
     * @returns {void}
     */
    #handleSessionExpired() {
        const current = router.getCurrentPath();
        this.#clearSession();

        router.navigate(
            `${this.#config.logoutRedirect}?redirect=${encodeURIComponent(current)}`,
            true,
        );
    }

    /**
     * Clear auth state
     * @returns {void}
     */
    #clearSession() {
        state.setBatch({
            [AUTH_USER_KEY]: null,
            [AUTH_IS_AUTHENTICATED]: false,
            [AUTH_STATUS_KEY]: "unauthenticated",
        });
    }

    /**
     * Get teh Current USer
     * @returns {User | null} the user or null
     */
    getUser() {
        return state.get(AUTH_USER_KEY);
    }

    /**
     * If the user is authenticated or not
     * @returns {boolean} boolean
     */
    isAuthenticated() {
        return state.get(AUTH_IS_AUTHENTICATED) === true;
    }

    /**
     * TO het the status
     * @returns {AuthStatus} the auth stats
     */
    getStatus() {
        return state.get(AUTH_STATUS_KEY);
    }

    /**
     * If the user has role or not
     * @param {string | string[]} roles teh required role
     * @param {boolean} [requireAll] if all roles are required
     * @returns {boolean} boolean
     */
    hasRole(roles, requireAll = true) {
        const user = this.getUser();
        if (!user || !Array.isArray(user.roles)) return false;

        const userRoles = new Set(user.roles);
        const check = Array.isArray(roles) ? roles : [roles];

        return requireAll
            ? check.every(r => userRoles.has(r))
            : check.some(r => userRoles.has(r));
    }

    /**
     * Guard for the router
     * @param {RequireAuthOptions} [options] the options
     * @returns {(ctx: any) => (void | string | false | Promise<void | string | false>)}
     */
    requireAuth(options = {}) {
        return () => {
            if (!this.isAuthenticated()) {
                return this.#config.loginRoute;
            }

            if (options.roles) {
                const ok = this.hasRole(
                    options.roles,
                    options.requireAll ?? true,
                );

                if (!ok) {
                    return options.redirectTo || this.#config.unauthorizedRoute;
                }
            }
        };
    }

    /**
     * Guard for router
     * @param {string} [redirectTo] the route to redirect to
     * @returns {() => (void | string)}
     */
    requireGuest(redirectTo) {
        return () => {
            if (this.isAuthenticated()) {
                return redirectTo ?? this.#config.defaultAuthenticatedRedirect;
            }
        };
    }
}

