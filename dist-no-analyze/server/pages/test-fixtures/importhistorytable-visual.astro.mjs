;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="de236420-1f98-4c98-b556-c015fc78c197",e._sentryDebugIdIdentifier="sentry-dbid-de236420-1f98-4c98-b556-c015fc78c197")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, p as renderHead, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import '../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
/* empty css                                                        */
export { renderers } from '../../renderers.mjs';

const mockData = {
  data: {
    data: [
      {
        importId: "11111111-1111-4111-8111-111111111111",
        fileName: "draws-jan.csv",
        date: "2024-01-20T10:00:00Z",
        rowsProcessed: 10,
        succeeded: 10,
        failed: 0,
        policy: "skip"
      },
      {
        importId: "22222222-2222-4222-8222-222222222222",
        fileName: "draws-feb.csv",
        date: "2024-02-15T14:30:00Z",
        rowsProcessed: 15,
        succeeded: 12,
        failed: 3,
        policy: "replace"
      },
      {
        importId: "33333333-3333-4333-8333-333333333333",
        fileName: "draws-mar.csv",
        date: "2024-03-10T09:15:00Z",
        rowsProcessed: 8,
        succeeded: 8,
        failed: 0,
        policy: "merge"
      }
    ],
    total: 3,
    totalPages: 1,
    page: 1,
    limit: 10
  },
  isLoading: false,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page) => {
  },
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size) => {
  },
  sort: { key: "date", order: "desc" },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort) => {
  },
  refetch: () => Promise.resolve()
};
const mockEmptyData = {
  data: { data: [], total: 0, totalPages: 0, page: 1, limit: 10 },
  isLoading: false,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page) => {
  },
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size) => {
  },
  sort: { key: "date", order: "desc" },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort) => {
  },
  refetch: () => Promise.resolve()
};
const mockLoadingData = {
  data: null,
  isLoading: true,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page) => {
  },
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size) => {
  },
  sort: { key: "date", order: "desc" },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort) => {
  },
  refetch: () => Promise.resolve()
};
const mockErrorData = {
  data: null,
  isLoading: false,
  error: new Error("Error de conexión"),
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page) => {
  },
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size) => {
  },
  sort: { key: "date", order: "desc" },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort) => {
  },
  refetch: () => Promise.resolve()
};
const mockPaginationData = {
  data: {
    data: Array.from({ length: 25 }, (_, i) => ({
      importId: `${String(i + 1).padStart(32, "0")}`,
      fileName: `draws-${i + 1}.csv`,
      date: "2024-01-20T10:00:00Z",
      rowsProcessed: 10,
      succeeded: 9,
      failed: 1,
      policy: "skip"
    })),
    total: 25,
    totalPages: 3,
    page: 1,
    limit: 10
  },
  isLoading: false,
  error: null,
  page: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: (_page) => {
  },
  pageSize: 10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageSize: (_size) => {
  },
  sort: { key: "date", order: "desc" },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSort: (_sort) => {
  },
  refetch: () => Promise.resolve()
};
const ImportHistoryTableVisualWrapper = ({
  data,
  isLoading,
  error,
  page,
  setPage,
  pageSize,
  setPageSize,
  sort,
  setSort,
  refetch
}) => {
  const columns = [
    { key: "fileName", header: "Archivo", width: "25%" },
    { key: "date", header: "Fecha", width: "15%" },
    { key: "processed", header: "Procesados", align: "center", width: "10%" },
    { key: "succeeded", header: "Éxitos", align: "center", width: "10%" },
    { key: "failed", header: "Fallidos", align: "center", width: "10%" },
    { key: "policy", header: "Política", align: "center", width: "10%" },
    { key: "actions", header: "Acciones", align: "center", width: "10%" }
  ];
  const formatPolicy = (policy) => {
    const labels = {
      skip: "Omitir",
      replace: "Reemplazar",
      merge: "Fusionar"
    };
    return labels[policy] ?? policy;
  };
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getPolicyBadgeClass = (policy) => {
    switch (policy) {
      case "skip":
        return "bg-amber-100 text-amber-800";
      case "replace":
        return "bg-blue-100 text-blue-800";
      case "merge":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };
  if (isLoading && !data) {
    return /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-surface-elevated", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 text-text-secondary", children: [
      /* @__PURE__ */ jsx("span", { className: "size-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" }),
      /* @__PURE__ */ jsx("span", { children: "Cargando historial..." })
    ] }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-surface-elevated", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "text-error-500/50 mx-auto size-12",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-text-primary", children: "Error al cargar el historial" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-secondary", children: error.message }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => void refetch(),
          className: "hover:bg-primary-500/90 mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white",
          children: "Reintentar"
        }
      )
    ] }) });
  }
  if (!data || data.data.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-surface-elevated", children: /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "mx-auto size-16 text-text-muted",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17a4 4 0 11-8 0 4 4 0 018 0z"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-medium text-text-primary", children: "Sin importaciones" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-text-secondary", children: "No hay importaciones registradas aún" }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/admin/imports/upload",
          className: "hover:bg-primary-500/90 mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "size-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              }
            ) }),
            "Primera importación"
          ]
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-surface-elevated", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", role: "table", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-surface", children: /* @__PURE__ */ jsx("tr", { children: columns.map((col) => /* @__PURE__ */ jsx(
        "th",
        {
          scope: "col",
          className: `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary ${col.align === "center" ? "text-center" : ""} cursor-pointer hover:bg-surface-elevated`,
          style: { width: col.width },
          onClick: () => col.key !== "actions" && setSort({
            key: col.key,
            order: sort.key === col.key && sort.order === "asc" ? "desc" : "asc"
          }),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1", children: [
            col.header,
            col.key !== "actions" && /* @__PURE__ */ jsx("span", { className: "inline-flex", children: sort.key === col.key ? sort.order === "asc" ? /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-3.5",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M5 15l7-7 7 7"
                  }
                )
              }
            ) : /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-3.5",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M19 9l-7 7-7-7"
                  }
                )
              }
            ) : /* @__PURE__ */ jsx("span", { className: "size-3.5 opacity-0", "aria-hidden": "true" }) })
          ] })
        },
        col.key
      )) }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", id: "history-table-body", children: data.data.map((importItem) => /* @__PURE__ */ jsxs("tr", { className: "transition-colors hover:bg-neutral-50", children: [
        /* @__PURE__ */ jsx("td", { className: "p-4 font-mono text-sm text-text-primary", children: importItem.fileName }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-sm text-text-secondary", children: formatDate(importItem.date) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-center text-sm text-text-primary", children: importItem.rowsProcessed }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-center text-sm font-medium text-success-500", children: importItem.succeeded }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-center text-sm font-medium text-error-500", children: importItem.failed }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPolicyBadgeClass(importItem.policy)}`,
            children: formatPolicy(importItem.policy)
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "hover:text-primary-500/80 text-sm font-medium text-primary-500",
            "aria-label": `Ver errores de ${importItem.fileName}`,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "mx-auto inline-block size-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                )
              }
            )
          }
        ) })
      ] }, importItem.importId)) })
    ] }) }),
    data.totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-text-secondary", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "page-size", className: "font-medium", children: "Mostrar:" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "page-size",
            value: pageSize,
            onChange: (e) => setPageSize(Number(e.target.value)),
            className: "rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: 10, children: "10" }),
              /* @__PURE__ */ jsx("option", { value: 20, children: "20" }),
              /* @__PURE__ */ jsx("option", { value: 50, children: "50" }),
              /* @__PURE__ */ jsx("option", { value: 100, children: "100" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("span", { children: [
          "de ",
          data.total,
          " registros"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center justify-center gap-2", "aria-label": "Paginación", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setPage(page - 1),
            disabled: page === 1,
            className: "rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-50",
            children: "Anterior"
          }
        ),
        Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
          let pageNum;
          if (data.totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= data.totalPages - 2) {
            pageNum = data.totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setPage(pageNum),
              className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${pageNum === page ? "bg-primary-500 text-white" : "text-text-secondary hover:bg-surface-elevated"}`,
              "aria-current": pageNum === page ? "page" : void 0,
              children: pageNum
            },
            pageNum
          );
        }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setPage(page + 1),
            disabled: page === data.totalPages,
            className: "rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-50",
            children: "Siguiente"
          }
        )
      ] })
    ] })
  ] }) });
};
const ImportHistoryTableVisual = ({ state }) => {
  let data = mockData;
  switch (state) {
    case "empty":
      data = mockEmptyData;
      break;
    case "loading":
      data = mockLoadingData;
      break;
    case "error":
      data = mockErrorData;
      break;
    case "pagination":
      data = mockPaginationData;
      break;
  }
  return /* @__PURE__ */ jsx(
    ImportHistoryTableVisualWrapper,
    {
      data: data.data,
      isLoading: data.isLoading,
      error: data.error,
      page: data.page,
      setPage: data.setPage,
      pageSize: data.pageSize,
      setPageSize: data.setPageSize,
      sort: data.sort,
      setSort: data.setSort,
      refetch: data.refetch
    }
  );
};

const $$Astro = createAstro("https://quini6.com");
const $$ImportHistoryTableVisual = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ImportHistoryTableVisual;
  const state = Astro2.url.searchParams.get("state") ?? "default";
  return renderTemplate`<html lang="es" data-astro-cid-fk3d2k2z> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Visual Test: ImportHistoryTable - ${state}</title>${renderHead()}</head> <body data-test-animate="false" class="min-h-screen bg-neutral-50 p-8 dark:bg-neutral-900" data-astro-cid-fk3d2k2z> <main data-astro-cid-fk3d2k2z> <h1 class="sr-only" data-astro-cid-fk3d2k2z>ImportHistoryTable Component Test</h1> ${renderComponent($$result, "ImportHistoryTableVisual", ImportHistoryTableVisual, { "state": state, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/admin/ImportHistoryTable.visual", "client:component-export": "ImportHistoryTableVisual", "data-astro-cid-fk3d2k2z": true })} </main> </body></html>`;
}, "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/ImportHistoryTable-visual.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/test-fixtures/ImportHistoryTable-visual.astro";
const $$url = "/test-fixtures/ImportHistoryTable-visual";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImportHistoryTableVisual,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
