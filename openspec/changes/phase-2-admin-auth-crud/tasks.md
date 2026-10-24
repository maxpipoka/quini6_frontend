# Tasks: Phase 2 - Admin Panel Authentication and CRUD Draws

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 2,500–3,500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Auth foundation → PR 2: Admin layout + middleware → PR 3: Draw CRUD → PR 4: Tests |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Auth foundation (types, context, CSRF, api-client hooks) | PR 1 | Base: main; includes unit tests for auth logic |
| 2 | Middleware + login page + admin layout + sidebar | PR 2 | Base: PR 1; protected routes work end-to-end |
| 3 | Draw CRUD pages (list, create, edit, change-password) | PR 3 | Base: PR 2; all admin UI complete |
| 4 | Integration + E2E tests | PR 4 | Base: PR 3; full flow verification |

---

## Phase 1: Auth Foundation (Infrastructure)

- [ ] 1.1 Create `src/lib/auth/types.ts` with `User`, `AuthState`, `LoginCredentials`, `ChangePasswordInput`, `AuthContextValue`, `AdminLoginResponse`, `AdminMeResponse`, `PaginatedDrawsResponse` interfaces
- [ ] 1.2 Create `src/lib/auth/csrf.ts` with `getCsrfToken()` reading `csrf_token` cookie and `setCsrfHeader()` for ky `beforeRequest` hook
- [ ] 1.3 Create `src/lib/auth/AuthProvider.tsx` React Context with `user`, `isLoading`, `isAuthenticated`, `login()`, `logout()`, `changePassword()`, `refresh()`, `getCsrfToken()`; implement silent refresh with promise deduplication via `refreshPromiseRef`
- [ ] 1.4 Modify `src/lib/api/client.ts`: add `credentials: 'include'` default; add `beforeRequest` hook injecting `X-CSRF-Token` from `getCsrfToken()`; add `afterResponse` hook handling 401 → call `auth.refresh()` → retry once
- [ ] 1.5 Create `src/styles/admin.css` with CSS custom properties: `--sidebar-width`, `--sidebar-collapsed-width`, `--modal-z-index`, `--admin-header-height`

---

## Phase 2: Route Protection + Login + Layout

- [ ] 2.1 Create `src/middleware.ts` Astro middleware: match `/admin/*`, check for session cookie or `Authorization` header, redirect unauthenticated to `/admin/login` with `?redirect=` original path; allow `/admin/login` and `/admin/auth/*` passthrough
- [ ] 2.2 Create `src/pages/admin/login.astro`: React island with form using `LoginSchema` from `src/lib/schemas.ts`; on submit call `auth.login()`, show Toast errors, redirect to `/admin/draws` or `redirect` param on success
- [ ] 2.3 Create `src/pages/admin/layout.astro`: shell with `<header>` (title, user avatar), `<Sidebar client:visible />` island, `<main><slot /></main>`; import `admin.css`
- [ ] 2.4 Create `src/components/admin/Sidebar.tsx`: React island with navigation links (`/admin/draws`, `/admin/change-password`), collapse/expand toggle (localStorage persist), logout button calling `auth.logout()` + redirect
- [ ] 2.5 Create `src/pages/admin/change-password.astro`: form using `ChangePasswordSchema`; validate current/new mismatch; call `auth.changePassword()`; Toast success/error; redirect to `/admin/draws`

---

## Phase 3: Draw CRUD Pages

- [ ] 3.1 Create `src/components/admin/DrawTableFilters.tsx`: filter controls — date range inputs (start/end), modality select (Tradicional, La Segunda, Revancha, Siempre Sale), "Clear filters" button; emits `onFilterChange(filters)` callback
- [ ] 3.2 Create `src/pages/admin/draws/index.astro`: page loads initial data via `GET /admin/draws?page=1&limit=20`; renders `<DrawTableFilters client:load />` + `<Table>` with columns (Date, Modality, Numbers, Actions); pagination using existing `Pagination` component; "Create Draw" button opens create modal
- [ ] 3.3 Create `src/components/admin/DrawFormWizard.tsx`: React component using `useReducer` for 4-step wizard (one per modality in `MODALITY_ORDER`); each step renders 6 `NumberInput` (1–46, unique per modality); validation per step via `CreateDrawSchema`/`UpdateDrawSchema`; "Next"/"Back"/"Submit" actions; emits `onSubmit(data)`
- [ ] 3.4 Create `src/pages/admin/draws/create.astro`: page with "Create Draw" button → opens modal containing `<DrawFormWizard client:visible />`; on submit `POST /admin/draws`; Toast success → close modal → refetch table
- [ ] 3.5 Create `src/pages/admin/draws/[id]/edit.astro`: page fetches `GET /admin/draws/:id`; pre-fills `<DrawFormWizard client:visible />` with existing data; on submit `PATCH /admin/draws/:id`; Toast success → close modal → refetch table
- [ ] 3.6 Add delete action in draws table: confirm modal (reuse design-system Modal) → `DELETE /admin/draws/:id` → Toast success → refetch table

---

## Phase 4: Testing

### Unit Tests (Vitest)
- [ ] 4.1 `src/lib/auth/__tests__/AuthProvider.test.tsx`: login sets user, logout clears, refresh dedupes concurrent calls, getCsrfToken reads cookie
- [ ] 4.2 `src/lib/auth/__tests__/csrf.test.ts`: getCsrfToken parses `csrf_token` cookie correctly; setCsrfHeader injects header
- [ ] 4.3 `src/components/admin/__tests__/DrawFormWizard.test.tsx`: reducer transitions steps correctly; validates 6 unique numbers 1–46 per modality; emits correct payload on submit
- [ ] 4.4 `src/components/admin/__tests__/DrawTableFilters.test.tsx`: filter change callback receives correct filter object

### Integration Tests (Vitest + MSW)
- [ ] 4.5 `src/lib/api/__tests__/client.integration.test.ts`: ApiClient injects `X-CSRF-Token` on POST/PATCH/DELETE; 401 triggers silent refresh then retries; `credentials: 'include'` on all requests
- [ ] 4.6 `src/middleware.test.ts`: middleware redirects unauthenticated `/admin/draws` to `/admin/login?redirect=/admin/draws`; allows `/admin/login` through

### E2E Tests (Playwright)
- [ ] 4.7 `e2e/admin-auth.spec.ts`: login → access `/admin/draws` → refresh page (session persists) → logout → redirected to login
- [ ] 4.8 `e2e/admin-draws-crud.spec.ts`: create draw (4 modalities × 6 numbers) → appears in table → edit draw → delete draw → verify removed
- [ ] 4.9 `e2e/admin-change-password.spec.ts`: change password with valid current/new → success toast → login with new password works
- [ ] 4.10 `e2e/admin-csrf.spec.ts`: verify `X-CSRF-Token` header sent on create/edit/delete requests; missing token returns 403
- [ ] 4.11 `e2e/admin-protected-routes.spec.ts`: direct navigation to `/admin/draws` without login redirects to `/admin/login`; after login redirects back

---

## Phase 5: Cleanup & Documentation

- [ ] 5.1 Update `src/lib/schemas.ts` exports if needed (re-export admin schemas)
- [ ] 5.2 Verify no TypeScript errors: `npm run check`
- [ ] 5.3 Run full test suite: `npm run test && npm run test:e2e`
- [ ] 5.4 Add admin route entries to `src/routes.ts` or verify Astro file-based routing covers all pages