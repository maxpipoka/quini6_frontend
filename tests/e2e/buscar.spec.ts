import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const EXACT_COMBINATION = ['05', '12', '23', '34', '41', '45'];
const NO_MATCH_COMBINATION = ['01', '02', '03', '04', '05', '06'];

async function fillCombination(page: Page, values: string[]) {
  // Use page.fill with force to set values properly
  for (let index = 0; index < values.length; index++) {
    const input = page.locator(`[data-number-index="${index}"]`);
    await input.waitFor({ state: 'visible' });
    await input.click({ force: true });
    await input.fill(values[index]!, { force: true });
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(1000);
}

test.describe('Buscar Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/buscar');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page.locator('main h1')).toContainText('Buscar combinación');
    await expect(page.getByTestId('search-form')).toBeVisible();
  });

  test('exact match displays the found draw', async ({ page }) => {
    await fillCombination(page, EXACT_COMBINATION);
    
    // Check button is enabled
    await expect(page.getByTestId('search-button')).toBeEnabled();
    
    // Wait for React to fully hydrate (important for the SearchForm island)
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.waitForTimeout(500);
    
    // Debug: check form state before click
    const button = page.getByTestId('search-button');
    const buttonHtml = await button.evaluate(el => el.outerHTML);
    console.log('BUTTON HTML:', buttonHtml);
    
    // Check input values
    for (let i = 1; i <= 6; i++) {
      const input = page.getByLabel(`Número ${i}`);
      const val = await input.inputValue();
      console.log(`INPUT ${i} VALUE:`, val);
    }
    
    // Set up console listener
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('request', req => console.log('BROWSER REQUEST:', req.method(), req.url()));
    page.on('response', res => console.log('BROWSER RESPONSE:', res.status(), res.url()));
    
    // Click the button using force to bypass any overlays
    await button.click({ force: true });
    
    // Debug: check what's on the page after click
    await page.waitForTimeout(3000);
    const pageContent = await page.content();
    console.log('PAGE CONTENT AFTER CLICK (first 10000 chars):', pageContent.substring(0, 10000));
    
    // Wait for results
    await expect(page.getByTestId('search-results')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('search-results')).toContainText('Se encontraron 1 coincidencia');
    await expect(page.getByTestId('search-results')).toContainText('Sorteo Nº 3245');
  });

  test('no matches state', async ({ page }) => {
    await fillCombination(page, NO_MATCH_COMBINATION);
    
    // Set up console listener
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('request', req => console.log('BROWSER REQUEST:', req.method(), req.url()));
    page.on('response', res => console.log('BROWSER RESPONSE:', res.status(), res.url()));
    
    // Click the button using force to bypass any overlays (same as exact match test)
    await page.getByTestId('search-button').click({ force: true });

    await expect(page.getByTestId('no-results')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('no-results')).toContainText('No encontramos esta combinación');
  });

  test('invalid submission shows a validation error', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('request', req => console.log('BROWSER REQUEST:', req.method(), req.url()));
    page.on('response', res => console.log('BROWSER RESPONSE:', res.status(), res.url()));
    
    // Wait for React to hydrate - check for the React dev tools message
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.waitForTimeout(1000);
    
    // Try pressing Enter on the button
    await page.locator('button[type="submit"]').press('Enter');
    await page.waitForTimeout(2000);
    
    // Check the page content
    const pageContent = await page.content();
    console.log('PAGE CONTENT (first 5000 chars):', pageContent.substring(0, 5000));
    
    await expect(page.getByTestId('search-error')).toContainText('exactamente 6 números', { timeout: 5000 });
  });

  test('clear button resets the form', async ({ page }) => {
    await fillCombination(page, EXACT_COMBINATION);
    await page.getByRole('button', { name: 'Limpiar' }).click();
    await expect(page.getByLabel('Número 1')).toHaveValue('');
  });
});
