# Documentation README Specification

## Purpose

This specification defines the project root README.md with setup instructions, available scripts, architecture overview, and contribution guidelines for the Quini6 Frontend application.

## Requirements

### Requirement: Project Setup Documentation

The system SHALL provide complete setup instructions in README.md for new developers.

#### Scenario: Fresh clone setup

- GIVEN a developer clones the repository
- WHEN they read README.md
- THEN setup steps cover:
  - Node.js version requirement (from .nvmrc or package.json)
  - `npm install` command
  - Environment variables setup (.env.example reference)
  - Development server start command (`npm run dev`)
  - Build command (`npm run build`)
  - Preview production build command

#### Scenario: Prerequisites clearly stated

- GIVEN a developer reads prerequisites section
- WHEN they check their environment
- THEN required tools listed:
  - Node.js version
  - npm/pnpm version
  - Git
  - Optional: VS Code extensions (Astro, Tailwind)

### Requirement: Available Scripts Documentation

The system SHALL document all npm scripts from package.json with descriptions.

#### Scenario: Script reference table

- GIVEN a developer looks for available commands
- WHEN they read the scripts section
- THEN a table lists each script with:
  - Command name
  - Description of what it does
  - When to use it
  - Example: `dev`, `build`, `preview`, `test`, `test:watch`, `test:e2e`, `storybook`, `build-storybook`, `lint`, `format`

#### Scenario: Script categories grouped

- GIVEN the scripts section
- WHEN reading it
- THEN scripts grouped by category:
  - Development
  - Testing
  - Building
  - Code Quality
  - Documentation

### Requirement: Architecture Overview

The system SHALL include a Mermaid architecture diagram showing the application structure.

#### Scenario: Architecture diagram renders

- GIVEN README.md is viewed on GitHub/GitLab
- WHEN the Mermaid block renders
- THEN diagram shows:
  - Astro as framework root
  - React components integration (islands)
  - API client layer (src/lib/api)
  - Schema validation (src/lib/schemas.ts with Zod)
  - State management (if any)
  - Styling (Tailwind CSS)
  - Deployment target (Vercel)

#### Scenario: Key architectural decisions documented

- GIVEN a developer reads architecture section
- WHEN they understand the stack
- THEN documented decisions include:
  - Why Astro (SSG + Islands)
  - Why React for interactive components
  - Why Zod for schema validation
  - API client pattern (fetch wrapper with types)

### Requirement: Contribution Guidelines

The system SHALL provide contribution guidelines for developers.

#### Scenario: Contributing section exists

- GIVEN a contributor wants to contribute
- WHEN they read CONTRIBUTING section
- THEN guidelines cover:
  - Branch naming convention
  - Commit message format (Conventional Commits)
  - PR template reference
  - Code style (ESLint + Prettier)
  - Test requirements before PR
  - Review process

### Requirement: Project Structure Overview

The system SHALL document the key directories and files.

#### Scenario: Directory tree shown

- GIVEN a developer explores the project
- WHEN they read project structure
- THEN tree shows:
  - src/pages/ (Astro routes)
  - src/components/ (React + Astro components)
  - src/lib/ (api, schemas, utils)
  - src/styles/ (global styles)
  - public/ (static assets)
  - tests/ (unit + e2e)
  - .github/workflows/ (CI/CD)
  - docs/ (this documentation)