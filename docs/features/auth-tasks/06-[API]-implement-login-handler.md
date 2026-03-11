# [API] Implement LoginHandler

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Implement the CQRS `LoginCommand` and `LoginHandler` in `TranslationApp.Application`. The handler looks up the user by email, verifies the BCrypt hash, generates a JWT via `IJwtTokenService`, and returns an `AuthResponseDto`.

## Acceptance Criteria
- [ ] `LoginCommand` record defined with `Email` and `Password` properties
- [ ] `LoginHandler` retrieves user by email; returns a 401-equivalent error if not found
- [ ] BCrypt hash verified against stored hash and salt; returns 401-equivalent error if invalid
- [ ] JWT generated via `IJwtTokenService` and included in `AuthResponseDto`
- [ ] FluentValidation validator added for `LoginCommand` (email required, password required)
- [ ] Handler registered in DI

## Technical Notes
- Layer: API (Application)
- Key files: `TranslationApp.Application/Auth/LoginCommand.cs`, `TranslationApp.Application/Auth/LoginHandler.cs`
- Depends on: `03-[API]-define-iuserrepository-and-implement-userrepository.md`, `04-[API]-implement-ijwttokenservice-and-jwttokenservice.md`
