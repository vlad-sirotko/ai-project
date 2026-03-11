# [DB] Create Document Entity and Migration

## User Story
> As a user, I can upload a PDF file to get it translated, and if I upload the same PDF I uploaded before, the file is not saved twice.

## Description
Create the `Document` entity in the `TranslationApp.Domain` project and the corresponding EF Core configuration and migration in `TranslationApp.Infrastructure`. This entity represents one uploaded PDF file and is the parent of all translation jobs for that file. The `FileHash` field (SHA-256) enables duplicate detection.

## Acceptance Criteria
- [x] `Document` entity exists in `TranslationApp.Domain/Entities/Document.cs` with all required properties: `Id`, `UserId`, `OriginalFileName`, `OriginalFilePath`, `SourceLanguage`, `FileHash`, `FileSizeBytes`, `UploadedAt`
- [x] `AppDbContext` includes a `Documents` `DbSet` with proper EF Core configuration
- [x] `Documents` table has a unique index on `(UserId, FileHash)` to support duplicate detection queries
- [x] `IDocumentRepository` interface is defined in `TranslationApp.Application/Interfaces/`
- [x] `DocumentRepository` is implemented in `TranslationApp.Infrastructure/Repositories/`
- [x] EF Core migration is generated and applies cleanly

## Technical Notes
- Layer: DB
- Key files / classes involved:
  - `TranslationApp.Domain/Entities/Document.cs`
  - `TranslationApp.Infrastructure/Persistence/AppDbContext.cs`
  - `TranslationApp.Application/Interfaces/IDocumentRepository.cs`
  - `TranslationApp.Infrastructure/Repositories/DocumentRepository.cs`
  - `TranslationApp.Infrastructure/Migrations/`
- Dependencies: none (first task in the chain)
