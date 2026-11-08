;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="551e9cfd-2939-471a-a735-d3ed76dfb8d9",e._sentryDebugIdIdentifier="sentry-dbid-551e9cfd-2939-471a-a735-d3ed76dfb8d9")}catch(e){}}();import '../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_rXuDvxK8.mjs';
import { N as NumberBall, $ as $$Header, a as $$Container, b as $$Footer } from '../chunks/Container_CKIc8Y_Y.mjs';
import '../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useState, useEffect, useCallback } from 'react';
import { f as formatDrawNumber, a as MODALITY_LABELS } from '../chunks/schemas_BWmv8V5v.mjs';
import { t as trackEvent } from '../chunks/analytics_cPtNKEwv.mjs';
export { renderers } from '../renderers.mjs';

function validateNumber(value) {
  if (value === "") return void 0;
  const num = parseInt(value, 10);
  if (isNaN(num)) return "Debe ser un número";
  if (num < 0 || num > 45) return "Debe estar entre 0 y 45";
  return void 0;
}
function validateUniqueNumbers(numbers) {
  const unique = new Set(numbers);
  if (unique.size !== numbers.length) return "Los números no pueden repetirse";
  return void 0;
}
function NumberField(props) {
  const { index, value, onChange, onBlur, error, disabled, autoAdvance } = props;
  const displayError = error ?? "";
  const [localValue, setLocalValue] = useState(value);
  const inputRef = React.useRef(null);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!/^\d*$/.test(newValue)) return;
    if (newValue.length > 2) return;
    setLocalValue(newValue);
    onChange(index, newValue);
    if (autoAdvance && newValue.length === 2) {
      const nextInput = document.querySelector(`[data-number-index="${index + 1}"]`);
      nextInput?.focus();
    }
  };
  const handleBlur = () => {
    onBlur(index);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && localValue === "" && index > 0) {
      const prevInput = document.querySelector(`[data-number-index="${index - 1}"]`);
      prevInput?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      const nextInput = document.querySelector(`[data-number-index="${index + 1}"]`);
      nextInput?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.querySelector(`[data-number-index="${index - 1}"]`);
      prevInput?.focus();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: inputRef,
        type: "text",
        inputMode: "numeric",
        pattern: "[0-9]*",
        value: localValue,
        onChange: handleChange,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        disabled,
        maxLength: 2,
        "aria-label": `Número ${index + 1}`,
        "data-number-index": index,
        className: `
          w-full rounded-lg
          border bg-surface p-2
          text-center text-heading-md font-semibold text-text-primary
          placeholder-text-muted transition-colors
          duration-150 focus:outline-none
          focus:ring-2 focus:ring-offset-0
          disabled:cursor-not-allowed disabled:bg-neutral-50
          disabled:opacity-50 dark:disabled:bg-neutral-800
          ${displayError ? "dark:focus:ring-error-900/30 border-error-500 focus:border-error-500 focus:ring-error-100" : "border-border focus:border-focus focus:ring-focus-ring"}
        `,
        placeholder: "--"
      }
    ),
    displayError && /* @__PURE__ */ jsx(
      "p",
      {
        className: "absolute bottom-full left-0 mb-1 text-xs text-error-600 dark:text-error-400",
        role: "alert",
        children: displayError
      }
    )
  ] });
}
const NumberInput = ({
  value,
  onChange,
  error,
  disabled = false,
  autoAdvance = true
}) => {
  const [fieldValues, setFieldValues] = useState(
    value.map((n) => n === null ? "" : formatDrawNumber(n))
  );
  const [fieldErrors, setFieldErrors] = useState(Array(6).fill(""));
  const [touched, setTouched] = useState(Array(6).fill(false));
  useEffect(() => {
    setFieldValues(value.map((n) => n === null ? "" : formatDrawNumber(n)));
  }, [value]);
  const handleFieldChange = useCallback(
    (index, newValue) => {
      const newFieldValues = [...fieldValues];
      newFieldValues[index] = newValue;
      setFieldValues(newFieldValues);
      const fieldError = validateNumber(newValue);
      const newFieldErrors = [...fieldErrors];
      newFieldErrors[index] = fieldError ?? "";
      setFieldErrors(newFieldErrors);
      const numbers = newFieldValues.map((v) => v === "" ? null : parseInt(v, 10)).filter((n) => n !== null);
      if (numbers.length === 6) {
        const uniqueError = validateUniqueNumbers(numbers);
        if (uniqueError) {
          const dupErrors = fieldErrors.map((_, i) => {
            const num = numbers[i];
            return num !== void 0 && numbers.indexOf(num) !== numbers.lastIndexOf(num) ? "Los números no pueden repetirse" : "";
          });
          setFieldErrors(dupErrors);
        }
      }
      const validNumbers = newFieldValues.map((v) => v === "" ? null : parseInt(v, 10)).filter((n) => n !== null && n >= 0 && n <= 45);
      if (validNumbers.length === 6) {
        const uniqueError = validateUniqueNumbers(validNumbers);
        if (!uniqueError) {
          onChange(validNumbers);
        }
      }
    },
    [fieldValues, fieldErrors, onChange]
  );
  const handleFieldBlur = useCallback(
    (index) => {
      const newTouched = [...touched];
      newTouched[index] = true;
      setTouched(newTouched);
    },
    [touched]
  );
  const hasUniqueError = fieldErrors.some((e) => e === "Los números no pueden repetirse");
  const uniqueErrorIndex = fieldErrors.findIndex((e) => e === "Los números no pueden repetirse");
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2", role: "group", "aria-label": "Selección de 6 números", children: [
    Array.from({ length: 6 }).map((_, i) => {
      const shouldShowError = touched[i] && fieldErrors[i];
      const hasUniqueErrorAtIndex = hasUniqueError && uniqueErrorIndex === i;
      const fieldError = shouldShowError ? fieldErrors[i] ?? "" : hasUniqueErrorAtIndex ? fieldErrors[i] ?? "" : "";
      return /* @__PURE__ */ jsx(
        NumberField,
        {
          index: i,
          value: fieldValues[i],
          onChange: handleFieldChange,
          onBlur: handleFieldBlur,
          error: fieldError,
          disabled,
          autoAdvance
        },
        i
      );
    }),
    error && !hasUniqueError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-error-600 dark:text-error-400", role: "alert", children: error })
  ] });
};

const MODALITY_COLORS = {
  TRADICIONAL: "primary",
  LA_SEGUNDA: "secondary",
  REVANCHA: "success",
  SIEMPRE_SALE: "warning"
};
function formatLongDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
const SearchForm = ({ apiBaseUrl }) => {
  const [numbers, setNumbers] = useState(Array(6).fill(null));
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorRequestId, setErrorRequestId] = useState("");
  const filledNumbers = numbers.filter((n) => n !== null);
  const isComplete = filledNumbers.length === 6;
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isComplete) {
      setStatus("error");
      setErrorMessage("Debe ingresar exactamente 6 números únicos entre 0 y 45.");
      return;
    }
    if (!apiBaseUrl) {
      setStatus("error");
      setErrorMessage("La API no está configurada. Intente más tarde.");
      return;
    }
    setStatus("loading");
    setResult(null);
    setErrorMessage("");
    setErrorRequestId("");
    void (async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/search/exact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ numbers: filledNumbers })
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setErrorMessage(payload?.message ?? `Error ${response.status}`);
          setErrorRequestId(payload?.requestId ?? "");
          setStatus("error");
          return;
        }
        const resultData = await response.json();
        setResult(resultData);
        setStatus("success");
        trackEvent("search_combination", {
          numbers: filledNumbers.map((n) => n.toString().padStart(2, "0")).join(","),
          hasResults: resultData.matches.length > 0,
          totalMatches: resultData.totalMatches
        });
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
        setStatus("error");
      }
    })();
  };
  const handleClear = () => {
    setNumbers(Array(6).fill(null));
    setResult(null);
    setStatus("idle");
    setErrorMessage("");
    setErrorRequestId("");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "form",
      {
        className: "card-elevated p-6 md:p-8",
        onSubmit: handleSubmit,
        noValidate: true,
        "data-testid": "search-form",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("p", { className: "mb-3 block text-sm font-medium text-text-secondary", children: "Sus 6 números" }),
            /* @__PURE__ */ jsx(NumberInput, { value: numbers, onChange: (value) => setNumbers(value), autoAdvance: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:justify-end", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "rounded-lg border border-border bg-surface px-4 py-2 font-medium text-text-primary transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                onClick: handleClear,
                children: "Limpiar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                "data-testid": "search-button",
                className: "rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50",
                disabled: status === "loading",
                children: status === "loading" ? "Buscando..." : "Buscar combinación"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "mt-8", "aria-live": "polite", children: [
      status === "loading" && /* @__PURE__ */ jsxs("div", { className: "card-elevated p-12 text-center", role: "status", children: [
        /* @__PURE__ */ jsxs(
          "svg",
          {
            className: "mx-auto size-8 animate-spin text-primary-600",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8z" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-text-secondary", children: "Buscando combinación..." })
      ] }),
      status === "error" && /* @__PURE__ */ jsxs("div", { className: "card-elevated p-8 text-center", role: "alert", "data-testid": "search-error", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-2 font-sans text-heading-md text-text-primary", children: "No pudimos realizar la búsqueda" }),
        /* @__PURE__ */ jsxs("p", { className: "mb-4 text-text-secondary", children: [
          errorMessage,
          errorRequestId ? ` (ID: ${errorRequestId})` : ""
        ] })
      ] }),
      status === "success" && result && result.matches.length > 0 && /* @__PURE__ */ jsxs("div", { "data-testid": "search-results", children: [
        /* @__PURE__ */ jsxs("p", { className: "mb-6 text-text-secondary", children: [
          "Se encontraron ",
          /* @__PURE__ */ jsx("strong", { children: result.totalMatches }),
          " coincidencia",
          result.totalMatches !== 1 ? "s" : "",
          "."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", role: "list", "aria-label": "Resultados de la búsqueda", children: result.matches.map((match) => /* @__PURE__ */ jsxs(
          "article",
          {
            className: "card-elevated p-6",
            role: "listitem",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-semibold text-text-primary", children: [
                    "Sorteo Nº ",
                    match.officialNumber
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-text-secondary", children: formatLongDate(match.drawDate) })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300", children: MODALITY_LABELS[match.modality] ?? match.modality })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "flex flex-wrap justify-center gap-1.5",
                  role: "img",
                  "aria-label": `Números: ${match.numbers.map((n) => n.toString().padStart(2, "0")).join(", ")}`,
                  children: match.numbers.map((num) => /* @__PURE__ */ jsx(
                    NumberBall,
                    {
                      number: num,
                      size: "md",
                      variant: MODALITY_COLORS[match.modality] ?? "primary"
                    },
                    num
                  ))
                }
              )
            ]
          },
          `${match.officialNumber}-${match.modality}`
        )) })
      ] }),
      status === "success" && result && result.matches.length === 0 && /* @__PURE__ */ jsxs("div", { className: "card-elevated p-8 text-center", role: "status", "data-testid": "no-results", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-2 font-sans text-heading-md text-text-primary", children: "No encontramos esta combinación" }),
        /* @__PURE__ */ jsxs("p", { className: "mb-4 text-text-secondary", children: [
          "Los números",
          " ",
          /* @__PURE__ */ jsx("strong", { children: filledNumbers.map((n) => n.toString().padStart(2, "0")).join(", ") }),
          " ",
          "no han salido juntos en ningún sorteo registrado."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-text-secondary", children: "Intente con otra combinación o revise el historial completo." })
      ] }),
      status === "idle" && /* @__PURE__ */ jsx("div", { className: "card-elevated p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-text-secondary", children: 'Ingrese sus 6 números arriba y pulse "Buscar combinación" para ver los resultados.' }) })
    ] })
  ] });
};

const $$Buscar = createComponent(($$result, $$props, $$slots) => {
  const apiBaseUrl = "https://api.quini6.com/api";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Buscar combinación", "description": "Búsqueda exacta de combinaciones en el historial del Quini 6. Ingrese 6 números y descubra en qué sorteos han salido juntos.", "canonical": "/buscar" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "currentPath": "/buscar" })} ${maybeRenderHead()}<main id="main-content" role="main"> ${renderComponent($$result2, "Container", $$Container, { "maxWidth": "md", "class": "py-8 md:py-12" }, { "default": ($$result3) => renderTemplate` <header class="mb-8 text-center"> <h1 class="font-sans text-display-sm text-text-primary">Buscar combinación</h1> <p class="mt-2 text-text-secondary">
Ingrese 6 números (0-45) y le mostraremos todos los sorteos donde han salido juntos, en
          cualquier modalidad.
</p> </header> ${renderComponent($$result3, "SearchForm", SearchForm, { "client:load": true, "apiBaseUrl": apiBaseUrl, "client:component-hydration": "load", "client:component-path": "D:/Desarrollo/quini6_frontend/src/components/search/SearchForm.tsx", "client:component-export": "default" })} ` })} </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/buscar.astro", void 0);
const $$file = "D:/Desarrollo/quini6_frontend/src/pages/buscar.astro";
const $$url = "/buscar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Buscar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
