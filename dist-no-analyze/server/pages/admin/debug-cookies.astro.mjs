;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="008739ea-dbd7-4978-b3e3-b78308e1e73c",e._sentryDebugIdIdentifier="sentry-dbid-008739ea-dbd7-4978-b3e3-b78308e1e73c")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_rXuDvxK8.mjs';
export { renderers } from '../../renderers.mjs';

const $$DebugCookies = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Debug Cookies - Quini 6" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex min-h-screen items-center justify-center bg-surface px-4 py-12"> <div class="w-full max-w-2xl"> <div class="rounded-xl border border-border bg-surface-elevated p-8"> <h1 class="mb-6 text-center font-sans text-2xl font-bold text-text-primary">
Debug Cookies
</h1> <div id="output" class="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-black/20 p-4 font-mono text-sm text-text-primary">
Loading...
</div> <div class="mt-6 space-y-3"> <button id="check-draws" class="hover:bg-primary-500/90 w-full rounded-lg bg-primary-500 py-3 font-medium text-white transition-colors focus:ring-primary-500">
Check /api/admin/draws
</button> <button id="check-middleware" class="hover:bg-secondary-500/90 w-full rounded-lg bg-secondary-500 py-3 font-medium text-white transition-colors focus:ring-secondary-500">
Check Middleware (via /admin/draws)
</button> </div> </div> </div> </div> ${renderScript($$result2, "D:/Desarrollo/quini6_frontend/src/pages/admin/debug-cookies.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/debug-cookies.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/debug-cookies.astro";
const $$url = "/admin/debug-cookies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DebugCookies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
