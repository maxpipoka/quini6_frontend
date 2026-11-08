;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="eb815c71-cab1-4e65-aede-08f0f6834d59",e._sentryDebugIdIdentifier="sentry-dbid-eb815c71-cab1-4e65-aede-08f0f6834d59")}catch(e){}}();import '../../../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from '../../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/layout_D3ahR9qN.mjs';
import { D as DrawFormWizard } from '../../../chunks/DrawFormWizard_BBAdbao3.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Create = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$Layout, { "title": "Crear Sorteo - Admin Quini 6" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-4xl"> <div class="mb-6"> <h1 class="font-sans text-2xl font-bold text-text-primary">Crear Nuevo Sorteo</h1> <p class="mt-1 text-text-secondary">
Complete los 4 pasos para crear un sorteo con todas sus modalidades
</p> </div> <div class="rounded-xl border border-border bg-surface-elevated p-6"> ${renderComponent($$result2, "DrawFormWizard", DrawFormWizard, { "client:visible": true, "isEditing": false, "onSubmit": (async (data) => {
    const response = await fetch("/api/admin/draws", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        "X-CSRF-Token": window.getCsrfToken?.() ?? ""
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json();
      const isValidError = errorData !== null && typeof errorData === "object" && "message" in errorData && // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      typeof errorData.message === "string";
      let message = "Error al crear sorteo";
      if (isValidError) {
        message = String(errorData.message);
      }
      throw new Error(message);
    }
    window.location.href = "/admin/draws";
  }), "onCancel": (() => {
    window.location.href = "/admin/draws";
  }), "client:component-hydration": "visible", "client:component-path": "@components/admin/DrawFormWizard.tsx", "client:component-export": "DrawFormWizard" })} </div> </div> ${renderScript($$result2, "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/create.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/create.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/create.astro";
const $$url = "/admin/draws/create";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Create,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
