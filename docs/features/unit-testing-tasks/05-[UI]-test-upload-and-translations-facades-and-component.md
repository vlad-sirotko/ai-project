# [UI] Test upload and translations facades and component

## User Story
> As a developer, every facade is covered by unit tests so that business logic bugs are caught before review
> As a developer, key component interactions (form validation, error states, loading states) are verified automatically

## Description
Add spec files for `UploadFacade`, `TranslationsListFacade`, `TranslationDetailFacade`, and `UploadComponent`. All three facades require `TestBed` (they use `effect()` or `takeUntilDestroyed`). The `UploadComponent` spec replaces the facade via `TestBed.overrideComponent()`.

## Acceptance Criteria

### UploadFacade
- [ ] Uses `TestBed.configureTestingModule` — not direct instantiation — to support Angular `effect()`
- [ ] `AuthStore`, `DocumentService`, `LanguageStore`, and `Router` are all provided as mocks
- [ ] `validationErrors` is empty when a valid file and language are selected
- [ ] `validationErrors` contains a message when no file is selected
- [ ] `validationErrors` contains a message when no target language is selected
- [ ] `fileTooLargeWarning` is `true` for a file exceeding 20 MB, `false` within the limit
- [ ] Calling `submit()` with valid state calls `DocumentService.uploadDocument()`
- [ ] On successful upload, `Router.navigate()` is called to the translation-detail route

### TranslationsListFacade
- [ ] Uses `TestBed.configureTestingModule` to support `takeUntilDestroyed`
- [ ] `DocumentService`, `TranslationStore`, and `LanguageStore` are provided as mocks
- [ ] The load call delegates to `DocumentService` and populates the store
- [ ] The documents and languages signals reflect the mocked store state
- [ ] No errors thrown when the component context (destroy ref) is torn down

### TranslationDetailFacade
- [ ] Uses `TestBed.configureTestingModule`
- [ ] `DocumentService`, `TranslationStore`, and `LanguageStore` are provided as mocks
- [ ] `availableLanguages` computed signal returns languages not yet present for the selected document
- [ ] `selectJob(jobId)` updates the selected-job state
- [ ] Calling `addLanguage()` with no `documentId` returns early without calling `DocumentService`
- [ ] Calling `addLanguage()` with a valid `documentId` calls `DocumentService.addTranslation()`
- [ ] Polling logic (`startPolling` / `stopPolling$`) is NOT tested in this task

### UploadComponent
- [ ] `UploadFacade` replaced via `TestBed.overrideComponent()` with a mock exposing controlled `signal()` values
- [ ] The template renders `validationErrors` when the signal contains messages
- [ ] The submit button is disabled / shows a loading indicator when the loading signal is `true`
- [ ] Clicking submit calls `facade.submit()`
- [ ] When `facade.fileTooLargeWarning` is `true`, the warning is visible in the DOM

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
