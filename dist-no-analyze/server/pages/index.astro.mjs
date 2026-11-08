;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="62c0f5e4-1757-4b01-a14f-28be753b3e03",e._sentryDebugIdIdentifier="sentry-dbid-62c0f5e4-1757-4b01-a14f-28be753b3e03")}catch(e){}}();import '../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_rXuDvxK8.mjs';
import { $ as $$Header, a as $$Container, N as NumberBall, b as $$Footer } from '../chunks/Container_CKIc8Y_Y.mjs';
import '../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { g as getApiClient } from '../chunks/client_DTLLHpdZ.mjs';
import { $ as $$Button } from '../chunks/Button_6r2fcfJH.mjs';
import { $ as $$Spinner } from '../chunks/Spinner_BaZPL3Gl.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const MOCK_DRAWS = Array.from({ length: 30 }, (_, index) => {
    const drawDate = new Date(Date.UTC(2024, 5, 1) - index * 7 * 24 * 60 * 60 * 1e3).toISOString();
    const MODALITIES = ["TRADICIONAL", "LA_SEGUNDA", "REVANCHA", "SIEMPRE_SALE"];
    return {
      id: `mock-${index}`,
      officialNumber: 3245 - index,
      drawDate,
      createdAt: drawDate,
      updatedAt: drawDate,
      results: MODALITIES.map((modality, modalityIndex) => ({
        modality,
        numbers: Array.from({ length: 6 }, (_2, k) => (index * 3 + modalityIndex * 7 + k * 5) % 46),
        createdAt: drawDate,
        updatedAt: drawDate
      }))
    };
  });
  function toSummary(draw) {
    return {
      id: draw.id,
      officialNumber: draw.officialNumber,
      drawDate: draw.drawDate,
      results: draw.results.map(({ modality, numbers }) => ({ modality, numbers }))
    };
  }
  let latestDraw = null;
  let latestDrawError = null;
  try {
    const apiClient = getApiClient();
    latestDraw = await apiClient.getLatestDraw();
  } catch (error) {
    console.warn("Could not fetch latest draw from API, using mock data:", error);
    latestDrawError = null;
    latestDraw = toSummary(MOCK_DRAWS[0]);
  }
  let recentDraws = null;
  let recentDrawsError = null;
  try {
    const apiClient = getApiClient();
    const response = await apiClient.getDrawHistory({ page: 1, limit: 5 });
    recentDraws = response.data;
  } catch (error) {
    console.warn("Could not fetch recent draws from API, using mock data:", error);
    recentDrawsError = null;
    recentDraws = MOCK_DRAWS.slice(1, 6).map(toSummary);
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const MODALITY_LABELS = {
    TRADICIONAL: "Tradicional",
    LA_SEGUNDA: "La Segunda",
    REVANCHA: "Revancha",
    SIEMPRE_SALE: "Siempre Sale"
  };
  const MODALITY_COLORS = {
    TRADICIONAL: "primary",
    LA_SEGUNDA: "secondary",
    REVANCHA: "success",
    SIEMPRE_SALE: "warning"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Inicio", "description": "Resultados y estad\xEDsticas del Quini 6 - Consulte el \xFAltimo sorteo, historial completo y busque sus n\xFAmeros favoritos." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "currentPath": "/" })} ${maybeRenderHead()}<main id="main-content" role="main"> <!-- Hero Section --> <section class="bg-gradient-to-b from-primary-50 to-transparent py-16 md:py-24 dark:from-[rgba(59,130,246,0.1)]"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "lg" }, { "default": async ($$result3) => renderTemplate` <div class="mx-auto max-w-3xl text-center"> <h1 class="mb-6 font-sans text-display-md text-text-primary">
Resultados y estadísticas del <span class="text-primary-600">Quini 6</span> </h1> <p class="mb-8 text-lg text-text-secondary">
Consulte sorteos históricos, busque sus combinaciones favoritas y analice la frecuencia
            de los números. Datos oficiales actualizados.
</p> <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"> ${renderComponent($$result3, "Button", $$Button, { "href": "/buscar", "size": "lg", "variant": "primary" }, { "default": async ($$result4) => renderTemplate` Buscar mi combinación ` })} ${renderComponent($$result3, "Button", $$Button, { "href": "/sorteos", "size": "lg", "variant": "ghost" }, { "default": async ($$result4) => renderTemplate` Ver historial completo ` })} </div> </div> ` })} </section> <!-- Featured Card: Último Sorteo --> <section class="py-12 md:py-16" aria-labelledby="latest-draw-heading"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "lg" }, { "default": async ($$result3) => renderTemplate` <div class="mb-8 flex items-center justify-between"> <h2 id="latest-draw-heading" class="font-sans text-heading-xl text-text-primary">
Último sorteo
</h2> <a href="/sorteos" class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700">
Ver todos →
</a> </div> ${latestDrawError ? renderTemplate`<div class="card-elevated p-8 text-center" role="alert"> <p class="mb-4 text-text-secondary">No pudimos cargar el último sorteo</p> ${renderComponent($$result3, "Button", $$Button, { "variant": "ghost", "href": "/", "aria-label": "Reintentar carga" }, { "default": async ($$result4) => renderTemplate`
Reintentar
` })} </div>` : latestDraw ? renderTemplate`<article class="card-elevated overflow-hidden"> <div class="dark:bg-primary-900/20 border-b border-border bg-primary-50 p-6 md:p-8"> <div class="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between"> <div> <p class="text-sm font-medium text-primary-700 dark:text-primary-300">
Sorteo Nº ${latestDraw.officialNumber} </p> <p class="text-base text-text-secondary">${formatDate(latestDraw.drawDate)}</p> </div> <div class="flex items-center gap-3"> <span class="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
OFICIAL
</span> </div> </div> </div> <div class="p-6 md:p-8"> <div class="grid grid-cols-2 gap-4 md:grid-cols-4"> ${latestDraw.results.map((result) => renderTemplate`<div${addAttribute(result.modality, "key")} class="flex flex-col items-center gap-3 text-center"> <span class="text-caption font-semibold uppercase tracking-wide text-text-secondary"> ${MODALITY_LABELS[result.modality] ?? result.modality} </span> <div class="flex gap-1.5" role="img"${addAttribute(`${MODALITY_LABELS[result.modality]}: ${result.numbers.map((n) => n.toString().padStart(2, "0")).join(", ")}`, "aria-label")}> ${result.numbers.map((num, idx) => renderTemplate`${renderComponent($$result3, "NumberBall", NumberBall, { "key": idx, "number": num, "size": "lg", "variant": MODALITY_COLORS[result.modality] ?? "primary" })}`)} </div> </div>`)} </div> </div> </article>` : renderTemplate`<div class="card-elevated p-12 text-center" role="status"> ${renderComponent($$result3, "Spinner", $$Spinner, { "size": "lg", "color": "primary", "aria-label": "Cargando \xFAltimo sorteo" })} <p class="mt-4 text-text-secondary">Cargando último sorteo...</p> </div>`}` })} </section> <!-- Recent Draws --> <section class="bg-surface py-12 md:py-16" aria-labelledby="recent-draws-heading"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "lg" }, { "default": async ($$result3) => renderTemplate` <div class="mb-8 flex items-center justify-between"> <h2 id="recent-draws-heading" class="font-sans text-heading-xl text-text-primary">
Sorteos recientes
</h2> <a href="/sorteos" class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700">
Ver todos →
</a> </div> ${recentDrawsError ? renderTemplate`<div class="card-elevated p-8 text-center" role="alert"> <p class="mb-4 text-text-secondary">No pudimos cargar los sorteos recientes</p> ${renderComponent($$result3, "Button", $$Button, { "variant": "ghost", "href": "/", "aria-label": "Reintentar carga" }, { "default": async ($$result4) => renderTemplate`
Reintentar
` })} </div>` : recentDraws ? renderTemplate`<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> ${recentDraws.map((draw) => renderTemplate`<a${addAttribute(draw.id, "key")}${addAttribute(`/sorteos/${draw.officialNumber}`, "href")} class="card-elevated block p-6 transition-shadow hover:shadow-lg"> <div class="mb-4 flex items-center justify-between"> <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
Sorteo Nº ${draw.officialNumber} </span> <time class="text-caption text-text-secondary"${addAttribute(draw.drawDate, "dateTime")}> ${formatShortDate(draw.drawDate)} </time> </div> <div class="grid grid-cols-2 gap-3 md:grid-cols-4"> ${draw.results.map((result) => renderTemplate`<div${addAttribute(result.modality, "key")} class="flex flex-col items-center gap-1.5 text-center"> <span class="text-[10px] font-medium uppercase tracking-wide text-text-secondary"> ${MODALITY_LABELS[result.modality] ?? result.modality} </span> <div class="flex gap-0.5" role="img"${addAttribute(`${MODALITY_LABELS[result.modality]}: ${result.numbers.map((n) => n.toString().padStart(2, "0")).join(", ")}`, "aria-label")}> ${result.numbers.map((num, idx) => renderTemplate`${renderComponent($$result3, "NumberBall", NumberBall, { "key": idx, "number": num, "size": "sm", "variant": MODALITY_COLORS[result.modality] ?? "primary" })}`)} </div> </div>`)} </div> </a>`)} </div>` : renderTemplate`<div class="card-elevated p-12 text-center" role="status"> ${renderComponent($$result3, "Spinner", $$Spinner, { "size": "lg", "color": "primary", "aria-label": "Cargando sorteos recientes" })} <p class="mt-4 text-text-secondary">Cargando sorteos recientes...</p> </div>`}` })} </section> <!-- CTA Section --> <section class="bg-primary-600 py-16 md:py-24" aria-labelledby="cta-heading"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "lg" }, { "default": async ($$result3) => renderTemplate` <div class="text-center text-white"> <h2 id="cta-heading" class="mb-4 font-sans text-display-sm text-white">
¿Quiere buscar una combinación específica?
</h2> <p class="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
Ingrese sus 6 números y le mostraremos en qué sorteos han salido juntos, con todas las
            modalidades y fechas.
</p> ${renderComponent($$result3, "Button", $$Button, { "href": "/buscar", "size": "lg", "variant": "secondary" }, { "default": async ($$result4) => renderTemplate` Buscar combinación ` })} </div> ` })} </section> <!-- Ad Slot (Collapsible) --> <section class="py-8" aria-labelledby="ad-heading" role="complementary"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "lg" }, { "default": async ($$result3) => renderTemplate` <div id="ad-slot-top" class="flex aspect-video items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800" role="region" aria-label="Espacio publicitario"> <div class="p-4 text-center"> <p class="text-text-secondary">Espacio publicitario (728×90)</p> <p class="mt-1 text-caption text-text-secondary">Se colapsa si no hay anuncio</p> </div> </div> ` })} </section> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/index.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
