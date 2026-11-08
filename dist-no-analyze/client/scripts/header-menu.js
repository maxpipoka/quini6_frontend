/**
 * Header Mobile Menu - Client-side script
 * Uses shared focus-trap utility for accessible mobile menu
 */

import { trapFocus, restoreFocus } from '/lib/focus-trap.js';

function initializeHeaderMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const themeToggle = document.getElementById('theme-toggle');

  if (!menuToggle || !mobileMenu) {
    return;
  }

  let cleanupFocusTrap = null;

  if (themeToggle) {
    const updateThemeIcon = (isDark) => {
      themeToggle.innerHTML = isDark
        ? '<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
        : '<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';
      themeToggle.setAttribute('aria-pressed', String(isDark));
    };

    updateThemeIcon(document.documentElement.getAttribute('data-theme') === 'dark');

    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      updateThemeIcon(!isDark);
    });
  }

  // Use a flag to track if listeners are already attached
  if (menuToggle.dataset.listenersAttached === 'true') {
    return;
  }

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    if (cleanupFocusTrap) {
      cleanupFocusTrap();
      cleanupFocusTrap = null;
    }
  };

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');

    // Activate focus trap using shared utility
    cleanupFocusTrap = trapFocus({
      container: mobileMenu,
      onEscape: () => {
        closeMenu();
        restoreFocus(menuToggle);
      },
      onClose: () => {
        // Cleanup is handled by closeMenu
      },
    });

    // Focus first focusable element in menu
    const firstFocusable = mobileMenu.querySelector('a, button');
    firstFocusable?.focus();
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('hidden');
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
      restoreFocus(menuToggle);
    }
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      restoreFocus(menuToggle);
    });
  });

  // Mark listeners as attached
  menuToggle.dataset.listenersAttached = 'true';
}

// Initialize immediately (not waiting for DOMContentLoaded)
initializeHeaderMenu();

// Also handle DOMContentLoaded for good measure
document.addEventListener('DOMContentLoaded', () => {
  initializeHeaderMenu();
});

// Handle ClientRouter navigation (re-initialization)
document.addEventListener('astro:after-swap', () => {
  initializeHeaderMenu();
});
