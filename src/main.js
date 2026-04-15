// @ts-check
import "./styles.css";
import { router } from "./core/router.js";
import { state } from "./core/state.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { createLandingPage } from "./pages/LandingPage.js";

// Uncomment for integration with a API Provider
// The Routes are defined in ./constants/endpoints.js
//
// import { ApiClient } from "./core/ApiClient/api";
// import { AuthService } from "./services/authService";

/** @type {ReturnType<typeof setTimeout> | null} */
let loaderTimeout = null;
const IS_APP_LOADING = "isAppLoading";
const IS_LOADING_ROUTE = "isLoadingRoute";
const IS_PAGE_CONTENT_LOADING = "isPageContentLoading";

/**
 * Set loading state for page content
 * @param {boolean} loading
 */
export function setPageLoading(loading) {
    state.set(IS_PAGE_CONTENT_LOADING, loading);
}

/**
 * Setup router listeners for loading states
 */
function setupRouterListeners() {
    router.on("start", () => {
        if (loaderTimeout) {
            clearTimeout(loaderTimeout);
        }

        loaderTimeout = setTimeout(() => {
            state.set(IS_LOADING_ROUTE, true);
        }, 150);
    });

    router.on("end", () => {
        if (loaderTimeout) {
            clearTimeout(loaderTimeout);
            loaderTimeout = null;
        }
        state.set(IS_LOADING_ROUTE, false);
    });

    router.on(
        "error",
        /** @param {any} err */
        (err) => {
            if (loaderTimeout) {
                clearTimeout(loaderTimeout);
                loaderTimeout = null;
            }
            state.set(IS_LOADING_ROUTE, false);
            console.error("Router error during navigation:", err);
        },
    );
}

/**
 * Setup global application loader
 * @param {HTMLElement} appLoader
 */
function setupGlobalLoader(appLoader) {
    state.subscribeMultiple(
        [IS_LOADING_ROUTE, IS_APP_LOADING, IS_PAGE_CONTENT_LOADING],
        () => {
            const isLoading =
                state.get(IS_LOADING_ROUTE) ||
                state.get(IS_APP_LOADING) ||
                state.get(IS_PAGE_CONTENT_LOADING);

            appLoader.classList.toggle("hidden", !isLoading);
        },
    );
}

/**
 * Main application entry point
 */
async function main() {
    const appLoader = document.getElementById("app-loader");

    state.setBatch({
        [IS_APP_LOADING]: true,
        [IS_LOADING_ROUTE]: false,
        [IS_PAGE_CONTENT_LOADING]: false,
    });

    if (appLoader) {
        setupGlobalLoader(appLoader);
    }

    setupRouterListeners();

    //     For Api Integration with backend and Auth Service Usage
    //
    //     /**
    //      * @constant {ApiClient} The main API client instance for the application.
    //      * Base URL and timeout are injected at build time via Vite environment variables.
    //      */
    //     const apiClient = new ApiClient({
    //         baseURL: __VITE_API_BASE_URL__,
    //         timeout: __VITE_API_TIMEOUT__,
    //         codec: JsonCodec,
    //     });
    //
    //     /**
    //      * @constant {AuthService} The main auth service used to authenticate users
    //      * NOTE- It takes the "Router Routes" here in config not "Endpoints"
    //      */
    //     const authService = new AuthService(
    //         apiClient, {
    //         loginRoute: "/login",
    //         logoutRedirect: "/signin",
    //         defaultAuthenticatedRedirect: "/",
    //         unauthorizedRoute: "/unauthorized",
    //     });
    //
    //     try {
    //         authService.initialize();
    //         await authService.checkSession();
    //     } catch (error) {
    //         console.error("App initialization failed:", error);
    //     } finally {
    //         state.set(IS_APP_LOADING, false);
    //     }
    //


    router.setNotFoundComp(NotFoundPage);
    router.addRoute({
        path: "/",
        title: "Vaani - Get back to your roots",
        component: async () => createLandingPage(),
    });

    //TODO: Add your routes over here

    router.init("app");
}

document.addEventListener("DOMContentLoaded", main);
