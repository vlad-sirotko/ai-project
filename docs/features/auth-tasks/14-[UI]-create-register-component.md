# [UI] Create RegisterComponent

## User Story
> As a new user, I can register with email and password.

## Description
Create the `RegisterComponent` for the `/auth/register` route. It renders an email, password, and confirm-password form with client-side validation and delegates submission to `AuthStore`. On success it redirects the user to `/app/upload`.

## Acceptance Criteria
- [ ] Standalone component with `OnPush` change detection
- [ ] Reactive form with `email` (required, valid email), `password` (required, min 8 chars), and `confirmPassword` (required, must match `password`) controls
- [ ] Cross-field validator ensures `password === confirmPassword`; error shown on the `confirmPassword` field
- [ ] Calls `AuthStore.register()` on submit; button disabled while request is in-flight
- [ ] On success: navigates to `/app/upload`
- [ ] On failure: displays server error message (e.g., "Email already in use")
- [ ] Includes a link to `/auth/login`
- [ ] Uses `input()` / `inject()` Angular 20 conventions — no `@Input` / `@Output` decorators

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/auth/register/register.component.ts`, `.html`, `.scss`
- Depends on: `12-[UI]-implement-auth-store.md`, `10-[UI]-set-up-auth-routing.md`
