# [UI] Navigate to Translation Detail on Success

## User Story
> As a user, after uploading a PDF, I am taken to the translation detail page. If a completed translation already exists for that language, I am redirected to it immediately without waiting.

## Description
After `DocumentService.upload()` returns a successful `UploadResponseDto`, the `UploadFacade` navigates the user to `/app/translations/{documentId}`. This navigation happens for both new jobs (`isExisting=false`, user will see a Pending status and polling will begin) and existing completed jobs (`isExisting=true`, detail page shows results immediately).

## Acceptance Criteria
- [ ] On successful upload response, `UploadFacade` calls `Router.navigate(['/app/translations', response.documentId])`
- [ ] Navigation occurs regardless of `isExisting` value (both new and existing jobs go to the same detail page)
- [ ] Navigation does not occur if an HTTP error was returned
- [ ] The route `/app/translations/:id` exists and is registered (may be a stub until `TranslationDetailComponent` is implemented)

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/features/documents/upload/upload.facade.ts`
  - `src/app/app.routes.ts`
- Dependencies:
  - `08-[UI]-implement-upload-page-form-and-validation.md`
  - `09-[UI]-wire-up-document-service-upload-call.md`
