# [UI] Test upload and translations facades and component

## User Story
> As a developer, every facade is covered by unit tests so that business logic bugs are caught before review
> As a developer, key component interactions (form validation, error states, loading states) are verified automatically

## Description
Add spec files for `UploadFacade`, `TranslationsListFacade`, `TranslationDetailFacade`, and `UploadComponent`. All three facades require `TestBed` (they use `effect()` or `takeUntilDestroyed`). The `UploadComponent` spec replaces the facade via `TestBed.overrideComponent()`.

## Acceptance Criteria

### UploadFacade
- [x] Uses `TestBed.configureTestingModule` — not direct instantiation — to support Angular `effect()`
- [x] `AuthStore`, `DocumentService`, `LanguageStore`, and `Router` are all provided as mocks
- [x] `validationErrors` is empty when a valid file and language are selected
- [x] `validationErrors` contains a message when no file is selected
- [x] `validationErrors` contains a message when no target language is selected
- [x] `fileTooLargeWarning` is `true` for a file exceeding 20 MB, `false` within the limit
- [x] Calling `submit()` with valid state calls `DocumentService.uploadDocument()`
- [x] On successful upload, `Router.navigate()` is called to the translation-detail route

### TranslationsListFacade
- [x] Uses `TestBed.configureTestingModule` to support `takeUntilDestroyed`
- [x] `DocumentService`, `TranslationStore`, and `LanguageStore` are provided as mocks
- [x] The load call delegates to `DocumentService` and populates the store
- [x] The documents and languages signals reflect the mocked store state
- [x] No errors thrown when the component context (destroy ref) is torn down

### TranslationDetailFacade
- [x] Uses `TestBed.configureTestingModule`
- [x] `DocumentService`, `TranslationStore`, and `LanguageStore` are provided as mocks
- [x] `availableLanguages` computed signal returns languages not yet present for the selected document
- [x] `selectJob(jobId)` updates the selected-job state
- [x] Calling `addLanguage()` with no `documentId` returns early without calling `DocumentService`
- [x] Calling `addLanguage()` with a valid `documentId` calls `DocumentService.addTranslation()`
- [x] Polling logic (`startPolling` / `stopPolling$`) is NOT tested in this task

### UploadComponent
- [x] `UploadFacade` replaced via `TestBed.overrideComponent()` with a mock exposing controlled `signal()` values
- [x] The template renders `validationErrors` when the signal contains messages
- [x] The submit button is disabled / shows a loading indicator when the loading signal is `true`
- [x] Clicking submit calls `facade.submit()`
- [x] When `facade.fileTooLargeWarning` is `true`, the warning is visible in the DOM

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/features/documents/upload/upload.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/documents/upload/upload.component.ts` / `.spec.ts`
  - `frontend/src/app/features/documents/translations-list/translations-list.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/documents/translation-detail/translation-detail.facade.ts` / `.spec.ts`
- Use `inject()` inside `TestBed.runInInjectionContext` (or `TestBed.inject`) to obtain facade instances so `effect()` runs in the correct context
- Use `of()` / `throwError()` for observable mock responses
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`

## Implementation Notes

- `UploadFacade`: `TestBed.flushEffects()` must be called after `TestBed.inject(UploadFacade)` so the constructor `effect()` runs synchronously and sets `_sourceLang` / `_targetLang` from the mocked `defaultSourceLanguage` / `defaultTargetLanguage` signals before assertions run
- `UploadFacade` no-target-lang test: the facade is re-instantiated in a fresh `TestBed` with a `null` default target signal so that the effect never sets `_targetLang`, confirming the validation error is produced
- `UploadComponent`: `NO_ERRORS_SCHEMA` is used to suppress sub-component errors; `provideHttpClient()` + `provideHttpClientTesting()` are required because `LanguageSelectorComponent` (a child) is provided-in-root and pulls `LanguageStore → LanguageService → HttpClient` from the root injector even when the component under test doesn't use it directly
- `TranslationsListFacade` + `TranslationDetailFacade`: both use `takeUntilDestroyed(this.destroyRef)` for polling — `TestBed.resetTestingModule()` covers teardown testing without needing to trigger the interval
- `TranslationDetailFacade`: `loadDocument()` is called before `addLanguage()` in the "valid documentId" test to set `currentDocumentId` (private) via the public method

## Status: ✅ Done
