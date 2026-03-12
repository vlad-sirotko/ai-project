# [UI] Implement polling in TranslationDetailFacade

## User Story
> As a user, I see a spinner while translation is in progress, without having to refresh the page.

## Description
Implement the polling logic inside `TranslationDetailFacade`. On init, the facade loads the document by ID (from the route param) via `DocumentService`. If any `TranslationJob` is in `Pending` or `Processing` status, the facade starts an `interval(3000)` that re-fetches `GET /api/documents/{id}` and updates `TranslationStore` on each tick. Polling stops automatically when all jobs reach a terminal status (`Completed` or `Failed`). The subscription is cleaned up via `takeUntilDestroyed`.

## Acceptance Criteria
- [ ] `TranslationDetailFacade` is provided in `TranslationDetailComponent`'s `providers` array (already present as a stub)
- [ ] Facade exposes a `document` signal derived from `TranslationStore.selectedDocument`
- [ ] `loadDocument(documentId: string)` fetches the document and writes it into `TranslationStore`
- [ ] After loading, if any job is `Pending` or `Processing`, `interval(3000)` polling starts
- [ ] Each poll tick calls `DocumentService.getDocument(id)` and updates `TranslationStore`
- [ ] Polling stops when all jobs have terminal status (`Completed` or `Failed`); uses `takeUntilDestroyed` or a `Subject`-based teardown
- [ ] Polling is not started if all jobs are already in terminal status on first load
- [ ] No memory leaks — subscription cleaned up on destroy

## Technical Notes
- Layer: UI
- Key file: `frontend/src/app/features/documents/translation-detail/translation-detail.facade.ts`
- Requires `TranslationStore` to exist with `selectedDocument` writable signal and an `setSelectedDocument()` method
- Requires `DocumentService.getDocument(id: string)` method
- Depends on: `07-[UI]-create-status-badge-component.md` (indirectly — polling feeds the data the status badge consumes)
- Consider creating `TranslationStore` as a prerequisite if it doesn't exist
