# [UI] Wire Up DocumentService Upload Call

## User Story
> As a user, when I click "Translate", my PDF and language selections are sent to the backend to start a translation job.

## Description
Implement `DocumentService.upload()` in `src/app/core/services/document.service.ts` and wire it into `UploadFacade`. The service method constructs a `FormData` payload (file, sourceLang, targetLang) and POSTs it to `POST /api/documents/upload`, returning the typed `UploadResponseDto`. The facade calls this method on form submit, manages the loading signal, and surfaces any error message to the component.

## Acceptance Criteria
- [x] `DocumentService.upload(file, sourceLang, targetLang)` method is implemented
- [x] Uses `HttpClient.post()` with `FormData` and returns `Observable<UploadResponseDto>`
- [x] The JWT interceptor automatically attaches the Bearer token (no manual headers needed)
- [x] `UploadFacade.submit()` method calls `documentService.upload()` and handles `loading` and `error` signals
- [x] On HTTP error (4xx/5xx), `error` signal is set with a user-friendly message
- [x] `UploadResponseDto` TypeScript interface is defined in `src/app/shared/models/`

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/core/services/document.service.ts`
  - `src/app/features/documents/upload/upload.facade.ts`
  - `src/app/shared/models/upload-response.model.ts`
- Dependencies:
  - `05-[API]-add-upload-document-endpoint.md` (endpoint must exist to test end-to-end)
  - `08-[UI]-implement-upload-page-form-and-validation.md` (facade scaffolded here)

## Implementation Notes
- `src/app/shared/models/upload-response.model.ts` — `UploadResponseModel` interface with fields `documentId`, `jobId`, `status`, `isExisting` (matches backend `UploadResponseDto` with camelCase JSON serialization)
- `src/app/core/services/document.service.ts` — `DocumentService` with `upload()` appending `file`, `sourceLang`, `targetLang` to `FormData`; no `Content-Type` header set manually (browser sets `multipart/form-data` boundary automatically)
- `UploadFacade.submit()` uses `firstValueFrom()` to await the observable; catches `HttpErrorResponse` and extracts `err.error.message ?? err.error.title` for a user-friendly error message
- `_isLoading` signal is set in `try/finally` to guarantee reset on both success and failure

## Status: ✅ Done
