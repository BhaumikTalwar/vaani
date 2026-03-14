import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [tailwindcss()],
        appName: env.VITE_APP_NAME || "Vaani",
        port: parseInt(env.VITE_APP_PORT) || 5173,
        previewPort: parseInt(env.VITE_APP_PORT) || 5173,

        clearScreen: false,

        define: {
            __VITE_APP_NAME__: JSON.stringify(env.VITE_APP_NAME || "Vaani"),
            __VITE_API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || "/api"),
            __VITE_API_TIMEOUT__: JSON.stringify(parseInt(env.VITE_API_TIMEOUT) || 15000),
        },

        server: {
            origin: env.VITE_DEV_SERVER_ORIGIN || "http://localhost:5173",
            port: parseInt(env.VITE_APP_PORT) || 5173,
            strictPort: true,
            host: host || false,
            hmr: host
                ? {
                    protocol: "ws",
                    host,
                    port: 1421,
                }
                : undefined,
            watch: {
                ignored: ["**/src-tauri/**"],
            },
            cors: true,
        },

        envPrefix: ["VITE_", "TAURI_ENV_*"],

        build: {
            outDir: "dist",
            assetsDir: "assets",
            sourcemap: mode !== "production",
            minify: mode === "production" ? "esbuild" : false,
            target:
                process.env.TAURI_ENV_PLATFORM === "windows"
                    ? "chrome105"
                    : "safari13",
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.includes("tailwindcss") || id.includes("@tailwindcss")) {
                            return "vendor";
                        }
                    },
                },
            },
        },

        preview: {
            port: parseInt(env.VITE_APP_PORT) || 4173,
            cors: true,
        },
    };
});
