;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="15fa1524-e576-49fc-8875-a965e988ae1d",e._sentryDebugIdIdentifier="sentry-dbid-15fa1524-e576-49fc-8875-a965e988ae1d")}catch(e){}}();import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, r as renderTemplate } from './astro/server_BCpdA0Tk.mjs';
/* empty css                         */
import 'clsx';

const $$Astro = createAstro("https://quini6.com");
const $$Spinner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Spinner;
  const {
    size = "md",
    display = "inline",
    color = "primary",
    "aria-label": ariaLabel = "Cargando",
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = Astro2.props;
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  const colorClasses = {
    primary: "border-primary-600 border-t-transparent",
    secondary: "border-secondary-600 border-t-transparent",
    accent: "border-accent-600 border-t-transparent",
    white: "border-white border-t-transparent"
  };
  const displayClasses = {
    inline: "inline-block",
    block: "block mx-auto"
  };
  const combinedClasses = `${displayClasses[display]} ${sizeClasses[size]} ${colorClasses[color]}`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(combinedClasses, "class")} role="status"${addAttribute(ariaLabel, "aria-label")}${addAttribute(ariaDescribedBy, "aria-describedby")} aria-busy="true"${spreadAttributes(rest)} data-astro-cid-mmgdppss> <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-mmgdppss> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-astro-cid-mmgdppss></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-astro-cid-mmgdppss></path> </svg> <span class="visually-hidden" data-astro-cid-mmgdppss>${ariaLabel}</span> </div> `;
}, "D:/Desarrollo/quini6_frontend/src/components/ui/Spinner.astro", void 0);

export { $$Spinner as $ };
