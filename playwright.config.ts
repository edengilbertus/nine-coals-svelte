import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  expect: { timeout: 5000 },
  use: {
    baseURL: process.env.TEST_BASE_URL ?? 'http://127.0.0.1:5179',
    viewport: { width: 1440, height: 1000 },
    actionTimeout: 7000,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: process.env.TEST_BASE_URL ? undefined : {
    command: 'bun run dev',
    url: 'http://127.0.0.1:5179',
    reuseExistingServer: process.env.REUSE_DEV_SERVER === '1'
  }
});
