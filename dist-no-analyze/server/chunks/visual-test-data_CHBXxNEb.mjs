;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ff2cbff2-2835-4af6-8496-110f892cae64",e._sentryDebugIdIdentifier="sentry-dbid-ff2cbff2-2835-4af6-8496-110f892cae64")}catch(e){}}();import './_sentry-release-injection-file_BwnRfS4D.mjs';

const sampleImportRows = [
  {
    rowNumber: 1,
    date: "2024-01-15",
    modality: "Tradicional",
    tradicional: [5, 12, 23, 34, 41, 45],
    laSegunda: null,
    revancha: null,
    siempreSale: null,
    reintegro: 7,
    isValid: true,
    errors: []
  },
  {
    rowNumber: 2,
    date: "2024-01-22",
    modality: "La Segunda",
    tradicional: null,
    laSegunda: [4, 11, 18, 25, 32, 39],
    revancha: null,
    siempreSale: null,
    reintegro: 4,
    isValid: true,
    errors: []
  },
  {
    rowNumber: 3,
    date: "2024-01-29",
    modality: "Revancha",
    tradicional: null,
    laSegunda: null,
    revancha: [7, 14, 21, 28, 35, 42],
    siempreSale: null,
    reintegro: 2,
    isValid: true,
    errors: []
  },
  {
    rowNumber: 4,
    date: "2024-02-05",
    modality: "Tradicional",
    tradicional: [8, 14, 27, 30, 36, 43],
    laSegunda: null,
    revancha: null,
    siempreSale: null,
    reintegro: 6,
    isValid: false,
    errors: [
      { rowNumber: 4, field: "date", message: "Duplicate draw date", rawValue: "2024-02-05" }
    ]
  },
  {
    rowNumber: 5,
    date: "2024-02-12",
    modality: "Siempre Sale",
    tradicional: null,
    laSegunda: null,
    revancha: null,
    siempreSale: [6, 13, 20, 27, 34, 41],
    reintegro: 8,
    isValid: true,
    errors: []
  }
];
[
  ...sampleImportRows,
  {
    rowNumber: 6,
    date: "2024-02-19",
    modality: "Tradicional",
    tradicional: [6, 13, 26, 35, 37, 47],
    laSegunda: null,
    revancha: null,
    siempreSale: null,
    reintegro: 1,
    isValid: true,
    errors: []
  },
  {
    rowNumber: 7,
    date: "2024-02-26",
    modality: "La Segunda",
    tradicional: null,
    laSegunda: [3, 10, 17, 24, 31, 38],
    revancha: null,
    siempreSale: null,
    reintegro: 3,
    isValid: true,
    errors: []
  }
];
const sampleProps = {
  FileDropzone: {
    default: { accept: ".csv,.xlsx", maxSize: 1048576 },
    hover: { accept: ".csv,.xlsx", maxSize: 1048576 },
    focus: { accept: ".csv,.xlsx", maxSize: 1048576 },
    error: { accept: ".csv,.xlsx", maxSize: 1048576 },
    loading: { accept: ".csv,.xlsx", maxSize: 1048576 },
    disabled: { accept: ".csv,.xlsx", maxSize: 1048576, disabled: true }
  },
  ImportPreviewTable: {
    default: { rows: sampleImportRows },
    empty: { rows: [] },
    error: { rows: sampleImportRows },
    // row with error is in sampleImportRows[3]
    loading: { rows: [] }
  },
  ImportProgress: {
    default: {
      importId: "11111111-1111-4111-8111-111111111111",
      stage: "processing",
      progress: 0,
      pollInterval: 0
    },
    inProgress: {
      importId: "22222222-2222-4222-8222-222222222222",
      stage: "processing",
      progress: 45,
      pollInterval: 0
    },
    success: {
      importId: "33333333-3333-4333-8333-333333333333",
      stage: "completed",
      progress: 100,
      pollInterval: 0
    },
    error: {
      importId: "44444444-4444-4444-8444-444444444444",
      stage: "processing",
      progress: 67,
      pollInterval: 0
    }
  },
  Progress: {
    default: { value: 0, stage: "processing", id: "progress-visual-default" },
    partial: { value: 50, stage: "processing", id: "progress-visual-partial" },
    complete: { value: 100, stage: "completed", id: "progress-visual-complete" },
    indeterminate: {
      value: void 0,
      stage: "processing",
      id: "progress-visual-indeterminate"
    },
    error: { value: 30, stage: "error", id: "progress-visual-error" }
  }
};

export { sampleProps as s };
