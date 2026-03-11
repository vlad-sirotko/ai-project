# [UI] Implement AuthStore

## User Story
> As a registered user, I can log in and receive a JWT token.
> As a logged-in user, I can set my preferred translation target language.
> As an admin user, I can access the admin panel.

## Description
Create the signal-based `AuthStore` in `frontend/src/app/core/stores/` to manage authentication state across the application. It stores the current user, the JWT token in `localStorage`, and exposes computed convenience signals.

## Acceptance Criteria
- [ ] `AuthStore` is an `@Injectable({ providedIn: 'root' })` service using Angular signals
- [ ] `currentUser: signal<UserModel | null>` holds the authenticated user
- [ ] `isAuthenticated: computed<boolean>` derived from `currentUser`
- [ ] `isAdmin: computed<boolean>` derived from `currentUser.role`
- [ ] `preferredTargetLanguage: signal<string>` reflects the user's preference
- [ ] `login()` action calls `AuthService.login()`, stores JWT in `localStorage`, sets `currentUser`
- [ ] `register()` action calls `AuthService.register()`, stores JWT, sets `currentUser`
- [ ] `logout()` action clears `localStorage` and resets `currentUser` to `null`
- [ ] `updatePreferences()` action calls `AuthService.updatePreferences()` and updates the signal
- [ ] On app init, token is read from `localStorage` and `AuthService.getMe()` is called to restore session

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/stores/auth.store.ts`
- Depends on: `11-[UI]-implement-auth-service.md`
