;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9b5d7532-fbb0-4015-907f-afc20e51d152",e._sentryDebugIdIdentifier="sentry-dbid-9b5d7532-fbb0-4015-907f-afc20e51d152")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, l as renderScript } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_rXuDvxK8.mjs';
export { renderers } from '../../renderers.mjs';

const $$ChangePassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cambiar Contrase\xF1a - Admin Quini 6" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface px-4 py-12"> <div class="mx-auto max-w-md"> <div class="rounded-xl border border-border bg-surface-elevated p-8"> <h1 class="mb-2 text-center font-sans text-2xl font-bold text-text-primary">
Cambiar Contraseña
</h1> <p class="mb-8 text-center text-text-secondary">Actualiza tu contraseña de administrador</p> <form id="change-password-form" class="space-y-6" novalidate> <div> <label htmlFor="currentPassword" class="mb-2 block text-sm font-medium text-text-primary">Contraseña actual</label> <input type="password" id="currentPassword" name="currentPassword" required autoComplete="current-password" class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"> </div> <div> <label htmlFor="newPassword" class="mb-2 block text-sm font-medium text-text-primary">Nueva contraseña</label> <input type="password" id="newPassword" name="newPassword" required autoComplete="new-password"${addAttribute(8, "minLength")} class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"> <p class="mt-1 text-xs text-text-muted">Mínimo 8 caracteres</p> </div> <div> <label htmlFor="confirmPassword" class="mb-2 block text-sm font-medium text-text-primary">Confirmar nueva contraseña</label> <input type="password" id="confirmPassword" name="confirmPassword" required autoComplete="new-password" class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"> </div> <button type="submit" class="hover:bg-primary-500/90 w-full rounded-lg bg-primary-500 py-3 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50" id="submit-btn">
Actualizar contraseña
</button> </form> <p id="error-message" class="mt-4 hidden text-center text-sm text-error-500" role="alert"></p> <p id="success-message" class="mt-4 hidden text-center text-sm text-success-500" role="status"></p> </div> </div> </div> ${renderScript($$result2, "D:/Desarrollo/quini6_frontend/src/pages/admin/change-password.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/change-password.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/change-password.astro";
const $$url = "/admin/change-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChangePassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
