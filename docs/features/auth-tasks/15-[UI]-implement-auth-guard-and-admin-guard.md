# [UI] Implement AuthGuard and AdminGuard

## User Story
> As an admin user, I can access the admin panel.

## Description
Implement two functional route guards — `AuthGuard` and `AdminGuard` — to protect application routes from unauthorised access.

## Acceptance Criteria
- [x] `AuthGuard` is a `CanActivateFn` in `frontend/src/app/core/guards/auth.guard.ts`
  - Reads `AuthStore.isAuthenticated`; if false redirects to `/auth/login` and returns `false`
- [x] `AdminGuard` is a `CanActivateFn` in `frontend/src/app/core/guards/admin.guard.ts`
  - Reads `AuthStore.isAdmin`; if false redirects to `/app/upload` and returns `false`
- [x] Both guards use `inject()` — no class-based injection
- [x] Guards applied to the appropriate routes in `app.routes.ts` (protected app routes use `AuthGuard`; admin routes use both `AuthGuard` and `AdminGuard`)

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/guards/auth.guard.ts`, `frontend/src/app/core/guards/admin.guard.ts`, `frontend/src/app/app.routes.ts`
- Depends on: `12-[UI]-implement-auth-store.md`

## Implementation Notes
- Both guards are functional `CanActivateFn` — no class, no `@Injectable`
- Guards return `router.createUrlTree([...])` (a `UrlTree`) instead of `false` for clean redirect semantics
- `app.routes.ts` extended with `/app` (guarded by `authGuard`) and `/admin` (guarded by `[authGuard, adminGuard]`) route trees including all feature stubs
- Stub components created for `MainLayoutComponent`, `AdminLayoutComponent` and all feature routes so the build is self-contained
- Build verified: all 12 lazy chunks emitted, 0 errors

## Status: ✅ Done
