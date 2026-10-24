import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const EXACT_COMBINATION = ['05', '12', '23', '34', '41', '45'];

async function fillCombination(page: Page, values: string[]) {
  for (let index = 0; index < values.length; index++) {
    await page.getByLabel(`Número ${index + 1}`).fill(values[index]!);
  }
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
    await page.getByTestId('search-button').click();

    await expect(page.getByTestId('search-results')).toBeVisible();
    await expect(page.getByTestId('search-results')).toContainText('Se encontraron 1 coincidencia');
    await expect(page.getByTestId('search-results')).toContainText('Sorteo Nº 3245');
  });

  test('no matches state', async ({ page }) => {
    await fillCombination(page, ['01', '02', '03', '04', '05', '06']);
    await page.getByTestId('search-button').click();

    await expect(page.getByTestId('no-results')).toBeVisible();
    await expect(page.getByTestId('no-results')).toContainText('No encontramos esta combinación');
  });

  test('invalid submission shows a validation error', async ({ page }) => {
    await page.getByTestId('search-button').click();
    await expect(page.getByTestId('search-error')).toContainText('exactamente 6 números');
  });

  test('clear button resets the form', async ({ page }) => {
    await fillCombination(page, EXACT_COMBINATION);
    await page.getByRole('button', { name: 'Limpiar' }).click();
    await expect(page.getByLabel('Número 1')).toHaveValue('');
  });
});
