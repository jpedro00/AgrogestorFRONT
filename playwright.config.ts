import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  testIgnore: "**/live-auth.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  use: {
    baseURL: "http://localhost:8082",
    trace: "retain-on-failure",
    navigationTimeout: 60000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run web -- --port 8082 --max-workers 2",
    url: "http://localhost:8082",
    env: {
      EXPO_NO_DOTENV: "1",
      EXPO_PUBLIC_SUPABASE_URL: "",
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
    },
    reuseExistingServer: false,
    timeout: 120000,
  },
});
