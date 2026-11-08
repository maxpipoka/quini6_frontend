;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="781cef71-56a6-42e9-8c3c-121b2705cb3b",e._sentryDebugIdIdentifier="sentry-dbid-781cef71-56a6-42e9-8c3c-121b2705cb3b")}catch(e){}}();import { e as createAstro, f as createComponent, h as addAttribute, l as renderScript, r as renderTemplate, n as renderSlot, p as renderHead, k as renderComponent, u as unescapeHTML } from './astro/server_BCpdA0Tk.mjs';
import 'piccolore';
/* empty css                                   */
import 'clsx';

const $$Astro$1 = createAstro("https://quini6.com");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "D:/Desarrollo/quini6_frontend/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Desarrollo/quini6_frontend/node_modules/astro/components/ClientRouter.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://quini6.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Estadísticas históricas del Quini 6 - Consulte sorteos, busque combinaciones y analice frecuencias.",
    canonical,
    ogImage,
    ogType = "website",
    noIndex = false,
    noFollow = false
  } = Astro2.props;
  const siteUrl = "https://quini6.com";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : Astro2.url.href;
  const ogImageUrl = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/og-default.jpg`;
  const pageTitle = title.includes("Quini 6") ? title : `${title} | Quini 6 Estadísticas`;
  return renderTemplate(_a || (_a = __template(['<html lang="es-AR" data-theme="light"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', "><!-- Primary SEO --><title>", '</title><meta name="description"', '><link rel="canonical"', '><!-- Robots --><meta name="robots"', '><!-- Open Graph --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:site_name" content="Quini 6 Estadísticas"><meta property="og:locale" content="es_AR"><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', `><!-- Favicon & Manifest --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="alternate icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#1e3a5f" media="(prefers-color-scheme: dark)"><!-- Fonts: Inter (self-hosted for performance) --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'"><!-- Lucide Icons (inline SVG via CDN for now, can be bundled later) --><script src="https://unpkg.com/lucide@latest" defer data-lucide="auto"></script><!-- Theme initialization script (prevents flash) --><script>
      (function () {
        try {
          var theme = localStorage.getItem('theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var isDark = theme === 'dark' || (!theme && prefersDark);
          document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } catch (e) {
          // Ignore localStorage errors (e.g., private browsing)
        }
      })();
    </script><!-- JSON-LD Structured Data for Organization --><script type="application/ld+json">`, '</script><!-- JSON-LD Structured Data for WebSite with SearchAction --><script type="application/ld+json">', "</script><!-- ClientRouter for SPA-like navigation (must be in head) -->", "", '</head> <body class="flex min-h-screen flex-col"> <!-- Skip Link for Accessibility --> <a href="#main-content" class="skip-link"> Saltar al contenido principal </a> ', " <!-- Navigation Focus Move (sessionStorage-gated: first load untouched) --> <!-- Set hasNavigated flag on initial page load so first navigation moves focus --> <script>\n      sessionStorage.setItem('hasNavigated', 'true');\n    </script> <script>\n      document.addEventListener('astro:after-swap', () => {\n        // Move focus to main heading on every ClientRouter navigation\n        const mainHeading = document.querySelector('main h1, #main-content h1, h1');\n\n        if (mainHeading instanceof HTMLElement) {\n          mainHeading.setAttribute('tabindex', '-1');\n          mainHeading.focus({ preventScroll: true });\n        }\n      });\n    </script> </body> </html>"])), addAttribute(Astro2.generator, "content"), pageTitle, addAttribute(description, "content"), addAttribute(canonicalUrl, "href"), addAttribute(`${noIndex ? "noindex" : "index"}, ${noFollow ? "nofollow" : "follow"}`, "content"), addAttribute(ogType, "content"), addAttribute(canonicalUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(description, "content"), addAttribute(ogImageUrl, "content"), addAttribute(canonicalUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(description, "content"), addAttribute(ogImageUrl, "content"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Quini 6 Estadísticas",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: ["https://twitter.com/quini6stats", "https://github.com/quini6/stats"]
  })), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Quini 6 Estadísticas",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        urlTemplate: `${siteUrl}/buscar?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  })), renderComponent($$result, "ClientRouter", $$ClientRouter, {}), renderHead(), renderSlot($$result, $$slots["default"]));
}, "D:/Desarrollo/quini6_frontend/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
