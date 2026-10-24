# Combination Search Specification

## Purpose

This specification defines the exact combination search functionality allowing users to check if their 6-number combination has won in any historical draw. It includes the NumberInput component for number selection, DatePicker for date filtering, and search results display.

## Requirements

### Requirement: NumberInput Component (6-Number Combination)

The system SHALL provide a NumberInput component as a React island allowing users to select exactly 6 unique numbers from 1-46.

#### Scenario: User selects 6 unique numbers

- GIVEN an empty NumberInput
- WHEN user clicks/taps 6 different numbers (1-46)
- THEN all 6 numbers display in the selection area
- AND the submit button enables
- AND the numbers maintain selection order visually

#### Scenario: Duplicate number rejection

- GIVEN user has selected number 23
- WHEN user attempts to select 23 again
- THEN the duplicate is rejected
- AND visual feedback indicates the number is already selected (shake animation or toast)

#### Scenario: Out-of-range rejection

- GIVEN user attempts to enter 0 or 47
- WHEN the input receives the value
- THEN the value is rejected
- AND validation message shows "Números del 1 al 46"

#### Scenario: Number removal works

- GIVEN user has 6 numbers selected
- WHEN user clicks the remove button on number 23
- THEN number 23 is removed from selection
- AND submit button disables (only 5 numbers)
- AND the removed number becomes selectable again

#### Scenario: Quick pick (random) generates valid combination

- GIVEN user clicks "Selección aleatoria" button
- WHEN the button is clicked
- THEN 6 unique random numbers (1-46) generate
- AND any previous selection is replaced
- AND submit button enables

#### Scenario: NumberInput keyboard accessible

- GIVEN user navigates with keyboard
- WHEN tabbing through numbers
- THEN focus indicators are visible
- AND Enter/Space selects/deselects numbers
- AND arrow keys navigate between numbers

### Requirement: DatePicker Component

The system SHALL provide a DatePicker component as a React island for filtering draws by date range.

#### Scenario: Date range selection

- GIVEN user opens DatePicker
- WHEN user selects start date and end date
- THEN both dates display in the input
- AND the range validates (start ≤ end)
- AND calendar highlights the selected range

#### Scenario: Single date selection

- GIVEN user selects only a start date
- WHEN the picker closes
- THEN the single date applies as "from this date forward"
- AND end date defaults to latest draw date

#### Scenario: Preset date ranges

- GIVEN DatePicker opens
- WHEN user clicks "Último año", "Últimos 5 años", "Todo el historial"
- THEN the corresponding date range applies
- AND the picker closes automatically

#### Scenario: DatePicker keyboard navigation

- GIVEN user navigates calendar with keyboard
- WHEN using arrow keys
- THEN focus moves between days correctly
- AND Enter confirms selection
- AND Escape closes picker without changes

### Requirement: Exact Search Execution

The system SHALL execute exact match search against historical draws when user submits a valid combination.

#### Scenario: Exact match found

- GIVEN user submits combination matching a historical draw exactly
- WHEN search executes
- THEN the matching draw displays with: draw number, date, prize category, prize amount
- AND a "¡Ganaste!" badge displays prominently
- AND share button generates URL with the winning combination

#### Scenario: Partial matches display

- GIVEN user submits combination with 5, 4, or 3 matching numbers
- WHEN search executes
- THEN partial matches group by match count (5+1, 5, 4+1, 4, 3+1, 3, 2+1)
- AND each group shows draw number, date, and prize won
- AND groups with no matches don't display

#### Scenario: No matches found

- GIVEN user submits combination with no historical matches
- WHEN search executes
- THEN a friendly "No se encontraron coincidencias" message displays
- AND suggestion to try Búsqueda por Aciertos (future feature) shows

#### Scenario: Search with date filter

- GIVEN user selects date range and submits combination
- WHEN search executes
- THEN results only include draws within the date range
- AND the applied filter displays above results
- AND "Limpiar filtro" link resets the date range

#### Scenario: Search loading state

- GIVEN search is executing
- WHEN waiting for results
- THEN a spinner displays in the results area
- AND the submit button shows loading state
- AND the form is disabled during search

### Requirement: Search Results Shareability

The system SHALL generate shareable URLs that reproduce the exact search.

#### Scenario: Share URL contains all parameters

- GIVEN a completed search with combination and optional date range
- WHEN user clicks "Compartir"
- THEN the generated URL includes: numbers (comma-separated), startDate, endDate
- AND opening the URL in a new browser reproduces the search exactly

#### Scenario: Share URL works without date range

- GIVEN a search without date filter
- WHEN share URL generates
- THEN the URL only includes numbers parameter
- AND opening it runs search across all history
