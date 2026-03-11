# [API] Implement GetMeHandler and UpdatePreferencesHandler

## User Story
> As a logged-in user, I can set my preferred translation target language.

## Description
Implement two CQRS handlers in `TranslationApp.Application`:
1. `GetMeQuery` / `GetMeHandler` — returns the current user's profile from the JWT `sub` claim.
2. `UpdatePreferencesCommand` / `UpdatePreferencesHandler` — updates the `PreferredTargetLanguage` field for the authenticated user.

## Acceptance Criteria
- [x] `GetMeQuery` accepts a `UserId` (Guid) and `GetMeHandler` returns a `UserProfileDto` with `id`, `email`, `role`, `preferredTargetLanguage`
- [x] `UpdatePreferencesCommand` accepts `UserId` and `PreferredTargetLanguage`; handler persists the change
- [x] Returns 404-equivalent error if user is not found
- [x] Both handlers registered in DI

## Technical Notes
- Layer: API (Application)
- Key files: `TranslationApp.Application/Auth/GetMeQuery.cs`, `TranslationApp.Application/Auth/GetMeHandler.cs`, `TranslationApp.Application/Auth/UpdatePreferencesCommand.cs`, `TranslationApp.Application/Auth/UpdatePreferencesHandler.cs`, `TranslationApp.Application/DTOs/UserProfileDto.cs`
- Depends on: `03-[API]-define-iuserrepository-and-implement-userrepository.md`

## Implementation Notes
- `UserProfileDto` record added to `TranslationApp.Application/DTOs/`
- `GetMeQuery` / `GetMeHandler`: throws `KeyNotFoundException` if user not found (mapped to 404 by exception middleware)
- `UpdatePreferencesCommand` / `UpdatePreferencesHandler`: loads user by ID, mutates `PreferredTargetLanguage`, persists via `IUserRepository.UpdateAsync`; throws `KeyNotFoundException` if not found
- `UpdateAsync` added to `IUserRepository` interface and implemented in `UserRepository` using `_context.Users.Update()` (works correctly with detached entities from `AsNoTracking` reads)
- Both handlers registered via `ApplicationServiceRegistration.AddApplication()`
- Build succeeded with 0 errors

## Status: ✅ Done
