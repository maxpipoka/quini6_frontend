# Delta for Testing Infrastructure

## ADDED Requirements

### Requirement: TypeDoc Documentation Generation in CI

The system SHALL integrate TypeDoc generation into the CI pipeline to generate API client documentation on every PR.

#### Scenario: TypeDoc runs in CI pipeline

- GIVEN a pull request opens or pushes to main
- WHEN GitHub Actions workflow runs
- THEN a docs generation job executes:
  - Installs TypeDoc dependencies (typedoc, typedoc-plugin-markdown)
  - Runs TypeDoc with typedoc.json configuration
  - Generates docs/api/client.md from src/lib/api/ and src/lib/schemas.ts
  - Validates output file exists and is non-empty
  - Uploads generated docs as workflow artifact
- AND job runs in parallel with other CI jobs

#### Scenario: TypeDoc failure blocks merge

- GIVEN TypeDoc generation encounters errors
- WHEN the docs job runs
- THEN the job fails if:
  - TypeDoc exits with non-zero code
  - Required entry points not found
  - Output file not generated
  - Broken internal cross-references detected
- AND PR cannot merge until docs generate successfully

#### Scenario: TypeDoc dependencies cached

- GIVEN CI runs multiple times
- WHEN dependencies restored from cache
- THEN TypeDoc dependencies cached via npm cache
- AND cache key includes package-lock.json hash
- AND cache reduces job runtime

## MODIFIED Requirements

### Requirement: Test Commands and CI Integration

The system SHALL provide npm scripts for all test types and integrate with CI/CD pipeline.

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
  7. **Documentation generation (TypeDoc)**
- AND all must pass for merge
(Previously: Pipeline had 6 steps, now 7 with docs generation added)

#### Scenario: Test artifacts upload on failure

- GIVEN a test failure in CI
- WHEN the workflow fails
- THEN Playwright traces upload as artifacts
- AND Lighthouse reports upload as artifacts
- AND coverage reports upload as artifacts
- AND **generated documentation uploads as artifact (on docs job failure)**
(Previously: Only Playwright, Lighthouse, and coverage artifacts; now adds docs artifact)