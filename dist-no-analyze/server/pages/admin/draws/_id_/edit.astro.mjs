;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e867db71-1574-4dd6-90b1-138e0c715a5b",e._sentryDebugIdIdentifier="sentry-dbid-e867db71-1574-4dd6-90b1-138e0c715a5b")}catch(e){}}();import '../../../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from '../../../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../../chunks/layout_D3ahR9qN.mjs';
import { D as DrawFormWizard } from '../../../../chunks/DrawFormWizard_BBAdbao3.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://quini6.com");
function getStaticPaths() {
  return [];
}
const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const drawId = Astro2.params.id;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$Layout, { "title": "Editar Sorteo - Admin Quini 6" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-4xl"> <div class="mb-6"> <h1 class="font-sans text-2xl font-bold text-text-primary">Editar Sorteo</h1> <p class="mt-1 text-text-secondary">Modifique los datos del sorteo y sus modalidades</p> </div> <div class="rounded-xl border border-border bg-surface-elevated p-6"> ${renderComponent($$result2, "DrawFormWizard", DrawFormWizard, { "client:load": true, "isEditing": true, "drawId": drawId, "onSubmit": (async (data) => {
    const response = await fetch(`/api/admin/draws/${drawId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": window.getCsrfToken?.() ?? ""
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      let message = "Error al actualizar sorteo";
      try {
        const errorData = await response.json();
        const isValidError = errorData !== null && typeof errorData === "object" && "message" in errorData && typeof errorData.message === "string";
        if (isValidError) {
          message = String(errorData.message);
        }
      } catch {
      }
      throw new Error(message);
    }
    window.location.href = "/admin/draws";
  }), "onCancel": (() => {
    window.location.href = "/admin/draws";
  }), "client:component-hydration": "load", "client:component-path": "@components/admin/DrawFormWizard.tsx", "client:component-export": "DrawFormWizard" })} </div> </div> ${renderScript($$result2, "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/[id]/edit.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/[id]/edit.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/[id]/edit.astro";
const $$url = "/admin/draws/[id]/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
