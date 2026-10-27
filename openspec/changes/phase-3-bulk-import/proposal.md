# Proposal: Phase 3 - Bulk Import (CSV/XLSX Preview → Commit)

## Intent

Complete the admin panel with bulk import functionality for draw results. Users need to upload CSV/XLSX files, preview parsed data with validation, select a conflict resolution policy (skip/replace/merge), commit valid rows, and view import history. Backend already exposes import endpoints; frontend lacks the full preview→commit flow, history UI, and policy selector.

## Scope

### In Scope
- **3.1 Upload & Preview**: Drag-drop/file input, parse CSV/XLSX, validate rows against Draw schema, show preview table with inline errors, row-level accept/reject
- **3.2 Commit with Policy Selector**: Policy dropdown (skip existing, replace existing, merge numbers), commit button calls backend, show progress + result toast
- **3.3 Import History**: Paginated table of past imports (file name, date, rows processed/succeeded/failed, policy used), expandable error details per import
- Reuse admin layout, auth, api-client, design-system, Zod schemas from Phase 2

### Out of Scope
- Scheduled/automated imports
- Multi-file batch in single commit
- Undo/rollback of committed imports (backend only)
- Template download (separate story)

## Capabilities

### New Capabilities
- `bulk-import`: End-to-end CSV/XLSX upload, preview, validation, policy-based commit, progress feedback
- `import-history`: Paginated list of past imports with expandable error details and summary stats

### Modified Capabilities
- `admin-draws-crud`: Add "Import Draws" button in draws list toolbar; after successful commit, refresh draws list
- `api-client`: Add import endpoints (preview, commit, history) with typed request/response schemas

## Approach

1. **React Islands per Page**: Create interactive islands under `src/pages/admin/imports/`:
   - `index.astro` — history list page (Table + Pagination from design-system)
   - `upload.astro` — upload/preview/commit page (FileDropzone, PreviewTable, PolicySelect islands)
   - Each island uses `client:visible` hydration; shared state via React Context for preview→commit flow

2. **File Parsing**: Use `papaparse` (CSV) + `xlsx` (XLSX) in web worker to avoid blocking main thread; worker posts back parsed rows + parse errors

3. **Validation**: Reuse `CreateDrawSchema` from `src/lib/schemas.ts` row-by-row; collect valid/invalid rows; show inline error badges in preview table

4. **Policy Selector**: Radio group (Skip | Replace | Merge) — maps to backend `onConflict` enum; disabled until ≥1 valid row

5. **Commit Flow**: POST `/admin/imports/preview` → returns `importId`; POST `/admin/imports/{importId}/commit?policy=` → progress poll or SSE; toast result

6. **History**: GET `/admin/imports` with pagination; expand row → GET `/admin/imports/{importId}/errors`

7. **API Client**: Extend `src/lib/api/client.ts` with `importPreview`, `importCommit`, `getImportHistory`, `getImportErrors` methods; all use `credentials: 'include'` + CSRF header

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/admin/imports/` | New | Upload, preview, commit, history pages |
| `src/components/admin/import/` | New | FileDropzone, PreviewTable, PolicySelect, ImportHistoryTable islands |
| `src/lib/api/client.ts` | Modified | Add import endpoints with typed schemas |
| `src/lib/schemas.ts` | Modified | Add ImportPreviewSchema, ImportCommitSchema, ImportHistorySchema |
| `src/lib/auth/` | None | Reuse existing auth context + middleware |
| `src/components/ui/` | None | Consume Table, Button, Modal, Toast, Select, Pagination, Spinner |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Large files (>10k rows) freeze UI | Med | Parse in web worker; chunk preview rendering (virtualized table) |
| CSV/XLSX parsing mismatch with backend | Low | Align column mapping with backend spec; integration test with sample files |
| Policy semantics unclear to users | Med | Inline help icons + tooltip per policy; confirm modal before commit |
| Duplicate draws on retry (no idempotency) | Low | Backend uses importId; frontend disables commit after success |
| CSRF/header issues on multipart upload | Low | Use same api-client hooks; FormData still sends CSRF header |

## Rollback Plan

1. Delete `src/pages/admin/imports/`, `src/components/admin/import/`
2. Revert `src/lib/api/client.ts` import methods
3. Revert `src/lib/schemas.ts` import schemas
4. Remove `papaparse`, `xlsx` from package.json
5. No DB migrations — pure frontend rollback

## Dependencies

- Backend import endpoints implemented (preview, commit, history, errors)
- Phase 2 admin-auth, admin-draws-crud, admin-layout, api-client, design-system complete
- `papaparse`, `xlsx` npm packages
- Web worker support (Vite handles automatically)

## Success Criteria

- [ ] Upload CSV/XLSX → preview table shows parsed rows with validation status
- [ ] Invalid rows show inline errors; user can exclude rows before commit
- [ ] Policy selector (Skip/Replace/Merge) works and maps to backend
- [ ] Commit shows progress, then success/error toast with counts
- [ ] After commit, draws list refreshes automatically
- [ ] History page lists past imports with pagination
- [ ] Expand history row → shows error details for failed rows
- [ ] All TypeScript strict; no console errors; design-system components used correctly
- [ ] Works on mobile (responsive preview table with horizontal scroll)