# [UI] Implement AuthStore

## User Story
> As a registered user, I can log in and receive a JWT token.
> As a logged-in user, I can set my preferred translation target language.
> As an admin user, I can access the admin panel.

## Description
Create the signal-based `AuthStore` in `frontend/src/app/core/stores/` to manage authentication state across the application. It stores the current user, the JWT token in `localStorage`, and exposes computed convenience signals.

## Acceptance Criteria
- [x] `AuthStore` is an `@Injectable({ providedIn: 'root' })` service using Angular signals
- [x] `currentUser: signal<UserModel | null>` holds the authenticated user
- [x] `isAuthenticated: computed<boolean>` derived from `currentUser`
- [x] `isAdmin: computed<boolean>` derived from `currentUser.role`
- [x] `preferredTargetLanguage: signal<string>` reflects the user's preference
- [x] `login()` action calls `AuthService.login()`, stores JWT in `localStorage`, sets `currentUser`
- [x] `register()` action calls `AuthService.register()`, stores JWT, sets `currentUser`
- [x] `logout()` action clears `localStorage` and resets `currentUser` to `null`
- [x] `updatePreferences()` action calls `AuthService.updatePreferences()` and updates the signal
- [x] On app init, token is read from `localStorage` and `AuthService.getMe()` is called to restore session

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/stores/auth.store.ts`
- Depends on: `11-[UI]-implement-auth-service.md`

## Implementation Notes
- All state signals are private write (`_currentUser`, `_preferredTargetLanguage`); exposed as readonly via `.asReadonly()`
- Actions (`login`, `register`, `updatePreferences`) are `async` and use `firstValueFrom` — no manual subscription management
- `logout()` is synchronous — clears `localStorage` and resets both signals to `null`/`''`
- `restoreSession()` runs in the constructor; if `getMe()` fails (expired/invalid token), the token is removed silently
- `getToken()` public method returns the raw JWT string — used by the JWT interceptor in task 16
- `AUTH_TOKEN_KEY` exported as a named constant for use in the interceptor
- Build verified: 0 errors

## Status: ✅ Done
