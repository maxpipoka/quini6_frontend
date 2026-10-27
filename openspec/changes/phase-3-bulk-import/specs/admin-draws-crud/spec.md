# Admin Draws CRUD - Delta Specification (Phase 3 Bulk Import)

## Purpose

This delta specification defines modifications to the existing admin-draws-crud capability to integrate bulk import functionality. Based on the Phase 2 design, the draws list page exists at `src/pages/admin/draws/index.astro` with a toolbar.

## Existing Requirements (from Phase 2)

The following requirements exist from Phase 2 and are **UNCHANGED**:
- Draw list with pagination, filters, and create button
- Create draw modal wizard (4 modalities × 6 numbers)
- Edit draw modal with pre-filled data
- Delete draw with confirmation
- All mutations show toast with requestId

---

## ADDED Sections

### Requirement: Import Draws Button in Toolbar

The system SHALL add an "Import Draws" button to the draws list toolbar that navigates to the bulk import upload page.

#### Scenario: Import Draws button appears in toolbar

- GIVEN the admin draws list page (`/admin/draws`)
- WHEN the page renders
- THEN a button labeled "Import Draws" appears in the toolbar next to "Create Draw"
- AND the button uses secondary styling (outline variant)
- AND the button has an upload icon

#### Scenario: Import Draws button navigates to upload page

- GIVEN the draws list page with Import Draws button
- WHEN the user clicks "Import Draws"
- THEN the browser navigates to `/admin/imports/upload`
- AND the upload page loads with file dropzone

### Requirement: Draws List Refresh After Successful Import

The system SHALL refresh the draws list automatically after a successful bulk import commit.

#### Scenario: Draws list refetches after import commit

- GIVEN user is on draws list page
- WHEN user navigates to import upload, completes import successfully, and returns
- THEN the draws table automatically refetches data
- AND new/updated draws appear in the list
- AND any active filters are preserved

#### Scenario: Programmatic refresh from import page

- GIVEN import commit succeeds on upload page
- WHEN the success toast displays
- THEN a custom event `draws:refresh` is dispatched
- AND the draws list page (if open in another tab) receives event and refetches

---

## MODIFIED Sections

### Requirement: Toolbar Layout (MODIFIED)

**Original (Phase 2):**
- Toolbar contains: "Create Draw" button (primary), filter controls

**Modified (Phase 3):**
- Toolbar contains: "Create Draw" button (primary), "Import Draws" button (secondary), filter controls
- Buttons are grouped with a small gap

---

## REMOVED Sections

None - no existing functionality removed.

---

## Integration Notes

### Navigation Flow
```
/admin/draws (list) --[Import Draws]--> /admin/imports/upload --[commit success]--> /admin/draws (refreshed)
```

### Event-Based Refresh
The import page dispatches a `draws:refresh` custom event on successful commit. The draws list page listens for this event (if same tab) or refetches on focus/visibility change.

### Toolbar Implementation
```tsx
// In DrawTableFilters.tsx or new Toolbar component
<div className="flex items-center gap-3">
  <Button variant="primary" onClick={openCreateModal}>Create Draw</Button>
  <Button variant="secondary" onClick={() => navigate('/admin/imports/upload')}>
    <UploadIcon className="w-4 h-4 mr-2" />
    Import Draws
  </Button>
  {/* existing filter controls */}
</div>
```