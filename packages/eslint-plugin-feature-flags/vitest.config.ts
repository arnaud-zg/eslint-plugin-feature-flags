import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // The examples import the plugin by its npm name, as a project does; tests run it from src.
  resolve: {
    alias: {
      "eslint-plugin-feature-flags": fileURLToPath(new URL("src/index.ts", import.meta.url)),
    },
  },
  test: {
    globals: false,
    environment: "node",
    watch: false,
    include: ["src/**/*.test.ts"],
  },
});
