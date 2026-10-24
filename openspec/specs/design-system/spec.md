# Design System Specification

## Purpose

This specification defines the design token system and base UI component library derived from the Kombai Canvas "Inicio A" design. It establishes CSS custom properties for theming, Tailwind configuration mapping, and a reusable component library.

## Requirements

### Requirement: CSS Custom Properties Design Tokens

The system SHALL define all design tokens as CSS custom properties in `src/styles/global.css` covering colors, spacing, typography, shadows, border radius, and breakpoints.

#### Scenario: Color tokens match Inicio A palette

- GIVEN the Kombai Canvas Inicio A design export
- WHEN the CSS custom properties are defined
- THEN all primary, secondary, accent, neutral, and semantic colors match the design
- AND color tokens use OKLCH format for wide-gamut support

#### Scenario: Spacing scale follows 4px base unit

- GIVEN the design system spacing requirements
- WHEN spacing tokens are defined
- THEN all spacing values are multiples of 4px (0.25rem)
- AND tokens range from --space-1 (4px) to --space-24 (96px)

#### Scenario: Typography scale is fluid and responsive

- GIVEN the Inicio A typography specifications
- WHEN font size, line height, and font weight tokens are defined
- THEN they use clamp() for fluid scaling between mobile and desktop
- AND font families match the design (Inter for UI, custom for display)

### Requirement: Tailwind Config Mapping

The system SHALL map all CSS custom properties to Tailwind utilities via `tailwind.config.mjs` using the `theme.extend` approach.

#### Scenario: Tailwind utilities reference design tokens

- GIVEN a component using `bg-primary-500 text-neutral-100 p-4 rounded-lg`
- WHEN the component renders
- THEN the styles resolve to the corresponding CSS custom properties
- AND changing the CSS custom property updates all referencing utilities

#### Scenario: Custom utilities for design-specific patterns

- GIVEN design patterns not covered by standard Tailwind
- WHEN custom utilities are added
- THEN utilities like `.container-page`, `.card-elevated`, `.text-gradient` are available
- AND they compose design tokens correctly

### Requirement: Base UI Component Library

The system SHALL implement the following base components as Astro components with TypeScript interfaces:

- Button (variants: primary, secondary, ghost, danger; sizes: sm, md, lg)
- Input (text, email, number, password with label, error, helper text)
- Select (native select with option groups, placeholder, error state)
- Modal (portal-rendered, focus-trapped, ESC to close, backdrop click)
- Toast (auto-dismiss, action button, variants: success, error, info, warning)
- Spinner (sizes: sm, md, lg; variants: default, inline)
- Table (sortable columns, responsive horizontal scroll, empty state)
- Pagination (page numbers, prev/next, first/last, aria labels)

#### Scenario: Button renders with correct variant styles

- GIVEN a Button component with variant="primary" size="md"
- WHEN rendered in the browser
- THEN it applies primary background, white text, medium padding
- AND hover/focus/active states are visually distinct
- AND disabled state shows reduced opacity and not-allowed cursor

#### Scenario: Input shows validation states

- GIVEN an Input with error prop set
- WHEN rendered
- THEN the border shows error color
- AND error message displays below with error icon
- AND aria-invalid="true" is set on the input

#### Scenario: Modal traps focus correctly

- GIVEN a Modal opened via trigger
- WHEN the modal is open
- THEN focus is trapped within the modal
- AND pressing ESC closes the modal
- AND clicking backdrop closes the modal
- AND focus returns to trigger on close

#### Scenario: Toast auto-dismisses after timeout

- GIVEN a Toast with default duration
- WHEN displayed
- THEN it disappears after 5 seconds
- AND hover pauses the timer
- AND action button click does not auto-dismiss

#### Scenario: Table handles responsive overflow

- GIVEN a Table with more columns than viewport width
- WHEN viewed on mobile
- THEN horizontal scroll appears on table wrapper
- AND header remains sticky during scroll
- AND row hover states work correctly

### Requirement: Component TypeScript Interfaces

The system SHALL export TypeScript interfaces for all component props with JSDoc documentation.

#### Scenario: Component props are fully typed

- GIVEN a consumer importing Button component
- WHEN using the component in TypeScript
- THEN all props have correct types
- AND invalid props cause TypeScript errors
- AND optional props have sensible defaults documented

### Requirement: Dark Mode Support

The system SHALL support dark mode via CSS custom property overrides using `prefers-color-scheme` and manual toggle.

#### Scenario: Dark mode applies automatically

- GIVEN user has system dark mode enabled
- WHEN the page loads
- THEN color tokens resolve to dark mode values
- AND no flash of light mode occurs

#### Scenario: Manual theme toggle works

- GIVEN a theme toggle button
- WHEN user clicks toggle
- THEN the theme switches immediately
- AND preference persists in localStorage
- AND subsequent loads respect saved preference
