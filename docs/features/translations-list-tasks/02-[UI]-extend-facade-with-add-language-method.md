# [UI] Extend TranslationsListFacade with addLanguage Method

## User Story
> As a user, I can add a new target language to an existing document without re-uploading

## Description
Add an `addLanguage(documentId: string, targetLang: string)` method to `TranslationsListFacade`. The method calls `DocumentService.addTranslation()`, then refreshes the `TranslationStore` so the new Pending job appears immediately in the list without a full page reload.

## Acceptance Criteria
- [ ] `addLanguage(documentId, targetLang)` method exists on the facade
- [ ] Calls `DocumentService.addTranslation(documentId, targetLang)` via the existing service method
- [ ] On success, calls `loadDocuments()` (or equivalent) to refresh `TranslationStore` with updated document list
- [ ] Error case is handled gracefully (console error or error signal — no unhandled observable errors)
- [ ] Polling restarts after adding a language (new Pending job means `hasActiveJobs` becomes true)

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translations-list/translations-list.facade.ts`
- Depends on `DocumentService.addTranslation()` (already implemented)
- Depends on `TranslationStore.setDocuments()` / `loadDocuments()` (already implemented)
- Task 05 (add-language dropdown template) depends on this task

## Implementation Notes
- `addLanguage(documentId, targetLang)` calls `DocumentService.addTranslation()` and on success calls `loadDocuments()`, which refreshes the store and automatically restarts polling if the new Pending job is detected (via `hasActiveJobs`).
- Errors are caught with `catchError` + `EMPTY` and logged to console — no unhandled observable errors propagate to the component.
- The method is public on the facade so the component template can bind to it directly.

## Status: ✅ Done
