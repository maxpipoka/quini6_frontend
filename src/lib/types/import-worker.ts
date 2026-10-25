/**
 * TypeScript types for import parser Web Worker communication
 * Shared between main thread and worker
 */

// Input sent to worker
export interface ImportParserInput {
  file: ArrayBuffer;
  fileName: string;
  mimeType: string;
}

// Output message types from worker
export interface ImportParserProgress {
  type: 'PROGRESS';
  parsed: number;
  total: number;
}

export interface ImportParserResult {
  type: 'RESULT';
  rows: ImportDrawRowInput[];
  parseErrors: ImportParseError[];
}

export interface ImportParserError {
  type: 'ERROR';
  message: string;
}

export type ImportParserOutput = ImportParserProgress | ImportParserResult | ImportParserError;

// Parsed draw row (matches DrawRowInputSchema from schemas.ts)
export interface ImportDrawRowInput {
  officialNumber: number;
  drawDate: string; // ISO datetime string
  results: {
    modality: 'TRADICIONAL' | 'LA_SEGUNDA' | 'REVANCHA' | 'SIEMPRE_SALE';
    numbers: number[];
  }[];
}

// Parse error detail
export interface ImportParseError {
  row: number;
  field?: string;
  message: string;
  rawValue?: unknown;
}

// Worker registration helper for TypeScript
// Usage: const worker = new Worker(new URL('./importParser.ts', import.meta.url), { type: 'module' });
// worker.onmessage = (e: MessageEvent<ImportParserOutput>) => { ... };

export type ImportWorker = Worker & {
  onmessage: ((this: Worker, e: MessageEvent<ImportParserOutput>) => void) | null;
  onerror: ((this: Worker, e: ErrorEvent) => void) | null;
};

// Helper to create typed worker
export function createImportParserWorker(): ImportWorker {
  // In Astro/Vite, use:
  // return new Worker(new URL('./importParser.ts', import.meta.url), { type: 'module' }) as ImportWorker;
  
  // For testing, we'll use a mock - actual instantiation happens in components
  return new Worker('') as ImportWorker;
}

// Message posting helper
export function postToWorker(worker: Worker, input: ImportParserInput): void {
  worker.postMessage(input);
}