# Public Pages Specification

## Purpose

This specification defines the six public page routes for the Quini6 Frontend application: Home, Último Sorteo (Latest Draw), Historial (History), Detalle (Draw Detail - SSG), Búsqueda Exacta (Exact Search), and 404 page. All pages must match the Kombai Canvas "Inicio A" design for both desktop and mobile.

## Requirements

### Requirement: Home Page (/)

The system SHALL render a home page with hero section, featured latest draw card, quick stats, and navigation to other sections.

#### Scenario: Home page loads with all sections

- GIVEN the home page route is accessed
- WHEN the page renders
- THEN the hero section displays with headline, subheadline, and CTA button
- AND the latest draw card shows draw number, date, and winning numbers
- AND quick stats show total draws, total prizes awarded, biggest jackpot
- AND navigation cards link to Último Sorteo, Historial, and Búsqueda

#### Scenario: Home page is responsive

- GIVEN the home page viewed on mobile (375px)
- WHEN the page renders
- THEN hero stacks vertically
- AND draw card adapts to single column
- AND stats stack in single column
- AND touch targets meet 44px minimum

### Requirement: Último Sorteo Page (/ultimo-sorteo)

The system SHALL render the latest draw with complete winning numbers, prize breakdown table, and jackpot information.

#### Scenario: Latest draw displays complete data

- GIVEN a latest draw exists in the data source
- WHEN the page renders
- THEN the 6 winning numbers display as NumberBall components
- AND the reintegro number displays separately
- AND the prize table shows all categories with winners and amounts
- AND the jackpot amount displays prominently
- AND the draw date and number are visible

#### Scenario: Page handles missing latest draw

- GIVEN no draws exist in the data source
- WHEN the page renders
- THEN a friendly empty state displays
- AND a CTA directs to Historial page

### Requirement: Historial Page (/historial)

The system SHALL render a paginated, filterable list of all historical draws with draw number, date, and winning numbers preview.

#### Scenario: Historical draws list with pagination

- GIVEN 100+ draws exist in the data source
- WHEN the page renders
- THEN draws display in reverse chronological order (newest first)
- AND pagination shows 10 draws per page
- AND page numbers, prev/next, first/last controls work
- AND URL updates with page parameter

#### Scenario: Filter by year works

- GIVEN draws span multiple years
- WHEN user selects a year filter
- THEN only draws from that year display
- AND pagination resets to page 1
- AND URL updates with year parameter

#### Scenario: Mobile history card layout

- GIVEN the history page on mobile
- WHEN draws render
- THEN each draw shows as a card with number, date, and 6 mini NumberBalls
- AND tapping card navigates to detail page

### Requirement: Detalle Sorteo Page (/detalle/[id]) - SSG

The system SHALL generate static pages for each draw detail via `getStaticPaths` with fallback for new draws.

#### Scenario: Draw detail page generates statically

- GIVEN the build runs with 50 historical draws
- WHEN `getStaticPaths` executes
- THEN 50 static HTML files generate for `/detalle/1` through `/detalle/50`
- AND each page contains complete draw data
- AND prize table, number frequency, and next/previous navigation render

#### Scenario: Fallback renders for new draws

- GIVEN a draw ID not in `getStaticPaths` is requested
- WHEN the page is accessed
- THEN the page renders with fallback data fetching
- AND a stale-while-revalidate header is set
- AND subsequent requests serve cached version

#### Scenario: Draw detail shows complete information

- GIVEN a specific draw detail page
- WHEN the page renders
- THEN all 6 winning numbers + reintegro display prominently
- AND full prize table with all categories renders
- AND number frequency chart for that draw shows
- AND previous/next draw navigation links work
- AND share button generates correct URL

#### Scenario: Invalid draw ID shows 404

- GIVEN a draw ID that doesn't exist and isn't in fallback
- WHEN the page is accessed
- THEN a 404 page displays with link back to Historial

### Requirement: Búsqueda Exacta Page (/busqueda)

The system SHALL render an exact combination search page with NumberInput (6 numbers), optional DatePicker filter, and results display.

#### Scenario: Exact search with valid combination

- GIVEN user enters 6 unique numbers (1-46) and submits
- WHEN the search executes
- THEN exact matches display with draw number, date, and prize won
- AND partial matches (5+1, 5, 4+1, etc.) display in separate section
- AND "no matches" message shows if none found

#### Scenario: Date range filter works

- GIVEN user selects a date range via DatePicker
- WHEN search executes
- THEN results are filtered to draws within that range
- AND date filter persists in URL

#### Scenario: NumberInput validates 6 unique numbers

- GIVEN user interacts with NumberInput
- WHEN user enters duplicate numbers
- THEN duplicate is rejected with visual feedback
- WHEN user enters number outside 1-46
- THEN input is rejected with visual feedback
- WHEN user has 6 valid numbers
- THEN submit button enables

#### Scenario: Search results are shareable

- GIVEN a search produces results
- WHEN user clicks share
- THEN a URL with search parameters generates
- AND opening that URL reproduces the search

### Requirement: 404 Page (/404)

The system SHALL render a friendly 404 page with search link and home link.

#### Scenario: 404 page displays correctly

- GIVEN a non-existent route is accessed
- WHEN the 404 page renders
- THEN a friendly illustration/message displays
- AND links to Home and Búsqueda Exacta are present
- AND the page returns HTTP 404 status

### Requirement: SEO Meta Tags and Open Graph

The system SHALL generate proper SEO meta tags and Open Graph tags for each page.

#### Scenario: Each page has unique meta tags

- GIVEN any public page
- WHEN the page renders
- THEN unique title, description, and canonical URL are present
- AND Open Graph tags (og:title, og:description, og:image, og:type) are present
- AND Twitter Card tags are present

#### Scenario: Draw detail has dynamic meta

- GIVEN a draw detail page
- WHEN the page renders
- THEN title includes draw number and date
- AND description includes winning numbers
- AND og:image generates a dynamic social card
