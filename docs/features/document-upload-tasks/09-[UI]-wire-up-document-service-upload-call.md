# [UI] Wire Up DocumentService Upload Call

## User Story
> As a user, when I click "Translate", my PDF and language selections are sent to the backend to start a translation job.

## Description
Implement `DocumentService.upload()` in `src/app/core/services/document.service.ts` and wire it into `UploadFacade`. The service method constructs a `FormData` payload (file, sourceLang, targetLang) and POSTs it to `POST /api/documents/upload`, returning the typed `UploadResponseDto`. The facade calls this method on form submit, manages the loading signal, and surfaces any error message to the component.

## Acceptance Criteria
- [ ] `DocumentService.upload(file, sourceLang, targetLang)` method is implemented
- [ ] Uses `HttpClient.post()` with `FormData` and returns `Observable<UploadResponseDto>`
- [ ] The JWT interceptor automatically attaches the Bearer token (no manual headers needed)
- [ ] `UploadFacade.submit()` method calls `documentService.upload()` and handles `loading` and `error` signals
- [ ] On HTTP error (4xx/5xx), `error` signal is set with a user-friendly message
- [ ] `UploadResponseDto` TypeScript interface is defined in `src/app/shared/models/`

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/core/services/document.service.ts`
  - `src/app/features/documents/upload/upload.facade.ts`
  - `src/app/shared/models/upload-response.model.ts`
- Dependencies:
  - `05-[API]-add-upload-document-endpoint.md` (endpoint must exist to test end-to-end)
  - `08-[UI]-implement-upload-page-form-and-validation.md` (facade scaffolded here)
