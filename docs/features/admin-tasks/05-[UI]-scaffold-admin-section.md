# [UI] Scaffold Admin Section (Guard, Layout, Routes)

## User Story
> As an admin, admin pages are accessible only to authenticated users with the Admin role, navigated via a dedicated sidebar layout.

## Description
Set up the three foundational pieces required before any admin page can be built:

1. **`AdminGuard`** (`core/guards/admin.guard.ts`) — functional `CanActivateFn` that checks `AuthStore.isAuthenticated()` and `AuthStore.isAdmin()` signals.
2. **`AdminLayoutComponent`** (`layouts/admin-layout/`) — standalone shell with a top bar (consistent with `MainLayoutComponent`), a sidebar with **Settings** and **Languages** links, a breadcrumb bar showing the current section, and a `<router-outlet>`.
3. **Routing** (`app.routes.ts`) — `/admin` parent route using `AdminLayoutComponent` + `AdminGuard`, with lazy-loaded children `/admin/settings` and `/admin/languages`; bare `/admin` redirects to `/admin/settings`.

## Acceptance Criteria
- [x] `AdminGuard`: `!isAuthenticated()` → redirect `/auth/login`; `!isAdmin()` → redirect `/app/upload`; uses `inject()` for `AuthStore` and `Router`
- [x] `AuthStore` exposes an `isAdmin` computed signal derived from the user's `Role` field (add if missing)
- [x] `AdminLayoutComponent` is standalone with `OnPush` change detection; sidebar links use `routerLinkActive`; breadcrumb derives section title from active route
- [x] Component uses `input()`, `output()`, `viewChild()` functions where applicable — no decorator-based inputs
- [x] `/admin` parent route applies `AdminGuard` via `canActivate`; children lazy-load `AdminSettingsComponent` and `AdminLanguagesComponent`
- [x] Default redirect from `/admin` → `/admin/settings`
- [x] Existing routes are unaffected

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/core/guards/admin.guard.ts`
  - `frontend/src/app/layouts/admin-layout/admin-layout.component.ts` (+ `.html`, `.scss`)
  - `frontend/src/app/app.routes.ts`
  - `frontend/src/app/core/store/auth.store.ts` (add `isAdmin` computed signal if absent)
- No dependency on other tasks in this set

## Implementation Notes
- `AdminGuard` was updated to check `!isAuthenticated()` first (redirect `/auth/login`), then `!isAdmin()` (redirect `/app/upload`) — the original scaffold only checked `isAdmin()` without the authentication fallback
- `AuthStore.isAdmin` was already present as a `computed(() => currentUser()?.role === 'Admin')` signal — no change needed
- `AdminLayoutComponent` was expanded with an external template, SCSS file, and a co-located `AdminLayoutFacade` declared in `providers`; the component only injects its facade
- Breadcrumb section title is derived reactively by subscribing to `NavigationEnd` events in the facade via `toSignal()`, avoiding any direct router access in the template
- Routing configuration in `app.routes.ts` was already correct (lazy-loaded children, `[authGuard, adminGuard]`, default redirect) — no changes required

## Status: ✅ Complete
