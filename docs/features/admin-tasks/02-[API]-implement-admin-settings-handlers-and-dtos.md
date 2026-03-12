# [API] Implement Admin Settings CQRS Handlers and DTOs

## User Story
> As an admin, I can switch the active translation provider between Mock and DeepL, and set and update the DeepL API key.

## Description
Create all Application-layer CQRS classes for the admin settings feature:

- **`GetAdminSettingsQuery` + `GetAdminSettingsHandler`** — reads all `AppSettings` rows via `IAppSettingRepository` and returns a list of `AppSettingDto`.
- **`UpdateAdminSettingsCommand` + `UpdateAdminSettingsHandler`** — accepts a dictionary of key-value settings to upsert; includes FluentValidation to restrict `TranslationProvider` to `"Mock"` or `"DeepL"`.
- **DTOs**: `AppSettingDto` (Key, Value) and `UpdateAdminSettingsRequest` (Dictionary<string, string> Settings).

## Acceptance Criteria
- [ ] `GetAdminSettingsQuery` record (no parameters); handler returns `IEnumerable<AppSettingDto>`
- [ ] `AppSettingDto` with `Key` and `Value` string properties in `TranslationApp.Application/DTOs/`
- [ ] `UpdateAdminSettingsRequest` with `Dictionary<string, string> Settings`; `UpdateAdminSettingsCommand` wraps it
- [ ] `UpdateAdminSettingsHandler` calls `IAppSettingRepository.UpsertAsync` for each entry
- [ ] FluentValidation validator: when `TranslationProvider` key is present its value must be `"Mock"` or `"DeepL"`
- [ ] Both handlers registered via MediatR (auto-scanned)

## Technical Notes
- Layer: API
- Key files:
  - `TranslationApp.Application/Admin/GetAdminSettingsQuery.cs`
  - `TranslationApp.Application/Admin/GetAdminSettingsHandler.cs`
  - `TranslationApp.Application/Admin/UpdateAdminSettingsCommand.cs`
  - `TranslationApp.Application/Admin/UpdateAdminSettingsHandler.cs`
  - `TranslationApp.Application/DTOs/AppSettingDto.cs`
  - `TranslationApp.Application/DTOs/UpdateAdminSettingsRequest.cs`
- Depends on: `01-[DB]-add-admin-repositories.md`
