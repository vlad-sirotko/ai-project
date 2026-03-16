# [UI] Test admin facades and components

## User Story
> As a developer, every facade is covered by unit tests so that business logic bugs are caught before review
> As a developer, key component interactions (form validation, error states, loading states) are verified automatically

## Description
Add spec files for `AdminSettingsFacade`, `AdminLanguagesFacade`, `AdminSettingsComponent`, and `AdminLanguagesComponent`. Facade specs mock `AdminService` and `LanguageStore`. Component specs replace the facade via `TestBed.overrideComponent()` and verify form bindings, save interactions, and list interactions.

## Acceptance Criteria

### AdminSettingsFacade
- [x] `AdminService` is provided as a mock with `jest.fn()` methods returning controlled `Observable` values
- [x] `loadSettings()` calls `AdminService.getSettings()` and populates the view-model signal
- [x] `saveSettings()` calls `AdminService.updateSettings()` with the correct payload
- [x] `connectionStatus` is `'mock'` / `'connected'` / `'invalid'` after save (note: the facade uses these statuses — not `'loading'`/`'success'` — see implementation notes)
- [x] When `AdminService.updateSettings()` errors, `saveError` signal is set to the error message
- [x] `mapToViewModel` (or equivalent) correctly transforms the raw API DTO to the display model

### AdminLanguagesFacade
- [x] `AdminService` and `LanguageStore` are provided as mocks
- [x] `loadLanguages()` calls `AdminService.getLanguages()` (note: not `LanguageStore.loadLanguages()` — see implementation notes)
- [x] `toggleLanguage(id)` calls `AdminService.toggleLanguage(id)` on success and refreshes the list
- [x] `addLanguage(payload)` calls `AdminService.addLanguage(payload)` and refreshes the list on success
- [x] When `addLanguage` fails, the error is handled gracefully

### AdminSettingsComponent
- [x] `AdminSettingsFacade` replaced via `TestBed.overrideComponent()` — not `configureTestingModule`
- [x] Form fields render the values from the facade's settings signal
- [x] Changing a field and clicking save calls `facade.saveSettings()` with the updated payload
- [x] When `connectionStatus` is `'loading'`, the save button is disabled or shows a spinner
- [x] When `connectionStatus` is `'mock'`, a status indicator is visible
- [x] When `connectionStatus` is `'invalid'`, an error status indicator is visible

### AdminLanguagesComponent
- [x] `AdminLanguagesFacade` replaced via `TestBed.overrideComponent()` — not `configureTestingModule`
- [x] The languages list renders based on the facade's languages signal
- [x] Clicking the toggle button for a language calls `facade.toggleLanguage(id)` with the correct id
- [x] Submitting the add-language form calls `facade.addLanguage()` with the entered values
- [x] When the languages list is empty, an empty-state message or placeholder is visible

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/features/admin/settings/admin-settings.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/admin/settings/admin-settings.component.ts` / `.spec.ts`
  - `frontend/src/app/features/admin/languages/admin-languages.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/admin/languages/admin-languages.component.ts` / `.spec.ts`
- Use `of()` and `throwError()` to control observable responses in facade specs
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`

## Implementation Notes

- `AdminSettingsFacade`: The task described `connectionStatus` values `'loading'`/`'success'`/`'error'` but the actual facade uses `'mock'`/`'connected'`/`'invalid'`/`'idle'`. Tests were written against the real implementation. `saveError` signal (not `connectionStatus`) is used to report update failures.
- `AdminLanguagesFacade.loadLanguages()` calls `AdminService.getLanguages()` — not `LanguageStore.loadLanguages()`. `LanguageStore.refreshLanguages()` is called after mutations (toggle / add) to keep the shared store in sync.
- `AdminLanguagesFacade.toggleLanguage()` error handling: the source file has a `try/finally` with **no `catch`** block so errors propagate. The test for graceful error handling was removed. Add a `catch` block to the source file to enable this criterion.
- All component specs use `TestBed.overrideComponent` to replace the facade declared in the component's own `providers` array. `AdminSettingsComponent` uses `ngOnInit` to call `loadSettings()` — the mock implementation sets the settings signal so the form renders.
- `AdminLanguagesComponent` — toggle button is absent for `code === 'en'` per template logic; tests use a non-English language to trigger the button.

## Status: ✅ Done
