# Design: Phase 3 Bulk Import

## Technical Approach

Implement bulk import as a new admin page (`/admin/import`) following the existing admin draw management patterns. The feature uses React islands for interactive components (`client:visible` / `client:load`), leverages the existing `ApiClient` methods (`adminImportPreview`, `adminImportCommit`, `adminListImports`), and processes large CSV/XLSX files in a Web Worker to keep the UI responsive. Import progress is polled via the existing import list endpoint with status filtering.

## Architecture Decisions

### Decision: File Parsing in Web Worker

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Main thread parsing | Simple, blocks UI on large files | ❌ Rejected |
| Web Worker (native) | No deps, keeps UI responsive, streaming parse | ✅ Chosen |
| Web Worker (with library e.g., PapaParse) | Easier CSV handling, adds bundle size | Consider if native proves complex |

**Rationale**: Native Web Worker avoids dependencies. CSV parsing via `TextDecoder` + simple split is sufficient for the known format. XLSX requires `sheetjs` — loaded dynamically only when needed.

### Decision: State Management

| Option | Tradeoff | Decision |
|--------|----------|----------|
| React Context + useReducer | Colocated with component, testable | ✅ Chosen for wizard state |
| Global store (Zustand) | Overkill for single-page feature | ❌ Rejected |
| Astro script state (like draws index) | Works but not portable to React islands | ❌ Rejected |

**Rationale**: The import wizard (file → preview → confirm → progress → result) maps naturally to a multi-step React component with `useReducer`. Shares pattern with `DrawFormWizard`.

### Decision: Progress Polling

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Server-Sent Events (SSE) | Real-time, requires backend support | ❌ Rejected (no SSE in API) |
| Short polling (2s interval) | Simple, works with existing `/admin/import` list endpoint | ✅ Chosen |
| WebSocket | Overkill, no backend support | ❌ Rejected |

**Rationale**: Backend exposes `GET /admin/import` with status filter. Polling every 2s after commit gives near-real-time UX without backend changes.

## Data Flow

```
User selects CSV/XLSX file
         │
         ▼
┌─────────────────────────────┐
│  ImportWizard (React)       │
│  - File validation (size,   │
│    type, headers)           │
│  - Dispatch to Web Worker   │
└──────────────┬──────────────┘
               │ postMessage({ file, type })
               ▼
┌─────────────────────────────┐
│  Web Worker                 │
│  - Parse CSV: text → rows   │
│  - Parse XLSX: SheetJS      │
│  - Validate each row        │
│    (officialNumber, date,   │
│     4 modalities × 6 nums)  │
│  - postMessage({            │
│      preview: DrawInput[],  │
│      errors: RowError[],    │
│      duplicates: string[]   │
│    })                       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  ImportWizard Step 2        │
│  - Show preview table       │
│  - Highlight errors/dupes   │
│  - Duplicate policy select  │
│    (SKIP / REPLACE / ABORT) │
└──────────────┬──────────────┘
               │ onConfirm(policy)
               ▼
┌─────────────────────────────┐
│  apiClient.adminImportCommit│
│  POST /admin/import/commit  │
│  { previewId, duplicatePolicy }    │
└──────────────┬──────────────┘
               │ returns importId
               ▼
┌─────────────────────────────┐
│  ImportWizard Step 3        │
│  - Poll GET /admin/import/:id│
│    every 2s                  │
│  - Update progress bar      │
│    (processed/total, status)│
└──────────────┬──────────────┘
               │ status === completed
               ▼
┌─────────────────────────────┐
│  ImportWizard Step 4        │
│  - Show summary:            │
│    created, updated,        │
│    skipped, errors          │
│  - Link to draws list       │
└─────────────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/admin/import.astro` | Create | Main import page with wizard island |
| `src/components/admin/ImportWizard.tsx` | Create | 4-step React island: upload → preview → confirm → progress/result |
| `src/components/admin/ImportPreviewTable.tsx` | Create | Table showing parsed rows with validation status |
| `src/components/admin/ImportProgress.tsx` | Create | Progress bar + status with polling logic |
| `src/workers/importParser.ts` | Create | Web Worker for CSV/XLSX parsing & validation |
| `src/lib/api/client.ts` | Modify | Add `adminImportPreview` uses FormData (already exists), ensure types |
| `src/lib/schemas.ts` | Modify | Add `ImportPreviewSchema`, `ImportResultSchema`, `ImportStatusSchema` |
| `src/components/ui/Progress.astro` | Create | Reusable progress bar component |
| `src/components/ui/FileDropzone.astro` | Create | Drag-and-drop file input with validation |
| `src/mock/handlers.ts` | Modify | Add MSW handlers for `/admin/import/*` endpoints |

## Interfaces / Contracts

```typescript
// src/lib/schemas.ts additions

export const ImportPreviewRowSchema = z.object({
  rowNumber: z.number().int().positive(),
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z.array(z.object({
    modality: ModalityEnum,
    numbers: SixUniqueNumbersSchema,
  })).length(4),
  status: z.enum(['valid', 'duplicate', 'error']),
  errors: z.array(z.string()).optional(),
});

export type ImportPreviewRow = z.infer<typeof ImportPreviewRowSchema>;

export const ImportPreviewSchema = z.object({
  previewId: z.string().uuid(),
  totalRows: z.number().int().nonnegative(),
  validRows: z.number().int().nonnegative(),
  duplicateRows: z.number().int().nonnegative(),
  errorRows: z.number().int().nonnegative(),
  rows: z.array(ImportPreviewRowSchema),
  headers: z.array(z.string()),
});

export type ImportPreview = z.infer<typeof ImportPreviewSchema>;

export const ImportStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'processing', 'completed', 'partial', 'failed']),
  totalRows: z.number().int().nonnegative(),
  processedRows: z.number().int().nonnegative(),
  createdRows: z.number().int().nonnegative(),
  updatedRows: z.number().int().nonnegative(),
  skippedRows: z.number().int().nonnegative(),
  errorRows: z.number().int().nonnegative(),
  errors: z.array(z.object({
    row: z.number().int().positive(),
    message: z.string(),
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type ImportStatus = z.infer<typeof ImportStatusSchema>;

export const ImportResultSchema = z.object({
  importId: z.string().uuid(),
  status: ImportStatusSchema.shape.status,
  summary: z.object({
    total: z.number().int().nonnegative(),
    created: z.number().int().nonnegative(),
    updated: z.number().int().nonnegative(),
    skipped: z.number().int().nonnegative(),
    errors: z.number().int().nonnegative(),
  }),
  details: z.array(z.object({
    officialNumber: z.number().int().positive(),
    action: z.enum(['created', 'updated', 'skipped', 'error']),
    error: z.string().optional(),
  })),
});

export type ImportResult = z.infer<typeof ImportResultSchema>;
```

```typescript
// Web Worker message types (importParser.ts)
type WorkerInput = {
  type: 'PARSE';
  file: ArrayBuffer;
  fileName: string;
  mimeType: string;
};

type WorkerOutput =
  | { type: 'PROGRESS'; parsed: number; total: number }
  | { type: 'RESULT'; preview: ImportPreview }
  | { type: 'ERROR'; message: string };
```

```typescript
// API Contracts (matching backend)

// POST /admin/import/preview
// Request: multipart/form-data with 'file'
// Response: ImportPreview

// POST /admin/import/commit
// Request: { previewId: string, duplicatePolicy: 'SKIP' | 'REPLACE' | 'ABORT' }
// Response: { importId: string }

// GET /admin/import/:id
// Response: ImportStatus

// GET /admin/import?page=1&limit=20&status=completed
// Response: PaginatedImportList (uses ImportListParamsSchema)
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `importParser.ts` Web Worker | Vitest with `worker_threads` mock; test CSV/XLSX parsing, validation logic, error cases |
| Unit | `ImportWizard` reducer | Test step transitions, validation, duplicate policy handling |
| Unit | `ImportPreviewTable` | Render with valid/duplicate/error rows; test sorting, filtering |
| Integration | `ImportWizard` + API client | MSW handlers for preview/commit/poll; test full flow |
| Integration | `adminImportPreview` / `adminImportCommit` | Test FormData construction, Zod validation, error mapping |
| E2E | Full import flow | Playwright: upload CSV → preview → confirm → poll → result; test error cases (bad file, duplicates, abort) |

## Migration / Rollout

- **No database migration required** — feature uses existing import tables
- **Feature flag**: Add `VITE_FEATURE_BULK_IMPORT` env var; hide import nav link and route when disabled
- **Rollout**: Enable flag in staging → verify with QA → enable in production
- **Rollback**: Disable flag; no data cleanup needed (imports are append-only)

## Open Questions

- [ ] Does backend support `multipart/form-data` for preview with 50MB files? (Confirm max body size)
- [ ] Should XLSX parsing use `sheetjs` (adds ~200KB) or require CSV only? (Prefer CSV-only MVP)
- [ ] Duplicate detection: by `officialNumber` only, or `officialNumber + drawDate`? (Need backend spec)
- [ ] Should import history page be separate or a tab on import page? (Lean: separate page `/admin/import/history`)
- [ ] Retry failed imports? (Defer to Phase 4; show errors in result step for now)