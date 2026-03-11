# [API] Add AuthController with all auth endpoints

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.
> As a logged-in user, I can set my preferred translation target language.

## Description
Add `AuthController` to `TranslationApp.API` exposing all four authentication endpoints. The controller dispatches to Application handlers and returns appropriate HTTP responses.

## Acceptance Criteria
- [x] `POST /api/auth/register` — calls `RegisterHandler`, returns `201 Created` with `AuthResponseDto`
- [x] `POST /api/auth/login` — calls `LoginHandler`, returns `200 OK` with `AuthResponseDto` or `401 Unauthorized` on failure
- [x] `GET /api/auth/me` — requires `[Authorize]`, calls `GetMeHandler` using `sub` claim, returns `200 OK` with `UserProfileDto`
- [x] `PUT /api/auth/me/preferences` — requires `[Authorize]`, calls `UpdatePreferencesHandler`, returns `204 No Content`
- [x] Global exception middleware maps domain validation errors to `400` and auth failures to `401`
- [x] Endpoints documented via Swagger (XML comments or `[SwaggerOperation]`)

## Technical Notes
- Layer: API (API layer)
- Key files: `TranslationApp.API/Controllers/AuthController.cs`, `TranslationApp.API/Middleware/ExceptionMiddleware.cs`
- Depends on: `05-[API]-implement-register-handler.md`, `06-[API]-implement-login-handler.md`, `07-[API]-implement-getme-and-updatepreferences-handlers.md`

## Implementation Notes
- `AuthController` dispatches to all four Application handlers via constructor-injected handler instances
- `ExceptionMiddleware` maps: `ValidationException→400` (with field errors dict), `UnauthorizedAccessException→401`, `KeyNotFoundException→404`, `InvalidOperationException→400`, unhandled→500
- JWT sub claim parsed via `ClaimTypes.NameIdentifier` in a private `GetCurrentUserId()` helper
- Swagger enhanced with `SecurityDefinition("Bearer")` + `SecurityRequirement`; XML docs enabled in `.csproj`
- Smoke-tested: all 4 endpoints confirmed in `GET /swagger/v1/swagger.json`

## Status: ✅ Done
