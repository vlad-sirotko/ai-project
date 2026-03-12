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
- [ ] `languages` signal (`LanguageDto[]`); `isLoading` signal (`boolean`)
- [ ] `loadLanguages()` calls `AdminService.getLanguages()` and updates signal
- [ ] `toggleLanguage(id)` calls `AdminService.toggleLanguage(id)`, updates `languages` signal in-place, and calls `LanguageStore` refresh
- [ ] `addLanguage(code, name)` calls `AdminService.addLanguage()` and appends result to `languages`

**Component:**
- [ ] Standalone, `OnPush`, `AdminLanguagesFacade` in `providers` array
- [ ] Language list rendered from `facade.languages()` signal; no duplicated local state
- [ ] Each row: flag emoji, name, code in parentheses, active/inactive badge, toggle button
- [ ] Toggle button label is **Disable** when `isActive = true`, **Enable** when `isActive = false`; hidden for `code === 'en'`
- [ ] Loading spinner shown while `facade.isLoading()` is true
- [ ] **[+ Add Language]** button toggles inline form visibility
- [ ] Form validates `Code` (2–5 lowercase letters) and `Name` (non-empty, max 100 chars) on client
- [ ] On add success: new row appears, form resets and collapses; on error: inline error shown
- [ ] **Cancel** button collapses the form without submitting; submit button disabled while form invalid or loading
- [ ] `loadLanguages()` called on component init

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/features/admin/languages/admin-languages.facade.ts`
  - `frontend/src/app/features/admin/languages/admin-languages.component.ts` (+ `.html`, `.scss`)
- Depends on: `05-[UI]-scaffold-admin-section.md`, `06-[UI]-create-admin-service.md`
