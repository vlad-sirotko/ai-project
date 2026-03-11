# [UI] Set up auth routing

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.

## Description
Configure the lazy-loaded `auth` feature routes under the `AuthLayoutComponent` shell. Register `/auth/login` and `/auth/register` paths that load their respective components on demand.

## Acceptance Criteria
- [x] Auth routes defined in `frontend/src/app/features/auth/auth.routes.ts`
- [x] Routes lazy-load `LoginComponent` and `RegisterComponent`
- [x] `AuthLayoutComponent` used as the parent layout for both routes
- [x] Auth routes registered in the root `app.routes.ts` as a lazy-loaded child
- [x] Navigating to `/auth/login` and `/auth/register` renders the correct components inside `AuthLayoutComponent`

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/auth/auth.routes.ts`, `frontend/src/app/app.routes.ts`
- Depends on: `09-[UI]-create-auth-layout-component.md`

## Implementation Notes
- `auth.routes.ts` defines `login`, `register`, and an empty-path redirect to `login`
- Stub `LoginComponent` and `RegisterComponent` created at `features/auth/login/` and `features/auth/register/`
- `app.routes.ts` registers `/auth` with `loadComponent` for `AuthLayoutComponent` and `loadChildren` for `authRoutes`
- Root empty path redirects to `auth/login`; wildcard also falls back to `auth/login`
- Build verified: all four lazy chunks emitted (`auth-layout-component`, `auth-routes`, `login-component`, `register-component`)

## Status: ✅ Done
