# [UI] Implement polling in TranslationsListFacade

## User Story
> As a user, I can see all my uploaded documents and their translation statuses update automatically while jobs are in progress.

## Description
Implement the polling logic inside `TranslationsListFacade`. On init, the facade loads all documents for the current user via `DocumentService.getDocuments()` and writes them into `TranslationStore`. If any job across any document is `Pending` or `Processing`, the facade starts an `interval(5000)` that re-fetches `GET /api/documents` and updates `TranslationStore` on each tick. Polling stops when all jobs across all documents are in terminal status. The subscription is cleaned up via `takeUntilDestroyed`.

## Acceptance Criteria
- [ ] `TranslationsListFacade` is provided in `TranslationsListComponent`'s `providers` array (already present as a stub)
- [ ] Facade exposes a `documents` signal derived from `TranslationStore.documents`
- [ ] `loadDocuments()` fetches all user documents and writes them into `TranslationStore`
- [ ] After loading, if any job across any document is `Pending` or `Processing`, `interval(5000)` polling starts
- [ ] Each poll tick calls `DocumentService.getDocuments()` and updates `TranslationStore`
- [ ] Polling stops when all jobs across all documents are in terminal status (`Completed` or `Failed`); uses `takeUntilDestroyed` or a `Subject`-based teardown
- [ ] Polling interval is 5000ms (less aggressive than the detail page's 3000ms)
- [ ] No memory leaks — subscription cleaned up on destroy

## Technical Notes
- Layer: UI
- Key file: `frontend/src/app/features/documents/translations-list/translations-list.facade.ts`
- Requires `TranslationStore` to exist with `documents` writable signal and a `setDocuments()` method
- Requires `DocumentService.getDocuments()` method
- Depends on: `07-[UI]-create-status-badge-component.md` (indirectly — polling feeds the data the status badge consumes)
- Consider creating `TranslationStore` as a prerequisite if it doesn't exist
