import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // jsdom so component tests are possible later; the current suite is pure
    // functions and does not need it, but the environment is cheap to keep.
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
