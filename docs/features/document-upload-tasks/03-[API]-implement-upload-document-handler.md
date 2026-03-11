# [API] Implement UploadDocumentCommand and Handler

## User Story
> As a user, I can upload a PDF file and select source and target languages to create a translation job.

## Description
Implement `UploadDocumentCommand` and `UploadDocumentHandler` in the `TranslationApp.Application` layer. The handler orchestrates the full upload flow: file validation, looking up or creating the `Document` record, looking up or reusing an existing completed `TranslationJob`, creating a new `TranslationJob` when needed, and writing the job ID to the `Channel<Guid>` for background processing. Returns `UploadResponseDto`.

## Acceptance Criteria
- [ ] `UploadDocumentCommand` is defined with properties: `FileBytes`, `FileName`, `ContentType`, `FileSizeBytes`, `SourceLang`, `TargetLang`, `UserId`
- [ ] `UploadDocumentHandler` validates: PDF MIME type (`application/pdf`), file size ≤ 20 MB
- [ ] Handler checks for an existing `Document` for the user by `FileHash` — reuses it if found, creates a new one otherwise
- [ ] Handler checks for an existing `TranslationJob` with `Status=Completed` for (DocumentId, TargetLanguage) — returns it directly if found (`isExisting=true`)
- [ ] Handler creates a new `TranslationJob` with `Status=Pending`, writes job ID to `Channel<Guid>`
- [ ] Returns `UploadResponseDto` with `DocumentId`, `JobId`, `Status`, `IsExisting`
- [ ] `UploadResponseDto` is defined in `TranslationApp.Application/DTOs/`
- [ ] FluentValidation validator is defined for `UploadDocumentCommand`

## Technical Notes
- Layer: API
- Key files / classes involved:
  - `TranslationApp.Application/Documents/UploadDocumentCommand.cs`
  - `TranslationApp.Application/Documents/UploadDocumentHandler.cs`
  - `TranslationApp.Application/DTOs/UploadResponseDto.cs`
  - `TranslationApp.Application/Interfaces/IDocumentRepository.cs`
  - `TranslationApp.Application/Interfaces/ITranslationJobRepository.cs`
  - `TranslationApp.Infrastructure/Services/TranslationBackgroundService.cs` (Channel consumer, likely already exists)
- Dependencies:
  - `01-[DB]-create-document-entity-and-migration.md`
  - `02-[DB]-create-translation-job-entity-and-migration.md`
  - `04-[API]-add-sha256-duplicate-detection.md` (SHA-256 utility needed inside handler)
