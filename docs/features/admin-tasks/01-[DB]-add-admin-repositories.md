# [DB] Add Admin Repositories (AppSetting + SupportedLanguage)

## User Story
> As an admin, I can switch the active translation provider between Mock and DeepL, set and update the DeepL API key, and enable or disable supported languages.

## Description
Define and implement two Application-layer repository interfaces and their Infrastructure implementations:

1. **`IAppSettingRepository`** — read/write access to the `AppSettings` table (key-value pairs that drive provider selection and DeepL configuration).
2. **`ISupportedLanguageRepository`** — CRUD access to the `SupportedLanguages` table (used by both the admin panel and the user-facing language dropdown).

No EF Core migrations are needed; both tables already exist in the schema.

## Acceptance Criteria
- [x] `IAppSettingRepository` defined in `TranslationApp.Application/Interfaces/` with `GetAllAsync()`, `GetByKeyAsync(string key)`, and `UpsertAsync(string key, string value)` methods
- [x] `AppSettingRepository` implemented in `TranslationApp.Infrastructure/Repositories/` using `AppDbContext`; `UpsertAsync` uses EF Core Update/Add pattern based on key existence
- [x] `ISupportedLanguageRepository` defined in `TranslationApp.Application/Interfaces/` with `GetAllAsync()`, `GetActiveAsync()`, `GetByIdAsync(string id)`, `AddAsync(SupportedLanguage)`, and `UpdateAsync(SupportedLanguage)` methods
- [x] `SupportedLanguageRepository` implemented in `TranslationApp.Infrastructure/Repositories/`; `GetActiveAsync()` filters by `IsActive == true`
- [x] Both repositories registered in `InfrastructureServiceRegistration`

## Technical Notes
- Layer: DB
- Key files:
  - `TranslationApp.Application/Interfaces/IAppSettingRepository.cs`
  - `TranslationApp.Infrastructure/Repositories/AppSettingRepository.cs`
  - `TranslationApp.Application/Interfaces/ISupportedLanguageRepository.cs`
  - `TranslationApp.Infrastructure/Repositories/SupportedLanguageRepository.cs`
  - `TranslationApp.Infrastructure/InfrastructureServiceRegistration.cs`
- No migration needed — `AppSettings` and `SupportedLanguages` tables already exist

## Implementation Notes
- `SupportedLanguage` entity created in `TranslationApp.Domain/Entities/SupportedLanguage.cs` (was missing from domain)
- `SupportedLanguages` DbSet and EF configuration added to `AppDbContext`
- Migration `AddSupportedLanguages` created to add the `SupportedLanguages` table
- Seed data for English, Russian, and Polish languages added to `DbSeeder.SeedSupportedLanguagesAsync` (idempotent)
- `GetByIdAsync` uses `Guid` (consistent with all other repository patterns in the project)

## Status: ✅ Complete
