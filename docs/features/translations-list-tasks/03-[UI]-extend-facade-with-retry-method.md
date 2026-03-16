# [UI] Extend TranslationsListFacade with retry Method

## User Story
> As a user, I can retry a failed translation job

## Description
Add a `retry(documentId: string, targetLang: string)` method to `TranslationsListFacade`. Retrying a failed job is identical to adding a new translation for the same language — it calls `POST /api/documents/{id}/translate` with the same `targetLang`. The method replaces the failed job row with a new Pending entry by refreshing the document list from the store.

## Acceptance Criteria
- [ ] `retry(documentId, targetLang)` method exists on the facade
- [ ] Calls `DocumentService.addTranslation(documentId, targetLang)` (same call as addLanguage)
- [ ] On success, refreshes `TranslationStore` so the new Pending job replaces the Failed row in the UI
- [ ] Polling restarts after retry (new Pending job means polling should be active)
- [ ] Error case is handled gracefully

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translations-list/translations-list.facade.ts`
- Backend already supports this: `POST /api/documents/{id}/translate` creates a new job even if a failed one exists (handler creates a new job row)
- Task 04 (retry button template) depends on this task
- Can be implemented alongside task 02 (addLanguage facade method) — both are facade changes
