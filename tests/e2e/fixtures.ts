/**
 * Shared test fixtures for E2E tests.
 * Provides isolated context for each test.
 */
import { test as base, type Page, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_STORAGE_STATE = path.join(__dirname, '..', '.auth', 'admin.json');

interface TestFixtures {
  // Authenticated admin page
  adminPage: Page;
  // Clean context for each test
  cleanContext: BrowserContext;
}

export const test = base.extend<TestFixtures>({
  // Create a clean context for each test with admin auth
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ADMIN_STORAGE_STATE,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Clean context without any storage state
  cleanContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },
});

export const expect = test.expect;
