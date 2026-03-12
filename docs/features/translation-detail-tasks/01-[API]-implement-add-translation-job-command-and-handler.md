# [API] Implement AddTranslationJobCommand and handler

## User Story
> As a user, I can add a new target language from the detail page.
> As a user, I can retry a failed translation.

## Description
Create the `AddTranslationJobCommand` record and `AddTranslationJobHandler` in the Application layer. The handler fetches the document (verifying it belongs to the requesting user), checks whether a non-failed job for the requested language already exists (returning it if so), creates a new `TranslationJob` with `Status = Pending`, persists it via `ITranslationJobRepository`, and enqueues the job ID on the background `Channel<Guid>`. Both the "add new language" and "retry failed translation" user flows share this single handler.

## Acceptance Criteria
- [x] `AddTranslationJobCommand(Guid DocumentId, string TargetLanguage, Guid UserId)` record exists in `TranslationApp.Application/Documents/`
- [x] `AddTranslationJobHandler` resolves the document via `IDocumentRepository.GetByIdForUserAsync`; returns `null` (or throws) when document is not found
- [x] If a `Completed` or non-failed active job already exists for the same language, the handler returns the existing `TranslationJobDto` without creating a duplicate
- [x] If the last job for that language is `Failed`, a fresh `TranslationJob` is created replacing it (or a new row with the same language is inserted)
- [x] New job is saved via `ITranslationJobRepository` and its ID is written to `Channel<Guid>` for background processing
- [x] Handler returns a `TranslationJobDto` representing the newly created (or existing) job
- [x] Handler is registered in DI in `ApplicationServiceRegistration.cs`

## Technical Notes
- Layer: API (Application layer handler)
- Key files: `TranslationApp.Application/Documents/AddTranslationJobCommand.cs`, `TranslationApp.Application/Documents/AddTranslationJobHandler.cs`, `TranslationApp.Application/ApplicationServiceRegistration.cs`
- Depends on: existing `ITranslationJobRepository`, `IDocumentRepository`, `Channel<Guid>` registered in infrastructure
- No DB migration needed — `TranslationJobs` table already exists

## Implementation Notes
- `AddTranslationJobCommand` is a `sealed record` with `DocumentId`, `TargetLanguage`, and `UserId` — no FluentValidation needed since input validation happens at the API layer.
- `AddTranslationJobHandler` is `sealed` following the least-exposure principle; it returns `null` (not an exception) when the document is not found, letting the controller decide the HTTP status.
- The handler compares `existingJob.Status != JobStatus.Failed` to decide whether to reuse or replace — this covers Pending, Processing, and Completed uniformly without needing separate branches.
- A new `TranslationJob` row is always inserted for retry (no update of the failed row), keeping audit history.
- `Channel<Guid>` is injected as `ChannelWriter<Guid>` (write-only), consistent with `UploadDocumentHandler`.

## Status: ✅ Done
