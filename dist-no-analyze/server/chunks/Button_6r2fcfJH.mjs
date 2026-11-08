;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e773a93f-63b7-4588-83fc-af85b0cf462b",e._sentryDebugIdIdentifier="sentry-dbid-e773a93f-63b7-4588-83fc-af85b0cf462b")}catch(e){}}();import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, r as renderTemplate, n as renderSlot } from './astro/server_BCpdA0Tk.mjs';
/* empty css                         */
import 'clsx';

const $$Astro = createAstro("https://quini6.com");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    type = "button",
    href,
    onClick,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = Astro2.props;
  const isLink = !!href;
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-800",
    secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-200 dark:focus:ring-secondary-800",
    ghost: "bg-transparent text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 focus:ring-primary-200 dark:focus:ring-primary-800"
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5"
  };
  const baseClasses = `
  inline-flex items-center justify-center font-medium
  rounded-lg transition-all duration-150 ease-in-out
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  ${isLink ? "text-center" : ""}
`;
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  return renderTemplate`${isLink ? renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(combinedClasses, "class")}${addAttribute(ariaLabel, "aria-label")}${addAttribute(ariaDescribedBy, "aria-describedby")}${addAttribute(disabled, "aria-disabled")}${spreadAttributes(rest)} data-astro-cid-6ygtcg62>${loading ? renderTemplate`<span class="inline-flex items-center gap-2" data-astro-cid-6ygtcg62><svg class="size-4 animate-spin sm:size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-6ygtcg62><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-astro-cid-6ygtcg62></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-astro-cid-6ygtcg62></path></svg><span data-astro-cid-6ygtcg62>Cargando...</span></span>` : renderTemplate`${renderSlot($$result, $$slots["default"], renderTemplate`Botón`)}`}</a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(combinedClasses, "class")}${addAttribute(disabled || loading, "disabled")}${addAttribute(ariaLabel, "aria-label")}${addAttribute(ariaDescribedBy, "aria-describedby")}${addAttribute(loading, "aria-busy")}${addAttribute(onClick, "onClick")}${spreadAttributes(rest)} data-astro-cid-6ygtcg62>${loading ? renderTemplate`<span class="inline-flex items-center gap-2" data-astro-cid-6ygtcg62><svg class="size-4 animate-spin sm:size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-6ygtcg62><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-astro-cid-6ygtcg62></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-astro-cid-6ygtcg62></path></svg><span data-astro-cid-6ygtcg62>Cargando...</span></span>` : renderTemplate`${renderSlot($$result, $$slots["default"], renderTemplate`Botón`)}`}</button>`}`;
}, "D:/Desarrollo/quini6_frontend/src/components/ui/Button.astro", void 0);

export { $$Button as $ };
