# [UI] Create LanguageSelectorComponent

## User Story
> As a user, I can pick source and target languages from dropdowns.

## Description
Create a reusable `LanguageSelectorComponent` in `src/app/shared/components/language-selector/`. The component renders a `<select>` (or Angular Material `<mat-select>`) populated from the `LanguageStore`'s active languages signal. It accepts a `label` input and emits the selected language code via `output()`. Designed to be used twice on the upload page (source and target).

## Acceptance Criteria
- [x] `LanguageSelectorComponent` is a standalone `OnPush` component
- [x] Reads active languages from `LanguageStore` via `inject()`
- [x] `label` input (string) displayed above or as placeholder in the dropdown
- [x] `value` input (string) for two-way binding / controlled value
- [x] Emits selected language code via `output()` named `languageSelected`
- [x] Displays language name in the dropdown option, uses language code as option value
- [x] Component is exported from `shared/` barrel

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/shared/components/language-selector/language-selector.component.ts`
  - `src/app/shared/components/language-selector/language-selector.component.html`
  - `src/app/shared/components/language-selector/language-selector.component.scss`
  - `src/app/core/stores/language.store.ts` (must exist or be created)
  - `src/app/core/services/language.service.ts` (loads languages from `/api/languages`)
- Dependencies: `LanguageStore` and `LanguageService` must be available

## Implementation Notes
- Uses `input()`, `output()` (Angular 20 signal-based APIs)
- `activeLanguages` and `isLoading` are readonly signals exposed from `LanguageSelectorFacade`; template uses `@for` control flow with `track lang.id`
- `LanguageSelectorFacade` is declared in the component's `providers` array and is the only dependency injected into the component — `LanguageStore` and `LanguageService` are never touched directly from the component
- `LanguageStore.loadLanguages()` is lazy: no-op if languages are already loaded; called in `ngOnInit` via the facade
- `SupportedLanguageModel` interface added at `src/app/shared/models/supported-language.model.ts`
- `LanguageService` added at `src/app/core/services/language.service.ts` — `getActiveLanguages()` calls `GET /api/languages`
- `LanguageStore` added at `src/app/core/stores/language.store.ts` — signals: `languages`, `activeLanguages` (computed, filters `isActive`), `isLoading`
- Native `<select>` with disabled state while loading; placeholder option has `value=""` and `disabled`
- Barrel export added at `src/app/shared/index.ts`
- Angular build succeeded with 0 errors

## Status: ✅ Done
