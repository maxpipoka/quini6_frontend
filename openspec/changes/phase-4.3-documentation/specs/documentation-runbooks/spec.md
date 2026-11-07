# Documentation Runbooks Specification

## Purpose

This specification defines operational runbooks in docs/runbooks/ covering Vercel deployment, rollback procedures, and common debugging scenarios for the Quini6 Frontend application.

## Requirements

### Requirement: Deployment Runbook

The system SHALL document the Vercel deployment process.

#### Scenario: Production deployment steps

- GIVEN a release is ready
- WHEN following deploy.md
- THEN steps cover:
  - Pre-deployment checklist (tests pass, build succeeds)
  - Vercel CLI or dashboard deployment
  - Environment variables verification
  - Domain configuration
  - Post-deployment smoke tests
  - Rollback trigger criteria

#### Scenario: Preview deployment process

- GIVEN a PR is opened
- WHEN Vercel creates preview deployment
- THEN documented:
  - Automatic preview URL generation
  - Environment variables in preview
  - Preview deployment lifecycle
  - How to promote preview to production

#### Scenario: Environment configuration

- GIVEN deployment requires env vars
- WHEN configuring Vercel
- THEN documented variables:
  - PUBLIC_API_URL (production API)
  - PUBLIC_MOCK_API (development flag)
  - Any secrets (not in repo)
  - Build-time vs runtime variables

### Requirement: Rollback Runbook

The system SHALL document rollback procedures for failed deployments.

#### Scenario: Immediate rollback via Vercel

- GIVEN a bad deployment detected
- WHEN initiating rollback
- THEN steps:
  - Vercel dashboard: select previous deployment
  - Click "Promote to Production"
  - Verify rollback completes
  - Run smoke tests on rolled-back version
  - Notify team

#### Scenario: Git-based rollback

- GIVEN Vercel rollback not available
- WHEN using git revert
- THEN steps:
  - Identify last known good commit
  - `git revert <bad-commit-range>`
  - Push to main triggers new deployment
  - Verify new deployment
  - Document incident

#### Scenario: Database/schema rollback considerations

- GIVEN API changes may need coordination
- WHEN rolling back frontend
- THEN documented:
  - Check API compatibility
  - Coordinate with backend team if needed
  - Feature flags for gradual rollout
  - Data migration implications

### Requirement: Debugging Runbook

The system SHALL document common debugging scenarios and solutions.

#### Scenario: Build failures

- GIVEN build fails in CI or locally
- WHEN debugging
- THEN common causes and fixes:
  - TypeScript errors: run `npm run typecheck`
  - ESLint/Prettier: run `npm run lint` and `npm run format`
  - Missing dependencies: `npm install`
  - Node version mismatch: check .nvmrc
  - Memory issues: increase Node memory limit

#### Scenario: Runtime errors in production

- GIVEN error reported in production
- WHEN investigating
- THEN debugging steps:
  - Check Vercel function logs
  - Check browser console errors
  - Reproduce locally with production build
  - Check API response format vs schemas
  - Verify environment variables

#### Scenario: Performance issues

- GIVEN slow page loads reported
- WHEN debugging performance
- THEN checks:
  - Lighthouse CI reports in CI artifacts
  - Vercel Analytics / Speed Insights
  - Bundle size analysis (`npm run build -- --analyze`)
  - Image optimization status
  - API response times
  - Cache headers verification

#### Scenario: API integration issues

- GIVEN API calls failing
- WHEN debugging integration
- THEN steps:
  - Check API endpoint availability
  - Verify request/response matches schemas
  - Check CORS configuration
  - Verify authentication/headers
  - Test with mock API (`PUBLIC_MOCK_API=true`)
  - Check network tab for failed requests

#### Scenario: Storybook deployment issues

- GIVEN Storybook GitHub Pages deployment fails
- WHEN debugging
- THEN common fixes:
  - Check base path in vite.config.ts
  - Verify GitHub Pages branch (gh-pages)
  - Check workflow permissions (Pages: write)
  - Verify build output directory
  - Clear GitHub Pages cache

### Requirement: Incident Response Runbook

The system SHALL document incident response procedures.

#### Scenario: Severity classification

- GIVEN an incident occurs
- WHEN classifying severity
- THEN levels:
  - SEV-1: Complete outage, data loss
  - SEV-2: Major feature broken, partial outage
  - SEV-3: Minor issue, workaround exists
  - SEV-4: Cosmetic, no user impact

#### Scenario: Communication during incidents

- GIVEN incident declared
- WHEN communicating
- THEN process:
  - Create incident channel/issue
  - Post status updates every 15-30 min
  - Document timeline and actions
  - Post-incident review within 48 hours
  - Update runbooks with learnings