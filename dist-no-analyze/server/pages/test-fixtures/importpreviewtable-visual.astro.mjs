;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f25b7ab2-4487-49d2-931e-6ed58c903e45",e._sentryDebugIdIdentifier="sentry-dbid-f25b7ab2-4487-49d2-931e-6ed58c903e45")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, p as renderHead, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { I as ImportPreviewTable } from '../../chunks/ImportPreviewTable_DtNO8Z25.mjs';
import { s as sampleProps } from '../../chunks/visual-test-data_CHBXxNEb.mjs';
/* empty css                                                        */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://quini6.com");
const $$ImportPreviewTableVisual = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ImportPreviewTableVisual;
  const { state = "default" } = Astro2.url.searchParams;
  const props = sampleProps.ImportPreviewTable[state] ?? sampleProps.ImportPreviewTable.default;
  return renderTemplate`<html lang="es" data-astro-cid-u26jlplt> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Visual Test: ImportPreviewTable - ${state}</title>${renderHead()}</head> <body data-test-animate="false" class="min-h-screen bg-neutral-50 p-8 dark:bg-neutral-900" data-astro-cid-u26jlplt> <main data-astro-cid-u26jlplt> <h1 class="sr-only" data-astro-cid-u26jlplt>ImportPreviewTable Component Test</h1> ${renderComponent($$result, "ImportPreviewTable", ImportPreviewTable, { ...props, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/admin/ImportPreviewTable", "client:component-export": "default", "data-astro-cid-u26jlplt": true })} </main> </body></html>`;
}, "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/ImportPreviewTable-visual.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/ImportPreviewTable-visual.astro";
const $$url = "/test-fixtures/ImportPreviewTable-visual";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImportPreviewTableVisual,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
