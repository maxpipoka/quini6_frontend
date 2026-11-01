/**
 * Global setup for Playwright E2E tests.
 * Creates storageState files for authenticated sessions.
 */
import { chromium, type FullConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_STORAGE_STATE = path.join(__dirname, '..', '.auth', 'admin.json');

async function globalSetup(config: FullConfig) {
  const { baseURL = 'http://localhost:4321' } = config.projects[0].use;

  // Ensure auth directory exists
  const fs = await import('fs');
  const authDir = path.dirname(ADMIN_STORAGE_STATE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Launch browser and log in as admin
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Go to login page
    await page.goto(`${baseURL}/admin/login`);

    // Wait for form to be ready
    await page.waitForSelector('form', { timeout: 10000 });

    // Fill login form
    await page.fill('input[name="email"], input[type="email"]', 'admin@quini6.com');
    await page.fill('input[name="password"], input[type="password"]', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect to admin dashboard
    await page.waitForURL('**/admin/**', { timeout: 10000 });

    // Save storage state
    await page.context().storageState({ path: ADMIN_STORAGE_STATE });
    console.log('Admin storage state saved to:', ADMIN_STORAGE_STATE);
  } catch (error) {
    console.error('Failed to create admin storage state:', error);
    // Create empty storage state as fallback
    await page.context().storageState({ path: ADMIN_STORAGE_STATE });
  } finally {
    await browser.close();
  }
}

export default globalSetup;