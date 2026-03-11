# [UI] Create LoginComponent

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Create the `LoginComponent` for the `/auth/login` route. It renders an email + password form with client-side validation and delegates submission to `AuthStore`. On success it redirects the user to `/app/upload`.

## Acceptance Criteria
- [ ] Standalone component with `OnPush` change detection
- [ ] Reactive form with `email` (required, valid email format) and `password` (required) controls
- [ ] Inline validation error messages shown on touched/dirty fields
- [ ] Calls `AuthStore.login()` on submit; button disabled while request is in-flight
- [ ] On success: navigates to `/app/upload`
- [ ] On failure: displays a generic error message (e.g., "Invalid email or password")
- [ ] Includes a link to `/auth/register`
- [ ] Uses `input()` / `inject()` Angular 20 conventions — no `@Input` / `@Output` decorators

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/auth/login/login.component.ts`, `.html`, `.scss`
- Depends on: `12-[UI]-implement-auth-store.md`, `10-[UI]-set-up-auth-routing.md`
