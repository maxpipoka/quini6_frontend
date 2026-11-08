;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d9443136-999d-4fc8-9d82-b1d738873b75",e._sentryDebugIdIdentifier="sentry-dbid-d9443136-999d-4fc8-9d82-b1d738873b75")}catch(e){}}();import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { P as Progress } from './Progress_D9U1KJsY.mjs';
import { c as CheckIcon, E as ErrorIcon, S as SpinnerIcon } from './icons_CBEl8IKQ.mjs';
import './_sentry-release-injection-file_BwnRfS4D.mjs';

const ImportProgress = ({
  importId,
  stage,
  progress,
  onComplete,
  onError,
  pollInterval = 2e3
}) => {
  const [currentStage, setCurrentStage] = useState(stage);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [_isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);
  const pollTimerRef = useRef(null);
  const progressRef = useRef({ currentStage, currentProgress });
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  progressRef.current = { currentStage, currentProgress };
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;
  const stageLabels = {
    processing: "Procesando archivo...",
    committing: "Guardando sorteos...",
    completed: "Completado"
  };
  const pollStatus = () => {
    try {
      setCurrentProgress((previous) => Math.min(100, previous + 10));
    } catch (err) {
      const error2 = err instanceof Error ? err : new Error("Error al consultar progreso");
      setError(error2);
      setCurrentStage("processing");
      onErrorRef.current?.(error2);
    }
  };
  const startPolling = () => {
    if (pollInterval <= 0) return;
    setIsPolling(true);
    pollTimerRef.current = window.setInterval(pollStatus, pollInterval);
  };
  const stopPolling = () => {
    setIsPolling(false);
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };
  useEffect(() => {
    if (currentProgress < 100) return;
    setCurrentStage("completed");
    stopPolling();
    onCompleteRef.current?.(true);
  }, [currentProgress]);
  useEffect(() => {
    if (stage === "completed") {
      stopPolling();
      onCompleteRef.current?.(true);
    } else if (stage === "processing" || stage === "committing") {
      startPolling();
    }
  }, [stage]);
  useEffect(() => {
    return () => stopPolling();
  }, []);
  const isCompleted = currentStage === "completed";
  const isError = !!error;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      isCompleted ? /* @__PURE__ */ jsx(CheckIcon, { className: "size-6 text-success-600 dark:text-success-400", "aria-hidden": true }) : isError ? /* @__PURE__ */ jsx(ErrorIcon, { className: "size-6 text-error-600 dark:text-error-400", "aria-hidden": true }) : /* @__PURE__ */ jsx(
        SpinnerIcon,
        {
          className: "size-6 text-primary-600 dark:text-primary-400",
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-neutral-900 dark:text-neutral-100", children: isCompleted ? "Importación completada" : isError ? "Error en la importación" : stageLabels[currentStage] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: [
          "ID: ",
          /* @__PURE__ */ jsxs("code", { className: "font-mono", children: [
            importId.slice(0, 8),
            "..."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Progress,
      {
        value: isCompleted ? 100 : currentProgress,
        stage: currentStage,
        label: isCompleted ? "" : `${currentProgress}%`,
        showPercentage: !isCompleted
      }
    ),
    isError && /* @__PURE__ */ jsx("div", { className: "text-sm text-error-600 dark:text-error-400", role: "alert", children: error?.message || "Error desconocido" })
  ] });
};

export { ImportProgress as I };
