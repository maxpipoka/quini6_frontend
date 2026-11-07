import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4323',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
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
      command: 'npm run dev -- --port 4323',
      port: 4323,
      reuseExistingServer: true,
      timeout: 120000,
      env: {
        VITE_SITE_URL: 'https://quini6.com',
        VITE_API_BASE_URL: 'http://localhost:3001/api',
        VITE_PLAUSIBLE_DOMAIN: 'quini6.example.com',
      },
    },
  ],
});