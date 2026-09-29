import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

// Only Chromium ships in this environment (/opt/pw-browsers). Firefox and
// WebKit projects run when those browsers are installed locally
// (`npx playwright install firefox webkit`) with PW_ALL_BROWSERS=1.
const extra = process.env.PW_ALL_BROWSERS
  ? [
      { name: "firefox", use: { ...devices["Desktop Firefox"] } },
      { name: "webkit", use: { ...devices["Desktop Safari"] } },
      { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
    ]
  : [];

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "qa/e2e-results.json" }]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    ...extra,
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: true,
    env: { RESEND_API_KEY: "", INQUIRY_NOTIFICATION_EMAIL: "" },
  },
});
