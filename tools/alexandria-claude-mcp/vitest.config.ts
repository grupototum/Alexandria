import { defineConfig } from "vitest/config";

export default defineConfig({
  // Isolar do projeto raiz (Vite resolve postcss.config.js do parent caso contrário).
  css: { postcss: { plugins: [] } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: false,
    reporters: ["default"],
  },
});
