# Bundle Analysis Specification

## Purpose

This specification defines the visual bundle size analysis via `rollup-plugin-visualizer` to generate interactive reports on CI builds.

## Requirements

### Requirement: Visualizer Plugin Configuration

The system SHALL configure `rollup-plugin-visualizer` in Vite build configuration.

#### Scenario: Plugin generates stats.html on build

- GIVEN production build runs (`npm run build`)
- WHEN Vite build completes
- THEN `dist/stats.html` generates with bundle visualization
- AND file includes interactive treemap/sunburst
- AND file opens in browser without server

#### Scenario: Plugin configuration excludes node_modules from analysis

- GIVEN visualizer config
- WHEN build runs
- THEN report focuses on application code
- AND external dependencies show as single nodes
- AND gzip/brotli sizes display

#### Scenario: Plugin runs only on CI, not local dev

- GIVEN `VITE_BUNDLE_ANALYZE=true` environment variable
- WHEN build runs
- THEN visualizer generates report
- AND when variable absent, no report generates
- AND local dev builds stay fast

### Requirement: Report Output Formats

The system SHALL support multiple output formats for different use cases.

#### Scenario: HTML report for visual analysis

- GIVEN visualizer config with `template: 'treemap'`
- WHEN build runs
- THEN `dist/stats.html` generates with treemap view
- AND interactive zoom/filter works in browser

#### Scenario: JSON report for programmatic analysis

- GIVEN visualizer config with `filename: 'bundle-stats.json'`
- WHEN build runs
- THEN `dist/bundle-stats.json` generates
- AND file contains module sizes, chunks, dependencies
- AND CI can parse for size regression detection

#### Scenario: Both formats generate simultaneously

- GIVEN visualizer config with multiple outputs
- WHEN build runs
- THEN both `stats.html` and `bundle-stats.json` generate
- AND neither blocks the other

### Requirement: CI Integration

The system SHALL integrate bundle analysis into CI pipeline.

#### Scenario: CI uploads report as artifact

- GIVEN GitHub Actions workflow runs build
- WHEN `VITE_BUNDLE_ANALYZE=true` is set
- THEN `dist/stats.html` uploads as build artifact
- AND artifact retained for 30 days
- AND PR comments can link to report

#### Scenario: CI fails on size regression (optional)

- GIVEN `bundle-stats.json` from current and previous build
- WHEN size comparison runs
- THEN if main chunk increases > 10%, build warns
- AND if total size increases > 5%, build warns
- AND warnings do not fail build by default

### Requirement: Chunk Analysis

The system SHALL provide visibility into code splitting and chunk sizes.

#### Scenario: Report shows initial load chunks

- GIVEN visualizer report opens
- WHEN viewing "Initial" chunks
- THEN all chunks loading on entry point display
- AND sizes show raw, gzip, brotli

#### Scenario: Report shows async/lazy chunks

- GIVEN visualizer report opens
- WHEN viewing "Async" chunks
- THEN all dynamically imported chunks display
- AND chunk names reflect route/component names

#### Scenario: Report identifies duplicate modules

- GIVEN multiple chunks include same dependency
- WHEN report generates
- THEN duplicates highlight in visualization
- AND suggested optimizations display