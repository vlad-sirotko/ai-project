# [UI] Extend TranslationDetailFacade with add-language and retry mutations

## User Story
> As a user, I can add a new target language from the detail page.
> As a user, I can retry a failed translation.

## Description
Add `addLanguage(targetLang: string)` and `retryTranslation(targetLang: string)` methods to `TranslationDetailFacade`. Both call `DocumentService.addTranslation()`. On success, `addLanguage` re-fetches the full document (to get the new job with its ID), updates `TranslationStore`, auto-selects the new tab, and restarts polling if needed. `retryTranslation` does the same, replacing the failed job with the new pending one.

## Acceptance Criteria
- [x] `addLanguage(targetLang: string): void` calls `documentService.addTranslation(documentId, targetLang)` and on success triggers a document re-fetch that updates the store
- [x] After `addLanguage` succeeds, `selectedJobId` is set to the new job's ID (auto-switch to new tab)
- [x] `retryTranslation(targetLang: string): void` calls the same HTTP method; after success the failed job is replaced in the store and polling restarts
- [x] Polling is (re)started after either mutation if the refreshed document has active jobs
- [x] `addLanguageError` and `retryError` signals expose error strings (or `null`) for template display
- [x] The current `documentId` is stored locally in the facade when `loadDocument` is called so mutations don't need it passed again

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translation-detail/translation-detail.facade.ts`
- Depends on: `03-[UI]-add-add-translation-method-to-document-service.md`, `04-[UI]-extend-facade-with-selected-job-and-copy-text.md`
- Uses `LanguageStore` to resolve language name from code (for display purposes, if needed)

## Implementation Notes
- `currentDocumentId` is stored as a plain class field (not a signal) — it is set once in `loadDocument` and only read synchronously in mutation methods.
- Both `addLanguage` and `retryTranslation` share the private `refreshAfterMutation(selectJobId?)` helper, which stops any running poll, re-fetches the document, updates the store, auto-selects the new/retried job, and restarts polling if needed — keeping the two flows fully DRY.
- The existing polling subscription is cancelled via `stopPolling$.next()` before starting a fresh one to prevent duplicate poll streams after a mutation.
- Error signals are reset to `null` at the start of each call so stale errors are cleared on retry.

## Status: ✅ Done
