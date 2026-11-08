;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e322564c-e6c0-4162-8973-e54dd662b351",e._sentryDebugIdIdentifier="sentry-dbid-e322564c-e6c0-4162-8973-e54dd662b351")}catch(e){}}();import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, k as renderComponent, m as maybeRenderHead, n as renderSlot } from './astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { jsx } from 'react/jsx-runtime';
import 'react';
import { f as formatDrawNumber } from './schemas_BWmv8V5v.mjs';
import './_sentry-release-injection-file_BwnRfS4D.mjs';
/* empty css                          */
import 'clsx';

const sizeClasses = {
  sm: "w-6 h-6 text-caption",
  md: "w-8 h-8 text-base-sm",
  lg: "w-12 h-12 text-lg"
};
const variantClasses = {
  primary: "bg-primary-500 text-white border-primary-500",
  secondary: "bg-secondary-500 text-white border-secondary-500",
  success: "bg-success-500 text-white border-success-500",
  warning: "bg-warning-500 text-neutral-900 border-warning-500 dark:text-neutral-50"
};
const NumberBall = ({
  number,
  size = "md",
  variant = "primary",
  className = ""
}) => {
  const validNumber = Math.max(0, Math.min(45, Math.floor(number)));
  const formattedNumber = formatDrawNumber(validNumber);
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `
        inline-flex items-center justify-center
        rounded-full border-2 font-bold
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `,
      role: "img",
      "aria-label": `Número ${formattedNumber}`,
      children: formattedNumber
    }
  );
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro("https://quini6.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Header;
  const { currentPath = "/" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", '<header class="sticky top-0 z-sticky border-b border-border bg-surface" role="banner" data-astro-cid-qlfjksao> <div class="container-page" data-astro-cid-qlfjksao> <div class="flex h-16 items-center justify-between md:h-20" data-astro-cid-qlfjksao> <!-- Logo --> <a href="/" class="flex items-center gap-2 text-xl font-bold text-text-primary transition-opacity hover:opacity-80" data-astro-cid-qlfjksao> ', ' <span data-astro-cid-qlfjksao>Quini 6 Estad\xEDsticas</span> </a> <!-- Navigation --> <nav class="hidden items-center gap-6 md:flex" role="navigation" aria-label="Navegaci\xF3n principal" data-astro-cid-qlfjksao> <a href="/"', "", ' data-astro-cid-qlfjksao>\nInicio\n</a> <a href="/sorteos"', "", ' data-astro-cid-qlfjksao>\nHistorial de sorteos\n</a> <a href="/buscar"', "", ' data-astro-cid-qlfjksao>\nBuscar combinaci\xF3n\n</a> </nav> <div class="flex items-center gap-2" data-astro-cid-qlfjksao> <!-- Theme Toggle --> <button id="theme-toggle" type="button" class="rounded-lg p-2 text-text-secondary transition-colors hover:bg-neutral-100 hover:text-text-primary" aria-label="Cambiar tema" aria-pressed="false" data-astro-cid-qlfjksao> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-qlfjksao> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" data-astro-cid-qlfjksao></path> </svg> </button> <!-- Mobile Menu Button --> <button id="mobile-menu-toggle" type="button" class="rounded-lg p-2 text-text-secondary transition-colors hover:bg-neutral-100 hover:text-text-primary md:hidden" aria-label="Abrir men\xFA" aria-expanded="false" aria-controls="mobile-menu" data-astro-cid-qlfjksao> <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-qlfjksao> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-qlfjksao></path> </svg> </button> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="hidden border-t border-border py-4 md:hidden" role="navigation" aria-label="Men\xFA m\xF3vil" data-astro-cid-qlfjksao> <nav class="flex flex-col gap-2" data-astro-cid-qlfjksao> <a href="/"', "", ' data-astro-cid-qlfjksao>\nInicio\n</a> <a href="/sorteos"', "", ' data-astro-cid-qlfjksao>\nHistorial de sorteos\n</a> <a href="/buscar"', "", ` data-astro-cid-qlfjksao>
Buscar combinaci\xF3n
</a> </nav> </div> </div> </header> <script>
  console.log('[Header] SCRIPT START - TOP OF SCRIPT');
  // Focus trap utility - inlined from focus-trap.ts (is:inline doesn't support imports)
  function getFocusableElements(container) {
    const selector = [
      'button:not([disabled]):not([tabindex="-1"])',
      '[href]:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([tabindex="-1"])',
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(selector));

    // Filter out elements that are not visually focusable
    // In production: check offsetParent !== null
    // In test environments (jsdom): offsetParent is always null, so check computed style
    const isTestEnv = document.body?.offsetParent === null;

    return elements.filter((el) => {
      if (isTestEnv) {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }
      return el.offsetParent !== null;
    });
  }

  function trapFocus(options) {
    const { container, onEscape, onClose } = options;
    let previouslyFocusedElement = null;
    let focusableElements = [];

    function updateFocusableElements() {
      focusableElements = getFocusableElements(container);
    }

    function handleKeydown(event) {
      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab cycling
      if (event.key !== 'Tab') return;

      updateFocusableElements();

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey) {
        // Shift+Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    function initialize() {
      // Store previously focused element
      previouslyFocusedElement = document.activeElement;

      // Get initial focusable elements
      updateFocusableElements();

      // Focus first focusable element
      const firstFocusable = focusableElements[0];
      firstFocusable?.focus();

      // Add event listeners
      document.addEventListener('keydown', handleKeydown);
    }

    function cleanup() {
      document.removeEventListener('keydown', handleKeydown);

      // Return focus to previously focused element
      previouslyFocusedElement?.focus();
      previouslyFocusedElement = null;
      focusableElements = [];

      onClose?.();
    }

    // Initialize immediately
    initialize();

    // Return cleanup function
    return cleanup;
  }

  function restoreFocus(element) {
    element?.focus();
  }

  console.log('[Header] Script loaded, adding DOMContentLoaded listener');
  console.log('[Header] Document readyState:', document.readyState);

  // Also log when script starts executing
  console.log('[Header] Script START executing');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Header] DOMContentLoaded fired');
      initMobileMenu();
    });
  } else {
    console.log('[Header] DOM already loaded, calling initMobileMenu directly');
    initMobileMenu();
  }

  function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggle = document.getElementById('theme-toggle');
    console.log('[Header] initMobileMenu called');
    console.log('[Header] menuToggle:', menuToggle);
    console.log('[Header] mobileMenu:', mobileMenu);

    let cleanupFocusTrap: (() => void) | null = null;

    if (themeToggle) {
      const updateThemeIcon = (isDark: boolean) => {
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

    if (menuToggle && mobileMenu) {
      console.log('[Header] Both menuToggle and mobileMenu found');
      const closeMenu = () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir men\xFA');
        if (cleanupFocusTrap) {
          cleanupFocusTrap();
          cleanupFocusTrap = null;
        }
      };

      const openMenu = () => {
        mobileMenu.classList.remove('hidden');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar men\xFA');

        // Activate focus trap
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
        console.log('[Header] Menu toggle clicked');
        console.log('[Header] mobileMenu:', mobileMenu);
        console.log('[Header] mobileMenu.classList:', mobileMenu.classList);
        console.log(
          '[Header] mobileMenu.classList.contains(hidden):',
          mobileMenu.classList.contains('hidden')
        );
        const isOpen = mobileMenu.classList.contains('hidden');
        if (isOpen) {
          console.log('[Header] Opening menu');
          openMenu();
        } else {
          console.log('[Header] Closing menu');
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
    }
  }
  initMobileMenu();
  // Expose for testing
  window.initMobileMenu = initMobileMenu;
  window.__headerScriptRan = true;
  console.log('[Header] initMobileMenu exposed on window');
  console.log('[Header] window.initMobileMenu:', window.initMobileMenu);
<\/script> `])), maybeRenderHead(), renderComponent($$result, "NumberBall", NumberBall, { "number": 6, "size": "lg", "variant": "primary", "class": "shrink-0", "data-astro-cid-qlfjksao": true }), addAttribute(`font-medium transition-colors ${currentPath === "/" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`, "class"), addAttribute(currentPath === "/" ? "page" : void 0, "aria-current"), addAttribute(`font-medium transition-colors ${currentPath.startsWith("/sorteos") ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`, "class"), addAttribute(currentPath.startsWith("/sorteos") ? "page" : void 0, "aria-current"), addAttribute(`font-medium transition-colors ${currentPath === "/buscar" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`, "class"), addAttribute(currentPath === "/buscar" ? "page" : void 0, "aria-current"), addAttribute(`rounded-lg px-4 py-2 font-medium transition-colors ${currentPath === "/" ? "dark:bg-primary-900/20 bg-primary-50 text-primary-700 dark:text-primary-300" : "text-text-secondary hover:bg-neutral-100 hover:text-text-primary"}`, "class"), addAttribute(currentPath === "/" ? "page" : void 0, "aria-current"), addAttribute(`rounded-lg px-4 py-2 font-medium transition-colors ${currentPath.startsWith("/sorteos") ? "dark:bg-primary-900/20 bg-primary-50 text-primary-700 dark:text-primary-300" : "text-text-secondary hover:bg-neutral-100 hover:text-text-primary"}`, "class"), addAttribute(currentPath.startsWith("/sorteos") ? "page" : void 0, "aria-current"), addAttribute(`rounded-lg px-4 py-2 font-medium transition-colors ${currentPath === "/buscar" ? "dark:bg-primary-900/20 bg-primary-50 text-primary-700 dark:text-primary-300" : "text-text-secondary hover:bg-neutral-100 hover:text-text-primary"}`, "class"), addAttribute(currentPath === "/buscar" ? "page" : void 0, "aria-current"));
}, "D:/Desarrollo/quini6_frontend/src/components/layout/Header.astro", void 0);

const $$Astro$1 = createAstro("https://quini6.com");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const { adminHref = "/admin", showAdmin = false } = Astro2.props;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-border bg-surface" role="contentinfo" data-astro-cid-35ed7um5> <div class="container-page py-12 md:py-16" data-astro-cid-35ed7um5> <div class="grid grid-cols-1 gap-8 md:grid-cols-4" data-astro-cid-35ed7um5> <!-- Brand --> <div class="md:col-span-2 lg:col-span-2" data-astro-cid-35ed7um5> <a href="/" class="mb-4 flex items-center gap-2 text-xl font-bold text-text-primary" aria-label="Quini 6 Estadísticas - Inicio" data-astro-cid-35ed7um5> <svg class="size-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-35ed7um5> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" data-astro-cid-35ed7um5></path> </svg> <span data-astro-cid-35ed7um5>Quini 6</span> </a> <p class="max-w-xs text-text-secondary" data-astro-cid-35ed7um5>
Estadísticas históricas oficiales del Quini 6. Consulte sorteos pasados, busque
          combinaciones y analice frecuencias de números.
</p> </div> <!-- Navigation Links --> <div data-astro-cid-35ed7um5> <h2 class="mb-4 font-semibold text-text-primary" data-astro-cid-35ed7um5>Navegación</h2> <nav aria-label="Enlaces de navegación del pie de página" data-astro-cid-35ed7um5> <ul class="space-y-2" data-astro-cid-35ed7um5> <li data-astro-cid-35ed7um5> <a href="/" class="text-text-secondary transition-colors hover:text-text-primary" data-astro-cid-35ed7um5>
Inicio
</a> </li> <li data-astro-cid-35ed7um5> <a href="/sorteos" class="text-text-secondary transition-colors hover:text-text-primary" data-astro-cid-35ed7um5>
Historial de sorteos
</a> </li> <li data-astro-cid-35ed7um5> <a href="/buscar" class="text-text-secondary transition-colors hover:text-text-primary" data-astro-cid-35ed7um5>
Buscar combinación
</a> </li> </ul> </nav> </div> <!-- Legal Links --> <div data-astro-cid-35ed7um5> <h2 class="mb-4 font-semibold text-text-primary" data-astro-cid-35ed7um5>Legal</h2> <nav aria-label="Enlaces legales" data-astro-cid-35ed7um5> <ul class="space-y-2" data-astro-cid-35ed7um5> <li data-astro-cid-35ed7um5> <a href="/privacidad" class="text-text-secondary transition-colors hover:text-text-primary" data-astro-cid-35ed7um5>
Política de Privacidad
</a> </li> <li data-astro-cid-35ed7um5> <a href="/terminos" class="text-text-secondary transition-colors hover:text-text-primary" data-astro-cid-35ed7um5>
Términos de Uso
</a> </li> <li data-astro-cid-35ed7um5> <a href="/cookies" class="text-text-secondary transition-colors hover:text-text-primary" data-astro-cid-35ed7um5>
Política de Cookies
</a> </li> </ul> </nav> </div> </div> <!-- Bottom Bar --> <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row" data-astro-cid-35ed7um5> <p class="text-center text-sm text-text-secondary md:text-left" data-astro-cid-35ed7um5>
© ${currentYear} Quini 6 Estadísticas. Datos oficiales de la Lotería de Santa Fe.
</p> <div class="flex items-center gap-6" data-astro-cid-35ed7um5> ${showAdmin && renderTemplate`<a${addAttribute(adminHref, "href")} class="text-xs text-text-muted transition-colors hover:text-text-primary" aria-label="Acceso administrador" data-astro-cid-35ed7um5>
Admin
</a>`} <a href="https://twitter.com/quini6stats" target="_blank" rel="noopener noreferrer" class="text-text-muted transition-colors hover:text-text-primary" aria-label="Twitter" data-astro-cid-35ed7um5> <svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-35ed7um5> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.308.88-8.502-9.24L6.02 20.23h-3.308l7.227-8.26-8.502-9.24 3.308-.88 8.502 9.24 1.71-2.14-1.71-.72z" data-astro-cid-35ed7um5></path> </svg> </a> <a href="https://github.com/quini6/stats" target="_blank" rel="noopener noreferrer" class="text-text-muted transition-colors hover:text-text-primary" aria-label="GitHub" data-astro-cid-35ed7um5> <svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-35ed7um5> <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" data-astro-cid-35ed7um5></path> </svg> </a> </div> </div> </div> </footer> `;
}, "D:/Desarrollo/quini6_frontend/src/components/layout/Footer.astro", void 0);

const $$Astro = createAstro("https://quini6.com");
const $$Container = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Container;
  const { maxWidth = "lg", class: customClass = "" } = Astro2.props;
  const maxWidthClasses = {
    sm: "max-w-3xl",
    // ~48rem / 768px
    md: "max-w-5xl",
    // ~64rem / 1024px
    lg: "max-w-[1152px]",
    // Custom 1152px
    xl: "max-w-7xl",
    // ~80rem / 1280px
    full: "max-w-full"
  };
  const containerClass = `mx-auto px-4 ${maxWidthClasses[maxWidth]} ${customClass}`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(containerClass, "class")} data-astro-cid-dm6k5sok> ${renderSlot($$result, $$slots["default"])} </div> `;
}, "D:/Desarrollo/quini6_frontend/src/components/layout/Container.astro", void 0);

export { $$Header as $, NumberBall as N, $$Container as a, $$Footer as b };
