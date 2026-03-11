# [UI] Implement AuthGuard and AdminGuard

## User Story
> As an admin user, I can access the admin panel.

## Description
Implement two functional route guards — `AuthGuard` and `AdminGuard` — to protect application routes from unauthorised access.

## Acceptance Criteria
- [ ] `AuthGuard` is a `CanActivateFn` in `frontend/src/app/core/guards/auth.guard.ts`
  - Reads `AuthStore.isAuthenticated`; if false redirects to `/auth/login` and returns `false`
- [ ] `AdminGuard` is a `CanActivateFn` in `frontend/src/app/core/guards/admin.guard.ts`
  - Reads `AuthStore.isAdmin`; if false redirects to `/app/upload` and returns `false`
- [ ] Both guards use `inject()` — no class-based injection
- [ ] Guards applied to the appropriate routes in `app.routes.ts` (protected app routes use `AuthGuard`; admin routes use both `AuthGuard` and `AdminGuard`)

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/guards/auth.guard.ts`, `frontend/src/app/core/guards/admin.guard.ts`, `frontend/src/app/app.routes.ts`
- Depends on: `12-[UI]-implement-auth-store.md`
