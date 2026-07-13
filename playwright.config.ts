import { defineConfig, devices } from "@playwright/test"

const localPlaywrightPort = 3101
const localBaseURL = `http://localhost:${localPlaywrightPort}`

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run dev -- -p ${localPlaywrightPort}`,
        url: localBaseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
  use: {
    baseURL: process.env.BASE_URL ?? localBaseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
