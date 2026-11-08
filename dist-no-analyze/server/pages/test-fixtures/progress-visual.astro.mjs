;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c43a41ec-66d6-4a61-bbd3-4daa97f8be95",e._sentryDebugIdIdentifier="sentry-dbid-c43a41ec-66d6-4a61-bbd3-4daa97f8be95")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, p as renderHead, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { P as Progress } from '../../chunks/Progress_D9U1KJsY.mjs';
import { s as sampleProps } from '../../chunks/visual-test-data_CHBXxNEb.mjs';
/* empty css                                              */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://quini6.com");
const $$ProgressVisual = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProgressVisual;
  const { state = "default" } = Astro2.url.searchParams;
  const props = sampleProps.Progress[state] ?? sampleProps.Progress.default;
  return renderTemplate`<html lang="es" data-astro-cid-kz5qpuur> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Visual Test: Progress - ${state}</title>${renderHead()}</head> <body data-test-animate="false" class="min-h-screen bg-neutral-50 p-8 dark:bg-neutral-900" data-astro-cid-kz5qpuur> <main data-astro-cid-kz5qpuur> <h1 class="sr-only" data-astro-cid-kz5qpuur>Progress Component Test</h1> ${renderComponent($$result, "Progress", Progress, { ...props, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/ui/Progress", "client:component-export": "default", "data-astro-cid-kz5qpuur": true })} </main> </body></html>`;
}, "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/Progress-visual.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/Progress-visual.astro";
const $$url = "/test-fixtures/Progress-visual";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ProgressVisual,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
