# [UI] Navigate to Translation Detail on Success

## User Story
> As a user, after uploading a PDF, I am taken to the translation detail page. If a completed translation already exists for that language, I am redirected to it immediately without waiting.

## Description
After `DocumentService.upload()` returns a successful `UploadResponseDto`, the `UploadFacade` navigates the user to `/app/translations/{documentId}`. This navigation happens for both new jobs (`isExisting=false`, user will see a Pending status and polling will begin) and existing completed jobs (`isExisting=true`, detail page shows results immediately).

## Acceptance Criteria
- [x] On successful upload response, `UploadFacade` calls `Router.navigate(['/app/translations', response.documentId])`
- [x] Navigation occurs regardless of `isExisting` value (both new and existing jobs go to the same detail page)
- [x] Navigation does not occur if an HTTP error was returned
- [x] The route `/app/translations/:id` exists and is registered (may be a stub until `TranslationDetailComponent` is implemented)

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/features/documents/upload/upload.facade.ts`
  - `src/app/app.routes.ts`
- Dependencies:
  - `08-[UI]-implement-upload-page-form-and-validation.md`
  - `09-[UI]-wire-up-document-service-upload-call.md`

## Implementation Notes
- Navigation is done inside `UploadFacade.submit()` via `await this.router.navigate(['/app/translations', response.documentId])` immediately after a successful response
- The `catch` block prevents navigation on HTTP errors — `router.navigate` is only reached in the `try` block after a successful `firstValueFrom()` resolves
- Route `/app/translations/:id` was already registered in `app.routes.ts` pointing to `TranslationDetailComponent` (stub)

## Status: ✅ Done
