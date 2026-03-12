# [API] Implement Admin Languages CQRS Handlers and DTOs

## User Story
> As an admin, I can enable or disable supported languages, and add new ones. Disabled languages do not appear in user-facing language dropdowns immediately.

## Description
Create all Application-layer CQRS classes for the admin languages feature:

- **`GetAdminLanguagesQuery` + `GetAdminLanguagesHandler`** — returns **all** languages (active + inactive) via `ISupportedLanguageRepository.GetAllAsync()`.
- **`AddLanguageCommand` + `AddLanguageHandler`** — creates a new `SupportedLanguage` (IsActive = true by default); validates code format and rejects duplicates.
- **`ToggleLanguageCommand` + `ToggleLanguageHandler`** — flips `IsActive` on an existing language by ID; rejects disabling English (`code == "en"`).
- **DTO**: `LanguageDto` (Id, Code, Name, IsActive) and `AddLanguageRequest` (Code, Name).

## Acceptance Criteria
- [x] `GetAdminLanguagesQuery` record (no parameters); handler returns `IEnumerable<LanguageDto>`
- [x] `LanguageDto` with `Id`, `Code`, `Name`, `IsActive` properties in `TranslationApp.Application/DTOs/`
- [x] `AddLanguageRequest` with `Code` and `Name` string properties; `AddLanguageCommand` wraps it
- [x] `AddLanguageHandler` creates a new `SupportedLanguage`, calls `AddAsync`, returns the created `LanguageDto`
- [x] `AddLanguageHandler` FluentValidation: `Code` is 2–5 lowercase letters only; `Name` non-empty, max 100 chars; duplicate `Code` returns a domain error
- [x] `ToggleLanguageCommand` record with `Guid Id`; handler flips `IsActive` and calls `UpdateAsync`
- [x] `ToggleLanguageHandler` returns not-found error if ID is unknown; returns domain error if attempting to disable `"en"`
- [x] All handlers registered in `ApplicationServiceRegistration`

## Technical Notes
- Layer: API
- Key files:
  - `TranslationApp.Application/Admin/GetAdminLanguagesQuery.cs`
  - `TranslationApp.Application/Admin/GetAdminLanguagesHandler.cs`
  - `TranslationApp.Application/Admin/AddLanguageCommand.cs`
  - `TranslationApp.Application/Admin/AddLanguageHandler.cs`
  - `TranslationApp.Application/Admin/ToggleLanguageCommand.cs`
  - `TranslationApp.Application/Admin/ToggleLanguageHandler.cs`
  - `TranslationApp.Application/DTOs/LanguageDto.cs`
  - `TranslationApp.Application/DTOs/AddLanguageRequest.cs`
- Depends on: `01-[DB]-add-admin-repositories.md`

## Implementation Notes
- Handlers follow the existing `HandleAsync` pattern (no MediatR); registered as scoped services in `ApplicationServiceRegistration`
- `ToggleLanguageCommand.Id` uses `Guid` (consistent with `ISupportedLanguageRepository.GetByIdAsync(Guid)` signature)
- Duplicate code check in `AddLanguageHandler` is performed in-handler using `GetAllAsync` (no extra query method needed)
- `ToggleLanguageHandler` throws `KeyNotFoundException` for missing IDs and `InvalidOperationException` when disabling `"en"` — consistent with existing exception patterns handled by `ExceptionMiddleware`

## Status: ✅ Complete
