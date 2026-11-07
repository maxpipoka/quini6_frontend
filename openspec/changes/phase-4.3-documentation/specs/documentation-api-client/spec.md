# Documentation API Client Specification

## Purpose

This specification defines the TypeDoc-generated API client documentation in docs/api/client.md, generated from TypeScript source in src/lib/api/ and src/lib/schemas.ts.

## Requirements

### Requirement: TypeDoc Configuration

The system SHALL configure TypeDoc to generate markdown documentation from TypeScript source.

#### Scenario: TypeDoc installed and configured

- GIVEN package.json includes typedoc and typedoc-plugin-markdown
- WHEN running `npx typedoc`
- THEN typedoc.json configuration reads:
  - Entry points: src/lib/api/, src/lib/schemas.ts
  - Output: docs/api/client.md
  - Plugin: typedoc-plugin-markdown
  - Theme: markdown
  - Options: excludePrivate, excludeProtected, excludeInternal

#### Scenario: TypeDoc generates complete API docs

- GIVEN TypeDoc runs successfully
- WHEN output is generated
- THEN docs/api/client.md contains:
  - Module overview for each file
  - All exported types, interfaces, functions, classes
  - JSDoc comments rendered as descriptions
  - Type signatures with links
  - Inheritance chains
  - Property/method documentation

#### Scenario: Zod schemas documented

- GIVEN src/lib/schemas.ts contains Zod schemas
- WHEN TypeDoc processes it
- THEN generated docs show:
  - Schema type inference (z.infer<typeof schema>)
  - Schema shape with field types
  - Validation rules described
  - Example inferred types

### Requirement: API Client Module Documentation

The system SHALL document the API client module from src/lib/api/.

#### Scenario: API client functions documented

- GIVEN src/lib/api/ contains fetch wrappers
- WHEN TypeDoc generates docs
- THEN each function documented with:
  - Function signature
  - Parameters with types
  - Return type (including Promise)
  - Throws documentation
  - Usage example from JSDoc

#### Scenario: API types and interfaces documented

- GIVEN src/lib/api/ exports types/interfaces
- WHEN TypeDoc generates docs
- THEN each type documented with:
  - Type definition
  - Properties with types and descriptions
  - Extends/implements relationships
  - Usage context

#### Scenario: Error types documented

- GIVEN API client defines error types
- WHEN TypeDoc generates docs
- THEN error hierarchy shown:
  - Base APIError class
  - Specific error subclasses
  - Error codes and messages
  - Handling patterns

### Requirement: CI Integration for Documentation Generation

The system SHALL integrate TypeDoc generation into CI pipeline.

#### Scenario: CI generates docs on PR

- GIVEN a PR opens
- WHEN CI runs
- THEN docs generation job:
  - Installs dependencies
  - Runs TypeDoc
  - Validates output exists
  - Checks for generation errors
  - Uploads docs as artifact (optional)

#### Scenario: Docs generation fails on errors

- GIVEN TypeDoc encounters errors
- WHEN CI runs generation
- THEN job fails if:
  - TypeDoc exits with non-zero code
  - Output file not created
  - Required modules not documented
  - Broken internal links

#### Scenario: Docs generation runs in parallel

- GIVEN CI pipeline has multiple jobs
- WHEN pipeline executes
- THEN docs job runs in parallel with:
  - Type check
  - Lint
  - Unit tests
  - Build verification
  - Does not block other jobs

### Requirement: Documentation Output Validation

The system SHALL validate generated documentation quality.

#### Scenario: Required sections present

- GIVEN docs/api/client.md generated
- WHEN validation runs
- THEN checks for:
  - Module index/table of contents
  - All entry point modules covered
  - No "undocumented" warnings for public API
  - Cross-references resolve correctly

#### Scenario: Documentation freshness

- GIVEN source code changes
- WHEN CI runs
- THEN docs regenerate automatically
- AND outdated docs flagged in PR review
- AND generation timestamp included