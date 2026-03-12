# [API] Implement AddTranslationJobCommand and handler

## User Story
> As a user, I can add a new target language from the detail page.
> As a user, I can retry a failed translation.

## Description
Create the `AddTranslationJobCommand` record and `AddTranslationJobHandler` in the Application layer. The handler fetches the document (verifying it belongs to the requesting user), checks whether a non-failed job for the requested language already exists (returning it if so), creates a new `TranslationJob` with `Status = Pending`, persists it via `ITranslationJobRepository`, and enqueues the job ID on the background `Channel<Guid>`. Both the "add new language" and "retry failed translation" user flows share this single handler.

## Acceptance Criteria
- [ ] `AddTranslationJobCommand(Guid DocumentId, string TargetLanguage, Guid UserId)` record exists in `TranslationApp.Application/Documents/`
- [ ] `AddTranslationJobHandler` resolves the document via `IDocumentRepository.GetByIdForUserAsync`; returns `null` (or throws) when document is not found
- [ ] If a `Completed` or non-failed active job already exists for the same language, the handler returns the existing `TranslationJobDto` without creating a duplicate
- [ ] If the last job for that language is `Failed`, a fresh `TranslationJob` is created replacing it (or a new row with the same language is inserted)
- [ ] New job is saved via `ITranslationJobRepository` and its ID is written to `Channel<Guid>` for background processing
- [ ] Handler returns a `TranslationJobDto` representing the newly created (or existing) job
- [ ] Handler is registered in DI in `ApplicationServiceRegistration.cs`

## Technical Notes
- Layer: API (Application layer handler)
- Key files: `TranslationApp.Application/Documents/AddTranslationJobCommand.cs`, `TranslationApp.Application/Documents/AddTranslationJobHandler.cs`, `TranslationApp.Application/ApplicationServiceRegistration.cs`
- Depends on: existing `ITranslationJobRepository`, `IDocumentRepository`, `Channel<Guid>` registered in infrastructure
- No DB migration needed — `TranslationJobs` table already exists
