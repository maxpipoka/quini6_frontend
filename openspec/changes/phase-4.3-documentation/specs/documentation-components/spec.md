# Documentation Components Specification

## Purpose

This specification defines the Storybook guide and component catalog documentation in docs/components/guide.md, explaining how to use Storybook, the component catalog, and how to run it locally.

## Requirements

### Requirement: Storybook Usage Guide

The system SHALL document how to run and use Storybook locally.

#### Scenario: Start Storybook locally

- GIVEN a developer wants to view components
- WHEN they run `npm run storybook`
- THEN Storybook dev server starts on http://localhost:6006
- AND all component stories load
- AND Controls panel works for each story

#### Scenario: Build static Storybook

- GIVEN a developer wants to build for deployment
- WHEN they run `npm run build-storybook`
- THEN static files output to storybook-static/
- AND build completes without errors
- AND output can be served statically

#### Scenario: Storybook configuration explained

- GIVEN a developer reads the guide
- WHEN they understand the setup
- THEN documented:
  - .storybook/main.ts configuration
  - .storybook/preview.ts global decorators
  - Framework: @storybook/astro + @storybook/react
  - Addons: controls, actions, a11y, docs

### Requirement: Component Catalog Documentation

The system SHALL catalog all components with usage examples.

#### Scenario: Base components cataloged

- GIVEN a developer reads component catalog
- WHEN they look for base components
- THEN each base component documented with:
  - Component name and purpose
  - Import path
  - Props table (name, type, default, description)
  - Variants/states showcase
  - Usage code example
  - Components: Button, Input, Select, Modal, Toast, Spinner, Table, Pagination

#### Scenario: Specialized components cataloged

- GIVEN a developer reads specialized components
- WHEN they look for domain components
- THEN each documented with:
  - Component name and purpose
  - Import path
  - Props table
  - Usage example in context
  - Components: NumberBall, NumberInput, DatePicker, DrawCard, PrizeTable, NumberFrequency, DrawDetail

#### Scenario: Component organization explained

- GIVEN a developer reads structure section
- WHEN they understand component hierarchy
- THEN documented:
  - src/components/ui/ (base components)
  - src/components/features/ (domain components)
  - Naming conventions
  - Story file naming (*.stories.tsx)

### Requirement: Writing Stories Guide

The system SHALL document how to write new component stories.

#### Scenario: Story template provided

- GIVEN a developer adds a new component
- WHEN they create a story file
- THEN template shows:
  - Meta configuration (title, component, tags)
  - Default export with render function
  - Args for each variant
  - Play functions for interactions
  - Decorators for providers/context

#### Scenario: Best practices documented

- GIVEN a developer writes stories
- WHEN they follow guidelines
- THEN documented practices:
  - One story per variant/state
  - Use ArgsTable for automatic props documentation
  - Test edge cases (empty, loading, error)
  - Include accessibility testing
  - Keep stories focused and isolated

### Requirement: Storybook Deployment Documentation

The system SHALL document the GitHub Pages deployment process.

#### Scenario: Deployment workflow explained

- GIVEN a maintainer deploys Storybook
- WHEN they read deployment section
- THEN documented:
  - GitHub Actions workflow (.github/workflows/storybook.yml)
  - Trigger: push to main branch
  - Build step: `npm run build-storybook`
  - Deploy step: GitHub Pages action
  - URL: https://<org>.github.io/<repo>/
  - Permissions: Pages write access

#### Scenario: Troubleshooting deployment

- GIVEN deployment fails
- WHEN developer reads troubleshooting
- THEN common issues covered:
  - Base path configuration for GitHub Pages
  - Build timeout issues
  - Permission errors
  - Cache invalidation