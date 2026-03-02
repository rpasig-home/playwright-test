import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  globalSetup: "./global-setup.ts",
  testDir: "./src",
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // ✅ Prevent random failures due to shared in-memory API state
  workers: 1,
  fullyParallel: false,

  retries: process.env.CI ? 2 : 0,

  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/junit.xml" }]
  ],

  use: {
    baseURL,
    extraHTTPHeaders: {
      "x-api-key": process.env.API_KEY ?? "local-dev-key",
      "content-type": "application/json"
    }
  }
});