# [UI] Create AuthLayoutComponent

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.

## Description
Create the `AuthLayoutComponent` used as the shell for all unauthenticated pages (`/auth/login`, `/auth/register`). It renders a centered card with no navigation bar or sidebar.

## Acceptance Criteria
- [ ] `AuthLayoutComponent` is a standalone component in `frontend/src/app/layouts/auth-layout/`
- [ ] Template presents a centered card layout (no top bar, no sidebar)
- [ ] Includes a `<router-outlet>` for child routes
- [ ] Uses `OnPush` change detection
- [ ] Styled with SCSS; card is responsive on mobile

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/layouts/auth-layout/auth-layout.component.ts`, `.html`, `.scss`
- No dependencies on other tasks in this set
