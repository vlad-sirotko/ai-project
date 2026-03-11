# [UI] Implement AuthService

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.
> As a logged-in user, I can set my preferred translation target language.

## Description
Create `AuthService` in `frontend/src/app/core/services/` to encapsulate all HTTP calls to the auth API. Components and stores must never call `HttpClient` directly.

## Acceptance Criteria
- [x] `AuthService` is an `@Injectable({ providedIn: 'root' })` service
- [x] `register(email, password)` calls `POST /api/auth/register` and returns `AuthResponse`
- [x] `login(email, password)` calls `POST /api/auth/login` and returns `AuthResponse`
- [x] `getMe()` calls `GET /api/auth/me` and returns `UserModel`
- [x] `updatePreferences(language)` calls `PUT /api/auth/me/preferences`
- [x] `UserModel` and `AuthResponse` interfaces defined in `frontend/src/app/shared/models/`
- [x] No side effects (state management) inside the service — that belongs in `AuthStore`

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/services/auth.service.ts`, `frontend/src/app/shared/models/user.model.ts`, `frontend/src/app/shared/models/auth-response.model.ts`
- No dependencies on other tasks in this set (runs parallel with store / component tasks)

## Implementation Notes
- `AuthService` uses `inject(HttpClient)` — no constructor injection
- All methods return `Observable<T>` with no internal subscriptions or side effects
- `provideHttpClient(withInterceptorsFromDi())` added to `app.config.ts` (required for JWT interceptor in task 16)
- `withComponentInputBinding()` also added to `provideRouter` for route param binding
- Relative base URL `/api/auth` — will be proxied in dev and served from same origin in prod
- Build verified: 0 errors

## Status: ✅ Done
