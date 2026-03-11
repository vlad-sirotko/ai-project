# [DB] Create TranslationJob Entity and Migration

## User Story
> As a user, if a completed translation for that language already exists, I am redirected to it immediately without waiting.

## Description
Create the `TranslationJob` entity in `TranslationApp.Domain`, its EF Core configuration in `TranslationApp.Infrastructure`, and the associated repository. Each `TranslationJob` represents one (Document, TargetLanguage) translation attempt with a status lifecycle (Pending → Processing → Completed/Failed). The entity has a cascade-delete relationship with `Document`.

## Acceptance Criteria
- [ ] `TranslationJob` entity exists in `TranslationApp.Domain/Entities/TranslationJob.cs` with all required properties: `Id`, `DocumentId`, `TargetLanguage`, `Status`, `TranslatedText`, `ErrorMessage`, `CreatedAt`, `CompletedAt`
- [ ] `JobStatus` enum exists in `TranslationApp.Domain/Enums/JobStatus.cs` with values: `Pending`, `Processing`, `Completed`, `Failed`
- [ ] `AppDbContext` includes a `TranslationJobs` `DbSet`
- [ ] `ON DELETE CASCADE` is configured from `Document` → `TranslationJob` in EF Core
- [ ] `ITranslationJobRepository` interface is defined in `TranslationApp.Application/Interfaces/` with at minimum: `GetByDocumentIdAsync`, `GetByDocumentAndLanguageAsync`, `AddAsync`, `UpdateAsync`
- [ ] `TranslationJobRepository` is implemented in `TranslationApp.Infrastructure/Repositories/`
- [ ] EF Core migration is generated and applies cleanly

## Technical Notes
- Layer: DB
- Key files / classes involved:
  - `TranslationApp.Domain/Entities/TranslationJob.cs`
  - `TranslationApp.Domain/Enums/JobStatus.cs`
  - `TranslationApp.Infrastructure/Persistence/AppDbContext.cs`
  - `TranslationApp.Application/Interfaces/ITranslationJobRepository.cs`
  - `TranslationApp.Infrastructure/Repositories/TranslationJobRepository.cs`
  - `TranslationApp.Infrastructure/Migrations/`
- Dependencies: `01-[DB]-create-document-entity-and-migration.md` (Document entity and FK must exist first)
