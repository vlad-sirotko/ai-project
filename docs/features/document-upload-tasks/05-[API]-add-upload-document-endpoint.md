# [API] Add Upload Document Endpoint

## User Story
> As a user, I can upload a PDF file and select source and target languages to start a translation.

## Description
Add a `POST /api/documents/upload` action to `DocumentsController` (create controller if it doesn't exist). The action accepts a `multipart/form-data` request containing the PDF file and language codes, dispatches `UploadDocumentCommand` to the handler, and returns the `UploadResponseDto`. The endpoint requires JWT authentication (User role). Register the `DocumentsController` in DI/routing.

## Acceptance Criteria
- [x] `DocumentsController` exists at `TranslationApp.API/Controllers/DocumentsController.cs`
- [x] `POST /api/documents/upload` action is implemented
- [x] Action accepts: `IFormFile file`, `string sourceLang`, `string targetLang` from multipart form
- [x] Action is decorated with `[Authorize]`
- [x] Extracts `UserId` from JWT claims and passes it to the command
- [x] Returns `200 OK` with `UploadResponseDto` on success
- [x] Returns appropriate error responses for validation failures (400) and auth failures (401)
- [x] Global exception middleware handles unexpected errors (500)

## Technical Notes
- Layer: API
- Key files / classes involved:
  - `TranslationApp.API/Controllers/DocumentsController.cs`
  - `TranslationApp.Application/Documents/UploadDocumentCommand.cs`
  - `TranslationApp.Application/DTOs/UploadResponseDto.cs`
  - `TranslationApp.API/Program.cs` (DI registration if needed)
- Dependencies:
  - `03-[API]-implement-upload-document-handler.md`
  - `04-[API]-add-sha256-duplicate-detection.md`

## Implementation Notes
- `[Authorize]` applied at controller level — all actions on `DocumentsController` require a valid JWT
- File bytes are read via `MemoryStream` before constructing the command; `using` ensures disposal
- `UserId` extracted from `ClaimTypes.NameIdentifier` following the same pattern as `AuthController`
- No additional DI registration needed — `UploadDocumentHandler` was already registered in task 03
- Endpoint verified at runtime: `/api/documents/upload` visible in Swagger spec
- Build succeeded with 0 errors

## Status: ✅ Done
