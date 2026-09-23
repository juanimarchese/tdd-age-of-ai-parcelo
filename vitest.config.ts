import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Chapter 13: quarantined tests are named *.flaky.test.ts
    exclude: ["**/node_modules/**", "**/*.flaky.test.ts"],
  },
});
