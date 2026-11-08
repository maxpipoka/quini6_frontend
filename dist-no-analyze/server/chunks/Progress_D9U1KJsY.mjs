;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="94fb7502-b7e3-4123-a752-b348a7e54f20",e._sentryDebugIdIdentifier="sentry-dbid-94fb7502-b7e3-4123-a752-b348a7e54f20")}catch(e){}}();import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useState, useEffect } from 'react';
import './_sentry-release-injection-file_BwnRfS4D.mjs';

const stageLabels = {
  processing: "Procesando archivo...",
  committing: "Guardando sorteos...",
  completed: "Completado",
  error: "Error"
};
const stageColors = {
  processing: "bg-primary-600",
  committing: "bg-blue-600",
  completed: "bg-success-600",
  error: "bg-error-600"
};
const Progress = ({
  value,
  stage = "processing",
  label,
  showPercentage = true,
  "aria-live": ariaLive = "polite",
  className = "",
  id
}) => {
  const progressIdRef = useRef(id ?? `progress-${Math.random().toString(36).slice(2, 9)}`);
  const [isIndeterminate, setIsIndeterminate] = useState(value === void 0);
  useEffect(() => {
    setIsIndeterminate(value === void 0);
  }, [value]);
  const currentLabel = label ?? stageLabels[stage];
  const currentColor = stageColors[stage];
  const percentage = isIndeterminate ? "" : `${Math.round(Math.max(0, Math.min(100, value ?? 0)))}%`;
  const indeterminateStyle = {
    animation: "indeterminate 1.5s infinite ease-in-out"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      id: progressIdRef.current,
      className: `w-full ${className}`,
      role: "progressbar",
      "aria-valuenow": isIndeterminate ? void 0 : Math.round(Math.max(0, Math.min(100, value ?? 0))),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-live": ariaLive,
      "aria-label": currentLabel,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-sm font-medium text-neutral-700 dark:text-neutral-300",
              id: `${progressIdRef.current}-label`,
              children: currentLabel
            }
          ),
          showPercentage && !isIndeterminate && /* @__PURE__ */ jsx(
            "span",
            {
              className: "font-mono text-sm text-neutral-500 dark:text-neutral-400",
              id: `${progressIdRef.current}-percentage`,
              children: percentage
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700", children: isIndeterminate ? /* @__PURE__ */ jsx(
          "div",
          {
            className: `${currentColor} h-full w-1/4`,
            style: indeterminateStyle,
            "aria-hidden": true
          }
        ) : /* @__PURE__ */ jsx(
          "div",
          {
            id: `${progressIdRef.current}-bar`,
            className: `${currentColor} h-full transition-all duration-300 ease-out`,
            style: { width: percentage },
            role: "presentation"
          }
        ) }),
        label && /* @__PURE__ */ jsx(
          "p",
          {
            className: "mt-1 text-xs text-neutral-500 dark:text-neutral-400",
            id: `${progressIdRef.current}-detail`,
            children: label
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @media (forced-colors: active) {
          .progress-container > div:last-child {
            forced-color-adjust: none;
            background-color: Canvas;
            border: 1px solid CanvasText;
          }
          .h-full bg-primary-500 rounded-full transition-all duration-300,
          .animate-pulse {
            forced-color-adjust: none;
            background-color: Highlight;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .h-full bg-primary-500 rounded-full transition-all duration-300 {
            transition: none;
          }
          .animate-pulse {
            animation: none;
            width: 50%;
          }
        }
      ` })
      ]
    }
  );
};

export { Progress as P };
