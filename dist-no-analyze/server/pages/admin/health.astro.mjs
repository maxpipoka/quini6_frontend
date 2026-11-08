;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="353c60f7-cac9-4bd1-823c-6f67b982d3b4",e._sentryDebugIdIdentifier="sentry-dbid-353c60f7-cac9-4bd1-823c-6f67b982d3b4")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_rXuDvxK8.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw, XCircle, Server, Database, ChevronUp, ChevronDown, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import '../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
export { renderers } from '../../renderers.mjs';

const HISTORY_KEY = "health-check-history";
const MAX_HISTORY_ENTRIES = 50;
const AUTO_REFRESH_INTERVAL = 3e4;
function getStatusColor(status) {
  switch (status) {
    case "ok":
      return "text-success-600 bg-success-100 dark:bg-success-900/30 dark:text-success-400";
    case "degraded":
      return "text-warning-600 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400";
    case "down":
      return "text-error-600 bg-error-100 dark:bg-error-900/30 dark:text-error-400";
    default:
      return "text-neutral-600 bg-neutral-100 dark:bg-neutral-900/30 dark:text-neutral-400";
  }
}
function getStatusIcon(status) {
  switch (status) {
    case "ok":
      return /* @__PURE__ */ jsx(CheckCircle, { className: "size-4", "aria-hidden": "true" });
    case "degraded":
      return /* @__PURE__ */ jsx(AlertCircle, { className: "size-4", "aria-hidden": "true" });
    case "down":
      return /* @__PURE__ */ jsx(XCircle, { className: "size-4", "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ jsx(Clock, { className: "size-4", "aria-hidden": "true" });
  }
}
function getStatusLabel(status) {
  switch (status) {
    case "ok":
      return "Saludable";
    case "degraded":
      return "Degradado";
    case "down":
      return "Caído";
    default:
      return "Desconocido";
  }
}
function formatTimestamp(isoString) {
  try {
    return new Date(isoString).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  } catch {
    return isoString;
  }
}
function loadHistory() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
  }
  return [];
}
function saveHistory(history) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES)));
  } catch {
  }
}
const HealthDashboard = ({
  initialApiHealth,
  initialDbHealth
}) => {
  const [apiHealth, setApiHealth] = useState(initialApiHealth ?? null);
  const [dbHealth, setDbHealth] = useState(initialDbHealth ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchHealthData();
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);
  const fetchHealthData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = "https://api.quini6.com/api";
      if (!baseUrl) ;
      const [apiResponse, dbResponse] = await Promise.allSettled([
        fetch(`${baseUrl}/health`, { credentials: "include" }),
        fetch(`${baseUrl}/health/db`, { credentials: "include" })
      ]);
      let newApiHealth = null;
      let newDbHealth = null;
      let hasError = false;
      const errorMessages = [];
      if (apiResponse.status === "fulfilled") {
        if (apiResponse.value.ok) {
          newApiHealth = await apiResponse.value.json();
        } else {
          hasError = true;
          errorMessages.push(`API health check failed: ${apiResponse.value.status}`);
          console.warn("API health check failed:", apiResponse.value.status);
        }
      } else {
        hasError = true;
        errorMessages.push(`API health check network error: ${apiResponse.reason}`);
        console.warn("API health check network error:", apiResponse.reason);
      }
      if (dbResponse.status === "fulfilled") {
        if (dbResponse.value.ok) {
          newDbHealth = await dbResponse.value.json();
        } else {
          hasError = true;
          errorMessages.push(`DB health check failed: ${dbResponse.value.status}`);
          console.warn("DB health check failed:", dbResponse.value.status);
        }
      } else {
        hasError = true;
        errorMessages.push(`DB health check network error: ${dbResponse.reason}`);
        console.warn("DB health check network error:", dbResponse.reason);
      }
      if (hasError) {
        setError(errorMessages.join("; "));
      }
      setApiHealth(newApiHealth);
      setDbHealth(newDbHealth);
      setLastRefresh(/* @__PURE__ */ new Date());
      const newEntry = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        apiHealth: newApiHealth,
        dbHealth: newDbHealth
      };
      setHistory((prev) => {
        const updated = [newEntry, ...prev].slice(0, MAX_HISTORY_ENTRIES);
        saveHistory(updated);
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      console.error("Health check failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleManualRefresh = () => {
    void fetchHealthData();
  };
  const getOverallStatus = () => {
    if (!apiHealth && !dbHealth) return "unknown";
    if (apiHealth?.status === "down" || dbHealth?.status === "down") {
      return "down";
    }
    if (apiHealth?.status === "degraded") {
      return "degraded";
    }
    return "ok";
  };
  const overallStatus = getOverallStatus();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", "data-testid": "health-dashboard", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `rounded-lg p-2 ${getStatusColor(overallStatus)}`, children: /* @__PURE__ */ jsx(Activity, { className: "size-5", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-neutral-900 dark:text-neutral-100", children: "Salud del sistema" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Monitoreo de API y base de datos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        lastRefresh && /* @__PURE__ */ jsxs("span", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: [
          "Última actualización: ",
          formatTimestamp(lastRefresh.toISOString())
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleManualRefresh,
            disabled: isLoading,
            className: "inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
            "data-testid": "refresh-button",
            children: [
              /* @__PURE__ */ jsx(
                RefreshCw,
                {
                  className: `size-4 ${isLoading ? "animate-spin" : ""}`,
                  "aria-hidden": "true",
                  "data-testid": "refresh-spinner"
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Actualizar" })
            ]
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-error-700",
        role: "alert",
        "data-testid": "error-alert",
        children: [
          /* @__PURE__ */ jsx(XCircle, { className: "size-5 flex-shrink-0", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
            "Error al obtener datos de salud: ",
            error
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleManualRefresh,
              className: "ml-auto text-sm underline hover:no-underline",
              children: "Reintentar"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", "data-testid": "status-cards", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `rounded-xl border p-5 transition-all ${apiHealth ? getStatusColor(apiHealth.status).replace("text-", "bg-").replace("dark:bg-", "dark:bg-") : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"}`,
          "data-testid": "api-status-card",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: `rounded-lg p-3 ${getStatusColor(apiHealth?.status ?? "unknown")}`, children: /* @__PURE__ */ jsx(Server, { className: "size-5", "aria-hidden": "true" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-neutral-900 dark:text-neutral-100", children: "API Backend" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Estado del servicio principal" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-right", children: apiHealth ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(apiHealth.status)}`,
                    children: [
                      getStatusIcon(apiHealth.status),
                      getStatusLabel(apiHealth.status)
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-neutral-500 dark:text-neutral-400", children: [
                  "v",
                  apiHealth.version,
                  " · Uptime: ",
                  Math.floor(apiHealth.uptime),
                  "s"
                ] })
              ] }) : isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-neutral-500 dark:text-neutral-400", children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "size-4 animate-spin", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Comprobando..." })
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Sin datos" }) })
            ] }),
            apiHealth && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-neutral-500 dark:text-neutral-400", children: "Timestamp" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-mono text-neutral-900 dark:text-neutral-100", children: formatTimestamp(apiHealth.timestamp) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-neutral-500 dark:text-neutral-400", children: "Versión" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-mono text-neutral-900 dark:text-neutral-100", children: apiHealth.version })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `rounded-xl border p-5 transition-all ${dbHealth ? getStatusColor(dbHealth.status).replace("text-", "bg-").replace("dark:bg-", "dark:bg-") : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"}`,
          "data-testid": "db-status-card",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: `rounded-lg p-3 ${getStatusColor(dbHealth?.status ?? "unknown")}`, children: /* @__PURE__ */ jsx(Database, { className: "size-5", "aria-hidden": "true" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-neutral-900 dark:text-neutral-100", children: "Base de Datos" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Conexión y latencia" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-right", children: dbHealth ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(dbHealth.status)}`,
                    children: [
                      getStatusIcon(dbHealth.status),
                      getStatusLabel(dbHealth.status)
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-neutral-500 dark:text-neutral-400", children: [
                  "Latencia: ",
                  dbHealth.latency.toFixed(1),
                  "ms"
                ] })
              ] }) : isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-neutral-500 dark:text-neutral-400", children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "size-4 animate-spin", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Comprobando..." })
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Sin datos" }) })
            ] }),
            dbHealth && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-neutral-500 dark:text-neutral-400", children: "Timestamp" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-mono text-neutral-900 dark:text-neutral-100", children: formatTimestamp(dbHealth.timestamp) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-neutral-500 dark:text-neutral-400", children: "Latencia" }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 font-mono text-neutral-900 dark:text-neutral-100", children: [
                  dbHealth.latency.toFixed(1),
                  "ms"
                ] })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowHistory(!showHistory),
          className: "flex w-full items-center justify-between bg-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700",
          "data-testid": "history-toggle",
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-neutral-900 dark:text-neutral-100", children: "Historial de comprobaciones" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: [
                history.length,
                " registros"
              ] }),
              showHistory ? /* @__PURE__ */ jsx(ChevronUp, { className: "size-5", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "size-5", "aria-hidden": "true" })
            ] })
          ]
        }
      ),
      showHistory && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", "data-testid": "history-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400", children: "Fecha y hora" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400", children: "API" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400", children: "Base de datos" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400", children: "Detalles" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-neutral-200 dark:divide-neutral-700", children: history.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: 4,
            className: "px-4 py-8 text-center text-neutral-500 dark:text-neutral-400",
            children: "No hay historial disponible"
          }
        ) }) : history.map((entry, index) => /* @__PURE__ */ jsxs("tr", { className: "dark:hover:bg-neutral-800/50 hover:bg-neutral-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-sm text-neutral-900 dark:text-neutral-100", children: formatTimestamp(entry.timestamp) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: entry.apiHealth ? /* @__PURE__ */ jsxs(
            "span",
            {
              className: `inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(entry.apiHealth.status)}`,
              children: [
                getStatusIcon(entry.apiHealth.status),
                getStatusLabel(entry.apiHealth.status)
              ]
            }
          ) : /* @__PURE__ */ jsx("span", { className: "text-sm text-neutral-400 dark:text-neutral-500", children: "—" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: entry.dbHealth ? /* @__PURE__ */ jsxs(
            "span",
            {
              className: `inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(entry.dbHealth.status)}`,
              children: [
                getStatusIcon(entry.dbHealth.status),
                getStatusLabel(entry.dbHealth.status)
              ]
            }
          ) : /* @__PURE__ */ jsx("span", { className: "text-sm text-neutral-400 dark:text-neutral-500", children: "—" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400", children: entry.apiHealth && entry.dbHealth ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "API v",
            entry.apiHealth.version,
            " · DB ",
            entry.dbHealth.latency.toFixed(1),
            "ms"
          ] }) : entry.apiHealth ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "API v",
            entry.apiHealth.version
          ] }) : entry.dbHealth ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "DB ",
            entry.dbHealth.latency.toFixed(1),
            "ms"
          ] }) : "-" })
        ] }, index)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "size-2 animate-pulse rounded-full bg-success-500", "aria-hidden": "true" }),
        "Auto-actualización cada 30s"
      ] }),
      lastRefresh && /* @__PURE__ */ jsxs("span", { children: [
        "Próxima en ~",
        Math.max(0, 30 - Math.floor((Date.now() - lastRefresh.getTime()) / 1e3)),
        "s"
      ] })
    ] })
  ] });
};

const $$Astro = createAstro("https://quini6.com");
const prerender = false;
const $$Health = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Health;
  const apiBaseUrl = "https://api.quini6.com/api";
  let initialApiHealth = null;
  let initialDbHealth = null;
  {
    try {
      const testSessionHeader = Astro2.request.headers.get("x-test-session");
      const cookieHeader = Astro2.request.headers.get("cookie") ?? "";
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
      };
      if (testSessionHeader) {
        headers["x-test-session"] = testSessionHeader;
      }
      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }
      const [apiRes, dbRes] = await Promise.allSettled([
        fetch(`${apiBaseUrl}/health`, { headers }),
        fetch(`${apiBaseUrl}/health/db`, { headers })
      ]);
      if (apiRes.status === "fulfilled" && apiRes.value.ok) {
        initialApiHealth = await apiRes.value.json();
      }
      if (dbRes.status === "fulfilled" && dbRes.value.ok) {
        initialDbHealth = await dbRes.value.json();
      }
    } catch {
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Salud del sistema - Admin - Quini 6" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-3xl"> ${renderComponent($$result2, "HealthDashboard", HealthDashboard, { "client:visible": true, "initialApiHealth": initialApiHealth, "initialDbHealth": initialDbHealth, "client:component-hydration": "visible", "client:component-path": "D:/Desarrollo/quini6_frontend/src/components/admin/HealthDashboard.tsx", "client:component-export": "HealthDashboard" })} </div> ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/health.astro", void 0);
const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/health.astro";
const $$url = "/admin/health";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Health,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
