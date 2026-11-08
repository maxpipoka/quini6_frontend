;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3b67fd71-947f-4488-a650-c537cd3db53a",e._sentryDebugIdIdentifier="sentry-dbid-3b67fd71-947f-4488-a650-c537cd3db53a")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, p as renderHead, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { I as ImportProgress } from '../../chunks/ImportProgress_CkcV7dH-.mjs';
import { s as sampleProps } from '../../chunks/visual-test-data_CHBXxNEb.mjs';
/* empty css                                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://quini6.com");
const $$ImportProgressVisual = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ImportProgressVisual;
  const { state = "default" } = Astro2.url.searchParams;
  const props = sampleProps.ImportProgress[state] ?? sampleProps.ImportProgress.default;
  return renderTemplate`<html lang="es" data-astro-cid-rdsv3uva> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Visual Test: ImportProgress - ${state}</title>${renderHead()}</head> <body data-test-animate="false" class="min-h-screen bg-neutral-50 p-8 dark:bg-neutral-900" data-astro-cid-rdsv3uva> <main data-astro-cid-rdsv3uva> <h1 class="sr-only" data-astro-cid-rdsv3uva>ImportProgress Component Test</h1> ${renderComponent($$result, "ImportProgress", ImportProgress, { ...props, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/admin/ImportProgress", "client:component-export": "default", "data-astro-cid-rdsv3uva": true })} </main> </body></html>`;
}, "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/ImportProgress-visual.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/ImportProgress-visual.astro";
const $$url = "/test-fixtures/ImportProgress-visual";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImportProgressVisual,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
