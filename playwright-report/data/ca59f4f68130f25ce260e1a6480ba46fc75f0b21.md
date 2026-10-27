# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sorteos.spec.ts >> Sorteos Page >> mobile card layout renders draw cards
- Location: tests\e2e\sorteos.spec.ts:44:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:4321/sorteos", waiting until "load"

```

# Page snapshot

```yaml
- article [ref=e3]:
  - generic [ref=e6]:
    - heading "Unable to connect" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - text: Nightly can’t connect to the server at
      - strong [ref=e9]: localhost:4321
    - generic [ref=e10]:
      - heading "What can you do about it?" [level=3] [ref=e11]
      - list [ref=e12]:
        - listitem [ref=e13]: The site could be temporarily unavailable or too busy. Try again in a few moments.
        - listitem [ref=e14]: If you are unable to load any pages, check your computer’s network connection.
        - listitem [ref=e15]: If your computer or network is protected by a firewall or proxy, make sure that Nightly is permitted to access the web.
    - button "Try Again" [ref=e18]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Sorteos Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto('/sorteos');
     |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  6  |   });
  7  | 
  8  |   test('loads the history heading', async ({ page }) => {
  9  |     await expect(page.locator('main h1')).toContainText('Historial de sorteos');
  10 |   });
  11 | 
  12 |   test('shows the draws table with the latest draw', async ({ page }) => {
  13 |     await expect(page.locator('table tbody tr')).toHaveCount(20);
  14 |     await expect(page.locator('table tbody tr').first()).toContainText('3245');
  15 |   });
  16 | 
  17 |   test('pagination is shown when there are multiple pages', async ({ page }) => {
  18 |     await expect(
  19 |       page.getByRole('navigation', { name: 'Paginación del historial de sorteos' })
  20 |     ).toBeVisible();
  21 |   });
  22 | 
  23 |   test('pagination navigates to the next page', async ({ page }) => {
  24 |     await page.getByRole('link', { name: 'Página siguiente' }).click();
  25 |     await expect(page).toHaveURL(/page=2/);
  26 |     await expect(page.locator('main h1')).toContainText('Historial de sorteos');
  27 |   });
  28 | 
  29 |   test('year filter navigates with the year param', async ({ page }) => {
  30 |     await page.getByLabel('Seleccionar año').selectOption('2024');
  31 |     await expect(page).toHaveURL(/year=2024/);
  32 |     await expect(page.locator('table tbody tr').first()).toBeVisible();
  33 |   });
  34 | 
  35 |   test('clicking a drawer link navigates to the detail page', async ({ page }) => {
  36 |     await page
  37 |       .getByRole('link', { name: /Ver resultados/ })
  38 |       .first()
  39 |       .click();
  40 |     await expect(page).toHaveURL(/\/sorteos\/\d+/);
  41 |     await expect(page.locator('main h1')).toContainText('Sorteo');
  42 |   });
  43 | 
  44 |   test('mobile card layout renders draw cards', async ({ page }) => {
  45 |     await page.setViewportSize({ width: 375, height: 667 });
  46 |     const cards = page.locator('article[data-row-index]');
  47 |     await expect(cards.first()).toBeVisible();
  48 |   });
  49 | });
  50 | 
```