# Tasks: Phase 3 Bulk Import

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1200-1800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation) → PR 2 (Core UI) → PR 3 (Integration + History) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Schemas, types, API client, web worker parser | PR 1 | Pure TypeScript/logic; no UI; unit-testable |
| 2 | ImportWizard, PreviewTable, Progress, FileDropzone components | PR 2 | React islands; design-system consumers; visual regression |
| 3 | Pages, routing, draws CRUD integration, history page | PR 3 | End-to-end wiring; cross-tab refresh event; E2E tests |

---

## Phase 1: Foundation (Schemas, Types, API Client, Worker)

- [x] 1.1 Add import-related Zod schemas to `src/lib/schemas.ts`: `ImportPreviewRequestSchema`, `ImportPreviewResponseSchema`, `ImportCommitRequestSchema`, `ImportCommitResponseSchema`, `ImportHistoryParamsSchema`, `ImportSummarySchema`, `ImportHistoryResponseSchema`, `ImportErrorSchema`, `ImportErrorDetailSchema`, `ImportErrorsResponseSchema`, `ImportProgressSchema`, `ImportPolicy` enum
- [x] 1.2 Add TypeScript interfaces to `src/lib/schemas.ts` matching the spec (ImportPreviewRequest, ImportPreviewResponse, ImportCommitRequest, ImportCommitResponse, ImportPolicy, ImportHistoryParams, ImportSummary, ImportHistoryResponse, ImportError, ImportErrorDetail, ImportErrorsResponse, ImportProgressStage, ImportProgress)
- [x] 1.3 Extend `src/lib/api/client.ts` with `importPreview`, `importCommit`, `getImportHistory`, `getImportErrors` methods; add import endpoints to non-retryable list; ensure CSRF header and credentials included
- [x] 1.4 Create `src/workers/importParser.ts` web worker: accept `{ file, type: 'csv'|'xlsx' }`, parse with papaparse/xlsx, postMessage `{ rows: DrawRowInput[], parseErrors: ParseError[] }`, handle large files in chunks
- [x] 1.5 Add worker registration and TypeScript types for worker messages in `src/lib/types/import-worker.ts` (or inline in schemas.ts)
- [x] 1.6 Update `src/mock/handlers.ts` with MSW handlers for `/admin/imports/preview`, `/admin/imports/:id/commit`, `/admin/imports`, `/admin/imports/:id/errors` returning typed mock data matching schemas
- [x] 1.7 Unit tests for schemas: validate valid/invalid request/response shapes in `src/lib/schemas.test.ts`
- [x] 1.8 Unit tests for API client import methods in `src/lib/api/client.test.ts` (mock fetch, verify request shape, response parsing)
- [x] 1.9 Unit tests for importParser worker in `src/workers/importParser.test.ts` (CSV, XLSX, error cases, large file chunking)

---

## Phase 2: Core Implementation (UI Components, Wizard, Parsing)

- [x] 2.1 Create `src/components/ui/FileDropzone.astro` — drag-drop zone with file input fallback, accepts `.csv,.xlsx`, shows file name/size, emits `fileSelected` event with File object
- [x] 2.2 Create `src/components/ui/Progress.astro` — accessible progress bar with stage labels (processing/committing/completed), ARIA live region for screen readers
- [x] 2.3 Create `src/components/admin/ImportPreviewTable.tsx` — native table with: row checkbox, row number, date, modality, 6 numbers, reintegro, status badge (valid/invalid), expandable error detail row, horizontal scroll wrapper, column sorting
- [x] 2.4 Create `src/components/admin/ImportProgress.tsx` — consumes Progress component, displays stage + percentage, calls onComplete callback
- [x] 2.5 Create `src/components/admin/PolicySelect.tsx` — radio group (Skip/Replace/Merge) with help tooltips, disabled until validCount > 0, maps to ImportPolicy enum
- [x] 2.6 Create `src/components/admin/ImportWizard.tsx` — orchestrates flow: FileDropzone → parser worker → validation (CreateDrawSchema) → ImportPreviewTable → PolicySelect → confirm modal → ImportProgress → result toast; React Context for shared state (rows, validRows, policy, importId)
- [x] 2.7 Add validation hook `useImportValidation.ts` — runs CreateDrawSchema per row, returns `{ validRows, invalidRows, rowErrors }`, memoized
- [x] 2.8 Add `useImportCommit.ts` hook — calls importPreview, then importCommit with policy, handles progress callbacks, returns commit result
- [ ] 2.9 Unit tests for ImportPreviewTable (render, sort, expand, checkbox toggle) in `src/components/admin/ImportPreviewTable.test.tsx`
- [ ] 2.10 Unit tests for PolicySelect (disabled state, policy mapping, tooltips) in `src/components/admin/PolicySelect.test.tsx`
- [ ] 2.11 Unit tests for ImportWizard integration (full flow mock) in `src/components/admin/ImportWizard.test.tsx`
- [ ] 2.12 Visual regression tests for FileDropzone, Progress, ImportPreviewTable (Storybook or Playwright)

---

## Phase 3: Integration (Pages, Routing, Event Wiring)

- [ ] 3.1 Create `src/pages/admin/imports/upload.astro` — page layout with admin shell, hydrates ImportWizard island (`client:visible`), imports design-system components
- [ ] 3.2 Create `src/pages/admin/imports/index.astro` — history page with admin shell, hydrates ImportHistoryTable island (`client:visible`)
- [ ] 3.3 Create `src/components/admin/ImportHistoryTable.tsx` — paginated table (File Name, Date, Processed, Succeeded, Failed, Policy, Expand), sorting, page size selector, skeleton loading, empty state with CTA to upload
- [ ] 3.4 Create `src/components/admin/ImportErrorDetails.tsx` — expandable error detail table (Row Number, Field, Message, Raw Value), mobile card stacking, horizontal scroll
- [ ] 3.5 Add `useImportHistory.ts` hook — fetches paginated history with filters, handles loading/error/empty states
- [ ] 3.6 Modify `src/pages/admin/draws/index.astro` — add "Import Draws" button in toolbar (secondary variant, upload icon, navigates to `/admin/imports/upload`)
- [ ] 3.7 Add `draws:refresh` custom event dispatch in ImportWizard on commit success; add listener in draws list page to refetch on event or visibilitychange
- [ ] 3.8 Update routing: ensure `/admin/imports` and `/admin/imports/upload` are protected by admin auth middleware (reuse existing)
- [ ] 3.9 Integration test: upload CSV → preview → commit → verify draws list refresh in `tests/integration/bulk-import-flow.test.ts`
- [ ] 3.10 Integration test: history page pagination, sorting, expand errors in `tests/integration/import-history.test.ts`
- [ ] 3.11 E2E test: full user journey (login → draws list → import draws → upload → commit → history) in `tests/e2e/bulk-import.spec.ts`

---

## Phase 4: Testing (Unit, Integration, E2E)

- [ ] 4.1 Run all unit tests (schemas, api-client, worker, components, hooks) — target 80%+ coverage
- [ ] 4.2 Run integration tests for bulk import flow and history
- [ ] 4.3 Run E2E test suite for critical paths
- [ ] 4.4 Visual regression review for new components (FileDropzone, PreviewTable, HistoryTable, Progress)
- [ ] 4.5 Accessibility audit: keyboard navigation, ARIA labels, color contrast, screen reader announcements for progress
- [ ] 4.6 Performance test: parse 10k-row CSV in worker, verify UI responsiveness, preview table virtualization if needed
- [ ] 4.7 Cross-browser test: Chrome, Firefox, Safari (mobile + desktop)

---

## Phase 5: Cleanup / Documentation

- [ ] 5.1 Update `README.md` or `docs/admin-import.md` with bulk import usage guide
- [ ] 5.2 Add JSDoc comments to new public APIs (hooks, worker, API methods)
- [ ] 5.3 Remove any temporary debug code or console.log statements
- [ ] 5.4 Verify no unused imports in modified files
- [ ] 5.5 Run lint (eslint), format (prettier), type-check (tsc --noEmit) — zero errors
- [ ] 5.6 Update CHANGELOG.md with Phase 3 features
- [ ] 5.7 Verify package.json has `papaparse`, `xlsx` dependencies added