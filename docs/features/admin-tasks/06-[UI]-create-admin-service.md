# [UI] Create AdminService

## User Story
> As an admin, I can switch provider, update the DeepL API key, and manage languages — all persisted via API calls.

## Description
Create `AdminService` in `frontend/src/app/core/services/` to encapsulate all HTTP calls for the admin panel. Also define the TypeScript models `AppSettingDto` and `LanguageDto` in `shared/models/`. HTTP calls must live in a service — never in a component or facade directly.

## Acceptance Criteria
- [ ] `AdminService` is `@Injectable({ providedIn: 'root' })`
- [ ] `getSettings(): Observable<AppSettingDto[]>` — `GET /api/admin/settings`
- [ ] `updateSettings(settings: Record<string, string>): Observable<void>` — `PUT /api/admin/settings`
- [ ] `getLanguages(): Observable<LanguageDto[]>` — `GET /api/admin/languages`
- [ ] `addLanguage(code: string, name: string): Observable<LanguageDto>` — `POST /api/admin/languages`
- [ ] `toggleLanguage(id: string): Observable<LanguageDto>` — `PUT /api/admin/languages/{id}`
- [ ] `AppSettingDto` model: `{ key: string; value: string }`
- [ ] `LanguageDto` model: `{ id: string; code: string; name: string; isActive: boolean }`
- [ ] JWT interceptor (already in core) attaches the Bearer token automatically — no manual header setup needed

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/core/services/admin.service.ts`
  - `frontend/src/app/shared/models/app-setting.model.ts`
  - `frontend/src/app/shared/models/language.model.ts`
- No dependency on other tasks in this set (can be implemented in parallel with `05`)
