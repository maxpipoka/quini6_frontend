# Manual Accessibility Verification Checklist

**Project:** Quini6 Frontend - Admin Import Components
**Date:** October 2026
**Standard:** WCAG 2.1 AA

---

## 1. Keyboard Tab Order (9 Steps)

Navigate through the complete admin import flow using only keyboard (Tab/Shift+Tab):

| Step | Expected Focus Target | Verified |
|------|----------------------|----------|
| 1 | File input (via label click) | ☐ |
| 2 | FileDropzone drag area | ☐ |
| 3 | "Iniciar importación" button | ☐ |
| 4 | Preview table first row expand button | ☐ |
| 5 | Preview table first row cells | ☐ |
| 6 | Progress bar / status region | ☐ |
| 7 | Cancel button (if visible) | ☐ |
| 8 | History link/tab | ☐ |
| 9 | Pagination controls (prev/next) | ☐ |

**Pass Criteria:** All interactive elements reachable in logical order, no trap focus.

---

## 2. Focus Indicator Verification

For each focused element, verify CSS focus styles:

| Requirement | Expected Value | Verified |
|-------------|----------------|----------|
| Outline width | 3px | ☐ |
| Outline style | solid | ☐ |
| Outline color | #005fcc (or equivalent blue) | ☐ |
| Outline offset | 2px | ☐ |
| Visible on all interactive elements | Yes | ☐ |

**Test Method:** Tab through each element, inspect with DevTools Computed styles.

---

## 3. Screen Reader Announcements (6 Dynamic Updates)

Test with NVDA (Windows) or VoiceOver (Mac):

| # | Trigger | Expected Announcement | Verified |
|---|---------|----------------------|----------|
| 1 | File selected in FileDropzone | "Archivo seleccionado: sample-draws.csv" | ☐ |
| 2 | File validation error | "Error: El archivo debe ser CSV" | ☐ |
| 3 | "Iniciar importación" clicked | "Importación iniciada" | ☐ |
| 4 | Progress updates | "Progreso: X de Y registros procesados" | ☐ |
| 5 | Import complete | "Importación completada con éxito" | ☐ |
| 6 | Import error | "Error en importación: [detalle]" | ☐ |
| 7 | History table updated | "Historial actualizado, X importaciones" | ☐ |

**Pass Criteria:** All announcements spoken via aria-live regions, no missing updates.

---

## 4. Color Contrast (≥4.5:1 text, ≥3:1 UI)

Verify using axe DevTools or Colour Contrast Analyser:

| Component | Element | Foreground | Background | Ratio | Pass |
|-----------|---------|------------|------------|-------|------|
| FileDropzone | Label text | #1f2937 | #ffffff | ≥4.5:1 | ☐ |
| FileDropzone | Border | #d1d5db | #ffffff | ≥3:1 | ☐ |
| ImportPreviewTable | Header text | #1f2937 | #f9fafb | ≥4.5:1 | ☐ |
| ImportPreviewTable | Row text | #374151 | #ffffff | ≥4.5:1 | ☐ |
| ImportProgress | Status text | #1f2937 | #ffffff | ≥4.5:1 | ☐ |
| ImportProgress | Progress bar | #005fcc | #e5e7eb | ≥3:1 | ☐ |
| ImportHistoryTable | Header text | #1f2937 | #f9fafb | ≥4.5:1 | ☐ |
| ImportHistoryTable | Pagination | #005fcc | #ffffff | ≥3:1 | ☐ |
| Progress | Bar fill | #005fcc | #e5e7eb | ≥3:1 | ☐ |
| Progress | Label text | #1f2937 | #ffffff | ≥4.5:1 | ☐ |

---

## 5. ARIA & Semantic HTML Verification

### FileDropzone
- [ ] `<input type="file">` has `id` matching `<label for="">`
- [ ] Label text describes purpose ("Seleccionar archivo CSV")
- [ ] Container does NOT have `role="button"` (fixed in PR 2)
- [ ] `aria-describedby` points to helper text
- [ ] Error state has `aria-invalid="true"` + `aria-describedby` error message

### ImportPreviewTable
- [ ] `<table>` with `<thead>`, `<tbody>`
- [ ] `<th scope="col">` for all columns (including "Acciones" - fixed in PR 2)
- [ ] Expand buttons have `aria-expanded` + `aria-controls`
- [ ] Row data in `<td>` with proper headers association
- [ ] Empty state: `<tbody>` with single `<td colspan="">` + descriptive text

### ImportProgress
- [ ] Container has `role="status"` + `aria-live="polite"`
- [ ] Progress bar has `role="progressbar"` + `aria-valuenow` + `aria-valuemin` + `aria-valuemax`
- [ ] Status text updates announced via aria-live
- [ ] Cancel button has `aria-label="Cancelar importación"`

### ImportHistoryTable
- [ ] `<table>` with proper `<thead>`, `<tbody>`
- [ ] `<th scope="col">` for all columns
- [ ] Pagination: `<nav aria-label="Paginación del historial">`
- [ ] Prev/Next buttons: `aria-label="Página anterior/siguiente"`
- [ ] Current page: `aria-current="page"`
- [ ] Empty state: descriptive text in `<td colspan="">`

### Progress (generic component)
- [ ] `<progress>` element OR `<div role="progressbar">` with proper ARIA
- [ ] `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- [ ] Label associated via `aria-labelledby` or `aria-label`
- [ ] Indeterminate state: `aria-valuenow` omitted, `aria-valuetext="Indeterminado"`

---

## 6. Additional Verification

- [ ] No keyboard traps in any component
- [ ] Escape key closes expanded rows / modals
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate within composite widgets (table rows, pagination)
- [ ] Reduced motion respected (animations disabled via `@media (prefers-reduced-motion: reduce)`)
- [ ] High contrast mode works (Windows HC mode / `@media (prefers-contrast: high)`)
- [ ] Zoom to 200% - no content loss or horizontal scrolling
- [ ] Touch target size ≥ 44x44px on mobile

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA/Accessibility | | | |
| Product Owner | | | |

**Notes:**