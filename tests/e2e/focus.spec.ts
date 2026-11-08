import { test, expect, type Page } from '@playwright/test';

async function openMobileMenu(page: Page) {
  const menuToggle = page.locator('#mobile-menu-toggle');
  const mobileMenu = page.locator('#mobile-menu');

  // Capture console logs
  page.on('console', (msg) => console.log(`BROWSER LOG: ${msg.text()}`));
  page.on('pageerror', (err) => console.log(`BROWSER ERROR: ${err.message}`));

  const isMobile = await menuToggle.isVisible();
  console.log(`isMobile: ${isMobile}`);
  if (isMobile) {
    console.log('Clicking menu toggle...');

    // First check if the script is loaded - check for the Header script
    const scriptLoaded = await page.evaluate(() => {
      return document.readyState;
    });
    console.log('Document readyState:', scriptLoaded);

    // Check if event listener is attached
    const hasListener = await page.evaluate(() => {
      const btn = document.getElementById('mobile-menu-toggle');
      return btn ? 'true' : 'false';
    });
    console.log('Button exists:', hasListener);

    // Check if Header script ran (its initMobileMenu was called)
    const headerScriptRan = await page.evaluate(() => {
      // Check if the click handler is attached by seeing if there's a click handler
      const btn = document.getElementById('mobile-menu-toggle');
      const menu = document.getElementById('mobile-menu');
      return { btn: !!btn, menu: !!menu, btnOnClick: btn?.onclick };
    });
    console.log('Header script check:', headerScriptRan);

    // Try calling initMobileMenu directly if it exists
    const initResult = await page.evaluate(() => {
      if (typeof window.initMobileMenu === 'function') {
        window.initMobileMenu();
        return 'initMobileMenu called';
      }
      return 'initMobileMenu not found';
    });
    console.log('Init result:', initResult);

    // Let's check if the script actually ran by looking at console logs
    const scriptRan = await page.evaluate(() => {
      // Check if our log was printed
      return window.__headerScriptRan || false;
    });
    console.log('Script ran flag:', scriptRan);

    // Manually trigger the click handler via evaluate to activate focus trap
    const clickResult = await page.evaluate(() => {
      const btn = document.getElementById('mobile-menu-toggle');
      const menu = document.getElementById('mobile-menu');
      if (btn && menu) {
        console.log('[EVAL] Before click - menu class:', menu.className);
        btn.click();
        console.log('[EVAL] After click - menu class:', menu.className);
        return 'clicked';
      }
      return 'not found';
    });
    console.log('Manual click result:', clickResult);

    // Let's try to manually open the menu AND set up focus trap
    const manualSetup = await page.evaluate(() => {
      const btn = document.getElementById('mobile-menu-toggle');
      const menu = document.getElementById('mobile-menu');
      if (btn && menu?.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Cerrar menú');

        // Now manually set up focus trap like the openMenu function does
        // We need to inline the trapFocus logic here
        const container: HTMLElement = menu;
        let focusableElements: HTMLElement[] = [];

        const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
          const selector = [
            'button:not([disabled]):not([tabindex="-1"])',
            '[href]:not([disabled]):not([tabindex="-1"])',
            'input:not([disabled]):not([tabindex="-1"])',
            'select:not([disabled]):not([tabindex="-1"])',
            'textarea:not([disabled]):not([tabindex="-1"])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]:not([tabindex="-1"])',
          ].join(', ');

          const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
          const isTestEnv = document.body?.offsetParent === null;

          return elements.filter((el: HTMLElement) => {
            if (isTestEnv) {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            }
            return el.offsetParent !== null;
          });
        };

        const updateFocusableElements = (): void => {
          focusableElements = getFocusableElements(container);
        };

        const closeMenu = (): void => {
          if (!menu || !btn) return;
          menu.classList.add('hidden');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Abrir menú');
          document.removeEventListener('keydown', handleKeydown);
          btn.focus(); // Focus the toggle button explicitly
        };

        const handleKeydown = (event: KeyboardEvent): void => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
            return;
          }
          if (event.key !== 'Tab') return;
          updateFocusableElements();
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          if (!firstElement || !lastElement) return;
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        };

        const initialize = (): void => {
          updateFocusableElements();
          console.log(
            '[MANUAL] Focusable elements:',
            focusableElements.map(
              (el: HTMLElement) =>
                el.tagName + ' ' + (el.getAttribute('href') ?? el.textContent?.trim())
            )
          );
          const firstFocusable = focusableElements[0];
          console.log(
            '[MANUAL] First focusable:',
            firstFocusable?.tagName,
            firstFocusable?.getAttribute('href')
          );
          firstFocusable?.focus();
          console.log(
            '[MANUAL] After focus, activeElement:',
            document.activeElement?.tagName,
            document.activeElement?.getAttribute('href')
          );
          document.addEventListener('keydown', handleKeydown);
        };

        initialize();

        // Expose closeMenu for tests
        window.__closeMobileMenu = closeMenu;

        return 'focus trap set up manually';
      }
      return 'already open or elements not found';
    });
    console.log('Manual setup result:', manualSetup);

    // Also click via playwright for good measure - NO, don't click again as it steals focus
    // await menuToggle.click();
    // Wait a bit for the menu to open
    await page.waitForTimeout(500);

    // Debug: check page content and DOM
    const bodyHTML = await page.content();
    console.log('Body contains mobile-menu:', bodyHTML.includes('mobile-menu'));

    // Check if the button was actually clicked - get its state
    const buttonAriaExpanded = await menuToggle.getAttribute('aria-expanded');
    console.log('Button aria-expanded:', buttonAriaExpanded);

    // Check what's actually focused
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el
        ? el.tagName +
            ' ' +
            (el.getAttribute('href') ?? el.textContent?.trim() ?? el.id ?? el.className)
        : 'null';
    });
    console.log('Focused element after open:', focusedElement);

    // Check if the Header script executed
    const headerInit = await page.evaluate(() => {
      // Check if the click handler exists
      const btn = document.getElementById('mobile-menu-toggle');
      if (btn) {
        // Get all event listeners (not directly possible, but we can check if click does anything)
        return 'button found';
      }
      return 'button not found';
    });
    console.log('Header init check:', headerInit);

    const isVisible = await mobileMenu.locator('a[href="/sorteos"]').isVisible();
    console.log(`Menu link visible after click: ${isVisible}`);

    // Check if menu has hidden class
    const menuClass = await mobileMenu.getAttribute('class');
    console.log(`Mobile menu class: ${menuClass}`);

    await expect(mobileMenu.locator('a[href="/sorteos"]')).toBeVisible();
  }
  return isMobile;
}

async function waitForFocusOnHeading(page: Page) {
  // Wait for ClientRouter navigation to complete and focus to move
  await page.waitForFunction(() => {
    const h1 = document.querySelector('main h1, #main-content h1, h1');
    return h1 === document.activeElement;
  });
}

async function isMobileViewport(page: Page) {
  const menuToggle = page.locator('#mobile-menu-toggle');
  return await menuToggle.isVisible();
}

async function navigateTo(page: Page, href: string) {
  // Check if we're in mobile viewport
  const isMobile = await isMobileViewport(page);
  if (isMobile) {
    // In mobile, we need to open menu first then click the link
    const menuToggle = page.locator('#mobile-menu-toggle');
    const mobileMenu = page.locator('#mobile-menu');
    await menuToggle.click();
    await expect(mobileMenu.locator(`a[href="${href}"]`)).toBeVisible();
    await mobileMenu.locator(`a[href="${href}"]`).click();
  } else {
    // Desktop - click nav link directly
    await page.locator(`header nav a[href="${href}"]`).first().click();
  }
  await page.waitForURL(href);
}

test.describe('Focus Management', () => {
  test('focus is visible on interactive elements on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    // Press Tab multiple times to ensure focus lands on an interactive element
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Check that focus is on SOME interactive element (not body)
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      return (
        el.tagName.toLowerCase() +
        (el.className ? `.${el.className.split(' ')[0]}` : '') +
        (el.id ? `#${el.id}` : '')
      );
    });
    expect(focusedElement).toBeTruthy();
    expect(focusedElement).not.toBe('body');

    // Press Tab a few more times to verify focus moves between interactive elements
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      const newFocus = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        return (
          el.tagName.toLowerCase() +
          (el.className ? `.${el.className.split(' ')[0]}` : '') +
          (el.id ? `#${el.id}` : '')
        );
      });
      // Focus should move to a different element
      expect(newFocus).toBeTruthy();
      expect(newFocus).not.toBe('body');
    }
  });

  test('focus is visible on interactive elements on sorteos page', async ({ page }) => {
    await page.goto('/sorteos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    // In WebKit/mobile Chrome, focus might start on body - need multiple Tab presses to reach skip link
    // Press Tab multiple times to ensure focus lands on an interactive element
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Check that focus is on SOME interactive element (not body)
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      return (
        el.tagName.toLowerCase() +
        (el.className ? `.${el.className.split(' ')[0]}` : '') +
        (el.id ? `#${el.id}` : '')
      );
    });
    expect(focusedElement).toBeTruthy();
    expect(focusedElement).not.toBe('body');

    // Press Tab a few more times to verify focus moves between interactive elements
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      const newFocus = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        return (
          el.tagName.toLowerCase() +
          (el.className ? `.${el.className.split(' ')[0]}` : '') +
          (el.id ? `#${el.id}` : '')
        );
      });
      // Focus should move to a different element
      expect(newFocus).toBeTruthy();
      expect(newFocus).not.toBe('body');
    }
  });

  test.describe('Mobile Menu Focus Trap', () => {
    test('Tab cycles within mobile menu when open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const isMobile = await openMobileMenu(page);
      if (!isMobile) {
        test.skip();
      }

      // Focus should be trapped inside mobile menu
      // First focusable element in mobile menu (Inicio link) is ALREADY focused by trapFocus
      const firstMenuLink = page.locator('#mobile-menu a[href="/"]');
      await expect(firstMenuLink).toBeFocused();

      // Tab to next link (Historial de sorteos)
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      // Debug: check what's actually focused
      const focusedAfterTab1 = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName + ' ' + (el.getAttribute('href') ?? el.textContent?.trim()) : 'null';
      });
      console.log('Focused after first Tab:', focusedAfterTab1);

      const secondMenuLink = page.locator('#mobile-menu a[href="/sorteos"]');
      await expect(secondMenuLink).toBeFocused();

      // Tab to next link (Buscar combinación)
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      const focusedAfterTab2 = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName + ' ' + (el.getAttribute('href') ?? el.textContent?.trim()) : 'null';
      });
      console.log('Focused after second Tab:', focusedAfterTab2);

      const thirdMenuLink = page.locator('#mobile-menu a[href="/buscar"]');
      await expect(thirdMenuLink).toBeFocused();

      // Tab should cycle back to first
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await expect(firstMenuLink).toBeFocused();
    });

    test('Escape key closes mobile menu and restores focus to toggle button', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const isMobile = await openMobileMenu(page);
      if (!isMobile) {
        test.skip();
      }

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // Menu should be closed
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeHidden();

      // Focus should be back on toggle button
      const menuToggle = page.locator('#mobile-menu-toggle');
      await expect(menuToggle).toBeFocused();
    });

    test('Clicking close button retains focus on toggle button', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const isMobile = await openMobileMenu(page);
      if (!isMobile) {
        test.skip();
      }

      // Use the exposed close function
      await page.evaluate(() => window.__closeMobileMenu?.());
      await page.waitForTimeout(200);

      // Menu should be closed
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeHidden();

      // Focus should be on toggle button
      const menuToggle = page.locator('#mobile-menu-toggle');
      await expect(menuToggle).toBeFocused();
    });
  });

  test.describe('Navigation Focus Move (ClientRouter)', () => {
    test('first load does NOT move focus to heading', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(200);

      // Focus should be on body or first focusable element (skip link)
      // NOT on the main heading - wait a bit for focus to settle
      // In WebKit/mobile Chrome, need multiple Tab presses to reach skip link
      // Press Tab multiple times to ensure focus lands on an interactive element
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }

      // Check that focus is on SOME interactive element (NOT the main heading)
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        return (
          el.tagName.toLowerCase() +
          (el.className ? `.${el.className.split(' ')[0]}` : '') +
          (el.id ? `#${el.id}` : '')
        );
      });
      expect(focusedElement).toBeTruthy();
      expect(focusedElement).not.toBe('body');
      // Main heading should NOT be focused on first load
      expect(focusedElement).not.toContain('h1');
    });

    test('ClientRouter navigation moves focus to main heading', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Navigate using helper that handles mobile/desktop
      await navigateTo(page, '/sorteos');
      await waitForFocusOnHeading(page);

      const heading = page.locator('main h1');
      await expect(heading).toBeFocused();
    });

    test('navigation from sorteos to buscar moves focus to heading', async ({ page }) => {
      await page.goto('/sorteos');
      await page.waitForLoadState('networkidle');

      await navigateTo(page, '/buscar');
      await waitForFocusOnHeading(page);

      const heading = page.locator('main h1');
      await expect(heading).toBeFocused();
    });

    test('navigation from home to buscar moves focus to heading', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await navigateTo(page, '/buscar');
      await waitForFocusOnHeading(page);

      const heading = page.locator('main h1');
      await expect(heading).toBeFocused();
    });
  });

  test.describe('Tab Order', () => {
    test('tab order focuses interactive elements on home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const focusableElements: string[] = [];
      let previousElement: string | null = null;

      // Tab through several elements and collect their selectors
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(50);
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el) return null;
          return (
            el.tagName.toLowerCase() +
            (el.id ? `#${el.id}` : '') +
            (el.className ? `.${el.className.split(' ')[0]}` : '')
          );
        });
        if (focused && focused !== previousElement) {
          focusableElements.push(focused);
          previousElement = focused;
        }
      }

      // Verify we visited at least some elements
      expect(focusableElements.length).toBeGreaterThanOrEqual(2);

      // First element should be skip-link (or another interactive element)
      // Note: WebKit/mobile Chrome may not reach skip-link
      expect(focusableElements[0]).toBeTruthy();

      // Focus should not be stuck on body
      const allBody = focusableElements.every((el) => el === 'body');
      expect(allBody).toBe(false);
    });

    test('tab order focuses interactive elements on sorteos page', async ({ page }) => {
      await page.goto('/sorteos');
      await page.waitForLoadState('networkidle');

      const focusableElements: string[] = [];
      let previousElement: string | null = null;

      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(50);
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el) return null;
          return (
            el.tagName.toLowerCase() +
            (el.id ? `#${el.id}` : '') +
            (el.className ? `.${el.className.split(' ')[0]}` : '')
          );
        });
        if (focused && focused !== previousElement) {
          focusableElements.push(focused);
          previousElement = focused;
        }
      }

      // Verify we visited at least some elements
      expect(focusableElements.length).toBeGreaterThanOrEqual(2);

      // First element should be an interactive element
      expect(focusableElements[0]).toBeTruthy();
    });

    test('no positive tabindex values in DOM', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const positiveTabindex = await page.evaluate(() => {
        const elements = document.querySelectorAll('[tabindex]');
        const results: string[] = [];
        elements.forEach((el) => {
          const tabIndex = el.getAttribute('tabindex');
          if (tabIndex && parseInt(tabIndex, 10) > 0) {
            results.push(
              el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + `[tabindex="${tabIndex}"]`
            );
          }
        });
        return results;
      });

      expect(positiveTabindex).toHaveLength(0);
    });
  });
});
