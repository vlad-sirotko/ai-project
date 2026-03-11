# [UI] Set up auth routing

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.

## Description
Configure the lazy-loaded `auth` feature routes under the `AuthLayoutComponent` shell. Register `/auth/login` and `/auth/register` paths that load their respective components on demand.

## Acceptance Criteria
- [ ] Auth routes defined in `frontend/src/app/features/auth/auth.routes.ts`
- [ ] Routes lazy-load `LoginComponent` and `RegisterComponent`
- [ ] `AuthLayoutComponent` used as the parent layout for both routes
- [ ] Auth routes registered in the root `app.routes.ts` as a lazy-loaded child
- [ ] Navigating to `/auth/login` and `/auth/register` renders the correct components inside `AuthLayoutComponent`

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/auth/auth.routes.ts`, `frontend/src/app/app.routes.ts`
- Depends on: `09-[UI]-create-auth-layout-component.md`
