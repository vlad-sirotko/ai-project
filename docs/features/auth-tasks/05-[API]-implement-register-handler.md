# [API] Implement RegisterHandler

## User Story
> As a new user, I can register with email and password.

## Description
Implement the CQRS `RegisterCommand` and `RegisterHandler` in `TranslationApp.Application`. The handler validates email uniqueness, hashes the password with BCrypt (storing the salt separately), creates a `User` entity, and returns an `AuthResponseDto` containing the JWT token and user info.

## Acceptance Criteria
- [x] `RegisterCommand` record defined with `Email` and `Password` properties
- [x] `RegisterHandler` validates that the email is not already taken (throws/returns error if duplicate)
- [x] Password hashed with BCrypt; hash and salt stored on the `User` entity
- [x] New user created with `Role=User` and `PreferredTargetLanguage="ru"` by default
- [x] `AuthResponseDto` returned with: `token`, `userId`, `email`, `role`, `preferredTargetLanguage`
- [x] FluentValidation validator added for `RegisterCommand` (email format, password min length)
- [x] Handler registered in DI

## Technical Notes
- Layer: API (Application)
- Key files: `TranslationApp.Application/Auth/RegisterCommand.cs`, `TranslationApp.Application/Auth/RegisterHandler.cs`, `TranslationApp.Application/DTOs/AuthResponseDto.cs`
- Depends on: `03-[API]-define-iuserrepository-and-implement-userrepository.md`, `04-[API]-implement-ijwttokenservice-and-jwttokenservice.md`

## Implementation Notes
- `RegisterCommand` record + `RegisterCommandValidator` in the same file (`TranslationApp.Application/Auth/RegisterCommand.cs`)
- Validator rules: `Email` — not empty, valid email format, max 256 chars; `Password` — not empty, min 8 chars
- `RegisterHandler` uses `ValidateAndThrowAsync` so FluentValidation exceptions propagate upstream
- Duplicate email check via `IUserRepository.ExistsWithEmailAsync` before any write
- BCrypt salt generated with `BCrypt.GenerateSalt()`; password hashed and stored separately on `User`
- `AuthResponseDto` is a record in `TranslationApp.Application/DTOs/`
- `ApplicationServiceRegistration.AddApplication()` extension method created; registers `RegisterHandler` and all validators via `AddValidatorsFromAssemblyContaining<RegisterCommandValidator>()`
- `Program.cs` calls `builder.Services.AddApplication()`
- `FluentValidation 11.9.2` + `FluentValidation.DependencyInjectionExtensions 11.9.2` + `BCrypt.Net-Next 4.0.3` installed in Application project
- Build succeeded with 0 errors

## Status: ✅ Done
