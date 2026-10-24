# Technical Design: Phase 2 - Admin Panel Authentication and CRUD Draws

## Technical Approach

Implement admin authentication and draw CRUD using **React Context for auth state**, **Astro middleware for server-side route protection**, and **ky hooks for CSRF/silent refresh**. All forms use existing Zod schemas and UI components (Modal, Toast, Table, NumberInput, etc.). Admin pages are React islands embedded in Astro layouts.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Auth store** | React Context (`AuthProvider`) | Follows existing pattern: NumberInput, DrawDetail are React; no Zustand in repo |
| **Route protection** | Astro middleware (`src/middleware.ts`) + client guard | Server blocks unauthenticated SSR; client guard handles island navigation |
| **CSRF** | Read `csrf_token` cookie → inject `X-CSRF-Token` header in `beforeRequest` hook | Double-submit pattern; centralized in api-client |
| **Silent refresh** | Promise deduplication via `refreshPromiseRef` in `AuthContext` | Prevents race on concurrent 401s; queues waiters |
| **Admin layout** | `src/pages/admin/layout.astro` with React `Sidebar` island | Astro renders shell; island manages collapse state |
| **Draw create/edit** | Multi-step modal wizard (stepper) using React `useReducer` | Complex 6×4 number grid; reducer handles validation per step |
| **Cookies** | `credentials: 'include'` on all admin calls in `ApiClient` | HttpOnly session cookie; Vite proxy forwards in dev |

---

## Data Flows

### Auth Flow
```
Login page → POST /admin/auth/login (credentials:include)
  → Set-Cookie: session (HttpOnly) + csrf_token
  → AuthContext.setUser(user)
  → Redirect to /admin/draws

Subsequent requests:
  → ApiClient injects X-CSRF-Token from cookie
  → 401 → silent refresh: POST /admin/auth/refresh (deduped)
  → Retry original request
  → On logout: POST /admin/auth/logout → clear context → redirect /admin/login
```

### Draw CRUD Flow
```
List: GET /admin/draws?page&limit&filters → Table (Astro component)
Create: Modal → 4 steps (modal per modality) → POST /admin/draws
Edit: Modal pre-filled → PATCH /admin/draws/:id
Delete: Confirm modal → DELETE /admin/draws/:id → refetch list
All mutations: Toast success/error with requestId
```

---

## File Changes

| Path | Action | Description |
|------|--------|-------------|
| `src/lib/auth/types.ts` | Create | AuthContext types: `User`, `AuthState`, `LoginCredentials`, `ChangePasswordInput` |
| `src/lib/auth/AuthProvider.tsx` | Create | React Context: user, login, logout, changePassword, silentRefresh, csrfToken getter |
| `src/lib/auth/csrf.ts` | Create | `getCsrfToken()` reads cookie; `setCsrfHeader()` for ky hooks |
| `src/middleware.ts` | Create | Astro middleware: protects `/admin/*`, redirects to `/admin/login` |
| `src/lib/api/client.ts` | Modify | Add `credentials: 'include'`, `beforeRequest` CSRF hook, `afterResponse` 401 refresh retry |
| `src/pages/admin/login.astro` | Create | Login form (LoginSchema), Toast errors, redirect on success |
| `src/pages/admin/layout.astro` | Create | Shell + `<Sidebar client:visible />` island + `<slot />` outlet |
| `src/pages/admin/draws/index.astro` | Create | Paginated Table with filters (modality, date range), create button |
| `src/pages/admin/draws/create.astro` | Create | Multi-step modal wizard (4 modalities × 6 numbers) using NumberInput |
| `src/pages/admin/draws/[id]/edit.astro` | Create | Pre-filled edit modal, same wizard |
| `src/pages/admin/change-password.astro` | Create | ChangePasswordSchema form, current/new mismatch validation |
| `src/components/admin/Sidebar.tsx` | Create | React island: navigation, collapse toggle, logout button |
| `src/components/admin/DrawFormWizard.tsx` | Create | Stepper state machine for 4 modalities |
| `src/components/admin/DrawTableFilters.tsx` | Create | Filter controls (date, modality) for draws list |
| `src/styles/admin.css` | Create | Admin-specific tokens (sidebar width, modal z-index) |

---

## Interfaces / Contracts

```ts
// src/lib/auth/types.ts
export interface User { id: string; email: string; name: string; role: 'admin' }
export interface AuthState { user: User | null; isLoading: boolean; isAuthenticated: boolean }
export interface LoginCredentials { email: string; password: string }
export interface ChangePasswordInput { currentPassword: string; newPassword: string }

// AuthContext API
export interface AuthContextValue extends AuthState {
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordInput) => Promise<void>;
  refresh: () => Promise<void>;
  getCsrfToken: () => string | null;
}

// API response types (extend existing schemas.ts)
export interface AdminLoginResponse { user: User }
export interface AdminMeResponse { user: User }
export interface PaginatedDrawsResponse { data: DrawSummary[]; page: number; limit: number; total: number; totalPages: number }
```

---

## Testing Strategy

| Layer | Tool | Coverage |
|-------|------|----------|
| **Unit** | Vitest | `AuthProvider` (login/logout/refresh), `csrf.ts`, `DrawFormWizard` reducer, validation utils |
| **Integration** | Vitest + MSW | `ApiClient` hooks (CSRF injection, 401 refresh retry, credentials include), middleware redirect logic |
| **E2E** | Playwright | Full flows: login → list → create → edit → delete → change password → logout; CSRF header verification; session persistence across refresh; protected route access |

Test data: Use existing MSW handlers in `src/mock/handlers.ts` extended with `/admin/*` routes.

---

## Migration / Rollout

No migrations. Pure frontend addition. Rollback: delete `src/lib/auth/`, `src/middleware.ts`, `src/pages/admin/`, revert `client.ts` changes.

---

## Open Questions

1. **Refresh endpoint**: Backend provides `/admin/auth/refresh`? If not, use `/admin/auth/me` as refresh (returns user if session valid).
2. **CSRF cookie name**: Confirm backend cookie name (`csrf_token` vs `XSRF-TOKEN`).
3. **Session TTL**: Does backend rotate session on activity? Affects refresh frequency.
4. **Modality order**: `MODALITY_ORDER` constant exists — use for wizard step order.
5. **NumberInput reuse**: Confirm `NumberInput` works for 0-45 (already validated in component).