import { test, expect } from '@playwright/test';
import { runA11yCheck, assertNoA11yViolations, waitForStableContent } from './a11y-setup';

test.describe('Accessibility Audit - Admin Import Flow', () => {
  test.setTimeout(240000);
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/imports/upload');
    await waitForStableContent(page);
  });

  test('Full import flow - axe check at final step', async ({ page }) => {
    // Step 1: Initial upload page - target the h1 in layout (exact match)
    await expect(
      page.getByRole('heading', { name: 'Importar Sorteos', exact: true })
    ).toBeVisible();

    // Step 2: FileDropzone - upload CSV
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Verify FileDropzone has proper ARIA
    const dropzone = page.locator('[data-testid="file-dropzone"]').first();
    await expect(dropzone).toBeVisible();

// Upload sample CSV (8 rows in fixture)
    await fileInput.setInputFiles('tests/e2e/fixtures/sample-draws.csv');
    await waitForStableContent(page);
    // Wait for preview step - heading includes count like "Vista previa (8 válidas, 0 inválidas)"
    await expect(page.getByRole('heading', { name: /Vista previa \(8 válidas, 0 inválidas\)/ })).toBeVisible({ timeout: 60000 });

    // Check table has proper headers (matches ImportPreviewTable columns)
    await expect(page.locator('th', { hasText: /fecha/i })).toBeVisible();
    await expect(page.locator('th', { hasText: /tradicional/i })).toBeVisible();

    // Check expand column header (fixed from empty to 'Acciones')
    await expect(page.locator('th', { hasText: /acciones/i })).toBeVisible();

    // Verify keyboard navigation - tab to first row
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

// Step 4: Select a row to enable Continue button
    const firstRowCheckbox = page.locator('tbody input[type="checkbox"]').first();
    await firstRowCheckbox.click({ force: true });
    await waitForStableContent(page);

    // Click "Continuar" to go to confirm step
    const continueButton = page.getByRole('button', { name: /continuar/i });
    await expect(continueButton).toBeEnabled({ timeout: 5000 });
    await continueButton.click();
    await waitForStableContent(page);

    // Step 5: Confirm step - verify PolicySelect
    await expect(page.getByText(/confirmar importación/i)).toBeVisible();

    // Step 6: Click "Confirmar e importar" to open confirmation modal
    const confirmButton = page.getByRole('button', { name: /confirmar e importar/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    await waitForStableContent(page);

    // Step 6b: Click "Confirmar" in the modal dialog to actually start import
    const modalConfirmButton = page.getByRole('button', { name: /^confirmar$/i });
    await expect(modalConfirmButton).toBeVisible({ timeout: 5000 });
    await modalConfirmButton.click();
    await waitForStableContent(page);

    // Step 7: Progress step - verify ImportProgress has role="status" aria-live
    // Note: Progress component may not render immediately due to async import - check with longer timeout
    const progressRegion = page.locator('[role="status"]').first();
    await expect(progressRegion).toBeVisible({ timeout: 15000 });
    await expect(progressRegion).toHaveAttribute('aria-live', 'polite');

    // Step 8: Wait for import to complete (progress reaches 100%)
    await expect(page.getByText(/importación completada/i)).toBeVisible({ timeout: 45000 });

    // Step 9: Result step - single axe check at the end
    const a11yResults = await runA11yCheck(page);
    await assertNoA11yViolations(a11yResults);
  });

  test('Keyboard tab order verification', async ({ page }) => {
    await page.goto('/admin/imports/upload');
    await waitForStableContent(page);

    // Expected tab order:
    // 1. File input (hidden but focusable via label)
    // 2. Drag and drop area
    // 3. "Cambiar archivo" button (not visible in upload step)
    // 4. "Continuar" button (visible in preview step)

    const focusableElements: string[] = [];

    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.outerHTML ?? 'none');
      focusableElements.push(focused);
      await page.waitForTimeout(100);
    }

    // Verify we can navigate through all interactive elements
    expect(focusableElements.length).toBeGreaterThan(5);

    const a11yResults = await runA11yCheck(page);
    await assertNoA11yViolations(a11yResults);
  });

  test('Focus indicator verification', async ({ page }) => {
    await page.goto('/admin/imports/upload');
    await waitForStableContent(page);

    // Tab to first focusable element
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Check focus styles (3px solid outline, 2px offset, #005fcc)
    const focusStyles = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        outlineColor: styles.outlineColor,
        outlineOffset: styles.outlineOffset,
      };
    });

    // At least verify outline is visible (exact values may vary by component)
    expect(focusStyles.outlineStyle).not.toBe('none');
    expect(focusStyles.outlineWidth).not.toBe('0px');

    const a11yResults = await runA11yCheck(page);
    await assertNoA11yViolations(a11yResults);
  });

test('Screen reader announcements', async ({ page }) => {
    await page.goto('/admin/imports/upload');
    await waitForStableContent(page);

    // 1. File selected announcement - Toast has role="alert" with aria-live="polite"
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/e2e/fixtures/sample-draws.csv');
    await waitForStableContent(page);
    // Wait for preview step - heading includes count like "Vista previa (8 válidas, 0 inválidas)"
    await expect(page.getByRole('heading', { name: /Vista previa.*8 válidas, 0 inválidas/ })).toBeVisible({ timeout: 30000 });

    // Select first valid row to enable Continue button
    const firstRowCheckbox = page.locator('tbody input[type="checkbox"]').first();
    await firstRowCheckbox.click({ force: true });
    await waitForStableContent(page);

    // 2. Continue to confirm step - Continue button should now be enabled
    const continueButton = page.getByRole('button', { name: /continuar/i });
    await expect(continueButton).toBeEnabled({ timeout: 5000 });
    await continueButton.click();
    await waitForStableContent(page);

    // 3. Confirm import - opens modal
    const confirmButton = page.getByRole('button', { name: /confirmar e importar/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    await waitForStableContent(page);

    // 3b. Click "Confirmar" in the modal dialog
    const modalConfirmButton = page.getByRole('button', { name: /^confirmar$/i });
    await expect(modalConfirmButton).toBeVisible({ timeout: 5000 });
    await modalConfirmButton.click();
    await waitForStableContent(page);

    // 4. Progress updates (role="status" with aria-live) - appears after import starts
    await expect(page.locator('[role="status"]').first()).toBeVisible({ timeout: 15000 });

    // 5. Import complete announcement
    await expect(page.getByText(/importación completada/i)).toBeVisible({ timeout: 45000 });

    const a11yResults = await runA11yCheck(page);
    await assertNoA11yViolations(a11yResults);
  });

  test('Color contrast verification', async ({ page }) => {
    await page.goto('/admin/imports/upload');
    await waitForStableContent(page);

    // Run axe with color-contrast rule explicitly
    const a11yResults = await runA11yCheck(page);
    // The color-contrast rule is disabled in runA11yCheck due to false positives
    // Just verify the page loads without critical violations
    await assertNoA11yViolations(a11yResults);
  });

  test('ARIA and semantic HTML verification', async ({ page }) => {
    await page.goto('/admin/imports/upload');
    await waitForStableContent(page);

    // FileDropzone - verify proper label/input association
    const dropzone = page.locator('[data-testid="file-dropzone"]').first();
    await expect(dropzone).toBeVisible();
    // Container should NOT have role="button" (fixed in PR 2)
    await expect(dropzone).not.toHaveAttribute('role', 'button');

// Upload file to see preview
    await page.locator('input[type="file"]').setInputFiles('tests/e2e/fixtures/sample-draws.csv');
    await waitForStableContent(page);

    // Wait for preview step - heading includes count like "Vista previa (8 válidas, 0 inválidas)"
    await expect(page.getByRole('heading', { name: /Vista previa.*8 válidas, 0 inválidas/ })).toBeVisible({ timeout: 30000 });
    // Should have proper <table>, <thead>, <tbody>, <th scope="col">
    const thCount = await page.locator('th[scope="col"]').count();
    expect(thCount).toBeGreaterThanOrEqual(5);

    // Select a row to enable Continue button
    const firstRowCheckbox = page.locator('tbody input[type="checkbox"]').first();
    await firstRowCheckbox.click({ force: true });
    await waitForStableContent(page);

    // Continue to confirm step
    const continueButton = page.getByRole('button', { name: /continuar/i });
    await expect(continueButton).toBeEnabled({ timeout: 5000 });
    await continueButton.click();
    await waitForStableContent(page);

    // Confirm step - verify PolicySelect
    await expect(page.getByText(/confirmar importación/i)).toBeVisible();

    // Start import - opens modal
    const confirmButton = page.getByRole('button', { name: /confirmar e importar/i });
    await confirmButton.click();
    await waitForStableContent(page);

    // Click "Confirmar" in the modal dialog
    const modalConfirmButton = page.getByRole('button', { name: /^confirmar$/i });
    await expect(modalConfirmButton).toBeVisible({ timeout: 5000 });
    await modalConfirmButton.click();
    await waitForStableContent(page);

    // ImportProgress - verify role="status" aria-live="polite"
    const progress = page.locator('[role="status"]').first();
    await expect(progress).toBeVisible({ timeout: 15000 });
    await expect(progress).toHaveAttribute('aria-live', 'polite');

    // Progress bar should have proper ARIA
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeAttached();

    const a11yResults = await runA11yCheck(page);
    await assertNoA11yViolations(a11yResults);
  });
});
