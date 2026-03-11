# [API] Add SHA-256 Duplicate File Detection

## User Story
> As a user, if I upload the same PDF I uploaded before, the file is not saved twice.

## Description
Add a helper utility (or inline logic within the handler) that computes the SHA-256 hash of the uploaded file's bytes. The hash is stored in `Document.FileHash` and used to detect whether the same file has already been uploaded by this user, allowing the backend to reuse the existing `Document` record and skip saving the file to disk again.

## Acceptance Criteria
- [x] SHA-256 hash is computed from the raw file bytes using `System.Security.Cryptography.SHA256`
- [x] Hash is formatted as a lowercase hex string (64 characters)
- [x] `IDocumentRepository` exposes `GetByUserAndHashAsync(userId, fileHash)` method
- [x] When a matching `Document` is found, `IFileStorageService.SaveFileAsync` is **not** called
- [x] When no matching `Document` is found, a new `Document` is created with the computed hash, and the file is saved to `/uploads/{newDocumentId}.pdf`
- [x] `IFileStorageService` interface is defined in `TranslationApp.Application/Interfaces/` and implemented in `TranslationApp.Infrastructure/Services/LocalFileStorageService.cs`

## Technical Notes
- Layer: API
- Key files / classes involved:
  - `TranslationApp.Application/Documents/UploadDocumentHandler.cs` (hash computed here)
  - `TranslationApp.Application/Interfaces/IFileStorageService.cs`
  - `TranslationApp.Infrastructure/Services/LocalFileStorageService.cs`
  - `TranslationApp.Application/Interfaces/IDocumentRepository.cs`
- Dependencies:
  - `01-[DB]-create-document-entity-and-migration.md`
  - `03-[API]-implement-upload-document-handler.md` (implemented as part of or before handler)

## Implementation Notes
- Implemented as part of task 03 — all logic lives inside `UploadDocumentHandler.HandleAsync`
- `ComputeSha256Hash(byte[])` is a private static method using `SHA256.HashData()` + `Convert.ToHexString().ToLowerInvariant()` — produces a 64-character lowercase hex string
- `LocalFileStorageService` uses `IHostEnvironment.ContentRootPath` to resolve the `uploads/` folder, creates it if it doesn't exist, and writes `{documentId}.pdf`
- Build succeeded with 0 errors

## Status: ✅ Done
