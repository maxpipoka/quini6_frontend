# Draw Data Display Specification

## Purpose

This specification defines the components for rendering draw results, prize tables, number statistics, and frequency charts. These components are used across public pages to display lottery draw data consistently.

## Requirements

### Requirement: NumberBall Component

The system SHALL render a styled ball component displaying a single lottery number with consistent visual design matching Inicio A.

#### Scenario: NumberBall renders correct number

- GIVEN a NumberBall with number={23}
- WHEN the component renders
- THEN the ball displays "23" centered
- AND the ball uses primary color background with white text
- AND the size matches design token (default: 40px diameter)

#### Scenario: NumberBall variants work

- GIVEN NumberBall with variant="reintegro"
- WHEN the component renders
- THEN the ball uses accent color background
- AND includes "R" label or icon per design

#### Scenario: NumberBall size variants

- GIVEN NumberBall with size="sm" (24px), "md" (40px), "lg" (56px)
- WHEN rendered
- THEN each size matches the design specification
- AND text scales proportionally

### Requirement: DrawCard Component

The system SHALL render a card displaying a draw summary with number, date, winning numbers, and navigation link.

#### Scenario: DrawCard shows essential info

- GIVEN a draw object with number, date, winning numbers
- WHEN DrawCard renders
- THEN draw number and date display prominently
- AND all 6 winning numbers render as NumberBall components
- AND reintegro displays separately
- AND "Ver detalle" link navigates to detail page

#### Scenario: DrawCard responsive layout

- GIVEN DrawCard on mobile
- WHEN rendered
- THEN numbers wrap appropriately
- AND touch target for link meets 44px minimum

### Requirement: PrizeTable Component

The system SHALL render a responsive table showing prize categories, winners count, and prize amounts per winner.

#### Scenario: PrizeTable displays all categories

- GIVEN a draw with 6 prize categories (6 aciertos, 5+1, 5, 4, 3, 2+1, reintegro)
- WHEN PrizeTable renders
- THEN all categories display in correct order (highest to lowest)
- AND columns show: Categoría, Ganadores, Premio por ganador
- AND amounts format with thousand separators and currency symbol
- AND "Sin ganadores" shows for categories with 0 winners

#### Scenario: PrizeTable handles large numbers

- GIVEN a jackpot prize over 1,000,000
- WHEN the table renders
- THEN the amount formats as "1.250.000 €" (Spanish locale)
- AND text aligns right for numeric columns

#### Scenario: PrizeTable responsive horizontal scroll

- GIVEN PrizeTable on mobile viewport
- WHEN the table renders
- THEN horizontal scroll wrapper appears
- AND header remains visible during scroll
- AND stripe rows for readability

### Requirement: NumberFrequency Component

The system SHALL render a frequency chart showing how often each number (1-46) has appeared across draws.

#### Scenario: Frequency chart displays all numbers

- GIVEN historical draw data
- WHEN NumberFrequency renders
- THEN bars for numbers 1-46 display
- AND bar height proportional to frequency
- AND hover shows exact count and percentage

#### Scenario: Frequency highlights hot/cold numbers

- GIVEN frequency data calculated
- WHEN the chart renders
- THEN top 6 most frequent numbers highlight as "calientes"
- AND bottom 6 least frequent highlight as "frías"
- AND tooltip explains the classification

#### Scenario: Frequency chart responsive

- GIVEN mobile viewport
- WHEN chart renders
- THEN horizontal scroll enables for all 46 bars
- AND number labels remain readable

### Requirement: DrawDetail Component

The system SHALL compose a complete draw detail view combining winning numbers, prize table, frequency, and navigation.

#### Scenario: DrawDetail assembles all sections

- GIVEN a complete draw object
- WHEN DrawDetail renders
- THEN winning numbers section displays prominently
- AND PrizeTable renders below
- AND NumberFrequency chart renders
- AND previous/next draw navigation links work
- AND share button generates correct URL

#### Scenario: DrawDetail loading state

- GIVEN draw data is fetching (fallback mode)
- WHEN DrawDetail renders
- THEN skeleton loaders show for each section
- AND layout doesn't shift when data loads
