;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9a253806-217a-47b4-af12-2038d4d95a9c",e._sentryDebugIdIdentifier="sentry-dbid-9a253806-217a-47b4-af12-2038d4d95a9c")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_rXuDvxK8.mjs';
import { b as $$Footer, a as $$Container, N as NumberBall, $ as $$Header } from '../../chunks/Container_CKIc8Y_Y.mjs';
import '../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { g as getApiClient } from '../../chunks/client_DTLLHpdZ.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://quini6.com");
async function getStaticPaths() {
  const MODALITIES = ["TRADICIONAL", "LA_SEGUNDA", "REVANCHA", "SIEMPRE_SALE"];
  const EXACT_MATCH = [5, 12, 23, 34, 41, 45];
  const BASE_DATE = Date.UTC(2024, 5, 1, 20, 0, 0);
  const WEEK_MS = 7 * 24 * 60 * 60 * 1e3;
  function buildNumbers(seed, modalityIndex) {
    return Array.from({ length: 6 }, (_, k) => (seed * 3 + modalityIndex * 7 + k * 5) % 46);
  }
  const MOCK_DRAWS = Array.from({ length: 30 }, (_, index) => {
    const drawDate = new Date(BASE_DATE - index * WEEK_MS).toISOString();
    return {
      id: `mock-${index}`,
      officialNumber: 3245 - index,
      drawDate,
      createdAt: drawDate,
      updatedAt: drawDate,
      results: MODALITIES.map((modality, modalityIndex) => ({
        modality,
        numbers: index === 0 && modalityIndex === 0 ? EXACT_MATCH : buildNumbers(index + 1, modalityIndex),
        createdAt: drawDate,
        updatedAt: drawDate
      }))
    };
  });
  let allDraws = MOCK_DRAWS;
  {
    try {
      const apiClient = getApiClient();
      const firstBatch = await apiClient.getDrawHistory({ page: 1, limit: 1 });
      const totalDraws = firstBatch.total;
      const BATCH_SIZE = 100;
      const totalPages = Math.ceil(totalDraws / BATCH_SIZE);
      for (let page = 1; page <= totalPages; page++) {
        const response = await apiClient.getDrawHistory({ page, limit: BATCH_SIZE });
        allDraws = [...allDraws, ...response.data];
        if (page % 5 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    } catch (error) {
      console.warn("Could not fetch draws from API, using mock data:", error);
      allDraws = MOCK_DRAWS;
    }
  }
  allDraws.sort((a, b) => a.officialNumber - b.officialNumber);
  return allDraws.map((draw, index) => {
    const prevDraw = index > 0 ? allDraws[index - 1] : null;
    const nextDraw = index < allDraws.length - 1 ? allDraws[index + 1] : null;
    return {
      params: { officialNumber: draw.officialNumber.toString() },
      props: { draw, prevDraw, nextDraw }
    };
  });
}
const fallback = "blocking";
const headers = {
  "Cache-Control": "public, max-age=0, stale-while-revalidate=60"
};
const $$officialNumber = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$officialNumber;
  const { draw, prevDraw, nextDraw } = Astro2.props;
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
  const pageTitle = `Sorteo Nº ${draw.officialNumber} - ${formatShortDate(draw.drawDate)}`;
  const pageDescription = `Resultados completos del sorteo Nº ${draw.officialNumber} del Quini 6 (${formatDate(draw.drawDate)}). Cuatro modalidades: Tradicional, La Segunda, Revancha y Siempre Sale.`;
  const canonicalUrl = `/sorteos/${draw.officialNumber}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "canonical": canonicalUrl, "ogType": "article" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<main id="main-content" role="main"> ', " </main> ", ' <script type="application/ld+json">', "</script> "])), renderComponent($$result2, "Header", $$Header, { "currentPath": "/sorteos" }), maybeRenderHead(), renderComponent($$result2, "Container", $$Container, { "maxWidth": "lg", "class": "py-8 md:py-12" }, { "default": async ($$result3) => renderTemplate`<nav class="mb-6" aria-label="Ruta de navegación"> <ol class="flex items-center gap-2 text-sm text-text-secondary"> <li> <a href="/" class="transition-colors hover:text-text-primary">Inicio</a> </li> <li aria-hidden="true">/</li> <li> <a href="/sorteos" class="transition-colors hover:text-text-primary">Historial</a> </li> <li aria-hidden="true">/</li> <li aria-current="page" class="font-medium text-text-primary">
Sorteo Nº ${draw.officialNumber} </li> </ol> </nav> <header class="mb-8 text-center md:text-left"> <div class="mb-4 flex items-center justify-center gap-2 md:justify-start"> <span class="dark:bg-primary-900/20 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
OFICIAL
</span> </div> <h1 class="mb-2 font-sans text-display-sm text-text-primary">
Sorteo Nº ${draw.officialNumber} </h1> <time class="text-body-lg text-text-secondary"${addAttribute(draw.drawDate, "dateTime")}> ${formatDate(draw.drawDate)} </time> </header> <section aria-labelledby="modalities-heading" class="mb-12"> <h2 id="modalities-heading" class="sr-only">Modalidades del sorteo</h2> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> ${draw.results.map((result) => renderTemplate`<article${addAttribute(result.modality, "key")} class="card-elevated p-6 text-center"> <header class="mb-4"> <span class="bg-{MODALITY_COLORS[result.modality] ?? 'primary'}-100 text-{MODALITY_COLORS[result.modality] ?? 'primary'}-700 dark:bg-{MODALITY_COLORS[result.modality] ?? 'primary'}-900/20 dark:text-{MODALITY_COLORS[result.modality] ?? 'primary'}-300 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"> ${MODALITY_LABELS[result.modality] ?? result.modality} </span> </header> <div class="flex flex-wrap justify-center gap-2" role="img"${addAttribute(`${MODALITY_LABELS[result.modality] ?? result.modality}: ${result.numbers.map((n) => n.toString().padStart(2, "0")).join(", ")}`, "aria-label")}> ${result.numbers.map((num, idx) => renderTemplate`${renderComponent($$result3, "NumberBall", NumberBall, { "key": idx, "number": num, "size": "lg", "variant": MODALITY_COLORS[result.modality] ?? "primary" })}`)} </div> <p class="mt-4 text-caption text-text-secondary">6 números</p> </article>`)} </div> </section> <nav class="flex items-center justify-between gap-4" aria-label="Navegación entre sorteos"> ${prevDraw ? renderTemplate`<a${addAttribute(`/sorteos/${prevDraw.officialNumber}`, "href")} class="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-text-primary transition-colors hover:border-border-strong hover:bg-neutral-100 dark:hover:bg-neutral-800"${addAttribute(`Sorteo anterior: Nº ${prevDraw.officialNumber}`, "aria-label")}> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg> <div class="text-left"> <p class="text-caption text-text-secondary">Sorteo anterior</p> <p class="font-medium">Nº ${prevDraw.officialNumber}</p> </div> </a>` : renderTemplate`<div class="flex-1" aria-hidden="true"></div>`} <a href="/sorteos" class="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-text-primary transition-colors hover:border-border-strong hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Volver al historial completo"> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path> </svg> <span class="font-medium">Historial</span> </a> ${nextDraw ? renderTemplate`<a${addAttribute(`/sorteos/${nextDraw.officialNumber}`, "href")} class="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-text-primary transition-colors hover:border-border-strong hover:bg-neutral-100 dark:hover:bg-neutral-800"${addAttribute(`Sorteo siguiente: Nº ${nextDraw.officialNumber}`, "aria-label")}> <div class="text-right"> <p class="text-caption text-text-secondary">Sorteo siguiente</p> <p class="font-medium">Nº ${nextDraw.officialNumber}</p> </div> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a>` : renderTemplate`<div class="flex-1" aria-hidden="true"></div>`} </nav> ` }), renderComponent($$result2, "Footer", $$Footer, {}), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Sorteo Quini 6 Nº ${draw.officialNumber}`,
    startDate: draw.drawDate,
    description: `Resultados del sorteo Nº ${draw.officialNumber} del Quini 6 con sus 4 modalidades.`,
    organizer: {
      "@type": "Organization",
      name: "Lotería de Santa Fe"
    },
    location: {
      "@type": "Place",
      name: "Argentina"
    }
  }))) })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/sorteos/[officialNumber].astro", void 0);
const $$file = "D:/Desarrollo/quini6_frontend/src/pages/sorteos/[officialNumber].astro";
const $$url = "/sorteos/[officialNumber]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$officialNumber,
  fallback,
  file: $$file,
  getStaticPaths,
  headers,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
