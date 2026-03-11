# [API] Implement LoginHandler

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Implement the CQRS `LoginCommand` and `LoginHandler` in `TranslationApp.Application`. The handler looks up the user by email, verifies the BCrypt hash, generates a JWT via `IJwtTokenService`, and returns an `AuthResponseDto`.

## Acceptance Criteria
- [x] `LoginCommand` record defined with `Email` and `Password` properties
- [x] `LoginHandler` retrieves user by email; returns a 401-equivalent error if not found
- [x] BCrypt hash verified against stored hash and salt; returns 401-equivalent error if invalid
- [x] JWT generated via `IJwtTokenService` and included in `AuthResponseDto`
- [x] FluentValidation validator added for `LoginCommand` (email required, password required)
- [x] Handler registered in DI

## Technical Notes
- Layer: API (Application)
- Key files: `TranslationApp.Application/Auth/LoginCommand.cs`, `TranslationApp.Application/Auth/LoginHandler.cs`
- Depends on: `03-[API]-define-iuserrepository-and-implement-userrepository.md`, `04-[API]-implement-ijwttokenservice-and-jwttokenservice.md`

## Implementation Notes
- `LoginCommand` record + `LoginCommandValidator` in the same file; validator requires non-empty valid email and non-empty password
- `LoginHandler` throws `UnauthorizedAccessException` for both not-found and wrong-password cases (same message to prevent user enumeration)
- BCrypt verification uses `BCrypt.Net.BCrypt.Verify(password, storedHash)` — the salt is embedded in the stored hash so no separate salt lookup needed at verification time
- `LoginHandler` registered via `ApplicationServiceRegistration.AddApplication()`; `LoginCommandValidator` picked up automatically by assembly scan
- Build succeeded with 0 errors

## Status: ✅ Done
