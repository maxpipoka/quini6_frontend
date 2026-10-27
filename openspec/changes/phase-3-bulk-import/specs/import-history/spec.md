# Import History Specification

## Purpose

This specification defines the import history functionality for viewing past bulk import operations. Users can see a paginated list of imports with summary statistics and expand rows to view detailed error information.

## Requirements

### Requirement: Paginated Import History Table

The system SHALL display a paginated table of past imports with key summary information.

#### Scenario: History table loads with pagination

- GIVEN the user navigates to /admin/imports
- WHEN the page loads
- THEN GET /admin/imports?page=1&limit=10 is called
- AND response validates against ImportHistorySchema
- AND table renders with columns: File Name, Date, Rows Processed, Succeeded, Failed, Policy, Actions

#### Scenario: Pagination controls work

- GIVEN the history table with multiple pages
- WHEN the user clicks page 2
- THEN GET /admin/imports?page=2&limit=10 is called
- AND table updates with new data
- AND URL updates to reflect current page

#### Scenario: Page size selector works

- GIVEN the history table
- WHEN the user changes limit to 25
- THEN GET /admin/imports?page=1&limit=25 is called
- AND table shows 25 rows per page

#### Scenario: Sorting by column works

- GIVEN the history table
- WHEN the user clicks "Date" column header
- THEN GET /admin/imports?page=1&limit=10&sort=date&order=desc is called
- AND table sorts by date descending

### Requirement: Import Summary Statistics

The system SHALL display summary statistics for each import row.

#### Scenario: Row shows correct summary counts

- GIVEN an import with 100 rows processed, 95 succeeded, 5 failed
- WHEN the history row renders
- THEN "Rows Processed" shows 100
- AND "Succeeded" shows 95 with green badge
- AND "Failed" shows 5 with red badge
- AND "Policy" shows the policy used (skip/replace/merge)

#### Scenario: File name links to download (if available)

- GIVEN an import with stored file
- WHEN the file name renders
- THEN it displays as text (download handled by backend if needed)

### Requirement: Expandable Error Details

The system SHALL allow expanding a history row to view detailed error information for failed rows.

#### Scenario: Expand row shows error details

- GIVEN a history row with failed rows
- WHEN the user clicks the expand chevron
- THEN GET /admin/imports/{importId}/errors is called
- AND an expanded section opens below the row
- AND a table shows: Row Number, Field, Error Message, Raw Value

#### Scenario: Error details table is scrollable

- GIVEN an import with many errors
- WHEN the expanded section renders
- THEN horizontal scroll appears if needed
- AND vertical scroll if many errors
- AND headers remain visible

#### Scenario: Collapse row hides error details

- GIVEN an expanded history row
- WHEN the user clicks the collapse chevron
- THEN the error details section closes
- AND no additional API calls made

#### Scenario: Error details empty state

- GIVEN an import with zero failed rows
- WHEN the user expands the row
- THEN the expanded section shows "No errors - all rows imported successfully"

### Requirement: Empty State and Loading States

The system SHALL handle empty history and loading states gracefully.

#### Scenario: Empty history state

- GIVEN no imports exist
- WHEN the history page loads
- THEN a friendly empty state shows: "No imports yet. Import your first CSV/XLSX file."
- AND a button links to /admin/imports/upload

#### Scenario: Loading skeleton during fetch

- GIVEN the history page is loading
- WHEN data is fetching
- THEN skeleton rows display in table
- AND pagination controls are disabled

#### Scenario: Error state on fetch failure

- GIVEN the history API fails
- WHEN the error occurs
- THEN an error toast shows with retry button
- AND table shows error message row

### Requirement: Responsive Design

The system SHALL work on mobile and desktop viewports.

#### Scenario: Mobile table with horizontal scroll

- GIVEN the history table on mobile
- WHEN the table renders
- THEN horizontal scroll wrapper enables
- AND priority columns (Date, Status) remain visible
- AND expand chevron remains accessible

#### Scenario: Expandable details stack on mobile

- GIVEN expanded error details on mobile
- WHEN the section renders
- THEN error table stacks vertically
- AND each error shows as card with field/value pairs

---

## ADDED Sections

All requirements above are ADDED for this new capability.

## MODIFIED Sections

None - this is a new capability.

## REMOVED Sections

None - this is a new capability.