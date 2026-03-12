# [UI] Scaffold Admin Section (Guard, Layout, Routes)

## User Story
> As an admin, admin pages are accessible only to authenticated users with the Admin role, navigated via a dedicated sidebar layout.

## Description
Set up the three foundational pieces required before any admin page can be built:

1. **`AdminGuard`** (`core/guards/admin.guard.ts`) — functional `CanActivateFn` that checks `AuthStore.isAuthenticated()` and `AuthStore.isAdmin()` signals.
2. **`AdminLayoutComponent`** (`layouts/admin-layout/`) — standalone shell with a top bar (consistent with `MainLayoutComponent`), a sidebar with **Settings** and **Languages** links, a breadcrumb bar showing the current section, and a `<router-outlet>`.
3. **Routing** (`app.routes.ts`) — `/admin` parent route using `AdminLayoutComponent` + `AdminGuard`, with lazy-loaded children `/admin/settings` and `/admin/languages`; bare `/admin` redirects to `/admin/settings`.

## Acceptance Criteria
- [ ] `AdminGuard`: `!isAuthenticated()` → redirect `/auth/login`; `!isAdmin()` → redirect `/app/upload`; uses `inject()` for `AuthStore` and `Router`
- [ ] `AuthStore` exposes an `isAdmin` computed signal derived from the user's `Role` field (add if missing)
- [ ] `AdminLayoutComponent` is standalone with `OnPush` change detection; sidebar links use `routerLinkActive`; breadcrumb derives section title from active route
- [ ] Component uses `input()`, `output()`, `viewChild()` functions where applicable — no decorator-based inputs
- [ ] `/admin` parent route applies `AdminGuard` via `canActivate`; children lazy-load `AdminSettingsComponent` and `AdminLanguagesComponent`
- [ ] Default redirect from `/admin` → `/admin/settings`
- [ ] Existing routes are unaffected

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/core/guards/admin.guard.ts`
  - `frontend/src/app/layouts/admin-layout/admin-layout.component.ts` (+ `.html`, `.scss`)
  - `frontend/src/app/app.routes.ts`
  - `frontend/src/app/core/store/auth.store.ts` (add `isAdmin` computed signal if absent)
- No dependency on other tasks in this set
