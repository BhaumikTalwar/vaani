// @ts-check

import { JsonCodec } from "../core/codec.js";

/**
 * @typedef {object} CacheEntry the cache Entry object
 * @property {any} value  the value
 * @property {number} expiresAt the expires at time
 */

/**
 *
 */
class CacheService {
    /** @type {Storage} */
    #storage;

    /** @type {string} */
    #namespace;

    /** @type {number} */
    #defaultTTL;

    /** @type {import("../core/codec.js").Codec} */
    #codec;

    /**
     * Construtor function
     * @param {object} config the config
     * @param {Storage} config.storage the storage object to choose
     * @param {string} config.namespace the namespace
     * @param {number} [config.defaultTTL] the ttl default
     * @param {import("../core/codec.js").Codec} [config.codec] the codec to pick
     */
    constructor({ storage, namespace, defaultTTL = 0, codec = JsonCodec }) {
        this.#storage = storage;
        this.#namespace = namespace;
        this.#defaultTTL = defaultTTL;
        this.#codec = codec;
    }

    /**
     * Private fucn to get Key final
     * @param {string} key the key input
     * @returns {string} the final key
     */
    #key(key) {
        return `${this.#namespace}:${key}`;
    }

    /**
     * The set function
     * @param {string} key the key
     * @param {any} value the value
     * @param {{ ttl?: number }} [options] the optional ttl
     */
    set(key, value, options = {}) {
        const ttl = options.ttl ?? this.#defaultTTL;

        /** @type {CacheEntry} */
        const entry = {
            value,
            expiresAt: ttl > 0 ? Date.now() + ttl : Infinity,
        };

        try {
            const encoded = this.#codec.encode(entry);

            const payload =
                encoded instanceof Uint8Array
                    ? btoa(String.fromCharCode(...encoded))
                    : encoded;

            this.#storage.setItem(this.#key(key), payload);
        } catch (err) {
            console.error("CacheService.set failed:", key, err);
        }
    }

    /**
     * The Get function
     * @param {string} key the key
     * @returns {any | null} the value if it exist
     */
    get(key) {
        try {
            const raw = this.#storage.getItem(this.#key(key));
            if (!raw) return null;

            let decoded;
            if (this.#codec !== JsonCodec) {
                const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0));
                decoded = this.#codec.decode(bytes);
            } else {
                decoded = this.#codec.decode(new TextEncoder().encode(raw));
            }

            /** @type {CacheEntry} */
            const entry = decoded;

            if (Date.now() > entry.expiresAt) {
                this.remove(key);
                return null;
            }

            return entry.value;
        } catch (err) {
            console.error("CacheService.get failed:", key, err);
            this.remove(key);
            return null;
        }
    }

    /**
     * The func to remove
     * @param {string} key the key
     */
    remove(key) {
        this.#storage.removeItem(this.#key(key));
    }

    /**
     * Clear all cached entries for this namespace
     */
    clear() {
        const prefix = `${this.#namespace}:`;
        for (let i = this.#storage.length - 1; i >= 0; i--) {
            const key = this.#storage.key(i);
            if (key?.startsWith(prefix)) {
                this.#storage.removeItem(key);
            }
        }
    }
}

export const localCache = new CacheService({
    storage: window.localStorage,
    namespace: "amaanat:cache",
    defaultTTL: 15 * 60 * 1000,
    codec: JsonCodec,
});

export const sessionCache = new CacheService({
    storage: window.sessionStorage,
    namespace: "amaanat:session",
    codec: JsonCodec,
});
