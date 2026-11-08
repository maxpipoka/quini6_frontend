;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f6ee2be3-41f8-4014-a451-d00207314f03",e._sentryDebugIdIdentifier="sentry-dbid-f6ee2be3-41f8-4014-a451-d00207314f03")}catch(e){}}();import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useCallback, useReducer, useEffect } from 'react';
import { Check, AlertCircle, X, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';
import './_sentry-release-injection-file_BwnRfS4D.mjs';
import { M as MODALITY_ORDER, a as MODALITY_LABELS, U as UpdateDrawSchema, C as CreateDrawSchema } from './schemas_BWmv8V5v.mjs';

function NumberInputField({
  value,
  onChange,
  min = 0,
  max = 45,
  placeholder,
  disabled = false,
  error = false,
  ariaLabel,
  ariaDescribedBy
}) {
  const [localValue, setLocalValue] = useState(value === null ? "" : value.toString());
  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      if (!/^\d*$/.test(newValue)) return;
      if (newValue.length > 2) return;
      setLocalValue(newValue);
      if (newValue === "") {
        onChange(null);
      } else {
        const num = parseInt(newValue, 10);
        if (!isNaN(num) && num >= min && num <= max) {
          onChange(num);
        }
      }
    },
    [min, max, onChange]
  );
  const handleBlur = useCallback(() => {
    if (localValue === "") {
      onChange(null);
    }
  }, [localValue, onChange]);
  return /* @__PURE__ */ jsx(
    "input",
    {
      type: "number",
      inputMode: "numeric",
      value: localValue,
      onChange: handleChange,
      onBlur: handleBlur,
      min,
      max,
      placeholder,
      disabled,
      maxLength: 2,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": error,
      className: `
        w-full rounded-lg border bg-surface px-4 py-2.5 text-center text-text-primary
        placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${error ? "border-error-500 focus:ring-error-500" : "border-border focus:ring-primary-500"}
      `
    }
  );
}

const initialStepState = {
  modality: "TRADICIONAL",
  numbers: [null, null, null, null, null, null],
  errors: [],
  isValid: false
};
function validateStep(numbers) {
  const filled = numbers.filter((n) => n !== null);
  const errors = [];
  if (filled.length !== 6) {
    errors.push("Debe seleccionar exactamente 6 números");
  } else {
    const unique = new Set(filled);
    if (unique.size !== 6) {
      errors.push("Los números no pueden repetirse");
    }
    const outOfRange = filled.some((n) => n < 0 || n > 45);
    if (outOfRange) {
      errors.push("Los números deben estar entre 0 y 45");
    }
  }
  return { isValid: errors.length === 0, errors };
}
function reducer(state, action) {
  switch (action.type) {
    case "SET_NUMBER": {
      const newSteps = [...state.steps];
      const step = newSteps[action.step];
      if (!step) return state;
      const newNumbers = [...step.numbers];
      newNumbers[action.index] = action.value;
      const { isValid, errors } = validateStep(newNumbers);
      newSteps[action.step] = {
        ...step,
        numbers: newNumbers,
        isValid,
        errors
      };
      return { ...state, steps: newSteps };
    }
    case "SET_OFFICIAL_NUMBER": {
      const num = parseInt(action.value, 10);
      const officialNumberError = action.value && (isNaN(num) || num <= 0) ? "El número oficial debe ser positivo" : "";
      return { ...state, officialNumber: action.value, officialNumberError };
    }
    case "SET_DRAW_DATE": {
      const drawDateError = action.value && isNaN(Date.parse(action.value)) ? "Fecha inválida" : "";
      return { ...state, drawDate: action.value, drawDateError };
    }
    case "NEXT_STEP": {
      const currentStep = state.steps[state.currentStep];
      if (state.currentStep < 3 && currentStep?.isValid) {
        return { ...state, currentStep: state.currentStep + 1 };
      }
      return state;
    }
    case "PREV_STEP": {
      if (state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;
    }
    case "GO_TO_STEP": {
      if (action.step >= 0 && action.step <= 3) {
        return { ...state, currentStep: action.step };
      }
      return state;
    }
    case "SET_SUBMIT_ERROR": {
      return { ...state, submitError: action.error };
    }
    case "RESET": {
      const steps = MODALITY_ORDER.map((modality) => {
        const existingResult = action.initialData?.results?.find((r) => r.modality === modality);
        const numbers = existingResult ? existingResult.numbers.map((n) => n ?? null) : [null, null, null, null, null, null];
        const { isValid, errors } = validateStep(numbers);
        return {
          ...initialStepState,
          modality,
          numbers,
          isValid,
          errors
        };
      });
      return {
        currentStep: 0,
        steps,
        officialNumber: action.initialData?.officialNumber?.toString() ?? "",
        drawDate: action.initialData?.drawDate ?? "",
        officialNumberError: "",
        drawDateError: "",
        submitError: null
      };
    }
    default:
      return state;
  }
}
function getInitialState(initialData) {
  const steps = MODALITY_ORDER.map((modality) => {
    const existingResult = initialData?.results?.find((r) => r.modality === modality);
    const numbers = existingResult ? existingResult.numbers.map((n) => n ?? null) : [null, null, null, null, null, null];
    const { isValid, errors } = validateStep(numbers);
    return {
      ...initialStepState,
      modality,
      numbers,
      isValid,
      errors
    };
  });
  return {
    currentStep: 0,
    steps,
    officialNumber: initialData?.officialNumber?.toString() ?? "",
    drawDate: initialData?.drawDate ?? "",
    officialNumberError: "",
    drawDateError: "",
    submitError: null
  };
}
function DrawFormWizard({
  initialData,
  isEditing = false,
  drawId,
  onSubmit,
  onCancel,
  isLoading = false
}) {
  const [state, dispatch] = useReducer(reducer, initialData, getInitialState);
  useEffect(() => {
    if (isEditing && drawId && !initialData) {
      fetch(`/api/admin/draws/${drawId}`, { credentials: "include" }).then(async (res) => {
        if (!res.ok) return null;
        const json = await res.json();
        const isValidData = json !== null && typeof json === "object" && "officialNumber" in json && typeof json.officialNumber === "number" && "drawDate" in json && typeof json.drawDate === "string" && "results" in json && Array.isArray(json.results);
        return isValidData ? json : null;
      }).then((data) => {
        if (data) {
          const typedData = data;
          const results = typedData.results.map((r) => ({
            modality: r.modality,
            numbers: r.numbers.filter((n) => n !== null)
          }));
          dispatch({
            type: "RESET",
            initialData: {
              officialNumber: typedData.officialNumber,
              drawDate: typedData.drawDate,
              results
            }
          });
        }
      }).catch((err) => console.error("Failed to fetch draw data:", err));
    }
  }, [isEditing, drawId, initialData]);
  const currentStepData = state.steps[state.currentStep] ?? initialStepState;
  const isLastStep = state.currentStep === 3;
  const isFirstStep = state.currentStep === 0;
  const canGoNext = currentStepData.isValid;
  const allStepsValid = state.steps.every((s) => s.isValid);
  const hasOfficialNumber = state.officialNumber.trim() !== "";
  const hasDrawDate = state.drawDate.trim() !== "";
  const canSubmit = allStepsValid && hasOfficialNumber && hasDrawDate && !state.officialNumberError && !state.drawDateError;
  const handleNumberChange = (index, value) => {
    dispatch({ type: "SET_NUMBER", step: state.currentStep, index, value });
  };
  const handleOfficialNumberChange = (e) => {
    dispatch({ type: "SET_OFFICIAL_NUMBER", value: e.target.value });
  };
  const handleDrawDateChange = (e) => {
    dispatch({ type: "SET_DRAW_DATE", value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;
    dispatch({ type: "SET_SUBMIT_ERROR", error: null });
    const results = state.steps.map((step) => ({
      modality: step.modality,
      numbers: step.numbers.filter((n) => n !== null)
    }));
    const payload = {
      officialNumber: parseInt(state.officialNumber, 10),
      drawDate: state.drawDate,
      results
    };
    const schema = isEditing ? UpdateDrawSchema : CreateDrawSchema;
    const result = schema.safeParse(payload);
    if (!result.success) {
      dispatch({
        type: "SET_SUBMIT_ERROR",
        error: result.error.errors.map((e2) => e2.message).join(", ")
      });
      return;
    }
    onSubmit(payload).catch((error) => {
      dispatch({
        type: "SET_SUBMIT_ERROR",
        error: error instanceof Error ? error.message : "Error al guardar el sorteo"
      });
    });
  };
  const stepIndicators = MODALITY_ORDER.map((modality, index) => {
    const step = state.steps[index];
    const isComplete = step?.isValid ?? false;
    const isCurrent = index === state.currentStep;
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${isComplete ? "bg-primary-500 text-white" : isCurrent ? "bg-primary-500/20 border-2 border-primary-500 text-primary-500" : "border-2 border-border bg-surface text-text-muted"}`,
          children: isComplete ? /* @__PURE__ */ jsx(Check, { className: "size-5", "aria-hidden": "true" }) : index + 1
        }
      ),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `mt-1 text-center text-xs font-medium ${isCurrent ? "text-primary-500" : "text-text-muted"}`,
          children: MODALITY_LABELS[modality]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `mt-1 h-1 w-20 transition-colors ${index < 3 ? step?.isValid ? "bg-primary-500" : "bg-border" : ""}`
        }
      )
    ] }, modality);
  });
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", noValidate: true, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "mb-4 flex flex-col items-center gap-2",
        role: "progressbar",
        "aria-valuenow": state.currentStep + 1,
        "aria-valuemin": 1,
        "aria-valuemax": 4,
        "aria-label": "Progreso del asistente",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: stepIndicators }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-secondary", children: [
            "Paso ",
            state.currentStep + 1,
            " de 4: ",
            MODALITY_LABELS[currentStepData.modality]
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "official-number",
            className: "mb-1 block text-sm font-medium text-text-secondary",
            children: "Número Oficial *"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            id: "official-number",
            value: state.officialNumber,
            onChange: handleOfficialNumberChange,
            min: "1",
            required: true,
            disabled: isLoading,
            className: `w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 ${state.officialNumberError ? "border-error-500 focus:ring-error-500" : ""}`,
            "aria-invalid": !!state.officialNumberError,
            "aria-describedby": state.officialNumberError ? "official-number-error" : void 0
          }
        ),
        state.officialNumberError && /* @__PURE__ */ jsx("p", { id: "official-number-error", className: "mt-1 text-sm text-error-500", role: "alert", children: state.officialNumberError })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "draw-date", className: "mb-1 block text-sm font-medium text-text-secondary", children: "Fecha del Sorteo *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "datetime-local",
            id: "draw-date",
            value: state.drawDate,
            onChange: handleDrawDateChange,
            required: true,
            disabled: isLoading,
            className: `w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 ${state.drawDateError ? "border-error-500 focus:ring-error-500" : ""}`,
            "aria-invalid": !!state.drawDateError,
            "aria-describedby": state.drawDateError ? "draw-date-error" : void 0
          }
        ),
        state.drawDateError && /* @__PURE__ */ jsx("p", { id: "draw-date-error", className: "mt-1 text-sm text-error-500", role: "alert", children: state.drawDateError })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("legend", { className: "text-sm font-medium text-text-secondary", children: [
          MODALITY_LABELS[currentStepData.modality],
          " - 6 números (0-45, sin repetir)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: currentStepData.numbers.map((number, index) => /* @__PURE__ */ jsx(
          NumberInputField,
          {
            value: number,
            onChange: (value) => handleNumberChange(index, value),
            min: 0,
            max: 45,
            placeholder: `${index + 1}`,
            disabled: isLoading,
            error: currentStepData.errors.length > 0,
            ariaLabel: `Número ${index + 1} de ${MODALITY_LABELS[currentStepData.modality]}`,
            ariaDescribedBy: currentStepData.errors.length > 0 ? `${currentStepData.modality}-errors` : void 0
          },
          index
        )) }),
        currentStepData.errors.length > 0 && /* @__PURE__ */ jsx(
          "p",
          {
            id: `${currentStepData.modality}-errors`,
            className: "text-sm text-error-500",
            role: "alert",
            children: currentStepData.errors.join(". ")
          }
        )
      ] }) })
    ] }),
    state.submitError && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-error-500/10 border-error-500/20 flex items-center gap-2 rounded-lg border p-3 text-error-500",
        role: "alert",
        children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "size-5 flex-shrink-0", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: state.submitError })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border pt-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: isLoading,
          className: "flex items-center gap-2 rounded-lg px-4 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(X, { className: "size-4", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { children: "Cancelar" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        !isFirstStep && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => dispatch({ type: "PREV_STEP" }),
            disabled: isLoading,
            className: "flex items-center gap-2 rounded-lg px-4 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: "Anterior" })
            ]
          }
        ),
        isLastStep ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: !canSubmit || isLoading,
            className: "hover:bg-primary-500/90 flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50",
            children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: "Guardando..." })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { children: isEditing ? "Actualizar" : "Crear" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "size-4", "aria-hidden": "true" })
            ] })
          }
        ) : /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => dispatch({ type: "NEXT_STEP" }),
            disabled: !canGoNext || isLoading,
            className: "hover:bg-primary-500/90 flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsx("span", { children: "Siguiente" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "size-4", "aria-hidden": "true" })
            ]
          }
        )
      ] })
    ] })
  ] });
}

export { DrawFormWizard as D };
