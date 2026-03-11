# [API] Add AuthController with all auth endpoints

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.
> As a logged-in user, I can set my preferred translation target language.

## Description
Add `AuthController` to `TranslationApp.API` exposing all four authentication endpoints. The controller dispatches to Application handlers and returns appropriate HTTP responses.

## Acceptance Criteria
- [ ] `POST /api/auth/register` — calls `RegisterHandler`, returns `201 Created` with `AuthResponseDto`
- [ ] `POST /api/auth/login` — calls `LoginHandler`, returns `200 OK` with `AuthResponseDto` or `401 Unauthorized` on failure
- [ ] `GET /api/auth/me` — requires `[Authorize]`, calls `GetMeHandler` using `sub` claim, returns `200 OK` with `UserProfileDto`
- [ ] `PUT /api/auth/me/preferences` — requires `[Authorize]`, calls `UpdatePreferencesHandler`, returns `204 No Content`
- [ ] Global exception middleware maps domain validation errors to `400` and auth failures to `401`
- [ ] Endpoints documented via Swagger (XML comments or `[SwaggerOperation]`)

## Technical Notes
- Layer: API (API layer)
- Key files: `TranslationApp.API/Controllers/AuthController.cs`, `TranslationApp.API/Middleware/ExceptionMiddleware.cs`
- Depends on: `05-[API]-implement-register-handler.md`, `06-[API]-implement-login-handler.md`, `07-[API]-implement-getme-and-updatepreferences-handlers.md`
