;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="38e2ea67-044f-48cc-a1d2-48abc73a6ece",e._sentryDebugIdIdentifier="sentry-dbid-38e2ea67-044f-48cc-a1d2-48abc73a6ece")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/layout_D3ahR9qN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Login - Quini 6" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex min-h-screen items-center justify-center bg-surface px-4 py-12"> <div class="w-full max-w-md"> <div class="rounded-xl border border-border bg-surface-elevated p-8"> <h1 class="mb-2 text-center font-sans text-2xl font-bold text-text-primary">
Panel de Administración
</h1> <p class="mb-8 text-center text-text-secondary">Inicia sesión para gestionar sorteos</p> <form id="login-form" class="space-y-6" novalidate> <div> <label htmlFor="email" class="mb-2 block text-sm font-medium text-text-primary">Email</label> <input type="email" id="email" name="email" required autoComplete="email" class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="admin@quini6.com"> </div> <div> <label htmlFor="password" class="mb-2 block text-sm font-medium text-text-primary">Contraseña</label> <input type="password" id="password" name="password" required autoComplete="current-password" class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="⬢⬢⬢⬢⬢⬢⬢⬢"> </div> <button type="submit" class="hover:bg-primary-500/90 w-full rounded-lg bg-primary-500 py-3 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50" id="submit-btn">
Iniciar sesión
</button> </form> <p id="error-message" class="mt-4 hidden text-center text-sm text-error-500" role="alert"></p> </div> </div> </div> ${renderScript($$result2, "D:/Desarrollo/quini6_frontend/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/login.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
