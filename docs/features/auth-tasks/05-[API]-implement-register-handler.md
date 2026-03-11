# [API] Implement RegisterHandler

## User Story
> As a new user, I can register with email and password.

## Description
Implement the CQRS `RegisterCommand` and `RegisterHandler` in `TranslationApp.Application`. The handler validates email uniqueness, hashes the password with BCrypt (storing the salt separately), creates a `User` entity, and returns an `AuthResponseDto` containing the JWT token and user info.

## Acceptance Criteria
- [ ] `RegisterCommand` record defined with `Email` and `Password` properties
- [ ] `RegisterHandler` validates that the email is not already taken (throws/returns error if duplicate)
- [ ] Password hashed with BCrypt; hash and salt stored on the `User` entity
- [ ] New user created with `Role=User` and `PreferredTargetLanguage="ru"` by default
- [ ] `AuthResponseDto` returned with: `token`, `userId`, `email`, `role`, `preferredTargetLanguage`
- [ ] FluentValidation validator added for `RegisterCommand` (email format, password min length)
- [ ] Handler registered in DI

## Technical Notes
- Layer: API (Application)
- Key files: `TranslationApp.Application/Auth/RegisterCommand.cs`, `TranslationApp.Application/Auth/RegisterHandler.cs`, `TranslationApp.Application/DTOs/AuthResponseDto.cs`
- Depends on: `03-[API]-define-iuserrepository-and-implement-userrepository.md`, `04-[API]-implement-ijwttokenservice-and-jwttokenservice.md`
