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
- [ ] `GetAdminLanguagesQuery` record (no parameters); handler returns `IEnumerable<LanguageDto>`
- [ ] `LanguageDto` with `Id`, `Code`, `Name`, `IsActive` properties in `TranslationApp.Application/DTOs/`
- [ ] `AddLanguageRequest` with `Code` and `Name` string properties; `AddLanguageCommand` wraps it
- [ ] `AddLanguageHandler` creates a new `SupportedLanguage`, calls `AddAsync`, returns the created `LanguageDto`
- [ ] `AddLanguageHandler` FluentValidation: `Code` is 2–5 lowercase letters only; `Name` non-empty, max 100 chars; duplicate `Code` returns a domain error
- [ ] `ToggleLanguageCommand` record with `string Id`; handler flips `IsActive` and calls `UpdateAsync`
- [ ] `ToggleLanguageHandler` returns not-found error if ID is unknown; returns domain error if attempting to disable `"en"`
- [ ] All handlers registered via MediatR (auto-scanned)

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
