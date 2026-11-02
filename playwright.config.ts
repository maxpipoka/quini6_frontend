import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKERS = process.env.CI ? 2 : 4; // Limit workers to reduce resource contention
const _ADMIN_STORAGE_STATE = path.join(__dirname, '.auth', 'admin.json');

export default defineConfig({
  testDir: './tests/e2e',
  // Visual snapshots are platform-dependent; run them explicitly with VISUAL=1.
  testIgnore: process.env.VISUAL === '1' ? [] : ['**/visual.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: WORKERS,
  reporter: 'html',
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/visual.spec.ts'],
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
      use: { ...devices['iPhone 14'], colorScheme: 'light' },
    },
    // Visual regression projects (Chromium only for consistent baselines)
    {
      name: 'visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        colorScheme: 'light',
      },
      testMatch: '**/visual.spec.ts',
    },
    {
      name: 'visual-mobile',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 375, height: 667 },
        colorScheme: 'light',
        hasTouch: true,
      },
      testMatch: '**/visual.spec.ts',
    },
    // A11y project (Chromium only for consistent results)
    {
      name: 'a11y',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/a11y-admin-import*.spec.ts',
    },
  ],
  webServer: [
    {
      command: 'node tests/mock-api/server.mjs',
      port: 3001,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'npm run dev',
      port: 4321,
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
  snapshotDir: './tests/e2e/visual-snapshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
});
