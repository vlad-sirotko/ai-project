# [UI] Implement polling in TranslationsListFacade

## User Story
> As a user, I can see all my uploaded documents and their translation statuses update automatically while jobs are in progress.

## Description
Implement the polling logic inside `TranslationsListFacade`. On init, the facade loads all documents for the current user via `DocumentService.getDocuments()` and writes them into `TranslationStore`. If any job across any document is `Pending` or `Processing`, the facade starts an `interval(5000)` that re-fetches `GET /api/documents` and updates `TranslationStore` on each tick. Polling stops when all jobs across all documents are in terminal status. The subscription is cleaned up via `takeUntilDestroyed`.

## Acceptance Criteria
- [x] `TranslationsListFacade` is provided in `TranslationsListComponent`'s `providers` array (already present as a stub)
- [x] Facade exposes a `documents` signal derived from `TranslationStore.documents`
- [x] `loadDocuments()` fetches all user documents and writes them into `TranslationStore`
- [x] After loading, if any job across any document is `Pending` or `Processing`, `interval(5000)` polling starts
- [x] Each poll tick calls `DocumentService.getDocuments()` and updates `TranslationStore`
- [x] Polling stops when all jobs across all documents are in terminal status (`Completed` or `Failed`); uses `takeUntilDestroyed` or a `Subject`-based teardown
- [x] Polling interval is 5000ms (less aggressive than the detail page's 3000ms)
- [x] No memory leaks — subscription cleaned up on destroy

## Technical Notes
- Layer: UI
- Key file: `frontend/src/app/features/documents/translations-list/translations-list.facade.ts`
- Requires `TranslationStore` to exist with `documents` writable signal and a `setDocuments()` method
- Requires `DocumentService.getDocuments()` method
- Depends on: `07-[UI]-create-status-badge-component.md` (indirectly — polling feeds the data the status badge consumes)
- Consider creating `TranslationStore` as a prerequisite if it doesn't exist

## Implementation Notes

- Same dual-teardown pattern as task 08: `takeUntil(this.stopPolling$)` for terminal-status stop + `takeUntilDestroyed(this.destroyRef)` for component destroy cleanup
- `hasActiveJobs` checks across all documents and all their jobs — polling stops only when every job in the entire list is `Completed` or `Failed`
- Interval is 5000ms (vs 3000ms on the detail page) to keep the list less aggressive on the API
- `TranslationsListComponent` updated: calls `facade.loadDocuments()` in `ngOnInit`, renders documents with `@for` and inlines `app-status-badge` per job; View link only shown for `Completed` jobs
- Backend prerequisites `GET /api/documents` and `GET /api/documents/{id}` were also implemented as part of this set (handlers, DTOs, repository methods, controller endpoints)

## Status: ✅ Done
