import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    base: "/",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    ton: ["@ton/core", "@tonconnect/ui-react"],
                },
            },
        },
    },
    server: {
        https: true,
        cors: true,
    },
    plugins: [react(), basicSsl()],
});
