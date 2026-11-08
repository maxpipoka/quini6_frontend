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

// Fixed test session ID that the mock API accepts
const TEST_SESSION_ID = 'test-session';

async function globalSetup(config: FullConfig) {
  const _baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:4321';

  // Ensure auth directory exists
  const fs = await import('fs');
  const authDir = path.dirname(ADMIN_STORAGE_STATE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Launch browser and create a context with the fixed test session cookie
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const _page = await context.newPage();

  // Set the fixed test session cookie
  await context.addCookies([
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
    {
      name: 'session',
      value: TEST_SESSION_ID,
      domain: 'localhost',
      path: '/',
      expires: -1,
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // Save storage state
  await context.storageState({ path: ADMIN_STORAGE_STATE });
  console.log('Admin storage state saved to:', ADMIN_STORAGE_STATE);

  await browser.close();
}

export default globalSetup;
