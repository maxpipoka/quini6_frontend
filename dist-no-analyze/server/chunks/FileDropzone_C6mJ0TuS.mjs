;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0d019980-7ede-49f9-8f8e-98608a538abb",e._sentryDebugIdIdentifier="sentry-dbid-0d019980-7ede-49f9-8f8e-98608a538abb")}catch(e){}}();import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useState, useId, useCallback } from 'react';
import './_sentry-release-injection-file_BwnRfS4D.mjs';

const FileDropzone = ({
  accept = ".csv,.xlsx",
  maxSize = 10 * 1024 * 1024,
  onFileSelected: _onFileSelected,
  onError: _onError,
  disabled = false,
  className = "",
  "data-testid": testId
}) => {
  const dropzoneRef = useRef(null);
  const inputRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const dropzoneId = useId();
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const validateFile = useCallback(
    (file) => {
      setError(null);
      const allowedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = allowedTypes.some((t) => t === fileExt || t === file.type);
      if (!isValidType) {
        const msg = `Tipo de archivo no permitido. Use: ${accept}`;
        setError(msg);
        _onError?.(msg);
        return false;
      }
      if (file.size > maxSize) {
        const msg = `Archivo demasiado grande. Máximo: ${formatSize(maxSize)}`;
        setError(msg);
        _onError?.(msg);
        return false;
      }
      return true;
    },
    [accept, maxSize, _onError]
  );
  const handleFile = useCallback(
    (file) => {
      if (!validateFile(file)) return;
      setCurrentFile(file);
      _onFileSelected?.(file);
    },
    [validateFile, _onFileSelected]
  );
  const clearFile = useCallback(() => {
    setCurrentFile(null);
    if (inputRef.current) inputRef.current.value = "";
    _onFileSelected?.(null);
  }, [_onFileSelected]);
  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setDragActive(true);
      }
    },
    [disabled]
  );
  const handleDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!currentFile && !disabled) {
        setDragActive(false);
      }
    },
    [currentFile, disabled]
  );
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (disabled) return;
      const file = e.dataTransfer?.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );
  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );
  const handleRemoveClick = useCallback(
    (e) => {
      e.stopPropagation();
      clearFile();
    },
    [clearFile]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: dropzoneRef,
      id: dropzoneId,
      "data-testid": testId,
      className: `
        rounded-lg border-2 border-dashed p-8 text-center
        transition-all duration-200
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${dragActive ? "dark:bg-primary-900/20 border-primary-400 bg-primary-50" : "border-neutral-300 dark:border-neutral-600"}
        ${currentFile ? "dark:bg-primary-900/20 border-primary-400 bg-primary-50" : ""}
        dark:bg-neutral-800/50 bg-neutral-50
        ${className}
      `,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            id: `${dropzoneId}-input`,
            className: "sr-only",
            accept,
            disabled,
            "aria-describedby": `${dropzoneId}-hint`,
            onChange: handleInputChange,
            "aria-label": "Seleccionar archivo CSV o XLSX"
          }
        ),
        /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: `${dropzoneId}-input`,
            className: "inline-flex cursor-pointer flex-col items-center gap-4",
            "aria-label": "Arrastra y suelta un archivo aquí o haz clic para seleccionar",
            children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "size-12 text-neutral-400 dark:text-neutral-500",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 1.5,
                      d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-neutral-900 dark:text-neutral-100", children: "Arrastra y suelta un archivo aquí" }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", id: `${dropzoneId}-hint`, children: [
                  "o haz clic para seleccionar ",
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: ".csv, .xlsx" })
                ] })
              ] })
            ]
          }
        ),
        currentFile && /* @__PURE__ */ jsx("div", { id: `${dropzoneId}-selected`, className: "mt-4", "aria-live": "polite", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-6 text-primary-600 dark:text-primary-400",
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
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-neutral-900 dark:text-neutral-100", children: currentFile.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: formatSize(currentFile.size) })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              id: `${dropzoneId}-remove`,
              className: "rounded p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:text-neutral-300",
              "aria-label": "Eliminar archivo seleccionado",
              onClick: handleRemoveClick,
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
        ] }) }),
        error && /* @__PURE__ */ jsx(
          "div",
          {
            id: `${dropzoneId}-error`,
            className: "dark:bg-error-900/20 mt-3 rounded-lg border border-error-400 bg-error-50 p-3 text-sm text-error-600 dark:border-error-700 dark:text-error-400",
            role: "alert",
            "aria-live": "assertive",
            children: error
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        #${dropzoneId}:focus-visible {
          outline: 2px solid var(--color-primary-500);
          outline-offset: 2px;
        }

        @media (forced-colors: active) {
          #${dropzoneId} {
            forced-color-adjust: none;
            border-color: CanvasText;
            background-color: Canvas;
          }
          #${dropzoneId}:hover {
            border-color: Highlight;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #${dropzoneId} {
            transition: none;
          }
        }
      ` })
      ]
    }
  );
};

export { FileDropzone as F };
