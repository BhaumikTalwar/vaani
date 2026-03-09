// @ts-check
/**
 * @typedef {object} Route
 * @property {string} path - Route path (for :params)
 * @property {(ctx: { params: object, query: object }) => Promise<HTMLElement>} component the component that returns the comp
 * @property {() => Promise<HTMLElement>} [layout] The layout of the page
 * @property {(ctx: { params: object, query: object }) => (false | string | void | Promise<false | string | void>)} [beforeEnter] - Guard function, return false | new path to navigqate to prevent mal
 * @property {string} [title] - Page title
 * @property {RegExp} [_regex] - Compiled regex for path matching (Internal)
 * @property {string[]} [_paramNames] - List of param names extracted from path (Internal)
 */

/**
 * @class Router
 * @classdesc Router Class for a basic router setup
 * @author Bhaumik Talwar
 */
export class Router {

    /** @type {string} */
    #baseTitle = "App";

    /** @type {Route[]} */
    #routes = [];

    /** @type {Route|null} */
    #currentRoute = null;

    /** @type {object} */
    #params = {};

    /** @type {object} */
    #queryParams = {};

    /** @type {HTMLElement|null} */
    #appContainer = null;

    /** @type {Function|null} */
    #currentLayoutRenderFn = null;

    /** @type {() => Promise<HTMLElement>} */
    #notFoundComponent = async () => {
        const div = document.createElement("div");
        div.textContent = "404 Not Found";
        return div;
    };

    /** @type {() => Promise<HTMLElement>} */
    #errorComponent = async () => {
        const div = document.createElement("div");
        div.textContent = "Application Error";
        return div;
    };

    /** @type {number}*/
    #navId = 0;

    /** @type {Map<string, Set<Function>>} */
    #events = new Map();

    /**
     * Subscribe to router events
     * @param {string} event - The name of the event to subscribe to.
     * @param {Function} cb - The callback function to execute when the event is emitted.
     * @returns {() => void} An unsubscribe function.
     */
    on(event, cb) {
        if (!this.#events.has(event)) {
            this.#events.set(event, new Set());
        }
        this.#events.get(event)?.add(cb);

        return () => {
            this.#events.get(event)?.delete(cb);
            if (this.#events.get(event)?.size === 0) {
                this.#events.delete(event);
            }
        };
    }

    /**
     * Emit a router event
     * @param {string} event - The name of the event to emit.
     * @param {any} [payload] - The data to pass to the event listeners.
     */
    #emit(event, payload) {
        const listeners = this.#events.get(event);
        if (listeners) {
            listeners.forEach(cb => {
                // call the call back cb(payload)
                try {
                    cb(payload);
                } catch (err) {
                    console.error(`Error in router event listener for '${event}':`, err);
                }
            });
        }
    }

    /**
     *Cnstructir function to create a app router
     * @param {string } baseName the base app name
     */
    constructor(baseName = "App") {
        this.#baseTitle = baseName;
    }

    /**
     * To initialize the router for the application
     * @param {string} [containerId] The element Id for the container
     * @throws {Error}
     */
    init(containerId = "app") {
        this.#appContainer = document.getElementById(containerId);

        if (!this.#appContainer) {
            throw new Error("App container was not found");
        }

        window.addEventListener("popstate", () => {
            this.handleRoute(window.location.pathname + window.location.search);
        });

        document.addEventListener("click", (e) => {
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey || e.ctrlKey || e.shiftKey
            ) return;

            if (!(e.target instanceof Element)) return;

            const link = e.target.closest("a[data-link]");
            if (!(link instanceof HTMLAnchorElement)) return;

            e.preventDefault();
            const href = link.getAttribute("href");
            if (!href) return;

            this.navigate(href);
        });

        this.handleRoute(window.location.pathname + window.location.search);
    }


    /**
     * The Static Function to get the Outlet Attribute
     * @returns {string} the attr
     */
    static get OUTLET_ATTR() { return "data-router-outlet"; }

    /**
     * The function to set up a 404 handler comp
     * @param {() => Promise<HTMLElement>} fn the 404 comp async func that return a Html elem
     * @returns {Router} this object for chaining
     */
    setNotFoundComp(fn) {
        this.#notFoundComponent = fn;
        return this;
    }

    /**
     * Function to set up the err comp
     * @param {() => Promise<HTMLElement>} fn the err comp
     * @returns {Router} this object for chaining
     */
    setErrComp(fn) {
        this.#errorComponent = fn;
        return this;
    }

    /**
     * Add a route to the router
     * @param {Route} route the route object
     */
    addRoute(route) {
        if (route.path !== "*") {
            /** @type {string[]} */
            const paramNames = [];

            const escapedPath = route.path.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
            );

            const regexPath = escapedPath.replace(
                /:([^/]+)/g,
                (_, paramName) => {
                    paramNames.push(paramName);
                    return "([^/]+)";
                },
            );

            route._regex = new RegExp(`^${regexPath}$`);
            route._paramNames = paramNames;
        }

        this.#routes.push(route);
    }

    /**
     * Navigate to a new path
     * @param {string} path the path to navigate to
     * @param {boolean} [replace] - Use replaceState instead of pushState
     */
    navigate(path, replace = false) {
        if (replace) {
            window.history.replaceState({}, "", path);
        } else {
            window.history.pushState({}, "", path);
        }

        const fullPath = window.location.pathname + window.location.search;
        this.handleRoute(fullPath);
    }

    /**
     * Handle route change
     * @async
     * @param {string} path the path to handle
     */
    async handleRoute(path) {
        const navId = ++this.#navId;

        this.#emit("start", { path, navId });

        try {
            const { pathname, search } = this.#normalizePath(path);
            this.#queryParams = this.parseQuery(search);

            const { route, params } = this.matchRoute(pathname);

            if (!route) {
                const comp = await this.#notFoundComponent();
                if (navId !== this.#navId) return;

                this.#currentLayoutRenderFn = null;
                this.render(comp);
                this.#currentRoute = null;
                return;
            }

            this.#params = params;

            if (route.beforeEnter) {

                const result = await route.beforeEnter({
                    params,
                    query: this.#queryParams,
                });

                if (navId !== this.#navId) return;

                if (result === false) {
                    this.navigate("/", true);
                    return;
                }
                if (typeof result === "string") {
                    this.navigate(result, true);
                    return;
                }
            }

            if (route.title) {
                document.title = route.title
                    ? `${route.title} - ${this.#baseTitle}`
                    : this.#baseTitle;
            }

            this.#currentRoute = route;

            const component = await route.component({ params, query: this.#queryParams });
            if (navId !== this.#navId) return;

            if (route.layout) {
                if (this.#currentLayoutRenderFn === route.layout) {
                    this.updateOutlet(component);
                } else {
                    const layoutElement = await route.layout();
                    if (navId !== this.#navId) return;

                    this.#currentLayoutRenderFn = route.layout;
                    this.render(layoutElement, component);
                }
            } else {
                this.#currentLayoutRenderFn = null;
                this.render(component);
            }

        } catch (error) {
            // console.error("Router Error:", error);
            if (navId === this.#navId) {
                this.#emit("error", error);
                this.render(await this.#errorComponent());
            }
        } finally {
            if (navId === this.#navId) {
                this.#emit("end", { path, navId });
            }
        }
    }

    /**
     * function to parse query Params
     * @param {string} search the query string
     * @returns {object} for the query params
     */
    parseQuery(search = "") {
        /** @type {Record<string, string | string[]>} */
        const query = {};
        if (!search) return query;

        const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
        for (const [key, value] of params.entries()) {
            if (key in query) {
                const prev = query[key];
                query[key] = Array.isArray(prev) ? [...prev, value] : [prev, value];
            } else {
                query[key] = value;
            }
        }

        return query;
    }

    /**
     * Match path to route and extract params
     * @param {string} path the path to match with
     * @returns {{route: Route | null, params: object}} the route and the parma
     */
    matchRoute(path) {
        path = path === "" ? "/" : path;

        for (const route of this.#routes) {
            if (route.path === "*") continue;

            const match = route._regex?.exec(path);
            if (match) {
                /** @type {Record<string, string>} */
                const params = {};

                route._paramNames?.forEach((name, index) => {
                    params[name] = decodeURIComponent(match[index + 1]);
                });

                return { route, params };
            }
        }

        const catchAll = this.#routes.find(r => r.path === "*");
        return { route: catchAll ?? null, params: {} };
    }

    /**
     * Normalize path:
     * @param {string} path the path tb be nomarlized
     * @returns {{ pathname: string, search: string }} the nrmalized path object
     */
    #normalizePath(path) {
        const url = new URL(path, window.location.origin);

        let pathname = url.pathname;
        if (pathname.length > 1 && pathname.endsWith("/")) {
            pathname = pathname.slice(0, -1);
        }

        return {
            pathname,
            search: url.search,
        };
    }

    /**
     * Render component into app container or layout
     * @param {HTMLElement} contentOrLayout The main element to put in DOM
     * @param {HTMLElement | null} [pageComponent] If using layout, this is the inner content
     */
    render(contentOrLayout, pageComponent = null) {
        if (!this.#appContainer) return;

        this.#appContainer.replaceChildren(contentOrLayout);

        if (pageComponent) {
            this.updateOutlet(pageComponent);
        } else {
            window.scrollTo(0, 0);
        }
    }

    /**
     * Updates only the inner content of the current layout
     * @param {HTMLElement} component teh comp to update
     */
    updateOutlet(component) {
        if (!this.#appContainer) return;
        const outlet = this.#appContainer.querySelector(`[${Router.OUTLET_ATTR}]`);

        if (outlet) {
            outlet.replaceChildren(component);

            window.scrollTo(0, 0);
            outlet.scrollTop = 0;
        } else {
            this.#appContainer.appendChild(component);
            window.scrollTo(0, 0);
        }
    }

    /**
     * Get current route params
     * @returns {object} the params for the current path
     */
    getParams() {
        return this.#params;
    }

    /**
     * Get current query params
     * @returns {object} the query params for the current path
     */
    getQueryParams() {
        return this.#queryParams;
    }

    /**
     * Get current path
     * @returns {string} the curent path
     */
    getCurrentPath() {
        return window.location.pathname + window.location.search;
    }

    /**
     * Get Current Route Object
     * @returns {Route | null} curr route
     */
    getCurrentRoute() {
        return this.#currentRoute;
    }

    /**
     * A function to get a router link
     * @param {string} path teh path of teh route
     * @returns {object} teh object to assign to anchor tag
     */
    link(path) {
        return {
            href: path,
            "data-link": "",
        };
    }

    /**
     * A function to get a router link
     * @param {string} path teh path of teh route
     * @returns {string} teh object to assign to anchor tag
     */
    linkAttrs(path) {
        return `href="${path}" data-link`;
    }
}

export const router = new Router(__VITE_APP_NAME__ || "Vaani");
