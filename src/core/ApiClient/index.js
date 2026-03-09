// @ts-check

import { ApiClient } from "./api.js";
import { JsonCodec } from "../codec.js";

/**
 * @constant {ApiClient} The main API client instance for the application.
 * Base URL and timeout are injected at build time via Vite environment variables.
 */
export const apiClient = new ApiClient({
    baseURL: __VITE_API_BASE_URL__,
    timeout: __VITE_API_TIMEOUT__,
    codec: JsonCodec,
});
