# Testing Infrastructure Specification

## Purpose

This specification defines the testing infrastructure for the Quini6 Frontend application including unit testing with Vitest, end-to-end testing with Playwright, component documentation with Storybook, and performance monitoring with Lighthouse CI.

## Requirements

### Requirement: Vitest Unit Testing Setup

The system SHALL configure Vitest for unit and integration testing with coverage reporting.

#### Scenario: Unit tests run and pass

- GIVEN the test suite
- WHEN running `npm run test`
- THEN all unit tests pass
- AND coverage report generates with thresholds

#### Scenario: Component tests render correctly

- GIVEN an Astro component with logic
- WHEN the component test runs
- THEN the component renders in JSDOM
- AND user interactions fire correctly
- AND assertions validate output

#### Scenario: Coverage thresholds enforced

- GIVEN the Vitest config with coverage thresholds
- WHEN running tests with coverage
- THEN build fails if coverage drops below:
  - Statements: 80%
  - Branches: 70%
  - Functions: 80%
  - Lines: 80%

#### Scenario: Watch mode works for development

- GIVEN a developer runs `npm run test:watch`
- WHEN test files change
- THEN only affected tests re-run
- AND results update in terminal immediately

### Requirement: Playwright E2E Testing

The system SHALL configure Playwright for cross-browser end-to-end testing of critical user flows.

#### Scenario: Critical user flows pass

- GIVEN the Playwright test suite
- WHEN running `npm run test:e2e`
- THEN these flows pass:
  - Home page loads and navigates to detail
  - Último Sorteo displays latest draw
  - Historial pagination and filtering works
  - Búsqueda Exacta finds exact match
  - Búsqueda Exacta shows partial matches
  - Draw detail page renders from SSG
  - 404 page displays for invalid routes

#### Scenario: Cross-browser testing

- GIVEN Playwright config
- WHEN tests run in CI
- THEN tests execute in Chromium, Firefox, and WebKit
- AND all browsers pass the same test suite

#### Scenario: Mobile device emulation

- GIVEN Playwright config with device presets
- WHEN tests run with `project: 'mobile-chrome'`
- THEN viewport emulates iPhone 14 (390x844)
- AND touch events simulate correctly
- AND responsive layouts validate visually

#### Scenario: Visual regression testing

- GIVEN baseline screenshots committed
- WHEN visual tests run
- THEN pixel-by-pixel comparison detects changes
- AND threshold allows 0.2% pixel difference
- AND diff images generate for failures

#### Scenario: Test traces on failure

- GIVEN a test fails in CI
- WHEN the failure occurs
- THEN a trace.zip attaches to the run
- AND the trace includes screenshots, DOM snapshots, network logs
- AND the trace opens locally with `npx playwright show-trace`

### Requirement: Storybook Component Documentation

The system SHALL configure Storybook for documenting all base and specialized components with interactive controls.

#### Scenario: All components have stories

- GIVEN the Storybook build
- WHEN running `npm run storybook`
- THEN stories exist for:
  - Button (all variants, sizes, states)
  - Input (all types, validation states)
  - Select (options, groups, states)
  - Modal (open, closed, focus trap)
  - Toast (all variants, auto-dismiss)
  - Spinner (sizes, variants)
  - Table (data, empty, sortable, responsive)
  - Pagination (all page counts, states)
  - NumberBall (numbers, reintegro, sizes)
  - NumberInput (selection, validation, quick pick)
  - DatePicker (range, presets, keyboard)
  - DrawCard, PrizeTable, NumberFrequency, DrawDetail

#### Scenario: Stories have interactive controls

- GIVEN a component story
- WHEN viewing in Storybook
- THEN Controls panel shows all props
- AND changing props updates the component live
- AND Actions panel logs event handlers

#### Scenario: Stories include accessibility addon

- GIVEN a story with a11y addon enabled
- WHEN the story renders
- THEN the Accessibility panel shows violations
- AND zero violations for all base components
- AND violations link to WCAG criteria

#### Scenario: Storybook builds statically

- GIVEN `npm run build-storybook`
- WHEN the build completes
- THEN static files output to `storybook-static/`
- AND the build deploys to Vercel/Chromatic successfully

### Requirement: Lighthouse CI Performance Monitoring

The system SHALL integrate Lighthouse CI to enforce performance budgets on every PR.

#### Scenario: Lighthouse CI runs on PR

- GIVEN a pull request opens
- WHEN GitHub Actions runs
- THEN Lighthouse CI audits all public pages
- AND budgets enforced:
  - Performance: > 90
  - Accessibility: > 95
  - Best Practices: > 90
  - SEO: > 95

#### Scenario: Budget failure blocks merge

- GIVEN a page scores below threshold
- WHEN Lighthouse CI completes
- THEN the check fails
- AND the PR cannot merge until scores improve
- AND detailed report links to specific failing audits

#### Scenario: Desktop and mobile budgets

- GIVEN Lighthouse CI config
- WHEN audits run
- THEN both desktop and mobile audits execute
- AND mobile budgets are stricter (Performance > 85)
- AND both must pass

#### Scenario: Historical trend tracking

- GIVEN Lighthouse CI with storage
- WHEN multiple runs complete
- THEN performance trends display in dashboard
- AND regressions highlight automatically

### Requirement: Test Commands and CI Integration

The system SHALL provide npm scripts for all test types and integrate with CI/CD pipeline.

#### Scenario: Test commands available

- GIVEN the package.json scripts
- WHEN running commands:
  - `npm run test` - unit tests with coverage
  - `npm run test:watch` - unit tests in watch mode
  - `npm run test:e2e` - Playwright E2E tests
  - `npm run test:e2e:ui` - Playwright with UI
  - `npm run storybook` - Storybook dev server
  - `npm run build-storybook` - Static Storybook build
  - `npm run lighthouse` - Local Lighthouse CI
- THEN each command executes correctly

#### Scenario: CI pipeline runs all tests

- GIVEN a GitHub Actions workflow
- WHEN a PR opens or pushes to main
- THEN the pipeline runs:
  1. TypeScript type check
  2. ESLint + Prettier
  3. Unit tests with coverage
  4. Build verification
  5. E2E tests (chromium only for speed)
  6. Lighthouse CI (on PRs to main)
- AND all must pass for merge

#### Scenario: Test artifacts upload on failure

- GIVEN a test failure in CI
- WHEN the workflow fails
- THEN Playwright traces upload as artifacts
- AND Lighthouse reports upload as artifacts
- AND coverage reports upload as artifacts
