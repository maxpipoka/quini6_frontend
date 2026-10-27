# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buscar.spec.ts >> Buscar Page >> invalid submission shows a validation error
- Location: tests\e2e\buscar.spec.ts:39:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('search-error')
Expected substring: "exactamente 6 números"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByTestId('search-error') with timeout 5000ms
  - waiting for getByTestId('search-error')

```

```yaml
- link "Saltar al contenido principal":
  - /url: "#main-content"
- banner:
  - link "Quini 6 Estadísticas - Inicio":
    - /url: /
    - img "Número 06": "06"
    - text: Quini 6 Estadísticas
  - navigation "Navegación principal":
    - link "Inicio":
      - /url: /
    - link "Historial de sorteos":
      - /url: /sorteos
    - link "Buscar combinación":
      - /url: /buscar
  - button "Cambiar tema":
    - img
- main:
  - heading "Buscar combinación" [level=1]
  - paragraph: Ingrese 6 números (0-45) y le mostraremos todos los sorteos donde han salido juntos, en cualquier modalidad.
  - paragraph: Sus 6 números
  - group "Selección de 6 números":
    - textbox "Número 1":
      - /placeholder: "--"
    - textbox "Número 2":
      - /placeholder: "--"
    - textbox "Número 3":
      - /placeholder: "--"
    - textbox "Número 4":
      - /placeholder: "--"
    - textbox "Número 5":
      - /placeholder: "--"
    - textbox "Número 6":
      - /placeholder: "--"
  - button "Limpiar"
  - button "Buscar combinación"
  - paragraph: Ingrese sus 6 números arriba y pulse "Buscar combinación" para ver los resultados.
- contentinfo:
  - link "Quini 6 Estadísticas - Inicio":
    - /url: /
    - text: Quini 6
  - paragraph: Estadísticas históricas oficiales del Quini 6. Consulte sorteos pasados, busque combinaciones y analice frecuencias de números.
  - heading "Navegación" [level=3]
  - navigation "Enlaces de navegación del pie de página":
    - list:
      - listitem:
        - link "Inicio":
          - /url: /
      - listitem:
        - link "Historial de sorteos":
          - /url: /sorteos
      - listitem:
        - link "Buscar combinación":
          - /url: /buscar
  - heading "Legal" [level=3]
  - navigation "Enlaces legales":
    - list:
      - listitem:
        - link "Política de Privacidad":
          - /url: /privacidad
      - listitem:
        - link "Términos de Uso":
          - /url: /terminos
      - listitem:
        - link "Política de Cookies":
          - /url: /cookies
  - paragraph: © 2026 Quini 6 Estadísticas. Datos oficiales de la Lotería de Santa Fe.
  - link "Twitter":
    - /url: https://twitter.com/quini6stats
  - link "GitHub":
    - /url: https://github.com/quini6/stats
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import type { Page } from '@playwright/test';
  3  | 
  4  | const EXACT_COMBINATION = ['05', '12', '23', '34', '41', '45'];
  5  | 
  6  | async function fillCombination(page: Page, values: string[]) {
  7  |   for (let index = 0; index < values.length; index++) {
  8  |     await page.getByLabel(`Número ${index + 1}`).fill(values[index]!);
  9  |   }
  10 | }
  11 | 
  12 | test.describe('Buscar Page', () => {
  13 |   test.beforeEach(async ({ page }) => {
  14 |     await page.goto('/buscar');
  15 |   });
  16 | 
  17 |   test('loads successfully', async ({ page }) => {
  18 |     await expect(page.locator('main h1')).toContainText('Buscar combinación');
  19 |     await expect(page.getByTestId('search-form')).toBeVisible();
  20 |   });
  21 | 
  22 |   test('exact match displays the found draw', async ({ page }) => {
  23 |     await fillCombination(page, EXACT_COMBINATION);
  24 |     await page.getByTestId('search-button').click();
  25 | 
  26 |     await expect(page.getByTestId('search-results')).toBeVisible();
  27 |     await expect(page.getByTestId('search-results')).toContainText('Se encontraron 1 coincidencia');
  28 |     await expect(page.getByTestId('search-results')).toContainText('Sorteo Nº 3245');
  29 |   });
  30 | 
  31 |   test('no matches state', async ({ page }) => {
  32 |     await fillCombination(page, ['01', '02', '03', '04', '05', '06']);
  33 |     await page.getByTestId('search-button').click();
  34 | 
  35 |     await expect(page.getByTestId('no-results')).toBeVisible();
  36 |     await expect(page.getByTestId('no-results')).toContainText('No encontramos esta combinación');
  37 |   });
  38 | 
  39 |   test('invalid submission shows a validation error', async ({ page }) => {
  40 |     await page.getByTestId('search-button').click();
> 41 |     await expect(page.getByTestId('search-error')).toContainText('exactamente 6 números');
     |                                                    ^ Error: expect(locator).toContainText(expected) failed
  42 |   });
  43 | 
  44 |   test('clear button resets the form', async ({ page }) => {
  45 |     await fillCombination(page, EXACT_COMBINATION);
  46 |     await page.getByRole('button', { name: 'Limpiar' }).click();
  47 |     await expect(page.getByLabel('Número 1')).toHaveValue('');
  48 |   });
  49 | });
  50 | 
```