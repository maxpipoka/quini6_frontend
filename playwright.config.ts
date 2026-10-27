import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Visual snapshots are platform-dependent; run them explicitly with VISUAL=1.
  testIgnore: process.env.VISUAL === '1' ? [] : ['**/visual.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['iPhone 14'] },
    },
    // Visual regression projects (Chromium only for consistent baselines)
    {
      name: 'visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: '**/visual.spec.ts',
    },
    {
      name: 'visual-mobile',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 375, height: 667 },
      },
      testMatch: '**/visual.spec.ts',
    },
    // A11y project (Chromium only for consistent results)
    {
      name: 'a11y',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/a11y-admin-import.spec.ts',
    },
  ],
  webServer: [
    {
      command: 'node tests/mock-api/server.mjs',
      url: 'http://localhost:3001/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:4321',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
  snapshotDir: './tests/e2e/visual-snapshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
});
