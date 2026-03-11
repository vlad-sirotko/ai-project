# [UI] Create LoginComponent

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Create the `LoginComponent` for the `/auth/login` route. It renders an email + password form with client-side validation and delegates submission to `AuthStore`. On success it redirects the user to `/app/upload`.

## Acceptance Criteria
- [x] Standalone component with `OnPush` change detection
- [x] Reactive form with `email` (required, valid email format) and `password` (required) controls
- [x] Inline validation error messages shown on touched/dirty fields
- [x] Calls `AuthStore.login()` on submit; button disabled while request is in-flight
- [x] On success: navigates to `/app/upload`
- [x] On failure: displays a generic error message (e.g., "Invalid email or password")
- [x] Includes a link to `/auth/register`
- [x] Uses `input()` / `inject()` Angular 20 conventions — no `@Input` / `@Output` decorators

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/auth/login/login.component.ts`, `.html`, `.scss`
- Depends on: `12-[UI]-implement-auth-store.md`, `10-[UI]-set-up-auth-routing.md`

## Implementation Notes
- `FormBuilder`, `Router`, `AuthStore` all injected via `inject()`
- `loading` and `error` are writable `signal()`s — `OnPush` is fully reactive
- `onSubmit()` calls `form.markAllAsTouched()` on invalid before returning; disables button during the async call via `loading()`
- Error banner shown only when `error()` is non-null; cleared on each new submit attempt
- Template uses Angular 17+ `@if` control flow syntax
- `RouterLink` used for the register link — no `routerLinkActive` needed here
- Build verified: 0 errors

## Status: ✅ Done
