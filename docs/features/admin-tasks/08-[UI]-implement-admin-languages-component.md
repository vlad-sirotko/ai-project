# [UI] Implement AdminLanguagesComponent with Facade and Add-Language Form

## User Story
> As an admin, I can enable or disable supported languages, and add new ones. Disabled languages do not appear in user-facing language dropdowns immediately.

## Description
Build the entire languages page as a cohesive unit:

1. **`AdminLanguagesFacade`** (component-scoped) — encapsulates `AdminService` and `LanguageStore`; exposes `languages` and `isLoading` signals; refreshes `LanguageStore` after a toggle so user-facing dropdowns update immediately.
2. **`AdminLanguagesComponent`** — standalone component that renders the language list with toggle buttons and an inline **[+ Add Language]** form.

Language list: each row shows flag emoji (derived from language code), name, code, active/inactive badge, and Enable/Disable button. The toggle button is hidden (not disabled) for English (`code === 'en'`).

Add-language inline form: shown by clicking **[+ Add Language]**; has `Code` (2–5 lowercase chars) and `Name` (non-empty, max 100 chars) fields with client-side validation; collapses and resets on success or Cancel.

## Acceptance Criteria
**Facade:**
- [x] `languages` signal (`LanguageDto[]`); `isLoading` signal (`boolean`)
- [x] `loadLanguages()` calls `AdminService.getLanguages()` and updates signal
- [x] `toggleLanguage(id)` calls `AdminService.toggleLanguage(id)`, updates `languages` signal in-place, and calls `LanguageStore` refresh
- [x] `addLanguage(code, name)` calls `AdminService.addLanguage()` and appends result to `languages`

**Component:**
- [x] Standalone, `OnPush`, `AdminLanguagesFacade` in `providers` array
- [x] Language list rendered from `facade.languages()` signal; no duplicated local state
- [x] Each row: flag emoji, name, code in parentheses, active/inactive badge, toggle button
- [x] Toggle button label is **Disable** when `isActive = true`, **Enable** when `isActive = false`; hidden for `code === 'en'`
- [x] Loading spinner shown while `facade.isLoading()` is true
- [x] **[+ Add Language]** button toggles inline form visibility
- [x] Form validates `Code` (2–5 lowercase letters) and `Name` (non-empty, max 100 chars) on client
- [x] On add success: new row appears, form resets and collapses; on error: inline error shown
- [x] **Cancel** button collapses the form without submitting; submit button disabled while form invalid or loading
- [x] `loadLanguages()` called on component init

## Implementation Notes
- `LanguageStore` was extended with a `refreshLanguages()` method (bypasses the length guard) so the facade can force a reload of active languages after a toggle, keeping user-facing dropdowns in sync
- Flag emoji is derived from the 2-letter language code via Unicode Regional Indicator Symbols (`charCodeAt + 127397`); codes that are not exactly 2 characters fall back to 🌐
- Client-side validation uses a `pattern="^[a-z]{2,5}$"` attribute on the code field alongside Angular's template-driven form `#ngModel` reference for error display
- `addLanguage` returns a `boolean` so the component can collapse/reset the form only on success, and leave it open with the error message on failure
- The toggle button is conditionally hidden (not disabled) for `code === 'en'` using `@if` in the template, matching the acceptance criteria

## Status: ✅ Complete
