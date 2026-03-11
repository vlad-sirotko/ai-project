# [UI] Create AuthLayoutComponent

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.

## Description
Create the `AuthLayoutComponent` used as the shell for all unauthenticated pages (`/auth/login`, `/auth/register`). It renders a centered card with no navigation bar or sidebar.

## Acceptance Criteria
- [x] `AuthLayoutComponent` is a standalone component in `frontend/src/app/layouts/auth-layout/`
- [x] Template presents a centered card layout (no top bar, no sidebar)
- [x] Includes a `<router-outlet>` for child routes
- [x] Uses `OnPush` change detection
- [x] Styled with SCSS; card is responsive on mobile

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/layouts/auth-layout/auth-layout.component.ts`, `.html`, `.scss`
- No dependencies on other tasks in this set

## Implementation Notes
- Angular 20 (zoneless) project scaffolded at `frontend/`
- Component is standalone with `ChangeDetectionStrategy.OnPush`, imports only `RouterOutlet`
- Layout: full-viewport flex wrapper centers a `max-width: 420px` card with `box-shadow`
- Mobile (≤480px): card goes edge-to-edge — no border-radius, no shadow, full width
- Build verified: `ng build --configuration development` — 0 errors

## Status: ✅ Done
