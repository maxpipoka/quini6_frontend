;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8ab32733-3461-4192-9345-6fa1e597c897",e._sentryDebugIdIdentifier="sentry-dbid-8ab32733-3461-4192-9345-6fa1e597c897")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, p as renderHead, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { F as FileDropzone } from '../../chunks/FileDropzone_C6mJ0TuS.mjs';
import { s as sampleProps } from '../../chunks/visual-test-data_CHBXxNEb.mjs';
/* empty css                                                  */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://quini6.com");
const $$FileDropzoneVisual = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FileDropzoneVisual;
  const { state = "default" } = Astro2.url.searchParams;
  const props = sampleProps.FileDropzone[state] ?? sampleProps.FileDropzone.default;
  return renderTemplate`<html lang="es" data-astro-cid-wo6acd56> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Visual Test: FileDropzone - ${state}</title>${renderHead()}</head> <body data-test-animate="false" class="min-h-screen bg-neutral-50 p-8 dark:bg-neutral-900" data-astro-cid-wo6acd56> <main data-astro-cid-wo6acd56> <h1 class="sr-only" data-astro-cid-wo6acd56>FileDropzone Component Test</h1> ${renderComponent($$result, "FileDropzone", FileDropzone, { ...props, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/ui/FileDropzone", "client:component-export": "default", "data-astro-cid-wo6acd56": true })} </main> </body></html>`;
}, "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/FileDropzone-visual.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/FileDropzone-visual.astro";
const $$url = "/test-fixtures/FileDropzone-visual";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$FileDropzoneVisual,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
