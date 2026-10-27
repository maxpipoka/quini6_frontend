# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y-admin-import.spec.ts >> Accessibility Audit - Admin Import Components >> ImportPreviewTable - empty
- Location: tests\e2e\a11y-admin-import.spec.ts:26:5

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:4321/test-fixtures/ImportPreviewTable-visual?state=empty", waiting until "load"

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
  2  | import { runA11yCheck, assertNoA11yViolations } from './a11y-setup';
  3  | 
  4  | const componentFixtures = [
  5  |   { path: '/test-fixtures/FileDropzone-visual?state=default', name: 'FileDropzone - default' },
  6  |   { path: '/test-fixtures/FileDropzone-visual?state=disabled', name: 'FileDropzone - disabled' },
  7  |   { path: '/test-fixtures/ImportPreviewTable-visual?state=default', name: 'ImportPreviewTable - default' },
  8  |   { path: '/test-fixtures/ImportPreviewTable-visual?state=empty', name: 'ImportPreviewTable - empty' },
  9  |   { path: '/test-fixtures/ImportHistoryTable-visual?state=default', name: 'ImportHistoryTable - default' },
  10 |   { path: '/test-fixtures/ImportHistoryTable-visual?state=empty', name: 'ImportHistoryTable - empty' },
  11 |   { path: '/test-fixtures/ImportHistoryTable-visual?state=loading', name: 'ImportHistoryTable - loading' },
  12 |   { path: '/test-fixtures/ImportHistoryTable-visual?state=pagination', name: 'ImportHistoryTable - pagination' },
  13 |   { path: '/test-fixtures/ImportProgress-visual?state=default', name: 'ImportProgress - default' },
  14 |   { path: '/test-fixtures/ImportProgress-visual?state=inProgress', name: 'ImportProgress - inProgress' },
  15 |   { path: '/test-fixtures/ImportProgress-visual?state=success', name: 'ImportProgress - success' },
  16 |   { path: '/test-fixtures/ImportProgress-visual?state=error', name: 'ImportProgress - error' },
  17 |   { path: '/test-fixtures/Progress-visual?state=default', name: 'Progress - default' },
  18 |   { path: '/test-fixtures/Progress-visual?state=partial', name: 'Progress - partial' },
  19 |   { path: '/test-fixtures/Progress-visual?state=complete', name: 'Progress - complete' },
  20 |   { path: '/test-fixtures/Progress-visual?state=indeterminate', name: 'Progress - indeterminate' },
  21 |   { path: '/test-fixtures/Progress-visual?state=error', name: 'Progress - error' },
  22 | ];
  23 | 
  24 | test.describe('Accessibility Audit - Admin Import Components', () => {
  25 |   for (const fixture of componentFixtures) {
  26 |     test(`${fixture.name}`, async ({ page }) => {
> 27 |       await page.goto(fixture.path);
     |                  ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  28 |       await page.waitForLoadState('domcontentloaded');
  29 |       await page.waitForTimeout(500);
  30 | 
  31 |       const accessibilityScanResults = await runA11yCheck(page);
  32 | 
  33 |       expect(accessibilityScanResults.violations).toEqual([]);
  34 |     });
  35 |   }
  36 | });
```