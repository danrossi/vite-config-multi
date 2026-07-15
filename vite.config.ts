import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  return {
    appType: "custom",
    plugins: [
      dts({ 
        insertTypesEntry: true, // Adds a "types" field mapping automatically
        tsconfigPath: './tsconfig.json' // Point to your app's tsconfig if defaults fail
      })
    ],
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
     
        output: {
          
        }
      }
    }
  };
});