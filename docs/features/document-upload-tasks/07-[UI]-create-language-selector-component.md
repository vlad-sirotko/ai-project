# [UI] Create LanguageSelectorComponent

## User Story
> As a user, I can pick source and target languages from dropdowns.

## Description
Create a reusable `LanguageSelectorComponent` in `src/app/shared/components/language-selector/`. The component renders a `<select>` (or Angular Material `<mat-select>`) populated from the `LanguageStore`'s active languages signal. It accepts a `label` input and emits the selected language code via `output()`. Designed to be used twice on the upload page (source and target).

## Acceptance Criteria
- [ ] `LanguageSelectorComponent` is a standalone `OnPush` component
- [ ] Reads active languages from `LanguageStore` via `inject()`
- [ ] `label` input (string) displayed above or as placeholder in the dropdown
- [ ] `value` input (string) for two-way binding / controlled value
- [ ] Emits selected language code via `output()` named `languageSelected`
- [ ] Displays language name in the dropdown option, uses language code as option value
- [ ] Component is exported from `shared/` barrel

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/shared/components/language-selector/language-selector.component.ts`
  - `src/app/shared/components/language-selector/language-selector.component.html`
  - `src/app/shared/components/language-selector/language-selector.component.scss`
  - `src/app/core/stores/language.store.ts` (must exist or be created)
  - `src/app/core/services/language.service.ts` (loads languages from `/api/languages`)
- Dependencies: `LanguageStore` and `LanguageService` must be available
