;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bdfed840-c465-468b-9ee5-eadfc30092b9",e._sentryDebugIdIdentifier="sentry-dbid-bdfed840-c465-468b-9ee5-eadfc30092b9")}catch(e){}}();import '../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, r as renderTemplate, k as renderComponent, l as renderScript, o as Fragment } from '../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_rXuDvxK8.mjs';
import { $ as $$Header, a as $$Container, b as $$Footer } from '../chunks/Container_CKIc8Y_Y.mjs';
import '../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { g as getApiClient } from '../chunks/client_DTLLHpdZ.mjs';
import { $ as $$Table } from '../chunks/Table_DaoQHMji.mjs';
/* empty css                                 */
import 'clsx';
import { $ as $$Button } from '../chunks/Button_6r2fcfJH.mjs';
import { $ as $$Spinner } from '../chunks/Spinner_BaZPL3Gl.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro("https://quini6.com");
const $$Pagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Pagination;
  const {
    page,
    totalPages,
    buildHref,
    showFirstLast = true,
    showPrevNext = true,
    maxPageButtons = 5,
    "aria-label": ariaLabel = "Paginaci\xF3n",
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = Astro2.props;
  const paginationId = `pagination-${Math.random().toString(36).slice(2, 9)}`;
  const linkClass = "inline-flex items-center justify-center rounded-lg border border-border bg-surface p-2 text-text-secondary transition-colors hover:bg-neutral-100 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 dark:hover:bg-neutral-800";
  const disabledLinkClass = "inline-flex items-center justify-center rounded-lg border border-border bg-surface p-2 text-text-secondary opacity-50";
  function getVisiblePages(currentPage, total, maxButtons) {
    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(total - 1, currentPage + half);
    if (end - start + 1 < maxButtons - 2) {
      if (start === 2) {
        end = start + maxButtons - 3;
      } else if (end === total - 1) {
        start = end - maxButtons + 3;
      }
    }
    const pages = [1];
    if (start > 2) {
      pages.push("ellipsis");
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < total - 1) {
      pages.push("ellipsis");
    }
    if (total > 1) {
      pages.push(total);
    }
    return pages;
  }
  const visiblePages = getVisiblePages(page, totalPages, maxPageButtons);
  return renderTemplate`${maybeRenderHead()}<nav${addAttribute(paginationId, "id")} class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"${addAttribute(ariaLabel, "aria-label")}${addAttribute(ariaDescribedBy, "aria-describedby")}${spreadAttributes(rest)} data-astro-cid-z6vjb6tl> <div class="flex items-center gap-1" data-astro-cid-z6vjb6tl> ${showFirstLast && (page > 1 ? renderTemplate`<a${addAttribute(buildHref(1), "href")}${addAttribute(linkClass, "class")} aria-label="Primera página" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" data-astro-cid-z6vjb6tl></path> </svg> </a>` : renderTemplate`<span${addAttribute(disabledLinkClass, "class")} aria-disabled="true" aria-label="Primera página" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" data-astro-cid-z6vjb6tl></path> </svg> </span>`)} ${showPrevNext && (page > 1 ? renderTemplate`<a${addAttribute(buildHref(page - 1), "href")}${addAttribute(linkClass, "class")} aria-label="Página anterior" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-z6vjb6tl></path> </svg> </a>` : renderTemplate`<span${addAttribute(disabledLinkClass, "class")} aria-disabled="true" aria-label="Página anterior" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-z6vjb6tl></path> </svg> </span>`)} <div class="flex items-center gap-0.5" role="group" aria-label="Seleccionar página" data-astro-cid-z6vjb6tl> ${visiblePages.map(
    (pageNum) => pageNum === "ellipsis" ? renderTemplate`<span class="px-3 py-2 text-sm text-text-muted" aria-hidden="true" data-astro-cid-z6vjb6tl>
⬦
</span>` : renderTemplate`<a${addAttribute(buildHref(pageNum), "href")}${addAttribute(`
                inline-flex h-10 min-w-[40px] items-center justify-center rounded-lg px-3 py-2 text-sm font-medium
                transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2
                ${pageNum === page ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-surface text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800"}
              `, "class")}${addAttribute(`P\xE1gina ${pageNum}`, "aria-label")}${addAttribute(pageNum === page ? "page" : void 0, "aria-current")} data-astro-cid-z6vjb6tl> ${pageNum} </a>`
  )} </div> ${showPrevNext && (page < totalPages ? renderTemplate`<a${addAttribute(buildHref(page + 1), "href")}${addAttribute(linkClass, "class")} aria-label="Página siguiente" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-z6vjb6tl></path> </svg> </a>` : renderTemplate`<span${addAttribute(disabledLinkClass, "class")} aria-disabled="true" aria-label="Página siguiente" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-z6vjb6tl></path> </svg> </span>`)} ${showFirstLast && (page < totalPages ? renderTemplate`<a${addAttribute(buildHref(totalPages), "href")}${addAttribute(linkClass, "class")} aria-label="Última página" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" data-astro-cid-z6vjb6tl></path> </svg> </a>` : renderTemplate`<span${addAttribute(disabledLinkClass, "class")} aria-disabled="true" aria-label="Última página" data-astro-cid-z6vjb6tl> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-z6vjb6tl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" data-astro-cid-z6vjb6tl></path> </svg> </span>`)} </div> <div class="whitespace-nowrap text-sm text-text-secondary" aria-live="polite" data-astro-cid-z6vjb6tl>
Página ${page} de ${totalPages} </div> </nav> `;
}, "D:/Desarrollo/quini6_frontend/src/components/ui/Pagination.astro", void 0);

const $$Astro$1 = createAstro("https://quini6.com");
const $$Select = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Select;
  const {
    options,
    label,
    error,
    helperText,
    placeholder = "Seleccionar...",
    value,
    name,
    id: propId,
    multiple = false,
    disabled = false,
    required = false,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
    onChange,
    onBlur,
    onFocus,
    ...rest
  } = Astro2.props;
  const selectId = propId ?? `select-${Math.random().toString(36).slice(2, 9)}`;
  const describedByParts = [];
  if (error) describedByParts.push(`${selectId}-error`);
  if (helperText) describedByParts.push(`${selectId}-helper`);
  if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
  const describedBy = describedByParts.length > 0 ? describedByParts.join(" ") : void 0;
  const isInvalid = error ? true : ariaInvalid;
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectClass = `
  bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")] w-full appearance-none rounded-lg border bg-surface bg-[right_0.75rem_center] bg-no-repeat px-4 py-2.5 pr-10 text-text-primary transition-colors
  duration-150
  focus:outline-none
  focus:ring-2
  focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50
  ${error ? "dark:focus:ring-error-900/30 border-error-500 focus:border-error-500 focus:ring-error-100" : "border-border focus:border-focus focus:ring-focus-ring"}
  ${multiple ? "min-h-[100px] pr-4" : ""}
`.replace(/\s+/g, " ").trim();
  return renderTemplate`${maybeRenderHead()}<div class="w-full" data-astro-cid-fmpop6ac> ${label && renderTemplate`<label${addAttribute(selectId, "for")} class="mb-1.5 block font-medium text-text-primary" data-astro-cid-fmpop6ac> ${label} ${required && renderTemplate`<span class="ml-1 text-error-500" aria-hidden="true" data-astro-cid-fmpop6ac>
*
</span>`} ${required && renderTemplate`<span class="visually-hidden" data-astro-cid-fmpop6ac> (requerido)</span>`} </label>`} <select${addAttribute(selectId, "id")}${addAttribute(name, "name")}${addAttribute(multiple, "multiple")}${addAttribute(disabled, "disabled")}${addAttribute(required, "required")}${addAttribute(isInvalid, "aria-invalid")}${addAttribute(required || ariaRequired, "aria-required")}${addAttribute(describedBy, "aria-describedby")}${addAttribute(selectClass, "class")}${addAttribute(onChange, "onChange")}${addAttribute(onBlur, "onBlur")}${addAttribute(onFocus, "onFocus")}${spreadAttributes(rest)} data-astro-cid-fmpop6ac> ${!multiple && placeholder && renderTemplate`<option value="" disabled selected hidden data-astro-cid-fmpop6ac> ${placeholder} </option>`} ${options.map((option) => renderTemplate`<option${addAttribute(option.value, "value")}${addAttribute(option.disabled, "disabled")}${addAttribute(selectedValues.includes(option.value), "selected")} data-astro-cid-fmpop6ac> ${option.label} </option>`)} </select> ${error && renderTemplate`<p${addAttribute(`${selectId}-error`, "id")} class="mt-1.5 text-sm text-error-600 dark:text-error-400" role="alert" data-astro-cid-fmpop6ac> ${error} </p>`} ${helperText && !error && renderTemplate`<p${addAttribute(`${selectId}-helper`, "id")} class="mt-1.5 text-sm text-text-muted" data-astro-cid-fmpop6ac> ${helperText} </p>`} </div> `;
}, "D:/Desarrollo/quini6_frontend/src/components/ui/Select.astro", void 0);

const $$Astro = createAstro("https://quini6.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const page = parseInt(Astro2.url.searchParams.get("page") ?? "1", 10);
  const yearParam = Astro2.url.searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : void 0;
  const limit = 20;
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
  let drawsResponse = null;
  let drawsError = null;
  let availableYears = [];
  try {
    const apiClient = getApiClient();
    drawsResponse = await apiClient.getDrawHistory({ page, limit, year });
    if (!year) {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
    }
  } catch (error) {
    console.warn("Could not fetch draw history from API, using mock data:", error);
    drawsError = null;
    let filteredDraws = MOCK_DRAWS;
    if (year) {
      filteredDraws = MOCK_DRAWS.filter((draw) => draw.drawDate.startsWith(year.toString()));
    }
    const start = (page - 1) * limit;
    const paginatedData = filteredDraws.slice(start, start + limit).map(toSummary);
    drawsResponse = {
      data: paginatedData,
      page,
      limit,
      total: filteredDraws.length,
      totalPages: Math.max(1, Math.ceil(filteredDraws.length / limit))
    };
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const MODALITY_LABELS = {
    TRADICIONAL: "Trad.",
    LA_SEGUNDA: "2da",
    REVANCHA: "Rev.",
    SIEMPRE_SALE: "S.S."
  };
  const MODALITY_COLORS = {
    TRADICIONAL: "primary",
    LA_SEGUNDA: "secondary",
    REVANCHA: "success",
    SIEMPRE_SALE: "warning"
  };
  const totalPages = drawsResponse?.totalPages ?? 1;
  const totalDraws = drawsResponse?.total ?? 0;
  const buildPageHref = (targetPage) => {
    const url = new URL(Astro2.url);
    if (targetPage > 1) {
      url.searchParams.set("page", targetPage.toString());
    } else {
      url.searchParams.delete("page");
    }
    return `${url.pathname}${url.search}`;
  };
  const columns = [
    {
      key: "officialNumber",
      header: "Sorteo",
      align: "center",
      render: (row) => `N\xBA ${row.officialNumber}`
    },
    {
      key: "drawDate",
      header: "Fecha",
      align: "center",
      render: (row) => formatDate(row.drawDate)
    },
    {
      key: "modalities",
      header: "Modalidades",
      render: (row) => ({
        html: `
        <div class="flex flex-wrap gap-1 justify-center" role="img" aria-label="${row.results.map((r) => `${MODALITY_LABELS[r.modality]}: ${r.numbers.map((n) => n.toString().padStart(2, "0")).join(", ")}`).join("; ")}">
          ${row.results.map(
          (result) => `
            <div class="flex flex-col items-center gap-1 text-center">
              <span class="text-[10px] font-medium text-text-secondary uppercase">${MODALITY_LABELS[result.modality] ?? result.modality}</span>
              <div class="flex gap-0.5">
                ${result.numbers.map(
            (num) => `
                  <span class="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 text-[10px] font-bold ${getModalityColorClass(result.modality)}">
                    ${num.toString().padStart(2, "0")}
                  </span>
                `
          ).join("")}
              </div>
            </div>
          `
        ).join("")}
        </div>
      `
      })
    },
    {
      key: "actions",
      header: "",
      align: "center",
      render: (row) => ({
        html: `
        <a
          href="/sorteos/${row.officialNumber}"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          aria-label="Ver resultados del sorteo N\xBA ${row.officialNumber}"
        >
          Ver resultados
          <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      `
      })
    }
  ];
  function getModalityColorClass(modality) {
    const color = MODALITY_COLORS[modality] ?? "primary";
    const colors = {
      primary: "bg-primary-500 text-white border-primary-500",
      secondary: "bg-secondary-500 text-white border-secondary-500",
      success: "bg-success-500 text-white border-success-500",
      warning: "bg-warning-500 text-neutral-900 border-warning-500 dark:text-neutral-900"
    };
    return colors[color];
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Historial de sorteos", "description": "Historial completo de sorteos del Quini 6 con paginaci\xF3n y filtro por a\xF1o. Consulte resultados oficiales de cada sorteo.", "canonical": "/sorteos" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "currentPath": "/sorteos" })} ${maybeRenderHead()}<main id="main-content" role="main"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "lg", "class": "py-8 md:py-12" }, { "default": async ($$result3) => renderTemplate` <header class="mb-8"> <h1 class="font-sans text-display-sm text-text-primary">Historial de sorteos</h1> <p class="mt-2 text-text-secondary">
Consulte todos los sorteos oficiales del Quini 6. Filtre por año y navegue por páginas.
<span class="hidden sm:inline"> Total: <strong>${totalDraws}</strong> sorteos.</span> </p> </header> <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div class="flex items-center gap-3"> <span class="whitespace-nowrap text-sm font-medium text-text-secondary">
Filtrar por año:
</span> ${renderComponent($$result3, "Select", $$Select, { "id": "year-filter", "name": "year", "value": year?.toString() ?? "", "options": [
    { value: "", label: "Todos los a\xF1os" },
    ...availableYears.map((y) => ({ value: y.toString(), label: y.toString() }))
  ], "class": "w-auto min-w-[160px]", "aria-label": "Seleccionar a\xF1o" })} </div> ${year && renderTemplate`<a href="/sorteos" class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700">
Limpiar filtro
</a>`} </div> ${drawsError ? renderTemplate`<div class="card-elevated p-8 text-center" role="alert"> <div class="mb-4"> <svg class="mx-auto size-12 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> </svg> </div> <h2 class="mb-2 font-sans text-heading-md text-text-primary">
No pudimos cargar el historial
</h2> <p class="mb-4 text-text-secondary"> ${drawsError instanceof Error && "requestId" in drawsError ? `Error: ${drawsError.message} (ID: ${drawsError.requestId})` : "Ocurri\xF3 un error al obtener los sorteos."} </p> ${renderComponent($$result3, "Button", $$Button, { "variant": "primary", "href": `${Astro2.url.pathname}${Astro2.url.search}`, "aria-label": "Reintentar carga" }, { "default": async ($$result4) => renderTemplate`
Reintentar
` })} </div>` : drawsResponse ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "Table", $$Table, { "columns": columns, "data": drawsResponse.data, "rowKey": "id", "emptyState": "No hay sorteos registrados para el per\xEDodo seleccionado.", "loadingState": false, "aria-label": "Historial de sorteos del Quini 6", "aria-describedby": "table-description" })} <p id="table-description" class="sr-only">
Tabla con ${drawsResponse.data.length} sorteos. Use la paginación para navegar.
</p> ${totalPages > 1 && renderTemplate`<div class="mt-8"> ${renderComponent($$result4, "Pagination", $$Pagination, { "page": page, "totalPages": totalPages, "showFirstLast": true, "showPrevNext": true, "maxPageButtons": 5, "buildHref": buildPageHref, "aria-label": "Paginaci\xF3n del historial de sorteos" })} </div>`}` })}` : renderTemplate`<div class="card-elevated p-12 text-center" role="status" aria-live="polite"> ${renderComponent($$result3, "Spinner", $$Spinner, { "size": "lg", "color": "primary", "aria-label": "Cargando historial de sorteos" })} <p class="mt-4 text-text-secondary">Cargando historial de sorteos...</p> </div>`}` })} </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "D:/Desarrollo/quini6_frontend/src/pages/sorteos/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/sorteos/index.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/sorteos/index.astro";
const $$url = "/sorteos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
