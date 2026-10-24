# Proposal: Phase 2 - Admin Panel Authentication and CRUD Draws

## Intent

Implement the admin panel authentication flow and CRUD operations for managing draws. The backend API already provides auth endpoints (adminLogin, adminMe, adminLogout, adminChangePassword) and draw CRUD endpoints, but the frontend has no authentication implementation. This change adds protected admin routes, auth context with silent refresh, CSRF handling, and full draw management UI.

## Scope

### In Scope
- Admin authentication: login page, logout, change password, protected route middleware
- Auth context/store with HttpOnly cookie support (credentials: include), silent token refresh
- CSRF protection: cookie + header double-submit pattern
- Admin layout with sidebar navigation
- Draw CRUD: list with pagination/filter, create modal, edit modal, delete confirmation
- Zod validation using existing schemas (LoginSchema, ChangePasswordSchema, CreateDrawSchema, UpdateDrawSchema)
- Reuse existing UI components (Modal, Toast, Table, Button, Input, Select, Pagination, NumberInput)

### Out of Scope
- Import/preview/commit functionality (separate Phase 2b)
- Role-based permissions beyond admin (single role for now)
- Advanced audit logging UI
- Bulk operations on draws

## Capabilities

### New Capabilities
- `admin-auth`: Authentication flow for admin panel (login, logout, session management, password change)
- `admin-draws-crud`: Full CRUD interface for managing draws (list, create, edit, delete)
- `admin-layout`: Protected admin layout with sidebar navigation and route protection

### Modified Capabilities
- `api-client`: Extend with authenticated request handling (credentials: include, CSRF header injection, silent refresh on 401)
- `design-system`: No behavior changes — only consumption of existing components

## Approach

1. **Auth Layer**: Create `src/lib/auth/` with context (React/Svelte store), middleware for protected routes (`src/middleware.ts`), and token refresh logic. Use HttpOnly cookies via `credentials: 'include'` on all admin API calls.

2. **CSRF Handling**: Backend sets CSRF cookie on login; frontend reads cookie and sends `X-CSRF-Token` header on mutating requests. Implement in api-client request hooks.

3. **Admin Routes**: Create pages under `src/pages/admin/`:
   - `login.astro` — login form using LoginSchema
   - `layout.astro` — sidebar + protected outlet
   - `draws/index.astro` — paginated table with filters
   - `draws/create.astro` — modal form with NumberInput for 6 numbers × 4 modalities
   - `draws/[id]/edit.astro` — pre-filled edit modal
   - `change-password.astro` — ChangePasswordSchema form

4. **API Client**: Add interceptors to inject CSRF header, handle 401 with silent refresh retry, and ensure `credentials: 'include'`.

5. **Validation**: Use existing Zod schemas from `src/lib/schemas.ts` for all forms.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/auth/` | New | Auth context, middleware, token refresh, CSRF utilities |
| `src/middleware.ts` | New | Protected route guard for `/admin/*` |
| `src/pages/admin/` | New | All admin pages (login, layout, draws CRUD, change-password) |
| `src/lib/api/client.ts` | Modified | Add CSRF header injection, 401 silent refresh, credentials include |
| `src/lib/schemas.ts` | None | Reuse existing LoginSchema, ChangePasswordSchema, CreateDrawSchema, UpdateDrawSchema |
| `src/components/ui/` | None | Consume existing Modal, Toast, Table, Button, Input, Select, Pagination, NumberInput |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSRF token not sent on mutating requests | Med | Centralize in api-client hooks; add integration test |
| Silent refresh race condition on concurrent 401s | Med | Use refresh promise deduplication; queue requests during refresh |
| HttpOnly cookies not sent cross-origin in dev | Low | Configure Vite proxy; ensure `credentials: 'include'` on all admin calls |
| Modal focus trap conflicts with page focus | Low | Reuse design-system Modal which already traps focus correctly |
| Zod schema mismatch with backend | Low | Schemas already match backend contracts per FRONTEND_DEVELOPMENT_GUIDE |

## Rollback Plan

1. Delete `src/lib/auth/`, `src/middleware.ts`, `src/pages/admin/`
2. Revert `src/lib/api/client.ts` to pre-auth version (remove CSRF, refresh, credentials logic)
3. No database migrations or backend changes — pure frontend rollback

## Dependencies

- Backend API endpoints already implemented (login, me, logout, change-password, draws CRUD)
- Existing design-system components (Modal, Toast, Table, Button, Input, Select, Pagination, NumberInput)
- Existing Zod schemas in `src/lib/schemas.ts`
- Vite dev proxy configured for cookie forwarding

## Success Criteria

- [ ] Admin can login at `/admin/login` and access protected routes
- [ ] Session persists across page refreshes (HttpOnly cookie)
- [ ] Silent token refresh works without user interruption
- [ ] CSRF token automatically included on POST/PATCH/DELETE
- [ ] Draw list shows paginated, filterable table with create/edit/delete actions
- [ ] Create/edit modals validate 6 unique numbers (1-46) per modality
- [ ] Change password form validates current/new password mismatch
- [ ] Logout clears session and redirects to login
- [ ] All forms show validation errors via Toast
- [ ] No TypeScript errors; all components consume design-system correctly