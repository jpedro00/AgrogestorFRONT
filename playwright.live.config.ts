import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testIgnore: [],
  testMatch: "**/live-auth.spec.ts",
  expect: { timeout: 20000 },
  outputDir: "test-results-live",
  use: { ...base.use, baseURL: "http://localhost:8083", trace: "off" },
  webServer: {
    command: "npm run web -- --port 8083 --max-workers 2",
    url: "http://localhost:8083",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
