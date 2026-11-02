import { test, expect } from '../e2e/fixtures';
import { waitForStableContent } from './a11y-setup';

test.describe('Admin Import', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Attach listeners BEFORE any navigation
    adminPage.on('console', (msg) => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    adminPage.on('pageerror', (err) => console.log('BROWSER ERROR:', err.message));
    adminPage.on('request', (request) => {
      if (
        request.url().includes(':') &&
        !request.url().includes('http://') &&
        !request.url().includes('https://') &&
        !request.url().includes('data:')
      ) {
        console.log('SUSPICIOUS REQUEST:', request.url());
      }
    });

    // Add an init script to catch the exact error location
    await adminPage.addInitScript(() => {
      const originalError = console.error;
      console.error = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('Unexpected token')) {
          console.log('CAPTURED ERROR:', args[0]);
          try {
            throw new Error();
          } catch (e) {
            console.log('STACK:', (e as Error).stack);
          }
        }
        originalError.apply(console, args);
      };

      window.addEventListener('error', (event) => {
        if (event?.message?.includes('Unexpected token')) {
          console.log(
            'WINDOW ERROR EVENT:',
            event.message,
            'at',
            event.filename,
            ':',
            event.lineno,
            ':',
            event.colno
          );
        }
      });
    });

    // Set localStorage theme to avoid flash
    await adminPage.addInitScript(() => {
      localStorage.setItem('theme', 'light');
    });

    // Now navigate to import page - cookies will be sent with this request
    await adminPage.goto('/admin/imports/upload');

    // Wait for page to load and island to hydrate
    await adminPage.waitForLoadState('networkidle');

    // Scroll to trigger client:visible hydration
    await adminPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await adminPage.waitForTimeout(3000);

    // Wait for the file dropzone div (outer container with data-testid)
    await adminPage.waitForSelector('[data-testid="file-dropzone"]', { timeout: 15000 });

    // Wait for the input to be in the DOM
    await adminPage.waitForSelector('[data-testid="file-dropzone"] input[type="file"]', {
      state: 'attached',
      timeout: 15000,
    });
  });

  test('should complete full import flow: upload -> preview -> confirm -> result', async ({
    adminPage,
  }) => {
    // Listen for page errors immediately
    adminPage.on('pageerror', (err) => {
      console.log('PAGE ERROR:', err.message);
      console.log('PAGE ERROR STACK:', err.stack);
    });

    // Listen for ALL console messages
    adminPage.on('console', (msg) => {
      const text = msg.text();
      console.log('BROWSER CONSOLE [' + msg.type() + ']:', text);
      if (
        text.includes('Unexpected token') ||
        text.includes('hydrat') ||
        text.includes('astro') ||
        text.includes('island') ||
        text.includes('react')
      ) {
        console.log('>>> RELEVANT CONSOLE:', text);
      }
    });

    // Enable network logging for import preview
    adminPage.on('request', (request) => {
      if (request.url().includes('imports/preview') || request.url().includes('imports')) {
        console.log('>>> IMPORT REQUEST:', request.method(), request.url());
        console.log('>>> REQUEST HEADERS:', JSON.stringify(request.headers(), null, 2));
        const postData = request.postData();
        if (postData) console.log('>>> REQUEST BODY:', postData.substring(0, 500));
      }
      if (
        request.url().includes('/api/') ||
        request.url().includes('3001') ||
        request.url().includes('preview')
      ) {
        console.log('>>> ANY API REQUEST:', request.method(), request.url());
      }
    });

    adminPage.on('response', (response) => {
      if (response.url().includes('imports/preview') || response.url().includes('imports')) {
        console.log('>>> IMPORT RESPONSE:', response.status(), response.url());
      }
      if (
        response.url().includes('/api/') ||
        response.url().includes('3001') ||
        response.url().includes('preview')
      ) {
        console.log('>>> ANY API RESPONSE:', response.status(), response.url());
      }
    });

    adminPage.on('requestfailed', (request) => {
      if (request.url().includes('imports/preview') || request.url().includes('imports')) {
        console.log('>>> IMPORT REQUEST FAILED:', request.url(), request.failure()?.errorText);
      }
      if (
        request.url().includes('/api/') ||
        request.url().includes('3001') ||
        request.url().includes('preview')
      ) {
        console.log('>>> ANY API REQUEST FAILED:', request.url(), request.failure()?.errorText);
      }
    });

    // Upload a CSV file - interact with FileDropzone (input is visually hidden but in DOM)
    const fileInput = adminPage.locator('[data-testid="file-dropzone"] input[type="file"]').first();
    await fileInput.setInputFiles('tests/e2e/fixtures/sample-draws.csv');

    // Wait for preview step
    await expect(
      adminPage.getByRole('heading', { name: /Vista previa.*8 válidas, 0 inválidas/ })
    ).toBeVisible({ timeout: 15000 });

    // Debug: check page content
    const previewContent = await adminPage.content();
    console.log('PREVIEW PAGE CONTENT:', previewContent.substring(0, 5000));

    // Check if there's an error toast
    const errorAlert = adminPage.getByRole('alert');
    const hasError = (await errorAlert.count()) > 0;
    if (hasError) {
      const errorText = await errorAlert.textContent();
      console.log('ERROR TOAST FOUND:', errorText);
    }

    // Check button state before click
    const continuarBtn = adminPage.getByRole('button', { name: 'Continuar' });
    const isDisabled = await continuarBtn.isDisabled();
    console.log('CONTINUAR BUTTON DISABLED:', isDisabled);

    // Also check the button element
    const btnElement = await adminPage.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent?.includes('Continuar')) {
          return {
            disabled: btn.disabled,
            innerHTML: btn.innerHTML,
            onclick: btn.onclick ? 'HAS ONCLICK' : 'NO ONCLICK',
          };
        }
      }
      return 'NO BUTTON FOUND';
    });
    console.log('BUTTON ELEMENT:', JSON.stringify(btnElement, null, 2));

    // Check validRows state in React
    const validRowsCheck = await adminPage.evaluate(() => {
      const island = document.querySelector('astro-island');
      if (!island) return 'no island';
      return 'island exists';
    });
    console.log('VALID ROWS CHECK:', validRowsCheck);

    // Listen for ALL network requests
    adminPage.on('request', (request) => {
      const url = request.url();
      if (
        url.includes('/api/') ||
        url.includes('hydration') ||
        url.includes('astro') ||
        url.includes('@astrojs_react') ||
        url.includes('before-hydration') ||
        url.includes('chunk-') ||
        url.includes('react') ||
        url.includes('refresh')
      ) {
        console.log('NETWORK REQUEST:', request.method(), url);
      }
    });

    adminPage.on('response', (response) => {
      const url = response.url();
      if (
        url.includes('/api/') ||
        url.includes('hydration') ||
        url.includes('astro') ||
        url.includes('@astrojs_react') ||
        url.includes('before-hydration') ||
        url.includes('chunk-') ||
        url.includes('react') ||
        url.includes('refresh')
      ) {
        console.log('NETWORK RESPONSE:', response.status(), url);
        response
          .text()
          .then((body) => {
            if (
              url.includes('before-hydration') ||
              url.includes('@astrojs_react') ||
              url.includes('chunk-')
            ) {
              console.log('RESPONSE BODY (first 500 chars):', body.substring(0, 500));
            }
          })
          .catch(() => {
            /* ignore */
          });
      }
    });

    // Listen for ALL console messages
    adminPage.on('console', (msg) => {
      const text = msg.text();
      console.log('BROWSER CONSOLE [' + msg.type() + ']:', text);
      if (
        text.includes('Unexpected token') ||
        text.includes('hydrat') ||
        text.includes('astro') ||
        text.includes('island') ||
        text.includes('react')
      ) {
        console.log('>>> RELEVANT CONSOLE:', text);
      }
    });

    // Listen for page errors with full details
    adminPage.on('pageerror', (err) => {
      console.log('PAGE ERROR:', err.message);
      console.log('PAGE ERROR STACK:', err.stack);
    });

    // Enable all request/response logging for debugging
    adminPage.on('request', (request) => {
      if (
        request.url().includes('ImportWizard') ||
        request.url().includes('worker') ||
        request.url().includes('@astrojs_react')
      ) {
        console.log('REQUEST:', request.method(), request.url());
      }
    });

    adminPage.on('response', (response) => {
      if (
        response.url().includes('ImportWizard') ||
        response.url().includes('worker') ||
        response.url().includes('@astrojs_react')
      ) {
        console.log('RESPONSE:', response.status(), response.url());
      }
    });

    adminPage.on('requestfailed', (request) => {
      console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
    });

    // Check if ImportWizard is hydrated
    const islandInfo = await adminPage.evaluate(() => {
      const islands = document.querySelectorAll('astro-island');
      return Array.from(islands).map((el) => ({
        uid: el.getAttribute('uid'),
        client: el.getAttribute('client'),
        hasContent: el.innerHTML.length > 100,
        scripts: Array.from(el.querySelectorAll('script')).map((s) => s.src),
        outerHTML: el.outerHTML.substring(0, 500),
      }));
    });
    console.log('ASTRO ISLANDS:', JSON.stringify(islandInfo, null, 2));

    // Click Continuar to go to confirm step
    console.log('ABOUT TO CLICK CONTINUAR');
    await continuarBtn.click();
    console.log('CLICKED CONTINUAR');

    // Check if the island's hydrate method was called
    await adminPage.waitForTimeout(1000);
    const hydrateCheck = await adminPage.evaluate(() => {
      const island = document.querySelector('astro-island[component-url*="ImportWizard"]');
      if (!island) return 'no island';
      return {
        hasSSR: island.hasAttribute('ssr'),
        clientRenderTime: island.getAttribute('client-render-time'),
        outerHTML: island.outerHTML.substring(0, 500),
      };
    });
    console.log('HYDRATE CHECK AFTER CLICK:', JSON.stringify(hydrateCheck, null, 2));

    // Check page content after click
    const afterClickContent = await adminPage.content();
    console.log('AFTER CLICK CONTENT (first 3000 chars):', afterClickContent.substring(0, 3000));

    // Wait for confirm step (heading "Confirmar importación") - use polling to catch React state update
    await expect(adminPage.locator('[data-step="confirm"]')).toBeVisible({ timeout: 30000 });

    await adminPage.waitForTimeout(3000);

    // The step has changed to confirm - verify by checking data-step attribute on the island's inner div
    const importWizardIsland = adminPage
      .locator('astro-island[component-url*="ImportWizard"]')
      .first();
    await expect(importWizardIsland.locator('[data-step="confirm"]')).toBeVisible({
      timeout: 10000,
    });

    // Click Confirmar e importar - the button should be available in the confirm step
    await adminPage.getByRole('button', { name: 'Confirmar e importar' }).click();

    // Wait for the confirmation modal to appear
    await expect(adminPage.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 });

    // Verify confirmation modal content
    await expect(
      adminPage.locator('[role="dialog"]').getByRole('heading', { name: 'Confirmar importación' })
    ).toBeVisible();
    await expect(
      adminPage.locator('[role="dialog"]').getByText(/Se importarán.*sorteos con la política.*skip/)
    ).toBeVisible();

    // Confirm in modal
    await adminPage.locator('[role="dialog"]').getByRole('button', { name: 'Confirmar' }).click();

    // Wait for result step
    await adminPage.waitForTimeout(3000);

    // Re-query the island after state changes
    const importWizardIslandResult = adminPage
      .locator('astro-island[component-url*="ImportWizard"]')
      .first();

    // Debug: check island content
    const islandContent = await importWizardIslandResult.innerHTML();
    console.log('ISLAND CONTENT AFTER COMMIT:', islandContent.substring(0, 5000));

    // Wait for the result step by checking data-step attribute on the island's inner div
    await expect(importWizardIslandResult.locator('[data-step="result"]')).toBeVisible({
      timeout: 15000,
    });

    // Wait a bit more for React to render the content
    await adminPage.waitForTimeout(2000);

    // Verify result step - scope to island since React state changes inside island don't update page
    await expect(
      importWizardIslandResult.getByRole('heading', { name: 'Importación completada' })
    ).toBeVisible({ timeout: 10000 });
    await expect(importWizardIslandResult.getByText('Creados: 2')).toBeVisible();
    await expect(importWizardIslandResult.getByText('Actualizados: 0')).toBeVisible();
    await expect(importWizardIslandResult.getByText('Omitidos: 0')).toBeVisible();
  });

  test.skip('should show error when worker fails', () => {
    // This test is difficult to trigger in E2E because FileDropzone validates file type
    // before sending to worker. The unit test covers worker ERROR message handling.
    // We skip this E2E test and rely on unit test coverage.
  });

  test('should allow policy selection', async ({ adminPage }) => {
    // Wait for file input to be available
    await adminPage.waitForSelector('[data-testid="file-dropzone"] input[type="file"]', {
      state: 'attached',
      timeout: 15000,
    });

    const fileInput = adminPage.locator('[data-testid="file-dropzone"] input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'test-import.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(
        'officialNumber,drawDate,tradicional1,tradicional2,tradicional3,tradicional4,tradicional5,tradicional6,la_segunda1,la_segunda2,la_segunda3,la_segunda4,la_segunda5,la_segunda6,revancha1,revancha2,revancha3,revancha4,revancha5,revancha6,siempre_sale1,siempre_sale2,siempre_sale3,siempre_sale4,siempre_sale5,siempre_sale6\n3300,2024-12-01,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24\n3301,2024-12-08,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25'
      ),
    });

    await expect(adminPage.getByRole('heading', { name: 'Vista previa' })).toBeVisible({
      timeout: 15000,
    });
    await adminPage.getByRole('button', { name: 'Continuar' }).click();

    // Wait for confirm step to load - the heading should change to "Confirmar importación"
    await expect(adminPage.getByRole('heading', { name: 'Confirmar importación' })).toBeVisible({
      timeout: 15000,
    });

    // Debug: log the radio buttons state
    const radios = adminPage.locator('input[type="radio"]');
    const count = await radios.count();
    console.log(`Found ${count} radio buttons`);
    for (let i = 0; i < count; i++) {
      const radio = radios.nth(i);
      const value = await radio.getAttribute('value');
      const disabled = await radio.isDisabled();
      const checked = await radio.isChecked();
      console.log(`Radio ${i}: value=${value}, disabled=${disabled}, checked=${checked}`);
    }

    // Change policy to replace - use JS to click the input directly (bypasses label issues on mobile)
    await adminPage.evaluate(() => {
      const radio = document.querySelector<HTMLInputElement>('input[value="replace"]');
      if (radio) radio.click();
    });
    await waitForStableContent(adminPage);
    await expect(adminPage.locator('input[value="replace"]')).toBeChecked({ timeout: 10000 });

    // Change policy to merge - use JS to click the input directly
    await adminPage.evaluate(() => {
      const radio = document.querySelector<HTMLInputElement>('input[value="merge"]');
      if (radio) radio.click();
    });
    await waitForStableContent(adminPage);
    await expect(adminPage.locator('input[value="merge"]')).toBeChecked({ timeout: 10000 });
  });
});
