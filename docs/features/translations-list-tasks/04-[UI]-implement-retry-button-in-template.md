# [UI] Implement Retry Button in Translations List Template

## User Story
> As a user, I can retry a failed translation job

## Description
Add a `[Retry]` button to the job row inside `TranslationsListComponent` template. The button is only visible when a job's `status === 'Failed'`. Clicking it calls `facade.retry(document.id, job.targetLanguage)` and the row updates to show a new Pending status badge once the store refreshes.

## Acceptance Criteria
- [ ] A `[Retry]` button is rendered only on job rows where `status === 'Failed'`
- [ ] Clicking `[Retry]` calls `facade.retry(document.id, job.targetLanguage)`
- [ ] After retry, the job row updates to show `○ Pending` status (driven by store refresh)
- [ ] Button is disabled while the retry call is in-flight (optional but preferred)
- [ ] Button is not shown for Pending, Processing, or Completed jobs

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translations-list/translations-list.component.html`, `translations-list.component.ts`
- Depends on task 03 (`retry` facade method)
- Depends on task 01 (`StatusBadgeComponent`) for the updated badge display

## Implementation Notes
- The retry button is rendered inside an `@if (job.status === 'Failed')` block so it is strictly invisible for any other status.
- The button is disabled while the retry is in-flight by binding `[disabled]="facade.isRetrying(doc.id, job.targetLanguage)"`. The facade tracks in-flight keys with a `signal<string[]>` keyed by `${documentId}:${targetLang}` and clears the key on both success and error.
- The button label changes to `Retrying…` while disabled to give visual feedback without needing a spinner component.
- After the API call succeeds, `loadDocuments()` is called, the store refreshes, and the job row transitions from Failed to Pending driven entirely by the signal update.

## Status: ✅ Done
