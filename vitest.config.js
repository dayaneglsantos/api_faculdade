// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["node_modules", "dist", "cors.js", "**/cors.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/cors.js", "vitest.config.js"],
    },
  },
});
