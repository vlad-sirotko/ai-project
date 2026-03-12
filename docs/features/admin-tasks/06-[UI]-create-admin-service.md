# [UI] Create AdminService

## User Story
> As an admin, I can switch provider, update the DeepL API key, and manage languages — all persisted via API calls.

## Description
Create `AdminService` in `frontend/src/app/core/services/` to encapsulate all HTTP calls for the admin panel. Also define the TypeScript models `AppSettingDto` and `LanguageDto` in `shared/models/`. HTTP calls must live in a service — never in a component or facade directly.

## Acceptance Criteria
- [x] `AdminService` is `@Injectable({ providedIn: 'root' })`
- [x] `getSettings(): Observable<AppSettingDto[]>` — `GET /api/admin/settings`
- [x] `updateSettings(settings: Record<string, string>): Observable<void>` — `PUT /api/admin/settings`
- [x] `getLanguages(): Observable<LanguageDto[]>` — `GET /api/admin/languages`
- [x] `addLanguage(code: string, name: string): Observable<LanguageDto>` — `POST /api/admin/languages`
- [x] `toggleLanguage(id: string): Observable<LanguageDto>` — `PUT /api/admin/languages/{id}`
- [x] `AppSettingDto` model: `{ key: string; value: string }`
- [x] `LanguageDto` model: `{ id: string; code: string; name: string; isActive: boolean }`
- [x] JWT interceptor (already in core) attaches the Bearer token automatically — no manual header setup needed

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/core/services/admin.service.ts`
  - `frontend/src/app/shared/models/app-setting.model.ts`
  - `frontend/src/app/shared/models/language.model.ts`
- No dependency on other tasks in this set (can be implemented in parallel with `05`)

## Implementation Notes
- `LanguageDto.id` typed as `string` (not `number`) to align with the backend `Guid` return type from the language handlers
- `toggleLanguage` sends an empty object body (`{}`) on the `PUT` request — the backend identifies the language solely by the route `{id}` parameter
- No base URL prefix needed; the Angular dev proxy (`proxy.conf.json`) forwards all `/api/**` requests to the backend, and the JWT interceptor already attaches the `Authorization: Bearer` header
- Models placed in `shared/models/` as separate files (`app-setting.model.ts`, `language.model.ts`) following the project file-naming convention

## Status: ✅ Complete
