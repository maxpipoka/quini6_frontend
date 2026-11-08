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
      // Don't use storageState, rely on headers and cookies
      extraHTTPHeaders: {
        'x-test-session': 'test-session',
      },
    });
    // Add the session cookie to the context
    await context.addCookies([
      {
        name: 'session',
        value: 'test-session',
        domain: 'localhost',
        path: '/',
        expires: -1,
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
      {
        name: 'csrf_token',
        value: 'test-csrf-token',
        domain: 'localhost',
        path: '/',
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
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

/**
 * Authenticates the given page's context using the storage state
 * created by global-setup (tests/.auth/admin.json).
 */
export async function adminLogin(page: Page): Promise<void> {
  const fs = await import('fs');
  if (!fs.existsSync(ADMIN_STORAGE_STATE)) {
    throw new Error(
      `Admin storage state not found at ${ADMIN_STORAGE_STATE}. Run global setup first.`
    );
  }
  const state = JSON.parse(fs.readFileSync(ADMIN_STORAGE_STATE, 'utf-8')) as {
    cookies: Parameters<BrowserContext['addCookies']>[0];
  };
  await page.context().addCookies(state.cookies);
}
