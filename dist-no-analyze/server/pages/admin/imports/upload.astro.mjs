;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cf529c44-213b-415d-81ec-e325128c28e7",e._sentryDebugIdIdentifier="sentry-dbid-cf529c44-213b-415d-81ec-e325128c28e7")}catch(e){}}();import '../../../chunks/page-ssr_DXgf4VtS.mjs';
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/layout_D3ahR9qN.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useId, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { F as FileDropzone } from '../../../chunks/FileDropzone_C6mJ0TuS.mjs';
import '../../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { I as ImportPreviewTable } from '../../../chunks/ImportPreviewTable_DtNO8Z25.mjs';
import { I as ImportProgress } from '../../../chunks/ImportProgress_CkcV7dH-.mjs';
import { b as XIcon, U as UploadIcon, E as ErrorIcon, c as CheckIcon } from '../../../chunks/icons_CBEl8IKQ.mjs';
/* empty css                                        */
import { C as CreateDrawSchema } from '../../../chunks/schemas_BWmv8V5v.mjs';
import { g as getApiClient } from '../../../chunks/client_DTLLHpdZ.mjs';
import { t as trackEvent } from '../../../chunks/analytics_cPtNKEwv.mjs';
export { renderers } from '../../../renderers.mjs';

const POLICY_OPTIONS = [
  {
    value: "skip",
    label: "Omitir duplicados",
    description: "Mantiene los sorteos existentes, ignora los nuevos que coincidan en fecha y modalidad"
  },
  {
    value: "replace",
    label: "Reemplazar",
    description: "Elimina los sorteos existentes y crea nuevos con los datos importados"
  },
  {
    value: "merge",
    label: "Fusionar",
    description: "Actualiza sorteos existentes y crea nuevos, combinando números si es posible"
  }
];
const PolicySelect = ({
  value,
  onChange,
  disabled = false,
  validCount = 0,
  "aria-describedby": ariaDescribedBy
}) => {
  const radioGroupId = useId();
  const isDisabled = disabled || validCount === 0;
  return /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3", "aria-describedby": ariaDescribedBy, children: [
    /* @__PURE__ */ jsx("legend", { className: "text-sm font-medium text-neutral-900 dark:text-neutral-100", children: "Política de conflicto" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "space-y-2",
        role: "radiogroup",
        "aria-labelledby": `${radioGroupId}-legend`,
        id: radioGroupId,
        children: POLICY_OPTIONS.map((option) => (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control -- label wraps input; text is in nested <p>
          /* @__PURE__ */ jsxs(
            "label",
            {
              className: `flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all duration-200
              ${value === option.value ? "dark:bg-primary-900/20 border-primary-500 bg-primary-50" : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"}
              ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`,
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: radioGroupId,
                    value: option.value,
                    checked: value === option.value,
                    onChange: () => !isDisabled && onChange(option.value),
                    disabled: isDisabled,
                    className: "mt-1 size-4 border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50",
                    "aria-describedby": `${option.value}-description`
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-neutral-900 dark:text-neutral-100", children: option.label }),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      id: `${option.value}-description`,
                      className: "mt-0.5 text-sm text-neutral-500 dark:text-neutral-400",
                      children: option.description
                    }
                  )
                ] })
              ]
            },
            option.value
          )
        ))
      }
    ),
    isDisabled && validCount === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs italic text-neutral-500 dark:text-neutral-400", children: "Seleccione una política después de validar el archivo (mínimo 1 fila válida)" })
  ] });
};

const Modal = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  closeOnBackdrop = true,
  closeOnEscape = true
}) => {
  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const focusableElementsRef = useRef([]);
  const getFocusableElements = (container) => {
    const selector = [
      'button:not([disabled]):not([tabindex="-1"])',
      '[href]:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([tabindex="-1"])'
    ].join(", ");
    return Array.from(container.querySelectorAll(selector)).filter(
      (el) => el.offsetParent !== null
    );
  };
  const trapFocus = (event) => {
    if (event.key !== "Tab") return;
    const firstElement = focusableElementsRef.current[0];
    const lastElement = focusableElementsRef.current[focusableElementsRef.current.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };
  const handleKeyDown = (event) => {
    if (closeOnEscape && event.key === "Escape") {
      onClose();
    }
    trapFocus(event);
  };
  const handleBackdropClick = (event) => {
    if (!closeOnBackdrop) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      const panel = modalRef.current?.querySelector("[data-modal-panel]");
      if (panel) {
        focusableElementsRef.current = getFocusableElements(panel);
        const firstFocusable = focusableElementsRef.current[0];
        const closeBtn = modalRef.current?.querySelector(
          "[data-modal-close]"
        );
        (firstFocusable ?? closeBtn)?.focus();
      }
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, closeOnEscape]);
  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl"
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": title ? "modal-title" : void 0,
        tabIndex: -1,
        onKeyDown: (e) => e.key === "Escape" && closeOnEscape && onClose(),
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
              "aria-hidden": "true",
              onClick: handleBackdropClick
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: modalRef,
              className: `relative w-full ${sizeClasses[size]} max-h-[90vh] transform animate-fade-in animate-in animate-zoom-in-95 overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-200 ease-out focus:outline-none dark:bg-neutral-900`,
              "data-modal-panel": true,
              children: [
                title && /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700", children: [
                  /* @__PURE__ */ jsx(
                    "h2",
                    {
                      id: "modal-title",
                      className: "text-lg font-semibold text-neutral-900 dark:text-neutral-100",
                      children: title
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: "rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:bg-neutral-800",
                      "aria-label": "Cerrar modal",
                      "data-modal-close": true,
                      onClick: onClose,
                      children: /* @__PURE__ */ jsx(XIcon, { className: "size-5", "aria-hidden": true })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-4", "data-modal-content": true, children })
              ]
            }
          )
        ]
      }
    )
  );
};

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
const loadingSpinner = /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
  /* @__PURE__ */ jsxs(
    "svg",
    {
      className: "size-4 animate-spin",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            className: "opacity-75",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          }
        )
      ]
    }
  ),
  /* @__PURE__ */ jsx("span", { children: "Cargando..." })
] });
const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  href,
  children,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  onClick
}) => {
  const isLink = !!href;
  const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isLink ? "text-center" : ""}`;
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  if (isLink) {
    return /* @__PURE__ */ jsx(
      "a",
      {
        href,
        className: combinedClasses,
        "aria-label": ariaLabel,
        "aria-describedby": ariaDescribedBy,
        "aria-disabled": disabled,
        "aria-busy": loading,
        onClick: handleClick,
        children: loading ? loadingSpinner : children
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type,
      className: combinedClasses,
      disabled: disabled || loading,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-busy": loading,
      onClick: handleClick,
      children: loading ? loadingSpinner : children
    }
  );
};
Button.displayName = "Button";

const Toast = ({
  type,
  title,
  message,
  requestId,
  duration = 5e3,
  action,
  onClose,
  "aria-live": ariaLive = "polite"
}) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 200);
      }, duration);
      return () => clearTimeout(timer);
    }
    return void 0;
  }, [duration, onClose]);
  if (!isVisible) return null;
  const typeConfig = {
    success: {
      icon: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "size-5 text-success-600 dark:text-success-400",
          fill: "currentColor",
          viewBox: "0 0 20 20",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
              clipRule: "evenodd"
            }
          )
        }
      ),
      bg: "bg-success-50 dark:bg-success-900/20",
      border: "border-success-200 dark:border-success-800",
      text: "text-success-700 dark:text-success-400",
      titleText: "text-success-900 dark:text-success-100",
      ariaLabel: "Éxito"
    },
    error: {
      icon: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "size-5 text-error-600 dark:text-error-400",
          fill: "currentColor",
          viewBox: "0 0 20 20",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-7a1 1 0 10-2 0v4a1 1 0 102 0V11zm1-9a1 1 0 100 2 1 1 0 000-2z",
              clipRule: "evenodd"
            }
          )
        }
      ),
      bg: "bg-error-50 dark:bg-error-900/20",
      border: "border-error-400 dark:border-error-700",
      text: "text-error-700 dark:text-error-400",
      titleText: "text-error-900 dark:text-error-100",
      ariaLabel: "Error"
    },
    warning: {
      icon: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "size-5 text-warning-600 dark:text-warning-400",
          fill: "currentColor",
          viewBox: "0 0 20 20",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
              clipRule: "evenodd"
            }
          )
        }
      ),
      bg: "bg-warning-50 dark:bg-warning-900/20",
      border: "border-warning-200 dark:border-warning-800",
      text: "text-warning-800 dark:text-warning-200",
      titleText: "text-warning-900 dark:text-warning-100",
      ariaLabel: "Advertencia"
    },
    info: {
      icon: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "size-5 text-info-600 dark:text-info-400",
          fill: "currentColor",
          viewBox: "0 0 20 20",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
              clipRule: "evenodd"
            }
          )
        }
      ),
      bg: "bg-info-50 dark:bg-info-900/20",
      border: "border-info-200 dark:border-info-800",
      text: "text-info-800 dark:text-info-200",
      titleText: "text-info-900 dark:text-info-100",
      ariaLabel: "Información"
    }
  };
  const config = typeConfig[type];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
        flex items-start gap-3 rounded-lg border p-4 shadow-lg
        ${config.bg} ${config.border} ${config.text}
        min-w-[300px] max-w-md animate-fade-in animate-in
        animate-slide-in-from-top-2 duration-300
        ${duration === 0 ? "" : "animate-out duration-200"}
      `,
      role: "alert",
      "aria-live": ariaLive,
      "aria-label": config.ariaLabel,
      "data-toast": true,
      "data-duration": duration,
      children: [
        /* @__PURE__ */ jsx("div", { className: "mt-0.5 flex-shrink-0", "aria-hidden": "true", children: config.icon }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: `font-semibold ${config.titleText} ${message ? "mb-1" : ""}`, children: title }),
          message && /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: message }),
          requestId && /* @__PURE__ */ jsxs("details", { className: "mt-2", "data-request-id": true, children: [
            /* @__PURE__ */ jsxs("summary", { className: "text-current/60 cursor-pointer select-none font-mono text-xs hover:text-current", children: [
              "Request ID: ",
              requestId
            ] }),
            /* @__PURE__ */ jsx("pre", { className: "bg-neutral-900/50 dark:bg-neutral-100/50 text-current/80 mt-1 overflow-x-auto rounded p-2 font-mono text-xs", children: requestId })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-shrink-0 items-start gap-2", children: [
          action && /* @__PURE__ */ jsx(
            "button",
            {
              className: "text-sm font-medium underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
              onClick: action.onClick,
              children: action.label
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "text-current/60 hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
              onClick: () => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 200);
              },
              "aria-label": "Cerrar",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "size-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  )
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes animate-slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes animate-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .animate-slide-in-from-top-2 { animation: animate-slide-in-from-top-2 300ms ease-out; }
        .animate-fade-in { animation: animate-fade-in 300ms ease-out; }
        .animate-out { animation: fade-out 200ms ease-in forwards; }

        @media (prefers-reduced-motion: reduce) {
          .animate-slide-in-from-top-2, .animate-fade-in, .animate-out { animation: none; }
        }

        @media (forced-colors: active) {
          [data-toast] {
            forced-color-adjust: none;
            border-color: CanvasText;
            background-color: Canvas;
            color: CanvasText;
          }
          [data-toast] svg { stroke: CanvasText; }
          [data-toast] summary { color: CanvasText; }
          [data-toast] pre { background-color: Canvas; border: 1px solid CanvasText; }
        }
      ` })
      ]
    }
  );
};

const useImportValidation = () => {
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [rowErrors, setRowErrors] = useState(/* @__PURE__ */ new Map());
  const validateRows = useMemo(
    () => (rows) => {
      const valid = [];
      const invalid = [];
      const errors = /* @__PURE__ */ new Map();
      rows.forEach((row, index) => {
        const result = CreateDrawSchema.safeParse(row);
        if (result.success) {
          valid.push(row);
        } else {
          invalid.push({ row, isValid: false, errors: result.error.issues });
          errors.set(index, result.error.issues);
        }
      });
      setValidRows(valid);
      setInvalidRows(invalid);
      setRowErrors(errors);
    },
    []
  );
  const clearValidation = useMemo(
    () => () => {
      setValidRows([]);
      setInvalidRows([]);
      setRowErrors(/* @__PURE__ */ new Map());
    },
    []
  );
  return {
    validRows,
    invalidRows,
    rowErrors,
    validateRows,
    clearValidation
  };
};

const useImportCommit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const clearError = useCallback(() => setError(null), []);
  const preview = useCallback(
    async (rows) => {
      console.log("[useImportCommit] preview called with rows:", rows.length);
      setIsLoading(true);
      setError(null);
      try {
        const client = getApiClient();
        console.log("[useImportCommit] calling client.importPreview");
        const result = await client.importPreview(rows);
        console.log("[useImportCommit] preview result:", result);
        return result;
      } catch (err) {
        console.error("[useImportCommit] preview error:", err);
        const error2 = err instanceof Error ? err : new Error("Error desconocido en vista previa");
        setError(error2);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  const commit = useCallback(
    async (importId, policy, onProgress) => {
      console.log("[useImportCommit] commit called with:", { importId, policy });
      setIsLoading(true);
      setError(null);
      try {
        const client = getApiClient();
        const options = onProgress ? { onProgress } : void 0;
        const result = await client.importCommit(importId, policy, options);
        console.log("[useImportCommit] commit result:", result);
        return result;
      } catch (err) {
        console.error("[useImportCommit] commit error:", err);
        const errWithResponse = err;
        if (err instanceof Error && "response" in err) {
          console.error("[useImportCommit] error response:", errWithResponse.response);
        }
        if (err instanceof Error && "body" in err) {
          console.error("[useImportCommit] error body:", errWithResponse.body);
        }
        const error2 = err instanceof Error ? err : new Error("Error desconocido al confirmar importación");
        setError(error2);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  return {
    preview,
    commit,
    isLoading,
    error,
    clearError
  };
};

const XLSX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const ImportWizard = ({ onImportSuccess }) => {
  const [step, setStep] = useState("upload");
  const [parsedFile, setParsedFile] = useState(null);
  const [importId, setImportId] = useState(null);
  const [policy, setPolicy] = useState("skip");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedRows, setSelectedRows] = useState(/* @__PURE__ */ new Set());
  const { validRows, invalidRows, rowErrors, validateRows, clearValidation } = useImportValidation();
  const { preview, commit, isLoading, clearError: clearCommitError } = useImportCommit();
  const workerRef = useRef(null);
  const progressStageRef = useRef("processing");
  const progressValueRef = useRef(0);
  const currentFileRef = useRef(null);
  const [renderKey, setRenderKey] = useState(0);
  useEffect(() => {
    console.log("[ImportWizard] step changed:", step);
    setRenderKey((k) => k + 1);
  }, [step]);
  useEffect(() => {
    console.log("[ImportWizard] Initializing worker");
    if (typeof Worker !== "undefined") {
      console.log("[ImportWizard] Worker API available, creating worker");
      workerRef.current = new Worker(new URL("../../workers/importParser.ts", import.meta.url), {
        type: "module"
      });
      workerRef.current.onmessage = (e) => {
        const message = e.data;
        console.log("[ImportWizard] worker message received:", message);
        if (message.type === "RESULT") {
          const { rows, parseErrors } = message;
          if (!currentFileRef.current) return;
          setParsedFile({ rows, parseErrors, file: currentFileRef.current });
          trackEvent("import_start", {
            fileName: currentFileRef.current.name,
            fileSize: currentFileRef.current.size,
            rowCount: rows.length
          });
          setSelectedRows(new Set(rows.map((_, index) => index)));
          validateRows(rows);
          setStep("preview");
        } else if (message.type === "ERROR") {
          console.log("[ImportWizard] worker ERROR message:", message.message);
          trackEvent("import_error", {
            stage: "parse",
            errorMessage: message.message
          });
          setToast({ type: "error", title: "Error al procesar", message: message.message });
          setStep("upload");
        } else if (message.type === "PROGRESS") {
          progressValueRef.current = message.total > 0 ? message.parsed / message.total : 0;
        }
      };
    } else {
      console.log("[ImportWizard] Worker API NOT available");
    }
    return () => {
      workerRef.current?.terminate();
    };
  }, [validateRows]);
  useEffect(() => {
    if (step !== "preview" || !parsedFile) return;
    const validIndices = parsedFile.rows.map((_, index) => index).filter((index) => (rowErrors.get(index)?.length ?? 0) === 0);
    setSelectedRows(new Set(validIndices));
  }, [step, parsedFile, rowErrors]);
  const handleFileSelected = useCallback(
    (file) => {
      if (!file) {
        setParsedFile(null);
        currentFileRef.current = null;
        clearValidation();
        return;
      }
      currentFileRef.current = file;
      setStep("upload");
      setToast(null);
      clearCommitError();
      const worker = workerRef.current;
      if (!worker) {
        console.log("[ImportWizard] No worker available");
        return;
      }
      const mimeType = file.type || (file.name.endsWith(".xlsx") ? XLSX_MIME_TYPE : "text/csv");
      console.log("[ImportWizard] Sending file to worker:", { fileName: file.name, mimeType });
      trackEvent("import_start", {
        fileName: file.name,
        fileSize: file.size,
        rowCount: 0
        // Will be updated after parsing
      });
      void file.arrayBuffer().then((buffer) => {
        const input = { file: buffer, fileName: file.name, mimeType };
        console.log("[ImportWizard] Posting message to worker:", input);
        worker.postMessage(input);
      });
    },
    [clearValidation, clearCommitError]
  );
  const handlePreview = useCallback(() => {
    console.log("[ImportWizard] handlePreview called", { parsedFile, validRows, step });
    if (!parsedFile || validRows.length === 0) {
      console.log("[ImportWizard] handlePreview returning early - no parsedFile or no validRows");
      return;
    }
    setStep("progress");
    progressStageRef.current = "processing";
    progressValueRef.current = 0;
    void preview(validRows).then((result) => {
      if (result) {
        console.log("[ImportWizard] preview success", result);
        setImportId(result.importId);
        console.log("[ImportWizard] calling setStep confirm");
        setStep("confirm");
        console.log("[ImportWizard] after setStep confirm");
      } else {
        console.log("[ImportWizard] preview failed - no result");
        trackEvent("import_error", {
          stage: "preview",
          errorMessage: "No se pudo generar la vista previa"
        });
        setToast({
          type: "error",
          title: "Error en vista previa",
          message: "No se pudo generar la vista previa"
        });
        setStep("upload");
      }
    }).catch((error) => {
      console.error("[ImportWizard] preview error:", error);
      trackEvent("import_error", {
        stage: "preview",
        errorMessage: error instanceof Error ? error.message : "Error inesperado"
      });
      setToast({
        type: "error",
        title: "Error en vista previa",
        message: error instanceof Error ? error.message : "Error inesperado"
      });
      setStep("upload");
    });
  }, [parsedFile, validRows, preview]);
  const handleConfirm = useCallback(() => {
    setShowConfirmModal(true);
  }, []);
  const handleCommit = useCallback(() => {
    if (!importId) return;
    console.log("[ImportWizard] handleCommit called", { importId, policy });
    trackEvent("import_commit", {
      importId,
      policy,
      selectedRows: selectedRows.size
    });
    setShowConfirmModal(false);
    setStep("progress");
    progressStageRef.current = "committing";
    progressValueRef.current = 0;
    void commit(importId, policy, (progress) => {
      progressValueRef.current = progress.progress;
      progressStageRef.current = progress.stage;
    }).then((result) => {
      console.log("[ImportWizard] commit result:", result);
      if (result) {
        setToast({
          type: "success",
          title: "Importación completada",
          message: `Creados: ${result.created}, Actualizados: ${result.updated}, Omitidos: ${result.skipped}, Fallidos: ${result.failed}`
        });
        setStep("result");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("draws:refresh"));
        }
        onImportSuccess?.();
      } else {
        console.log("[ImportWizard] commit returned null/undefined");
        trackEvent("import_error", {
          importId,
          stage: "commit",
          errorMessage: "No se pudo completar la importación"
        });
        setToast({
          type: "error",
          title: "Error en importación",
          message: "No se pudo completar la importación"
        });
        setStep("result");
      }
    }).catch((error) => {
      console.error("[ImportWizard] commit error:", error);
      trackEvent("import_error", {
        importId,
        stage: "commit",
        errorMessage: error instanceof Error ? error.message : "Error inesperado"
      });
      setToast({
        type: "error",
        title: "Error en importación",
        message: error instanceof Error ? error.message : "Error inesperado"
      });
      setStep("result");
    });
  }, [importId, policy, commit, onImportSuccess, selectedRows.size]);
  const handleRowSelect = useCallback((rowIndex, selected) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (selected) next.add(rowIndex);
      else next.delete(rowIndex);
      return next;
    });
  }, []);
  const handleBack = useCallback(() => {
    if (step === "preview") setStep("upload");
    else if (step === "confirm") setStep("preview");
    else if (step === "progress") setStep("confirm");
  }, [step]);
  const handleReset = useCallback(() => {
    setStep("upload");
    setParsedFile(null);
    setImportId(null);
    setPolicy("skip");
    setSelectedRows(/* @__PURE__ */ new Set());
    clearValidation();
    clearCommitError();
    setToast(null);
  }, [clearValidation, clearCommitError]);
  const renderUploadStep = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(
        UploadIcon,
        {
          className: "mx-auto size-16 text-neutral-400 dark:text-neutral-500",
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100", children: "Importar sorteos masivamente" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-neutral-500 dark:text-neutral-400", children: "Carga un archivo CSV o XLSX con los sorteos a importar" })
    ] }),
    /* @__PURE__ */ jsx(
      FileDropzone,
      {
        accept: ".csv,.xlsx",
        maxSize: 10 * 1024 * 1024,
        onFileSelected: handleFileSelected,
        onError: (msg) => setToast({ type: "error", title: "Error", message: msg }),
        "data-testid": "file-dropzone"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-sm text-neutral-500 dark:text-neutral-400", children: [
      /* @__PURE__ */ jsx("p", { children: '" Formato: CSV (UTF-8) o Excel (.xlsx)' }),
      /* @__PURE__ */ jsx("p", { children: '" Columnas requeridas: officialNumber, drawDate, modality, numbers' }),
      /* @__PURE__ */ jsx("p", { children: '" Máximo 10 MB / 10,000 filas' })
    ] }),
    toast && /* @__PURE__ */ jsx(
      Toast,
      {
        type: toast.type,
        title: toast.title,
        message: toast.message,
        onClose: () => setToast(null)
      }
    )
  ] });
  const renderPreviewStep = () => {
    const previewRows = parsedFile?.rows.map((row, index) => {
      const errors = rowErrors.get(index) ?? [];
      return {
        rowNumber: index + 1,
        date: row.drawDate,
        modality: row.results[0]?.modality ?? "",
        tradicional: row.results.find((r) => r.modality === "TRADICIONAL")?.numbers ?? null,
        laSegunda: row.results.find((r) => r.modality === "LA_SEGUNDA")?.numbers ?? null,
        revancha: row.results.find((r) => r.modality === "REVANCHA")?.numbers ?? null,
        siempreSale: row.results.find((r) => r.modality === "SIEMPRE_SALE")?.numbers ?? null,
        reintegro: null,
        isValid: errors.length === 0,
        errors: errors.map((e) => ({
          rowNumber: index + 1,
          field: e.path.join("."),
          message: e.message,
          rawValue: void 0
        }))
      };
    }) ?? [];
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold text-neutral-900 dark:text-neutral-100", children: [
          "Vista previa (",
          validRows.length,
          " válidas, ",
          invalidRows.length,
          " inválidas)"
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setStep("upload"), children: "Cambiar archivo" })
      ] }),
      /* @__PURE__ */ jsx(
        ImportPreviewTable,
        {
          rows: previewRows,
          onRowSelect: handleRowSelect,
          selectedRows
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: [
          selectedRows.size,
          " de ",
          validRows.length,
          " filas válidas seleccionadas"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: handleBack, children: "Atrás" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "primary",
              onClick: handlePreview,
              disabled: validRows.length === 0 || selectedRows.size === 0,
              children: "Continuar"
            }
          )
        ] })
      ] }),
      toast && /* @__PURE__ */ jsx(
        Toast,
        {
          type: toast.type,
          title: toast.title,
          message: toast.message,
          onClose: () => setToast(null)
        }
      )
    ] });
  };
  const renderConfirmStep = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-neutral-900 dark:text-neutral-100", children: "Confirmar importación" }),
    /* @__PURE__ */ jsx(PolicySelect, { value: policy, onChange: setPolicy, validCount: selectedRows.size }),
    /* @__PURE__ */ jsxs("div", { className: "dark:bg-neutral-800/50 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-medium text-neutral-900 dark:text-neutral-100", children: "Resumen" }),
      /* @__PURE__ */ jsxs("dl", { className: "space-y-1 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-neutral-500 dark:text-neutral-400", children: "Filas seleccionadas:" }),
          /* @__PURE__ */ jsx("dd", { className: "font-medium text-neutral-900 dark:text-neutral-100", children: selectedRows.size })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-neutral-500 dark:text-neutral-400", children: "Política de conflicto:" }),
          /* @__PURE__ */ jsx("dd", { className: "font-medium capitalize text-neutral-900 dark:text-neutral-100", children: policy })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: handleBack, children: "Atrás" }),
      /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: handleConfirm, disabled: isLoading, children: isLoading ? "Procesando..." : "Confirmar e importar" })
    ] })
  ] });
  const renderProgressStep = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-neutral-900 dark:text-neutral-100", children: progressStageRef.current === "processing" ? "Procesando archivo..." : "Guardando sorteos..." }),
    /* @__PURE__ */ jsx(
      ImportProgress,
      {
        importId: importId ?? "",
        stage: progressStageRef.current,
        progress: progressValueRef.current,
        onComplete: (success) => {
          if (success) {
            setToast({
              type: "success",
              title: "Completado",
              message: "La importación se ha completado exitosamente"
            });
            setStep("result");
            onImportSuccess?.();
          }
        },
        onError: (err) => {
          setToast({ type: "error", title: "Error", message: err.message });
          setStep("result");
        }
      }
    )
  ] });
  const renderResultStep = () => {
    const isError = toast?.type === "error";
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `mx-auto flex size-16 items-center justify-center rounded-full ${isError ? "dark:bg-error-900/30 bg-error-100" : "dark:bg-success-700/30 bg-success-100"}`,
          children: isError ? /* @__PURE__ */ jsx(ErrorIcon, { className: "size-8 text-error-600 dark:text-error-400", "aria-hidden": true }) : /* @__PURE__ */ jsx(
            CheckIcon,
            {
              className: "size-8 text-success-600 dark:text-success-400",
              "aria-hidden": true
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-neutral-900 dark:text-neutral-100", children: toast?.title ?? "Importación completada" }),
      toast?.message && /* @__PURE__ */ jsx("p", { className: "text-neutral-500 dark:text-neutral-400", children: toast.message }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-3", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: handleReset, children: "Nueva importación" }),
        /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: handleReset, children: "Volver a sorteos" })
      ] })
    ] });
  };
  const renderStep = () => {
    switch (step) {
      case "upload":
        return /* @__PURE__ */ jsx("div", { children: renderUploadStep() }, "upload-step");
      case "preview":
        return /* @__PURE__ */ jsx("div", { children: renderPreviewStep() }, "preview-step");
      case "confirm":
        return /* @__PURE__ */ jsx("div", { children: renderConfirmStep() }, "confirm-step");
      case "progress":
        return /* @__PURE__ */ jsx("div", { children: renderProgressStep() }, "progress-step");
      case "result":
        return /* @__PURE__ */ jsx("div", { children: renderResultStep() }, "result-step");
      default:
        return /* @__PURE__ */ jsx("div", { children: renderUploadStep() }, "upload-step");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-4xl space-y-6", "data-step": step, children: [
    /* @__PURE__ */ jsx("div", { children: renderStep() }, renderKey),
    showConfirmModal && /* @__PURE__ */ jsxs(
      Modal,
      {
        isOpen: showConfirmModal,
        onClose: () => setShowConfirmModal(false),
        title: "Confirmar importación",
        size: "md",
        children: [
          /* @__PURE__ */ jsxs("p", { className: "mb-4 text-neutral-600 dark:text-neutral-400", children: [
            "Se importarán ",
            /* @__PURE__ */ jsx("strong", { children: selectedRows.size }),
            " sorteos con la política",
            " ",
            /* @__PURE__ */ jsx("strong", { children: policy }),
            ". Esta acción no se puede deshacer."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setShowConfirmModal(false), children: "Cancelar" }),
            /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: handleCommit, disabled: isLoading, children: "Confirmar" })
          ] })
        ]
      }
    )
  ] });
};

const $$Upload = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$Layout, { "title": "Importar Sorteos - Admin Quini 6" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-4xl space-y-6"> <div> <h1 class="font-sans text-2xl font-bold text-text-primary">Importar Sorteos</h1> <p class="mt-1 text-text-secondary">Carga masiva de sorteos desde archivo CSV o Excel</p> </div> ${renderComponent($$result2, "ImportWizard", ImportWizard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/Desarrollo/quini6_frontend/src/components/admin/ImportWizard.tsx", "client:component-export": "ImportWizard" })} </div> ` })}`;
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/imports/upload.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/imports/upload.astro";
const $$url = "/admin/imports/upload";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Upload,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
