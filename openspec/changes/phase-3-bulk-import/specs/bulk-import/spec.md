# Bulk Import Specification

## Purpose

This specification defines the bulk import functionality for CSV/XLSX draw result files. Users can upload files, preview parsed data with validation, select conflict resolution policy, and commit valid rows to the backend.

## Requirements

### Requirement: File Upload and Parsing

The system SHALL accept CSV and XLSX files via drag-drop or file input, parse them in a web worker, and return structured row data with parse errors.

#### Scenario: User drags and drops a CSV file

- GIVEN the upload page is loaded
- WHEN the user drags a valid CSV file onto the dropzone
- THEN the file is accepted
- AND a web worker parses the CSV using papaparse
- AND parsed rows post back to main thread
- AND parse errors (malformed rows) display inline

#### Scenario: User selects XLSX file via file input

- GIVEN the upload page is loaded
- WHEN the user clicks file input and selects an XLSX file
- THEN the file is accepted
- AND a web worker parses the XLSX using xlsx library
- AND parsed rows post back to main thread
- AND parse errors display inline

#### Scenario: Large file parsing does not block UI

- GIVEN a file with 10,000+ rows
- WHEN parsing starts
- THEN the UI remains responsive
- AND a progress indicator shows parsing status
- AND parsing completes in web worker

#### Scenario: Unsupported file type is rejected

- GIVEN the upload page is loaded
- WHEN the user attempts to upload a .txt file
- THEN the file is rejected
- AND an error toast shows "Only CSV and XLSX files are supported"

### Requirement: Row Validation Against Draw Schema

The system SHALL validate each parsed row against the CreateDrawSchema and classify rows as valid or invalid with specific error messages.

#### Scenario: Valid row passes validation

- GIVEN a parsed row with all required fields (date, modality, 6 numbers, reintegro)
- WHEN validation runs
- THEN the row is marked valid
- AND no error messages display

#### Scenario: Invalid row shows inline errors

- GIVEN a parsed row missing required fields or with invalid numbers
- WHEN validation runs
- THEN the row is marked invalid
- AND specific error badges display per field (e.g., "Number must be 1-46", "Date required")
- AND invalid rows are excluded from commit by default

#### Scenario: User can toggle row inclusion

- GIVEN a preview table with valid and invalid rows
- WHEN the user clicks the checkbox on an invalid row
- THEN the row toggles included/excluded state
- AND commit button updates valid row count

#### Scenario: Validation uses existing CreateDrawSchema

- GIVEN the CreateDrawSchema from src/lib/schemas.ts
- WHEN validating rows
- THEN the same schema rules apply
- AND no duplicate validation logic exists

### Requirement: Preview Table with Inline Errors

The system SHALL display a responsive preview table showing all parsed rows with validation status, inline errors, and row-level actions.

#### Scenario: Preview table renders all rows

- GIVEN parsed and validated rows
- WHEN the preview renders
- THEN each row shows: row number, date, modality, 6 numbers, reintegro, status badge
- AND valid rows show green "Valid" badge
- AND invalid rows show red "Invalid" badge with error count

#### Scenario: Expandable error details per row

- GIVEN an invalid row in preview table
- WHEN the user clicks the expand icon
- THEN a detail row opens showing field-level errors
- AND each error shows field name and message

#### Scenario: Preview table is horizontally scrollable on mobile

- GIVEN the preview table on mobile viewport
- WHEN the table renders
- THEN horizontal scroll wrapper appears
- AND header remains visible during scroll
- AND row checkboxes remain accessible

#### Scenario: Column sorting works

- GIVEN the preview table
- WHEN the user clicks a sortable column header
- THEN rows sort by that column
- AND sort direction toggles on repeat click

### Requirement: Policy Selector for Conflict Resolution

The system SHALL provide a policy selector (Skip/Replace/Merge) that maps to backend onConflict enum and is required before commit.

#### Scenario: Policy selector displays three options

- GIVEN at least one valid row in preview
- WHEN the policy selector renders
- THEN three radio options display: Skip existing, Replace existing, Merge numbers
- AND each has help icon with tooltip explaining behavior

#### Scenario: Policy selector disabled until valid rows exist

- GIVEN zero valid rows in preview
- WHEN the policy selector renders
- THEN all options are disabled
- AND commit button is disabled

#### Scenario: Selected policy maps to backend enum

- GIVEN user selects "Replace existing"
- WHEN commit is initiated
- THEN the request includes onConflict: "replace"
- AND "Skip existing" maps to "skip"
- AND "Merge numbers" maps to "merge"

#### Scenario: Confirm modal before commit

- GIVEN user clicks commit button
- WHEN the confirm modal opens
- THEN modal shows: valid row count, selected policy, warning about irreversible action
- AND user must confirm to proceed

### Requirement: Commit Flow with Progress Feedback

The system SHALL submit the preview to backend preview endpoint, then commit with selected policy, showing progress and result toast.

#### Scenario: Preview submit returns importId

- GIVEN valid rows and selected policy
- WHEN user confirms commit
- THEN POST /admin/imports/preview with validated rows
- AND response returns importId
- AND progress indicator starts

#### Scenario: Commit with policy shows progress

- GIVEN importId from preview
- WHEN POST /admin/imports/{importId}/commit?policy={policy} is called
- THEN progress polling or SSE shows: processing, committing, completed
- AND progress bar updates accordingly

#### Scenario: Success toast shows commit results

- GIVEN commit completes successfully
- WHEN response returns
- THEN success toast shows: "Import completed: X created, Y updated, Z skipped"
- AND draws list page refreshes automatically
- AND user can navigate to history page

#### Scenario: Error toast shows failure details

- GIVEN commit fails
- WHEN error response returns
- THEN error toast shows: "Import failed: {message}"
- AND requestId displays for support
- AND user can retry or view history

#### Scenario: Commit button disabled during commit

- GIVEN commit is in progress
- WHEN commit request is active
- THEN commit button shows loading spinner
- AND button is disabled
- AND policy selector is disabled

### Requirement: Integration with Admin Draws CRUD

The system SHALL add an "Import Draws" button to the draws list toolbar that navigates to upload page, and refresh draws list after successful commit.

#### Scenario: Import Draws button in draws list toolbar

- GIVEN the admin draws list page
- WHEN the page renders
- THEN "Import Draws" button appears in toolbar
- AND button navigates to /admin/imports/upload

#### Scenario: Draws list refreshes after successful import

- GIVEN user completes import commit successfully
- WHEN returning to draws list
- THEN the draws table refetches data
- AND new/updated draws appear in list

---

## ADDED Sections

All requirements above are ADDED for this new capability.

## MODIFIED Sections

None - this is a new capability.

## REMOVED Sections

None - this is a new capability.