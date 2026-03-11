# [DB] Create TranslationJob Entity and Migration

## User Story
> As a user, if a completed translation for that language already exists, I am redirected to it immediately without waiting.

## Description
Create the `TranslationJob` entity in `TranslationApp.Domain`, its EF Core configuration in `TranslationApp.Infrastructure`, and the associated repository. Each `TranslationJob` represents one (Document, TargetLanguage) translation attempt with a status lifecycle (Pending → Processing → Completed/Failed). The entity has a cascade-delete relationship with `Document`.

## Acceptance Criteria
- [x] `TranslationJob` entity exists in `TranslationApp.Domain/Entities/TranslationJob.cs` with all required properties: `Id`, `DocumentId`, `TargetLanguage`, `Status`, `TranslatedText`, `ErrorMessage`, `CreatedAt`, `CompletedAt`
- [x] `JobStatus` enum exists in `TranslationApp.Domain/Enums/JobStatus.cs` with values: `Pending`, `Processing`, `Completed`, `Failed`
- [x] `AppDbContext` includes a `TranslationJobs` `DbSet`
- [x] `ON DELETE CASCADE` is configured from `Document` → `TranslationJob` in EF Core
- [x] `ITranslationJobRepository` interface is defined in `TranslationApp.Application/Interfaces/` with at minimum: `GetByDocumentIdAsync`, `GetByDocumentAndLanguageAsync`, `AddAsync`, `UpdateAsync`
- [x] `TranslationJobRepository` is implemented in `TranslationApp.Infrastructure/Repositories/`
- [x] EF Core migration is generated and applies cleanly

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

## Implementation Notes
- `JobStatus` enum stored as string in SQLite via `HasConversion<string>()` for readability
- `TranslationJob` entity has nullable `TranslatedText` (TEXT column) and `ErrorMessage` (max 2048) fields
- `ON DELETE CASCADE` configured from `Document` → `TranslationJob` via `HasOne(...).WithMany(...).OnDelete(DeleteBehavior.Cascade)`
- `ITranslationJobRepository` includes `GetByIdAsync` in addition to the required methods for future use
- `TranslationJobRepository` uses `AsNoTracking` for read queries; `Update` attaches entity for tracked update
- Migration `AddTranslationJobEntity` generated and applied cleanly to SQLite database
- Build succeeded with 0 errors

## Status: ✅ Done
