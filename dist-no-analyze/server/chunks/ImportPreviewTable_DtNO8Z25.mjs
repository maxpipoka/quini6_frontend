;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="98436941-c3ef-458e-a5d0-3b509eb57426",e._sentryDebugIdIdentifier="sentry-dbid-98436941-c3ef-458e-a5d0-3b509eb57426")}catch(e){}}();import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useCallback, useMemo } from 'react';
import { d as CheckCircleIcon, A as AlertCircleIcon, a as ChevronDownIcon } from './icons_CBEl8IKQ.mjs';
import './_sentry-release-injection-file_BwnRfS4D.mjs';

const ImportPreviewTable = ({
  rows,
  onRowSelect,
  selectedRows = /* @__PURE__ */ new Set()
}) => {
  const [sorting, setSorting] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const handleSort = useCallback((columnId) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === columnId);
      if (existing) {
        if (existing.desc) {
          return prev.filter((s) => s.id !== columnId);
        }
        return prev.map((s) => s.id === columnId ? { ...s, desc: true } : s);
      }
      return [...prev, { id: columnId, desc: false }];
    });
  }, []);
  const handleRowSelect = useCallback(
    (rowIndex, selected) => {
      onRowSelect?.(rowIndex, selected);
    },
    [onRowSelect]
  );
  const handleToggleAllRows = useCallback(
    (selected) => {
      rows.forEach((_, index) => {
        const row = rows[index];
        if (row?.isValid) {
          handleRowSelect(index, selected);
        }
      });
    },
    [rows, handleRowSelect]
  );
  const handleExpandRow = useCallback((rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  }, []);
  const sortedRows = useMemo(() => {
    if (sorting.length === 0) return rows;
    return [...rows].sort((a, b) => {
      for (const sort of sorting) {
        const aObj = a;
        const bObj = b;
        let aVal = "";
        let bVal = "";
        const rawA = aObj[sort.id];
        const rawB = bObj[sort.id];
        if (typeof rawA === "string") aVal = rawA.toLowerCase();
        else if (typeof rawA === "number") aVal = rawA;
        if (typeof rawB === "string") bVal = rawB.toLowerCase();
        else if (typeof rawB === "number") bVal = rawB;
        if (aVal < bVal) return sort.desc ? 1 : -1;
        if (aVal > bVal) return sort.desc ? -1 : 1;
      }
      return 0;
    });
  }, [rows, sorting]);
  const allValidSelected = sortedRows.length > 0 && sortedRows.filter((r) => r.isValid).every((_, i) => selectedRows.has(i));
  const columns = [
    { id: "select", header: "Seleccionar", width: 48, sortable: false },
    { id: "rowNumber", header: "N°", width: 60, sortable: true },
    { id: "date", header: "Fecha", width: 120, sortable: true },
    { id: "modality", header: "Modalidad", width: 130, sortable: true },
    { id: "tradicional", header: "Tradicional", width: 150, sortable: false },
    { id: "laSegunda", header: "La Segunda", width: 150, sortable: false },
    { id: "revancha", header: "Revancha", width: 150, sortable: false },
    { id: "siempreSale", header: "Siempre Sale", width: 150, sortable: false },
    { id: "reintegro", header: "Reintegro", width: 80, sortable: false },
    { id: "status", header: "Estado", width: 100, sortable: false },
    { id: "expand", header: "Acciones", width: 48, sortable: false }
  ];
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700",
      "data-testid": "import-preview",
      children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", role: "grid", children: [
        /* @__PURE__ */ jsx("thead", { className: "dark:bg-neutral-800/50 bg-neutral-50", children: /* @__PURE__ */ jsx("tr", { children: columns.map((col) => /* @__PURE__ */ jsx(
          "th",
          {
            className: `px-3 py-2 text-left font-medium text-neutral-700 dark:text-neutral-300 ${col.sortable ? "cursor-pointer select-none hover:bg-neutral-100 dark:hover:bg-neutral-700" : ""}`,
            style: { width: col.width },
            onClick: () => col.sortable && handleSort(col.id),
            "aria-sort": sorting.find((s) => s.id === col.id)?.desc === true ? "descending" : sorting.find((s) => s.id === col.id) ? "ascending" : "none",
            scope: "col",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              col.header,
              col.sortable && sorting.find((s) => s.id === col.id) && /* @__PURE__ */ jsx("span", { className: "text-primary-600", "aria-hidden": "true", children: sorting.find((s) => s.id === col.id)?.desc ? "↓" : "↑" }),
              col.id === "select" && /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: allValidSelected,
                  onChange: (e) => handleToggleAllRows(e.target.checked),
                  className: "size-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500",
                  "aria-label": "Seleccionar todas las filas válidas"
                }
              )
            ] })
          },
          col.id
        )) }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-neutral-200 dark:divide-neutral-700", children: sortedRows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: columns.length,
            className: "px-4 py-8 text-center text-neutral-500 dark:text-neutral-400",
            children: "No hay datos para mostrar"
          }
        ) }) : sortedRows.map((row, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "tr",
            {
              className: `transition-colors ${row.isValid ? "" : "dark:bg-error-900/10 bg-error-50"}`,
              children: [
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedRows.has(index),
                    onChange: (e) => handleRowSelect(index, e.target.checked),
                    className: "size-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500",
                    "aria-label": `Seleccionar fila ${index + 1}`,
                    disabled: !row.isValid
                  }
                ) }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: row.rowNumber }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: row.date }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx("span", { className: "dark:bg-primary-900/30 inline-flex items-center rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 dark:text-primary-200", children: row.modality }) }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: row.tradicional?.join(" - ") ?? "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: row.laSegunda?.join(" - ") ?? "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: row.revancha?.join(" - ") ?? "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: row.siempreSale?.join(" - ") ?? "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-neutral-900 dark:text-neutral-100", children: row.reintegro?.toString() ?? "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${row.isValid ? "dark:bg-success-700/30 bg-success-100 text-success-700 dark:text-success-400" : "dark:bg-error-900/30 bg-error-100 text-error-700 dark:text-error-400"}`,
                    children: row.isValid ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(CheckCircleIcon, { className: "size-3.5", "aria-hidden": true }),
                      "Válido"
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(AlertCircleIcon, { className: "size-3.5", "aria-hidden": true }),
                      "Inválido"
                    ] })
                  }
                ) }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleExpandRow(String(row.rowNumber)),
                    className: "rounded p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    "aria-label": expandedRows[String(row.rowNumber)] ? "Contraer detalles" : "Expandir detalles",
                    "aria-expanded": expandedRows[String(row.rowNumber)],
                    children: /* @__PURE__ */ jsx(
                      ChevronDownIcon,
                      {
                        className: `size-4 text-neutral-500 transition-transform ${expandedRows[String(row.rowNumber)] ? "rotate-180" : ""}`,
                        "aria-hidden": true
                      }
                    )
                  }
                ) })
              ]
            }
          ),
          expandedRows[String(row.rowNumber)] && row.errors.length > 0 && /* @__PURE__ */ jsx("tr", { className: "dark:bg-neutral-800/50 bg-neutral-50", children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "ml-12 space-y-2 border-l-2 border-neutral-200 pl-4 dark:border-neutral-700", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-error-600 dark:text-error-400", children: [
              "Errores en fila ",
              row.rowNumber,
              ":"
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: row.errors.map((error, idx) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "text-sm text-neutral-600 dark:text-neutral-400",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-mono text-error-600 dark:text-error-400", children: [
                    error.field,
                    ":",
                    " "
                  ] }),
                  error.message,
                  error.rawValue !== void 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 font-mono text-xs text-neutral-400 dark:text-neutral-500", children: [
                    "(valor: ",
                    String(error.rawValue),
                    ")"
                  ] })
                ]
              },
              idx
            )) })
          ] }) }) })
        ] }, row.rowNumber)) })
      ] })
    }
  );
};

export { ImportPreviewTable as I };
