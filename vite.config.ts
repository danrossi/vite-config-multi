import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    appType: "custom",
    build: {
      ssr: true,
      target: "esnext",
      watch: mode === "development" ? {} : null,
      minify: false,
      lib: {
        entry: resolve(__dirname, "src/vite.config.multi.ts"),
        fileName: "index",
        formats: ["es"]
      },
      rollupOptions: {
        external: [
          "vite"
        ],
        experimental: {
              attachDebugInfo: 'none',
        },
        output: {
          
        }
      }
    }
  };
});