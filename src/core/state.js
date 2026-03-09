// @ts-check


/**
 * @typedef {(oldV :any , newV :any) => boolean} CompFunc
 */

/**
 * @class
 * @classdesc The class to manage state
 * @author Bhaumik Talwar
 */
class StateManager {

    /** @type {{ [key: string]: any }} */
    #state = Object.create(null);

    /** @type {{ [key: string]: Array<(newValue: any, oldValue: any) => void> }} */
    #listeners = Object.create(null);

    /** @type {{[key :string]: CompFunc }} */
    #equals = Object.create(null);

    /** @type {number} */
    #batchDepth = 0;

    /** @type {Map<string, {old: any, new: any}>} */
    #batchedChanges = new Map();

    /**
     * Get a value from state
     * @param {string} key the key associated with the state
     * @returns {any} the value
     */
    get(key) {
        return this.#state[key];
    }

    /**
     * Get a value from state
     * @param {string} key the key associated with the state
     * @returns {any | null} the value or null if does not exixts
     */
    tryGet(key) {
        const val = this.#state[key];
        if (val === undefined) return null;

        return val;
    }

    /**
     * Get entire state object
     * @returns {object} the collective all ststes (Shallow copy)
     */
    getAll() {
        return { ...this.#state };
    }

    /**
     * Get entire state object
     * @returns {object} the collective all ststes (deep copy)
     */
    getCopyAll() {
        return structuredClone(this.#state);
    }

    /**
     * Function to define a key especicially its equals func if not set
     * state in objects/arrays must create new references to trigger updates
     * @param {string} key the key of the state
     * @param {CompFunc} equals the func to compare the objects
     */
    define(key, equals) {
        if (equals) this.#equals[key] = equals;
    }

    /**
     * Set a value in state and notify listeners
     * @param {string} key the key associated with the state
     * @param {any} value the val to set for the key
     */
    set(key, value) {
        const oldValue = this.#state[key];

        const eq = this.#equals[key];
        if (eq ? eq(oldValue, value) : oldValue === value) return;

        this.#state[key] = value;

        if (this.#batchDepth > 0) {
            const existing = this.#batchedChanges.get(key);
            this.#batchedChanges.set(key, {
                old: existing ? existing.old : oldValue,
                new: value,
            });
            return;
        }

        this.#listeners[key]?.forEach(cb => {
            try {
                cb(value, oldValue);
            } catch (err) {
                queueMicrotask(() => { throw err; });
            }
        });
    }

    /**
     * Set multiple values at once with nested transaction support
     * @param {{ [key: string]: any }} updates the object to update the store with
     */
    setBatch(updates) {
        this.transaction(() => {
            for (const [k, v] of Object.entries(updates)) {
                this.set(k, v);
            }
        });
    }

    /**
     *  helper to flush changes
     */
    #flushBatchedChanges() {
        if (this.#batchedChanges.size === 0) return;

        for (const [key, { old, new: newVal }] of this.#batchedChanges) {
            this.#listeners[key]?.forEach(cb => {
                try {
                    cb(newVal, old);
                } catch (err) {
                    queueMicrotask(() => { throw err; });
                }
            });
        }
        this.#batchedChanges.clear();
    }

    /**
     * Subscribe to state changes for a specific key
     * @param {string} key the key to subscribe to
     * @param {(newValue :any, oldvalue: any) => void} callback - (newValue, oldValue) => void
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.#listeners[key]) {
            this.#listeners[key] = [];
        }

        this.#listeners[key].push(callback);

        return () => {
            const list = this.#listeners[key];
            if (!list) return;

            const next = list.filter(cb => cb !== callback);

            if (next.length === 0) {
                delete this.#listeners[key];
            } else {
                this.#listeners[key] = next;
            }
        };
    }

    /**
     * Subscribe to multiple keys at once
     * @param {string[]} keys keys to sub to
     * @param {(newValue :any, oldvalue: any) => void} callback - (newValue, oldValue) => void
     * @returns {Function} Unsubscribe function
     */
    subscribeMultiple(keys, callback) {
        const unsubscribers = keys.map(key => this.subscribe(key, callback));

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }


    /**
     * Delete a key from state
     * @param {string} key the key to delete
     */
    delete(key) {
        const oldValue = this.#state[key];
        if (!(key in this.#state)) return;

        delete this.#state[key];
        delete this.#equals[key];

        const listeners = this.#listeners[key];
        if (listeners) {
            listeners.forEach(cb => cb(undefined, oldValue));
            delete this.#listeners[key];
        }
    }

    /**
     * Check if a key exists in state
     * @param {string} key key to check
     * @returns {boolean} to return if a key is in the store or not
     */
    has(key) {
        return key in this.#state;
    }

    /**
     * Clear all state
     */
    clear() {
        const keys = Object.keys(this.#state);
        keys.forEach(key => this.delete(key));
    }

    /**
     * createa computed value that updates when dependencies change
     * @param {string[]} dependencies - State keys
     * @param {Function} computeFn - Function ro computes the value
     * @param {string} resultKey - to store the computed value
     * @returns {Function} Unsubscribe function
     */
    computed(dependencies, computeFn, resultKey) {
        let computing = false;

        const compute = () => {
            if (computing) return;
            computing = true;

            try {
                const values = dependencies.map(key => this.get(key));
                const result = computeFn(...values);
                this.set(resultKey, result);
            } finally {
                computing = false;
            }
        };

        const unsubscribers = dependencies.map(key =>
            this.subscribe(key, compute),
        );

        compute();

        return () => {
            unsubscribers.forEach(unsub => unsub());
            this.delete(resultKey);
        };
    }

    /**
     * To run a Code to state change in between the bacth updates
     * @param {Function} fn teh function to compute between a batch
     */
    transaction(fn) {
        this.#batchDepth++;
        try {
            fn();
        } finally {
            this.#batchDepth--;
            if (this.#batchDepth === 0) this.#flushBatchedChanges();
        }
    }

}

export const state = new StateManager();
