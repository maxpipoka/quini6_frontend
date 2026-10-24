# Project Foundation Specification

## Purpose

This specification defines the project scaffolding, build configuration, and development tooling for the Quini6 Frontend application. It establishes the Astro + Tailwind + TypeScript foundation with linting, formatting, and CI/CD readiness.

## Requirements

### Requirement: Astro Project Configuration

The system SHALL initialize an Astro 5 project configured for static site generation with TypeScript strict mode enabled.

#### Scenario: Project builds successfully

- GIVEN a fresh clone of the repository
- WHEN running `npm install && npm run build`
- THEN the build completes without errors
- AND outputs static files to `dist/`

#### Scenario: Development server starts

- GIVEN the project dependencies are installed
- WHEN running `npm run dev`
- THEN the development server starts on localhost:4321
- AND hot module replacement works for Astro components

### Requirement: TypeScript Configuration

The system SHALL enforce strict TypeScript compilation with no implicit any, strict null checks, and exact optional property types.

#### Scenario: Type checking passes

- GIVEN the project source code
- WHEN running `npx tsc --noEmit`
- THEN zero TypeScript errors are reported

### Requirement: Tailwind CSS Integration

The system SHALL integrate Tailwind CSS v4 with JIT compilation and CSS custom properties for design tokens.

#### Scenario: Tailwind utilities apply correctly

- GIVEN an Astro component using Tailwind classes
- WHEN the page renders in development
- THEN the styles are applied correctly
- AND unused styles are purged in production build

### Requirement: ESLint and Prettier Configuration

The system SHALL enforce code quality with ESLint (astro, typescript, jsx-a11y plugins) and Prettier for formatting.

#### Scenario: Linting passes on clean code

- GIVEN code that follows project conventions
- WHEN running `npm run lint`
- THEN zero lint errors or warnings are reported

#### Scenario: Formatting check passes

- GIVEN code formatted with Prettier
- WHEN running `npm run format:check`
- THEN no formatting differences are detected

### Requirement: Husky Git Hooks

The system SHALL configure Husky pre-commit hooks to run lint-staged on staged files.

#### Scenario: Pre-commit hook runs on commit

- GIVEN staged files with lint errors
- WHEN attempting to commit
- THEN the commit is blocked
- AND lint errors are displayed

### Requirement: Environment Variable Management

The system SHALL provide type-safe environment variable access via `import.meta.env` with Zod validation schema.

#### Scenario: Required env vars validated at build

- GIVEN missing required environment variables
- WHEN running `npm run build`
- THEN the build fails with clear validation errors

#### Scenario: Optional env vars have defaults

- GIVEN optional environment variables not set
- WHEN the application runs
- THEN sensible defaults are used without errors

### Requirement: Global Error Boundary

The system SHALL implement a global error boundary component that catches render errors and displays a user-friendly fallback UI.

#### Scenario: Error boundary catches component error

- GIVEN a component that throws during render
- WHEN the error boundary wraps that component
- THEN the fallback UI is displayed
- AND the error is logged to console
- AND the rest of the page remains functional

### Requirement: Vercel Deployment Configuration

The system SHALL include `vercel.json` configured for static output with proper headers and rewrites.

#### Scenario: Vercel deployment succeeds

- GIVEN the project pushed to Vercel-connected repository
- WHEN Vercel builds the project
- THEN the deployment succeeds
- AND static assets are served with correct cache headers
