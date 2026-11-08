;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1b631c08-6963-46a2-a731-06ebe5acae49",e._sentryDebugIdIdentifier="sentry-dbid-1b631c08-6963-46a2-a731-06ebe5acae49")}catch(e){}}();import './page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, l as renderScript, n as renderSlot, m as maybeRenderHead } from './astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout$1 } from './Layout_rXuDvxK8.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, Activity, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import './_sentry-release-injection-file_BwnRfS4D.mjs';
/* empty css                          */

const NAV_ITEMS = [
  { href: "/admin/draws", label: "Sorteos", icon: LayoutDashboard },
  { href: "/admin/change-password", label: "Cambiar contraseña", icon: Settings }
];
const AUTH_NAV_ITEMS = [{ href: "/admin/health", label: "Salud del sistema", icon: Activity }];
function Sidebar({ isCollapsed = false, onToggle }) {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [currentPath, setCurrentPath] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const STORAGE_KEY = "sidebar-collapsed";
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
    setCurrentPath(window.location.pathname);
    setIsAuthenticated(!!window.__AUTH_USER__);
  }, []);
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!window.__AUTH_USER__);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);
  const toggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem(STORAGE_KEY, String(newCollapsed));
    onToggle?.();
  };
  const handleLogout = () => {
    fetch("/api/admin/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-Token": getCsrfToken() ?? ""
      }
    }).then((response) => {
      if (response.ok) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/admin/login";
      }
    }).catch(() => {
      window.location.href = "/admin/login";
    });
  };
  function getCsrfToken() {
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
  const navItems = [...NAV_ITEMS, ...isAuthenticated ? AUTH_NAV_ITEMS : []];
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `fixed inset-y-0 left-0 z-40 border-r border-border bg-surface transition-all duration-300 ${collapsed ? "w-16" : ""}`,
      style: { width: collapsed ? "var(--sidebar-w-16-width)" : "var(--sidebar-width)" },
      "aria-label": "Navegación principal",
      children: [
        /* @__PURE__ */ jsx(
          "nav",
          {
            className: "flex-1 space-y-1 overflow-y-auto p-4",
            style: { minWidth: "var(--sidebar-w-16-width)" },
            children: /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: navItems.map(({ href, label, icon: Icon }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              "a",
              {
                href,
                className: `flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary ${currentPath === href ? "bg-primary-500/10 text-primary-500" : ""}`,
                title: collapsed ? label : void 0,
                children: [
                  /* @__PURE__ */ jsx(Icon, { className: "size-5 flex-shrink-0", "aria-hidden": "true" }),
                  !collapsed && /* @__PURE__ */ jsx("span", { className: "font-medium", children: label })
                ]
              }
            ) }, href)) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-border p-4", children: [
          !collapsed && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleLogout,
              className: "bg-error-500/10 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:text-error-500",
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: "size-5 flex-shrink-0", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Cerrar sesión" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggle,
              className: `flex w-full items-center justify-center rounded-lg px-3 py-2 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary ${collapsed ? "ml-auto" : ""}`,
              "aria-label": collapsed ? "Expandir menú" : "Colapsar menú",
              "aria-expanded": !collapsed,
              children: collapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "size-5", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5", "aria-hidden": "true" })
            }
          )
        ] })
      ]
    }
  );
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _b;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const plausibleDomain = "";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout$1, { "title": "Admin - Quini 6", "data-astro-cid-myziea7w": true }, { "default": ($$result2) => renderTemplate(_b || (_b = __template(["   ", " <script>\n    import { initSentry, initWebVitals } from '@lib/sentry';\n    // Initialize Sentry (production only, handled by @sentry/astro integration)\n    // This ensures client-side configuration\n    if (import.meta.env.PROD) {\n      initSentry();\n      initWebVitals();\n    }\n  </script> ", '<div class="min-h-screen bg-neutral-50 dark:bg-neutral-900" data-astro-cid-myziea7w> ', ' <main class="flex-1 p-6 lg:p-8" data-astro-cid-myziea7w> <header class="mb-6" data-astro-cid-myziea7w> <h1 class="font-sans text-xl font-semibold text-text-primary" data-astro-cid-myziea7w>Administración</h1> <div class="flex items-center gap-4" data-astro-cid-myziea7w> <span class="hidden text-sm text-text-secondary sm:block" id="user-email" data-astro-cid-myziea7w></span> </div> </header> <div class="" data-astro-cid-myziea7w> ', " </div> </main> </div> ", " "])), plausibleDomain, maybeRenderHead(), renderComponent($$result2, "Sidebar", Sidebar, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/Desarrollo/quini6_frontend/src/components/admin/Sidebar.tsx", "client:component-export": "Sidebar", "data-astro-cid-myziea7w": true }), renderSlot($$result2, $$slots["default"]), renderScript($$result2, "D:/Desarrollo/quini6_frontend/src/pages/admin/layout.astro?astro&type=script&index=0&lang.ts")) })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/layout.astro", void 0);
const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/layout.astro";
const $$url = "/admin/layout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Layout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Layout as $, _page as _ };
