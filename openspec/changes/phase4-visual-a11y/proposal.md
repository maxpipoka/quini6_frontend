# Proposal: Phase 4 Visual Regression & Accessibility Audit

## Intent

Add visual regression testing for new admin/components and run a full accessibility audit on the bulk import workflow components. Currently no visual regression tooling covers the new components (FileDropzone, PreviewTable, HistoryTable, Progress), and accessibility gaps exist in keyboard navigation, ARIA labels, color contrast, and screen reader announcements.

## Scope

### In Scope
- Extend `tests/e2e/visual.spec.ts` with component-level visual tests for 5 components across multiple states
- Create Storybook stories for all 5 components with a11y addon enabled
- Add Playwright + axe-core E2E accessibility tests for critical admin flows
- Manual verification checklist for keyboard navigation and screen reader flows

### Out of Scope
- New testing infrastructure setup (already exists per testing-infrastructure spec)
- Public page visual regression (already covered)
- Non-admin components (Button, Modal, Toast, etc.)

## Capabilities

### New Capabilities
- `visual-regression-components`: Component-level visual regression testing for admin UI components
- `accessibility-audit-admin`: Automated + manual accessibility validation for admin bulk import workflow

### Modified Capabilities
- `testing-infrastructure`: Extends visual regression and a11y testing scope (delta spec will detail)

## Approach

**Visual Regression**: Use existing Playwright visual test infrastructure (`tests/e2e/visual.spec.ts`). Add component-level tests by:
1. Creating temporary Astro pages that render each component in isolation with various states (default, hover, focus, error, loading, disabled)
2. Capturing baseline screenshots at desktop (1280x720) and mobile (375x667) viewports
3. Using 0.2% pixel threshold per existing spec

**Accessibility**: Combined approach:
1. **Storybook a11y addon** - Add stories for all 5 components, run automated axe checks in Storybook UI
2. **Playwright + @axe-core/playwright** - E2E tests for admin import flow (FileDropzone → PreviewTable → ImportProgress → HistoryTable)
3. **Manual verification** - Targeted checklist for keyboard tab order, focus indicators, ARIA live regions for progress, color contrast ratios

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `tests/e2e/visual.spec.ts` | Modified | Add component-level visual tests for 5 components × states × viewports |
| `src/components/ui/FileDropzone.tsx` | Modified | Add Storybook stories, verify ARIA labels |
| `src/components/admin/ImportPreviewTable.tsx` | Modified | Add Storybook stories, verify table semantics |
| `src/components/admin/ImportHistoryTable.tsx` | Modified | Add Storybook stories, verify pagination/keyboard nav |
| `src/components/admin/ImportProgress.tsx` | Modified | Add Storybook stories, verify ARIA live region |
| `src/components/ui/Progress.tsx` | Modified | Add Storybook stories, verify role/progressbar |
| `.storybook/` | New | Configure a11y addon, add component stories |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Visual test flakiness from animations | Medium | Disable animations in test config, use `animations: 'disabled'` |
| Baseline screenshot drift across browsers | Low | Lock to Chromium for visual tests per existing spec |
| Missing Storybook stories for complex states | Medium | Create story variants for each component state (error, loading, success) |
| axe-core false positives in admin flows | Low | Suppress known false positives, focus on critical violations |

## Rollback Plan

1. Revert `tests/e2e/visual.spec.ts` to previous version
2. Remove added Storybook story files
3. Remove `@axe-core/playwright` dependency if added
4. No database or API changes - purely frontend test/story additions

## Dependencies

- Existing Playwright visual test infrastructure (per testing-infrastructure spec)
- Storybook with a11y addon (per testing-infrastructure spec)
- `@axe-core/playwright` npm package (may need install)
- Chromatic or local baseline screenshots storage

## Success Criteria

- [ ] Visual regression tests pass for all 5 components in default/hover/focus/error/loading states at desktop + mobile
- [ ] Storybook a11y panel shows zero violations for all 5 component stories
- [ ] Playwright + axe E2E tests pass for admin import flow (FileDropzone → PreviewTable → ImportProgress → HistoryTable)
- [ ] Manual verification checklist completed: keyboard tab order, focus visible, ARIA live announcements for progress, color contrast ≥ 4.5:1
- [ ] CI pipeline runs visual + a11y tests on PR