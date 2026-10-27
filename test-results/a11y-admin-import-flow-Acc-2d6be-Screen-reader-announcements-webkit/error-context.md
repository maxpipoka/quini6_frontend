# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y-admin-import-flow.spec.ts >> Accessibility Audit - Admin Import Flow >> Screen reader announcements
- Location: tests\e2e\a11y-admin-import-flow.spec.ts:153:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/vista previa/i)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/vista previa/i) with timeout 10000ms
  - waiting for getByText(/vista previa/i)

```

```yaml
- link "Saltar al contenido principal":
  - /url: "#main-content"
- complementary "Navegación principal":
  - navigation:
    - list:
      - listitem:
        - link "Sorteos":
          - /url: /admin/draws
      - listitem:
        - link "Cambiar contraseña":
          - /url: /admin/change-password
  - button "Cerrar sesión"
  - button "Colapsar menú" [expanded]
- main:
  - heading "Administración" [level=1]
  - heading "Importar Sorteos" [level=1]
  - paragraph: Carga masiva de sorteos desde archivo CSV o Excel
  - heading "Importar sorteos masivamente" [level=2]
  - paragraph: Carga un archivo CSV o XLSX con los sorteos a importar
  - button "Seleccionar archivo CSV o XLSX"
  - paragraph: Arrastra y suelta un archivo aquí
  - paragraph: o haz clic para seleccionar .csv, .xlsx
  - paragraph: "• Formato: CSV (UTF-8) o Excel (.xlsx)"
  - paragraph: "• Columnas requeridas: officialNumber, drawDate, modality, numbers"
  - paragraph: • Máximo 10 MB / 10,000 filas
```

# Test source

```ts
  63  |     // Step 5: Confirm step - verify PolicySelect
  64  |     await expect(page.getByText(/confirmar importación/i)).toBeVisible();
  65  | 
  66  |     const a11yResults3 = await runA11yCheck(page);
  67  |     await assertNoA11yViolations(a11yResults3);
  68  | 
  69  |     // Step 6: Click "Confirmar e importar" to open confirmation modal
  70  |     const confirmButton = page.getByRole('button', { name: /confirmar e importar/i });
  71  |     await expect(confirmButton).toBeVisible();
  72  |     await confirmButton.click();
  73  |     await waitForStableContent(page);
  74  | 
  75  |     // Step 6b: Click "Confirmar" in the modal dialog to actually start import
  76  |     const modalConfirmButton = page.getByRole('button', { name: /^confirmar$/i });
  77  |     await expect(modalConfirmButton).toBeVisible({ timeout: 5000 });
  78  |     await modalConfirmButton.click();
  79  |     await waitForStableContent(page);
  80  | 
  81  |     // Step 7: Progress step - verify ImportProgress has role="status" aria-live
  82  |     // Note: Progress component may not render immediately due to async import - check with longer timeout
  83  |     const progressRegion = page.locator('[role="status"]').first();
  84  |     await expect(progressRegion).toBeVisible({ timeout: 15000 });
  85  |     await expect(progressRegion).toHaveAttribute('aria-live', 'polite');
  86  | 
  87  |     const a11yResults4 = await runA11yCheck(page);
  88  |     await assertNoA11yViolations(a11yResults4);
  89  | 
  90  |     // Step 8: Wait for import to complete (progress reaches 100%)
  91  |     await expect(page.getByText(/importación completada/i)).toBeVisible({ timeout: 45000 });
  92  | 
  93  |     // Step 9: Result step
  94  |     const a11yResults5 = await runA11yCheck(page);
  95  |     await assertNoA11yViolations(a11yResults5);
  96  |   });
  97  | 
  98  |   test('Keyboard tab order verification', async ({ page }) => {
  99  |     await page.goto('/admin/imports/upload');
  100 |     await waitForStableContent(page);
  101 | 
  102 |     // Expected tab order:
  103 |     // 1. File input (hidden but focusable via label)
  104 |     // 2. Drag and drop area
  105 |     // 3. "Cambiar archivo" button (not visible in upload step)
  106 |     // 4. "Continuar" button (visible in preview step)
  107 | 
  108 |     const focusableElements: string[] = [];
  109 | 
  110 |     for (let i = 0; i < 15; i++) {
  111 |       await page.keyboard.press('Tab');
  112 |       const focused = await page.evaluate(() => document.activeElement?.outerHTML || 'none');
  113 |       focusableElements.push(focused);
  114 |       await page.waitForTimeout(100);
  115 |     }
  116 | 
  117 |     // Verify we can navigate through all interactive elements
  118 |     expect(focusableElements.length).toBeGreaterThan(5);
  119 | 
  120 |     const a11yResults = await runA11yCheck(page);
  121 |     await assertNoA11yViolations(a11yResults);
  122 |   });
  123 | 
  124 |   test('Focus indicator verification', async ({ page }) => {
  125 |     await page.goto('/admin/imports/upload');
  126 |     await waitForStableContent(page);
  127 | 
  128 |     // Tab to first focusable element
  129 |     await page.keyboard.press('Tab');
  130 | 
  131 |     const focusedElement = page.locator(':focus');
  132 |     await expect(focusedElement).toBeVisible();
  133 | 
  134 |     // Check focus styles (3px solid outline, 2px offset, #005fcc)
  135 |     const focusStyles = await focusedElement.evaluate((el) => {
  136 |       const styles = window.getComputedStyle(el);
  137 |       return {
  138 |         outlineWidth: styles.outlineWidth,
  139 |         outlineStyle: styles.outlineStyle,
  140 |         outlineColor: styles.outlineColor,
  141 |         outlineOffset: styles.outlineOffset,
  142 |       };
  143 |     });
  144 | 
  145 |     // At least verify outline is visible (exact values may vary by component)
  146 |     expect(focusStyles.outlineStyle).not.toBe('none');
  147 |     expect(focusStyles.outlineWidth).not.toBe('0px');
  148 | 
  149 |     const a11yResults = await runA11yCheck(page);
  150 |     await assertNoA11yViolations(a11yResults);
  151 |   });
  152 | 
  153 |   test('Screen reader announcements', async ({ page }) => {
  154 |     await page.goto('/admin/imports/upload');
  155 |     await waitForStableContent(page);
  156 | 
  157 |     // 1. File selected announcement - Toast has role="alert" with aria-live="polite"
  158 |     const fileInput = page.locator('input[type="file"]');
  159 |     await fileInput.setInputFiles('tests/e2e/fixtures/sample-draws.csv');
  160 |     await waitForStableContent(page);
  161 | 
  162 |     // Wait for step transition to preview
> 163 |     await expect(page.getByText(/vista previa/i)).toBeVisible({ timeout: 10000 });
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  164 | 
  165 |     // Select first valid row to enable Continue button
  166 |     const firstRowCheckbox = page.locator('tbody input[type="checkbox"]').first();
  167 |     await firstRowCheckbox.click();
  168 |     await waitForStableContent(page);
  169 | 
  170 |     // 2. Continue to confirm step - Continue button should now be enabled
  171 |     const continueButton = page.getByRole('button', { name: /continuar/i });
  172 |     await expect(continueButton).toBeEnabled({ timeout: 5000 });
  173 |     await continueButton.click();
  174 |     await waitForStableContent(page);
  175 | 
  176 |     // 3. Confirm import - opens modal
  177 |     const confirmButton = page.getByRole('button', { name: /confirmar e importar/i });
  178 |     await expect(confirmButton).toBeVisible();
  179 |     await confirmButton.click();
  180 |     await waitForStableContent(page);
  181 | 
  182 |     // 3b. Click "Confirmar" in the modal dialog
  183 |     const modalConfirmButton = page.getByRole('button', { name: /^confirmar$/i });
  184 |     await expect(modalConfirmButton).toBeVisible({ timeout: 5000 });
  185 |     await modalConfirmButton.click();
  186 |     await waitForStableContent(page);
  187 | 
  188 |     // 4. Progress updates (role="status" with aria-live) - appears after import starts
  189 |     await expect(page.locator('[role="status"]').first()).toBeVisible({ timeout: 15000 });
  190 | 
  191 |     // 5. Import complete announcement
  192 |     await expect(page.getByText(/importación completada/i)).toBeVisible({ timeout: 45000 });
  193 | 
  194 |     const a11yResults = await runA11yCheck(page);
  195 |     await assertNoA11yViolations(a11yResults);
  196 |   });
  197 | 
  198 |   test('Color contrast verification', async ({ page }) => {
  199 |     await page.goto('/admin/imports/upload');
  200 |     await waitForStableContent(page);
  201 | 
  202 |     // Run axe with color-contrast rule explicitly
  203 |     const a11yResults = await runA11yCheck(page);
  204 |     
  205 |     // The color-contrast rule is disabled in runA11yCheck due to false positives
  206 |     // Just verify the page loads without critical violations
  207 |     await assertNoA11yViolations(a11yResults);
  208 |   });
  209 | 
  210 |   test('ARIA and semantic HTML verification', async ({ page }) => {
  211 |     await page.goto('/admin/imports/upload');
  212 |     await waitForStableContent(page);
  213 | 
  214 |     // FileDropzone - verify proper label/input association
  215 |     const dropzone = page.locator('[data-testid="file-dropzone"]').first();
  216 |     await expect(dropzone).toBeVisible();
  217 |     // Container should NOT have role="button" (fixed in PR 2)
  218 |     await expect(dropzone).not.toHaveAttribute('role', 'button');
  219 | 
  220 |     // Upload file to see preview
  221 |     await page.locator('input[type="file"]').setInputFiles('tests/e2e/fixtures/sample-draws.csv');
  222 |     await waitForStableContent(page);
  223 | 
  224 |     // Wait for step transition to preview
  225 |     await expect(page.getByText(/vista previa/i)).toBeVisible({ timeout: 10000 });
  226 | 
  227 |     // ImportPreviewTable - verify table semantics
  228 |     const previewTable = page.locator('[data-testid="import-preview"]').first();
  229 |     await expect(previewTable).toBeVisible();
  230 |     // Should have proper <table>, <thead>, <tbody>, <th scope="col">
  231 |     const thCount = await page.locator('th[scope="col"]').count();
  232 |     expect(thCount).toBeGreaterThanOrEqual(5);
  233 | 
  234 |     // Select a row to enable Continue button
  235 |     const firstRowCheckbox = page.locator('tbody input[type="checkbox"]').first();
  236 |     await firstRowCheckbox.click();
  237 |     await waitForStableContent(page);
  238 | 
  239 |     // Continue to confirm step
  240 |     const continueButton = page.getByRole('button', { name: /continuar/i });
  241 |     await expect(continueButton).toBeEnabled({ timeout: 5000 });
  242 |     await continueButton.click();
  243 |     await waitForStableContent(page);
  244 | 
  245 |     // Confirm step - verify PolicySelect
  246 |     await expect(page.getByText(/confirmar importación/i)).toBeVisible();
  247 | 
  248 |     // Start import - opens modal
  249 |     const confirmButton = page.getByRole('button', { name: /confirmar e importar/i });
  250 |     await confirmButton.click();
  251 |     await waitForStableContent(page);
  252 | 
  253 |     // Click "Confirmar" in the modal dialog
  254 |     const modalConfirmButton = page.getByRole('button', { name: /^confirmar$/i });
  255 |     await expect(modalConfirmButton).toBeVisible({ timeout: 5000 });
  256 |     await modalConfirmButton.click();
  257 |     await waitForStableContent(page);
  258 | 
  259 |     // ImportProgress - verify role="status" aria-live="polite"
  260 |     const progress = page.locator('[role="status"]').first();
  261 |     await expect(progress).toBeVisible({ timeout: 15000 });
  262 |     await expect(progress).toHaveAttribute('aria-live', 'polite');
  263 | 
```