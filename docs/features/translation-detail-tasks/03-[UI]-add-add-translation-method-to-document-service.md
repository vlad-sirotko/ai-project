# [UI] Add addTranslation method to DocumentService

## User Story
> As a user, I can add a new target language from the detail page.
> As a user, I can retry a failed translation.

## Description
Extend `DocumentService` with an `addTranslation(documentId, targetLang)` method that calls `POST /api/documents/{id}/translate` and returns an `Observable<TranslationJobModel>`. This is the single HTTP method used by both the "add language" and "retry" flows in the facade.

## Acceptance Criteria
- [x] `DocumentService.addTranslation(documentId: string, targetLang: string): Observable<TranslationJobModel>` method added
- [x] Posts `{ targetLanguage }` JSON body to `/api/documents/{documentId}/translate`
- [x] Response is typed as `TranslationJobModel` (verify `TranslationJobModel` has all fields returned by the API: `id`, `targetLanguage`, `status`, `translatedText`, `errorMessage`, `createdAt`, `completedAt`)
- [x] No changes to existing `DocumentService` methods

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/services/document.service.ts`, `frontend/src/app/shared/models/translation-job.model.ts`
- Depends on: `02-[API]-add-post-translate-endpoint.md`

## Implementation Notes
- Added `addTranslation(documentId: string, targetLang: string): Observable<TranslationJobModel>` to `DocumentService`.
- Posts `{ targetLanguage: targetLang }` JSON to `/api/documents/{documentId}/translate`, typed against the existing `TranslationJobModel` which already covers all API response fields.
- `TranslationJobModel` was already complete — no changes needed to the model file.

## Status: ✅ Done
