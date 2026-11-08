;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8257421b-187d-447c-ba63-b3ffefe2b2e9",e._sentryDebugIdIdentifier="sentry-dbid-8257421b-187d-447c-ba63-b3ffefe2b2e9")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/layout_D3ahR9qN.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { g as getApiClient } from '../../chunks/client_DTLLHpdZ.mjs';
import { I as ImportHistoryResponseSchema, b as ImportErrorsResponseSchema } from '../../chunks/schemas_BWmv8V5v.mjs';
import '../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { A as AlertCircleIcon, X as XCircleIcon, C as ChevronUpIcon, a as ChevronDownIcon, F as FileIcon } from '../../chunks/icons_CBEl8IKQ.mjs';
export { renderers } from '../../renderers.mjs';

function useImportHistory(options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 20,
    initialSort = { key: "date", order: "desc" },
    initialFilters = {}
  } = options;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters);
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const api = getApiClient();
      const params = {
        page,
        limit: pageSize,
        sort: sort.key,
        order: sort.order,
        startDate: filters.startDate,
        endDate: filters.endDate,
        policy: filters.policy
      };
      const response = await api.getImportHistory(params);
      const validated = ImportHistoryResponseSchema.parse(response);
      setData(validated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar historial"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sort, filters]);
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  useEffect(() => {
    void fetchData();
  }, [fetchData]);
  useEffect(() => {
    setPage(1);
  }, [pageSize, sort, filters]);
  return {
    data,
    isLoading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
    filters,
    setFilters,
    refetch
  };
}

function ImportErrorDetails({ importId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchErrors = async () => {
    if (errors !== null) return;
    setIsLoading(true);
    setError(null);
    try {
      const api = getApiClient();
      const response = await api.getImportErrors(importId);
      const validated = ImportErrorsResponseSchema.parse(response);
      setErrors(validated.errors);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar detalles"));
    } finally {
      setIsLoading(false);
    }
  };
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      void fetchErrors();
    }
  };
  const formatField = (field) => {
    const fieldLabels = {
      officialNumber: "Nº Oficial",
      drawDate: "Fecha del sorteo",
      modality: "Modalidad",
      numbers: "Números",
      reintegro: "Reintegro"
    };
    return fieldLabels[field] ?? field;
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleToggle,
        className: "inline-flex items-center gap-1 px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary",
        "aria-label": "Cargando detalles...",
        disabled: true,
        children: [
          /* @__PURE__ */ jsx("span", { className: "size-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" }),
          /* @__PURE__ */ jsx("span", { role: "status", className: "sr-only", children: "Cargando detalles..." })
        ]
      }
    );
  }
  const hasErrors = errors && errors.length > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleToggle,
        className: `inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${hasErrors ? "bg-error-500/10 hover:bg-error-500/20 text-error-500" : "bg-success-500/10 hover:bg-success-500/20 text-success-500"}`,
        "aria-expanded": isExpanded,
        "aria-label": isExpanded ? "Ocultar detalles de errores" : hasErrors ? "Ver detalles de errores" : "Sin errores",
        children: [
          hasErrors ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(AlertCircleIcon, { className: "size-3.5" }),
            /* @__PURE__ */ jsxs("span", { children: [
              errors?.length,
              " error",
              errors && errors.length !== 1 ? "es" : ""
            ] })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(XCircleIcon, { className: "size-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Sin errores" })
          ] }),
          isExpanded ? /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-3.5", "data-testid": "chevron-up-icon" }) : /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-3.5", "data-testid": "chevron-down-icon" })
        ]
      }
    ),
    error && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-1 text-xs text-error-500", children: error.message }),
    isExpanded && hasErrors && errors && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "error-details-title",
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Cerrar modal",
              className: "fixed inset-0 bg-black/50",
              onClick: () => setIsExpanded(false),
              "data-testid": "modal-backdrop"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-surface-elevated shadow-xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "sticky top-0 flex items-center justify-between border-b border-border bg-surface px-4 py-3", children: [
              /* @__PURE__ */ jsxs("h3", { id: "error-details-title", className: "font-medium text-text-primary", children: [
                "Detalles de errores - ",
                errors.length,
                " error",
                errors.length !== 1 ? "es" : ""
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setIsExpanded(false),
                  className: "rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary",
                  "aria-label": "Cerrar",
                  children: /* @__PURE__ */ jsx(XCircleIcon, { className: "size-5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-h-[calc(80vh_-_64px)] overflow-y-auto p-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: errors.map((err, index) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "border-error-500/20 bg-error-500/5 rounded-lg border p-4",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx(AlertCircleIcon, { className: "mt-0.5 size-5 flex-shrink-0 text-error-500" }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsxs("span", { className: "font-medium text-text-primary", children: [
                        "Fila ",
                        err.rowNumber
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "bg-error-500/10 rounded px-2 py-0.5 text-xs font-medium text-error-500", children: formatField(err.field) })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-secondary", children: err.message }),
                    err.rawValue !== void 0 && err.rawValue !== null && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-text-muted", children: "Valor original:" }),
                      /* @__PURE__ */ jsx("code", { className: "ml-2 rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-text-secondary", children: JSON.stringify(err.rawValue) })
                    ] })
                  ] })
                ] })
              },
              `${err.rowNumber}-${err.field}-${index}`
            )) }) })
          ] })
        ]
      }
    )
  ] });
}

function ImportHistoryTable() {
  const { data, isLoading, error, page, setPage, pageSize, setPageSize, sort, setSort, refetch } = useImportHistory();
  const columns = useMemo(
    () => [
      { key: "fileName", header: "Archivo", width: "25%" },
      { key: "date", header: "Fecha", width: "15%" },
      { key: "processed", header: "Procesados", align: "center", width: "10%" },
      { key: "succeeded", header: "Éxitos", align: "center", width: "10%" },
      { key: "failed", header: "Fallidos", align: "center", width: "10%" },
      { key: "policy", header: "Política", align: "center", width: "10%" },
      { key: "actions", header: "", align: "center", width: "10%" }
    ],
    []
  );
  const handleSort = useCallback(
    (key) => {
      if (sort.key === key) {
        setSort({ key, order: sort.order === "asc" ? "desc" : "asc" });
      } else {
        setSort({ key, order: "asc" });
      }
    },
    [sort, setSort]
  );
  const formatPolicy = (policy) => {
    const labels = {
      skip: "Omitir",
      replace: "Reemplazar",
      merge: "Fusionar"
    };
    return labels[policy] || policy;
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
      /* @__PURE__ */ jsx(AlertCircleIcon, { className: "text-error-500/50 mx-auto size-12" }),
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
      /* @__PURE__ */ jsx(FileIcon, { className: "mx-auto size-16 text-text-muted" }),
      /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-medium text-text-primary", children: "Sin importaciones" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-text-secondary", children: "No hay importaciones registradas aún" }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/admin/imports/upload",
          className: "hover:bg-primary-500/90 mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white",
          children: [
            /* @__PURE__ */ jsx(FileIcon, { className: "size-4" }),
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
          onClick: () => col.key !== "actions" && handleSort(col.key),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1", children: [
            col.header,
            col.key !== "actions" && /* @__PURE__ */ jsx("span", { className: "inline-flex", children: sort.key === col.key ? sort.order === "asc" ? /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-3.5" }) : /* @__PURE__ */ jsx("span", { className: "size-3.5 opacity-0", "aria-hidden": "true" }) })
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
        /* @__PURE__ */ jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsx(ImportErrorDetails, { importId: importItem.importId }) })
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
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$Layout, { "title": "Historial de Importaciones - Admin Quini 6" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-6xl space-y-6"> <div> <h1 class="font-sans text-2xl font-bold text-text-primary">Historial de Importaciones</h1> <p class="mt-1 text-text-secondary">
Visualiza y gestiona el historial de importaciones masivas
</p> </div> ${renderComponent($$result2, "ImportHistoryTable", ImportHistoryTable, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/Desarrollo/quini6_frontend/src/components/admin/ImportHistoryTable.tsx", "client:component-export": "ImportHistoryTable" })} </div> ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/imports/index.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/imports/index.astro";
const $$url = "/admin/imports";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
