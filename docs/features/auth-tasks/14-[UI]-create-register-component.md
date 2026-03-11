# [UI] Create RegisterComponent

## User Story
> As a new user, I can register with email and password.

## Description
Create the `RegisterComponent` for the `/auth/register` route. It renders an email, password, and confirm-password form with client-side validation and delegates submission to `AuthStore`. On success it redirects the user to `/app/upload`.

## Acceptance Criteria
- [x] Standalone component with `OnPush` change detection
- [x] Reactive form with `email` (required, valid email), `password` (required, min 8 chars), and `confirmPassword` (required, must match `password`) controls
- [x] Cross-field validator ensures `password === confirmPassword`; error shown on the `confirmPassword` field
- [x] Calls `AuthStore.register()` on submit; button disabled while request is in-flight
- [x] On success: navigates to `/app/upload`
- [x] On failure: displays server error message (e.g., "Email already in use")
- [x] Includes a link to `/auth/login`
- [x] Uses `input()` / `inject()` Angular 20 conventions — no `@Input` / `@Output` decorators

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/auth/register/register.component.ts`, `.html`, `.scss`
- Depends on: `12-[UI]-implement-auth-store.md`, `10-[UI]-set-up-auth-routing.md`

## Implementation Notes
- Cross-field `passwordMatchValidator` defined as a standalone function at module level; applied as a group-level validator
- `confirmPassword` invalid state checks both its own `required` error and the group-level `passwordMismatch` error
- Error banner uses the message from the thrown `Error` if available; falls back to a generic string
- Template uses Angular 17+ `@if` control flow syntax throughout
- All dependencies injected via `inject()` — no constructor parameters
- Build verified: 0 errors

## Status: ✅ Done
