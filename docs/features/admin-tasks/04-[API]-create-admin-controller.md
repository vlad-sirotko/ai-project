# [API] Create AdminController with All Admin Endpoints

## User Story
> As an admin, I can manage translation provider settings and supported languages via a dedicated API protected by the Admin role.

## Description
Create `AdminController` in `TranslationApp.API/Controllers/` and implement all five admin endpoints by dispatching to MediatR handlers. A class-level `[Authorize(Roles = "Admin")]` attribute protects every action.

| Method | Route | Handler |
|--------|-------|---------|
| GET | `/api/admin/settings` | `GetAdminSettingsQuery` |
| PUT | `/api/admin/settings` | `UpdateAdminSettingsCommand` |
| GET | `/api/admin/languages` | `GetAdminLanguagesQuery` |
| POST | `/api/admin/languages` | `AddLanguageCommand` |
| PUT | `/api/admin/languages/{id}` | `ToggleLanguageCommand` |

## Acceptance Criteria
- [x] `[Route("api/admin")]` controller with class-level `[Authorize(Roles = "Admin")]`
- [x] `GET /api/admin/settings` → `200 OK` with `IEnumerable<AppSettingDto>`
- [x] `PUT /api/admin/settings` → `204 No Content` on success; `400` on validation failure
- [x] `GET /api/admin/languages` → `200 OK` with `IEnumerable<LanguageDto>` (all languages)
- [x] `POST /api/admin/languages` → `201 Created` with new `LanguageDto`; `400` on validation or duplicate code
- [x] `PUT /api/admin/languages/{id}` → `200 OK` with updated `LanguageDto`; `404` if not found; `400` if disabling English
- [x] Controller is auto-discovered by ASP.NET Core assembly scan in `Program.cs`

## Technical Notes
- Layer: API
- Key files: `TranslationApp.API/Controllers/AdminController.cs`
- Depends on: `02-[API]-implement-admin-settings-handlers-and-dtos.md`, `03-[API]-implement-admin-languages-handlers-and-dtos.md`

## Implementation Notes
- `ToggleLanguageHandler` was updated to return `LanguageDto` (previously `void`) to satisfy the `200 OK` with body requirement
- Route constraint `{id:guid}` used on the toggle endpoint to match `ToggleLanguageCommand(Guid Id)`
- Error cases (`KeyNotFoundException` → 404, `InvalidOperationException` → 400, `ValidationException` → 400) are handled by the existing `ExceptionMiddleware` — no per-action try/catch needed

## Status: ✅ Complete
