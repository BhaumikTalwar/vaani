import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [tailwindcss()],
        appName: env.VITE_APP_NAME || "Vaani",
        port: parseInt(env.VITE_APP_PORT) || 5173,
        previewPort: parseInt(env.VITE_APP_PORT) || 5173,

        define: {
            __VITE_APP_NAME__: JSON.stringify(env.VITE_APP_NAME || "Vaani"),
            __VITE_API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || "/api"),
            __VITE_API_TIMEOUT__: JSON.stringify(parseInt(env.VITE_API_TIMEOUT) || 15000),
        },

        server: {
            origin: env.VITE_DEV_SERVER_ORIGIN || "http://localhost:5173",
            port: parseInt(env.VITE_APP_PORT) || 5173,
            cors: true,
        },

        build: {
            outDir: "dist",
            assetsDir: "assets",
            sourcemap: mode !== "production",
            minify: mode === "production" ? "esbuild" : false,
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
