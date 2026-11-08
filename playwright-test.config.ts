import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: ['**/visual.spec.ts'],
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: 'line',
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:4323',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/visual.spec.ts'],
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
      port: 4323,
      reuseExistingServer: true,
      timeout: 120000,
      env: {
        VITE_SITE_URL: 'http://localhost:4323',
        VITE_API_BASE_URL: '/api',
        VITE_PLAUSIBLE_DOMAIN: 'quini6.example.com',
      },
    },
  ],
  snapshotDir: './tests/e2e/visual-snapshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
});
