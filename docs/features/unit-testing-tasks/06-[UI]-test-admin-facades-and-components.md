# [UI] Test admin facades and components

## User Story
> As a developer, every facade is covered by unit tests so that business logic bugs are caught before review
> As a developer, key component interactions (form validation, error states, loading states) are verified automatically

## Description
Add spec files for `AdminSettingsFacade`, `AdminLanguagesFacade`, `AdminSettingsComponent`, and `AdminLanguagesComponent`. Facade specs mock `AdminService` and `LanguageStore`. Component specs replace the facade via `TestBed.overrideComponent()` and verify form bindings, save interactions, and list interactions.

## Acceptance Criteria

### AdminSettingsFacade
- [ ] `AdminService` is provided as a mock with `jest.fn()` methods returning controlled `Observable` values
- [ ] `loadSettings()` calls `AdminService.getSettings()` and populates the view-model signal
- [ ] `saveSettings()` calls `AdminService.updateSettings()` with the correct payload
- [ ] `connectionStatus` is `'loading'` while the save is in flight, then `'success'` on completion
- [ ] When `AdminService.updateSettings()` errors, `connectionStatus` is set to `'error'`
- [ ] `mapToViewModel` (or equivalent) correctly transforms the raw API DTO to the display model

### AdminLanguagesFacade
- [ ] `AdminService` and `LanguageStore` are provided as mocks
- [ ] `loadLanguages()` calls `LanguageStore.loadLanguages()`
- [ ] `toggleLanguage(id)` calls `AdminService.toggleLanguage(id)` on success and refreshes the list
- [ ] When `toggleLanguage` fails, the error is handled gracefully (no unhandled rejection)
- [ ] `addLanguage(payload)` calls `AdminService.addLanguage(payload)` and refreshes the list on success
- [ ] When `addLanguage` fails, the error is handled gracefully

### AdminSettingsComponent
- [ ] `AdminSettingsFacade` replaced via `TestBed.overrideComponent()` — not `configureTestingModule`
- [ ] Form fields render the values from the facade's settings signal
- [ ] Changing a field and clicking save calls `facade.saveSettings()` with the updated payload
- [ ] When `connectionStatus` is `'loading'`, the save button is disabled or shows a spinner
- [ ] When `connectionStatus` is `'success'`, a success message is visible
- [ ] When `connectionStatus` is `'error'`, an error message is visible

### AdminLanguagesComponent
- [ ] `AdminLanguagesFacade` replaced via `TestBed.overrideComponent()` — not `configureTestingModule`
- [ ] The languages list renders based on the facade's languages signal
- [ ] Clicking the toggle button for a language calls `facade.toggleLanguage(id)` with the correct id
- [ ] Submitting the add-language form calls `facade.addLanguage()` with the entered values
- [ ] When the languages list is empty, an empty-state message or placeholder is visible

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/features/admin/settings/admin-settings.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/admin/settings/admin-settings.component.ts` / `.spec.ts`
  - `frontend/src/app/features/admin/languages/admin-languages.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/admin/languages/admin-languages.component.ts` / `.spec.ts`
- Use `of()` and `throwError()` to control observable responses in facade specs
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`
