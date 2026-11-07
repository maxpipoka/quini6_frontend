import { test, expect } from './fixtures';

type PlausibleCall = [string, { props?: Record<string, unknown> } | undefined];

declare global {
  interface Window {
    plausibleCalls: PlausibleCall[];
  }
}

function findCall(calls: PlausibleCall[] | undefined, eventName: string): PlausibleCall {
  if (!calls || calls.length === 0) {
    throw new Error(
      `Expected plausible event "${eventName}" but got: []`
    );
  }
  const call = calls.find((c) => c[0] === eventName);
  if (!call) {
    throw new Error(
      `Expected plausible event "${eventName}" but got: [${calls.map((c) => c[0]).join(', ')}]`
    );
  }
  return call;
}

test.describe('Analytics Events E2E', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Clear any existing plausible calls
    await adminPage.addInitScript(() => {
      window.plausibleCalls = [];
      const originalPlausible: typeof window.plausible = window.plausible;
      window.plausible = (eventName: string, options?: { props: Record<string, unknown> }) => {
        window.plausibleCalls.push([eventName, options]);
        if (originalPlausible) {
          originalPlausible(eventName, options);
        }
      };
    });
  });

  test.describe('Search combination event', () => {
    test('should track search_combination event on successful search', async ({ adminPage }) => {
      await adminPage.goto('/buscar');
      await adminPage.waitForLoadState('networkidle');

      // Fill in 6 numbers - use the correct selector for NumberInput
      const numberInputs = adminPage.locator('input[inputmode="numeric"]');
      await expect(numberInputs).toHaveCount(6);

      await numberInputs.nth(0).fill('1');
      await numberInputs.nth(1).fill('5');
      await numberInputs.nth(2).fill('12');
      await numberInputs.nth(3).fill('23');
      await numberInputs.nth(4).fill('34');
      await numberInputs.nth(5).fill('45');

      // Click search button
      await adminPage.click('button[type="submit"]');
      await adminPage.waitForLoadState('networkidle');

      // Check if plausible was called with search_combination
      const calls = await adminPage.evaluate(() => window.plausibleCalls);
      const searchCall = findCall(calls, 'search_combination');

      expect(searchCall[1]).toHaveProperty('props');
      expect(searchCall[1]?.props).toHaveProperty('numbers');
      expect(searchCall[1]?.props).toHaveProperty('hasResults');
      expect(searchCall[1]?.props).toHaveProperty('totalMatches');
    });

    test('should track search_combination event with hasResults=false when no matches', async ({
      adminPage,
    }) => {
      // Mock API to return no results
      await adminPage.route('**/api/search/exact**', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ found: false, totalMatches: 0, matches: [] }),
        });
      });

      await adminPage.goto('/buscar');
      await adminPage.waitForLoadState('networkidle');

      const numberInputs = adminPage.locator('input[inputmode="numeric"]');
      await numberInputs.nth(0).fill('1');
      await numberInputs.nth(1).fill('2');
      await numberInputs.nth(2).fill('3');
      await numberInputs.nth(3).fill('4');
      await numberInputs.nth(4).fill('5');
      await numberInputs.nth(5).fill('6');

      await adminPage.click('button[type="submit"]');
      await adminPage.waitForLoadState('networkidle');

      const calls = await adminPage.evaluate(() => window.plausibleCalls);
      const searchCall = findCall(calls, 'search_combination');

      expect(searchCall[1]?.props?.hasResults).toBe(false);
      expect(searchCall[1]?.props?.totalMatches).toBe(0);
    });
  });

  test.describe('Admin login event', () => {
    test('should track admin_login event on successful login', async ({ page, browser }) => {
      // Create a fresh context without the beforeEach initScript clearing on navigation
      const context = await browser.newContext();
      const adminPage = await context.newPage();
      
      // Add the init script with a Promise to wait for the event
      await adminPage.addInitScript(() => {
        window.plausibleCalls = [];
        window.__plausibleEventPromise = null;
        window.__plausibleEventResolve = null;
        
        const originalPlausible = window.plausible;
        window.plausible = (eventName, options) => {
          console.log('[TEST WRAPPER] plausible called:', eventName, options);
          window.plausibleCalls.push([eventName, options]);
          
          // Resolve the promise if we're waiting for this event
          if (window.__plausibleEventResolve && eventName === window.__plausibleEventPromise) {
            window.__plausibleEventResolve([eventName, options]);
            window.__plausibleEventPromise = null;
            window.__plausibleEventResolve = null;
          }
          
          if (originalPlausible) {
            originalPlausible(eventName, options);
          }
        };
        
        // Function to wait for a specific event
        window.waitForPlausibleEvent = (eventName) => {
          window.__plausibleEventPromise = eventName;
          return new Promise((resolve) => {
            window.__plausibleEventResolve = resolve;
            // Timeout after 5 seconds
            setTimeout(() => {
              if (window.__plausibleEventPromise === eventName) {
                window.__plausibleEventPromise = null;
                window.__plausibleEventResolve = null;
                resolve(null);
              }
            }, 5000);
          });
        };
      });
      
      await adminPage.goto('/admin/login');
      await adminPage.waitForLoadState('networkidle');

      // Fill login form - use correct credentials that mock API accepts
      await adminPage.fill('input[name="email"]', 'admin@quini6.com');
      await adminPage.fill('input[name="password"]', 'password123');

      // Don't mock the login - let the mock API handle it
      // The mock API will set a session cookie

      // Add a console log listener
      adminPage.on('console', (msg) => console.log(`BROWSER LOG: ${msg.text()}`));

      // Click submit and wait for the trackEvent to fire using the Promise
      const eventPromise = adminPage.evaluate(() => window.waitForPlausibleEvent('admin_login'));
      
      await adminPage.click('button[type="submit"]');
      
      // Wait for the event to be captured
      const eventResult = await eventPromise;
      console.log('Event result:', eventResult);
      
      // Use the event result directly since page unloads after redirect
      const loginCall = eventResult;
      
      await context.close();

      expect(loginCall[1]).toHaveProperty('props');
      expect(loginCall[1]?.props?.success).toBe(true);
    });

    test('should track admin_login_failed event on failed login', async ({ browser }) => {
      // Create a fresh context without the beforeEach initScript clearing on navigation
      const context = await browser.newContext();
      const adminPage = await context.newPage();
      
      // Add the init script with a Promise to wait for the event
      await adminPage.addInitScript(() => {
        window.plausibleCalls = [];
        window.__plausibleEventPromise = null;
        window.__plausibleEventResolve = null;
        
        const originalPlausible = window.plausible;
        window.plausible = (eventName, options) => {
          console.log('[TEST WRAPPER] plausible called:', eventName, options);
          window.plausibleCalls.push([eventName, options]);
          
          // Resolve the promise if we're waiting for this event
          if (window.__plausibleEventResolve && eventName === window.__plausibleEventPromise) {
            window.__plausibleEventResolve([eventName, options]);
            window.__plausibleEventPromise = null;
            window.__plausibleEventResolve = null;
          }
          
          if (originalPlausible) {
            originalPlausible(eventName, options);
          }
        };
        
        // Function to wait for a specific event
        window.waitForPlausibleEvent = (eventName) => {
          window.__plausibleEventPromise = eventName;
          return new Promise((resolve) => {
            window.__plausibleEventResolve = resolve;
            // Timeout after 5 seconds
            setTimeout(() => {
              if (window.__plausibleEventPromise === eventName) {
                window.__plausibleEventPromise = null;
                window.__plausibleEventResolve = null;
                resolve(null);
              }
            }, 5000);
          });
        };
      });
      
      await adminPage.goto('/admin/login');
      await adminPage.waitForLoadState('networkidle');

      await adminPage.fill('input[name="email"]', 'admin@quini6.com');
      await adminPage.fill('input[name="password"]', 'wrongpassword');

      // Mock failed login response
      await adminPage.route('**/api/admin/auth/login**', async (route) => {
        await route.fulfill({
          status: 401,
          body: JSON.stringify({ message: 'Invalid credentials' }),
        });
      });

      // Add a console log listener
      adminPage.on('console', (msg) => console.log(`BROWSER LOG: ${msg.text()}`));

      // Click submit and wait for the trackEvent to fire using the Promise
      const eventPromise = adminPage.evaluate(() => window.waitForPlausibleEvent('admin_login_failed'));
      
      await adminPage.click('button[type="submit"]');
      
      // Wait for the event to be captured
      const eventResult = await eventPromise;
      console.log('Event result:', eventResult);
      
      // Use the event result directly
      const loginFailedCall = eventResult;
      
      await context.close();

      expect(loginFailedCall[1]).toHaveProperty('props');
      expect(loginFailedCall[1]?.props?.success).toBe(false);
      expect(loginFailedCall[1]?.props?.errorType).toBeDefined();
    });
  });

  test.describe('Import events', () => {
    test('should track import_start event when file is uploaded', async ({ adminPage }) => {
      await adminPage.goto('/admin/imports/upload');
      await adminPage.waitForLoadState('networkidle');

      // Wait for island to hydrate
      await adminPage.waitForSelector('[data-testid="file-dropzone"]', { timeout: 15000 });

      // Upload a CSV file
      const fileInput = adminPage.locator('[data-testid="file-dropzone"] input[type="file"]');
      await fileInput.setInputFiles({
        name: 'test-draws.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(
          'officialNumber,drawDate,tradicional1,tradicional2,tradicional3,tradicional4,tradicional5,tradicional6,la_segunda1,la_segunda2,la_segunda3,la_segunda4,la_segunda5,la_segunda6,revancha1,revancha2,revancha3,revancha4,revancha5,revancha6,siempre_sale1,siempre_sale2,siempre_sale3,siempre_sale4,siempre_sale5,siempre_sale6\n3300,2024-12-01,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24'
        ),
      });

      await adminPage.waitForTimeout(3000);

      const calls = await adminPage.evaluate(() => window.plausibleCalls);
      const importStartCall = findCall(calls, 'import_start');

      expect(importStartCall[1]).toHaveProperty('props');
      expect(importStartCall[1]?.props).toHaveProperty('fileName', 'test-draws.csv');
      expect(importStartCall[1]?.props).toHaveProperty('fileSize');
      expect(importStartCall[1]?.props).toHaveProperty('rowCount');
    });

    test('should track import_commit event when import is confirmed', async ({ adminPage }) => {
      test.slow();

      await adminPage.goto('/admin/imports/upload');
      await adminPage.waitForLoadState('networkidle');

      await adminPage.waitForSelector('[data-testid="file-dropzone"]', { timeout: 15000 });

      const fileInput = adminPage.locator('[data-testid="file-dropzone"] input[type="file"]');
      await fileInput.setInputFiles({
        name: 'test-draws.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(
          'officialNumber,drawDate,tradicional1,tradicional2,tradicional3,tradicional4,tradicional5,tradicional6,la_segunda1,la_segunda2,la_segunda3,la_segunda4,la_segunda5,la_segunda6,revancha1,revancha2,revancha3,revancha4,revancha5,revancha6,siempre_sale1,siempre_sale2,siempre_sale3,siempre_sale4,siempre_sale5,siempre_sale6\n3300,2024-12-01,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24'
        ),
      });

      // Wait for preview
      await expect(adminPage.getByRole('heading', { name: /Vista previa/ })).toBeVisible({
        timeout: 15000,
      });

      // Click Continuar
      await adminPage.getByRole('button', { name: 'Continuar' }).click();

      // Wait for confirm step
      await expect(adminPage.getByRole('heading', { name: 'Confirmar importación' })).toBeVisible({
        timeout: 15000,
      });

      // Click Confirmar e importar
      await adminPage.getByRole('button', { name: 'Confirmar e importar' }).click();

      // Wait for modal
      await expect(adminPage.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 });

      // Confirm in modal
      await adminPage.locator('[role="dialog"]').getByRole('button', { name: 'Confirmar' }).click();

      // Wait for commit to complete
      await adminPage.waitForTimeout(5000);

      const calls = await adminPage.evaluate(() => window.plausibleCalls);
      const importCommitCall = findCall(calls, 'import_commit');

      expect(importCommitCall[1]).toHaveProperty('props');
      expect(importCommitCall[1]?.props).toHaveProperty('importId');
      expect(importCommitCall[1]?.props).toHaveProperty('policy');
      expect(importCommitCall[1]?.props).toHaveProperty('selectedRows');
    });
  });
});

test.describe('Analytics - Plausible not loaded', () => {
  test('should not throw when Plausible is not available', async ({ page }) => {
    // Remove Plausible from window
    await page.addInitScript(() => {
      delete (window as unknown as { plausible?: unknown }).plausible;
    });

    await page.goto('/buscar');
    await page.waitForLoadState('networkidle');

    // Should not throw any errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    const numberInputs = page.locator('input[inputmode="numeric"]');
    await numberInputs.nth(0).fill('1');
    await numberInputs.nth(1).fill('2');
    await numberInputs.nth(2).fill('3');
    await numberInputs.nth(3).fill('4');
    await numberInputs.nth(4).fill('5');
    await numberInputs.nth(5).fill('6');

    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // No errors should occur
    expect(errors.length).toBe(0);
  });
});
