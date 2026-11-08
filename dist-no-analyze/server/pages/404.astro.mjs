;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8a0f5054-3d4a-471c-8ed2-b574494b8273",e._sentryDebugIdIdentifier="sentry-dbid-8a0f5054-3d4a-471c-8ed2-b574494b8273")}catch(e){}}();import '../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_rXuDvxK8.mjs';
import { $ as $$Header, a as $$Container, b as $$Footer } from '../chunks/Container_CKIc8Y_Y.mjs';
import '../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { $ as $$Button } from '../chunks/Button_6r2fcfJH.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "P\xE1gina no encontrada", "description": "La p\xE1gina que busca no existe. Vuelva al inicio para consultar los sorteos del Quini 6.", "noIndex": true, "noFollow": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "currentPath": "/404" })} ${maybeRenderHead()}<main id="main-content" class="flex flex-1 items-center" role="main"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "md", "class": "py-16 text-center" }, { "default": ($$result3) => renderTemplate` <p class="font-sans text-6xl font-bold text-primary-600">404</p> <h1 class="mt-4 font-sans text-display-sm text-text-primary">Página no encontrada</h1> <p class="mt-2 text-text-secondary">
La página que busca no existe o fue movida. Puede volver al inicio y consultar el historial
        de sorteos.
</p> <div class="mt-8 flex justify-center"> ${renderComponent($$result3, "Button", $$Button, { "href": "/", "variant": "primary" }, { "default": ($$result4) => renderTemplate`Volver al inicio` })} </div> ` })} </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/404.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
