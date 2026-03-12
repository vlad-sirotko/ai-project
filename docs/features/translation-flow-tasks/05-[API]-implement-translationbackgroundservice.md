# [API] Implement TranslationBackgroundService

## User Story
> As a user, I want my uploaded PDF to be translated automatically in the background so that I do not have to wait on the upload page.

## Description
Implement `TranslationBackgroundService` in `TranslationApp.Infrastructure/Services/`. It implements `IHostedService` (or extends `BackgroundService`) and runs for the entire application lifetime. It reads job IDs from a `Channel<Guid>`, processes each job end-to-end, and updates the `TranslationJob` record in the database. One failed job must never stop the service — exceptions are caught per job.

**Processing loop:**
1. Wait for a job ID from `ChannelReader<Guid>`
2. Load `TranslationJob` from DB (including parent `Document` via the repository)
3. Set `Status = Processing`, save to DB
4. Extract text from PDF using `PdfTextExtractor.ExtractText(document.OriginalFilePath)`
5. Read the active provider name from `AppSettings` (Key = `TranslationProvider`)
6. Resolve the matching `ITranslationProvider` from the injected collection
7. Call `provider.TranslateTextAsync(extractedText, sourceLang, targetLang, cancellationToken)`
8. On success: set `TranslatedText`, `Status = Completed`, `CompletedAt = UtcNow`, save to DB
9. On any exception: set `Status = Failed`, `ErrorMessage = exception.Message`, save to DB

## Acceptance Criteria
- [ ] `TranslationBackgroundService` is created in `TranslationApp.Infrastructure/Services/TranslationBackgroundService.cs`
- [ ] Implements `BackgroundService` (or `IHostedService`)
- [ ] Injects `ChannelReader<Guid>`, `ITranslationJobRepository`, `IAppSettingRepository`, and `IEnumerable<ITranslationProvider>`
- [ ] Reads job IDs continuously until cancellation is requested
- [ ] Sets job to `Processing` before starting work, saves to DB
- [ ] Resolves the correct provider by matching `ProviderName` to the `TranslationProvider` app setting value (case-insensitive)
- [ ] Falls back to `MockTranslationProvider` if the setting value doesn't match any registered provider
- [ ] On success: saves `TranslatedText`, `Status = Completed`, `CompletedAt`
- [ ] On exception: saves `Status = Failed`, `ErrorMessage`; logs the exception; does not rethrow
- [ ] App setting is read per-job (not cached) so provider switches take effect immediately

## Technical Notes
- Layer: API (Infrastructure)
- Key file: `TranslationApp.Infrastructure/Services/TranslationBackgroundService.cs`
- Requires `ITranslationJobRepository` to expose `GetByIdWithDocumentAsync(Guid id)` and `UpdateAsync(TranslationJob job)` — add these to the interface if missing
- Depends on: `01-[API]-define-itranslationprovider-interface.md`, `02-[API]-implement-mocktranslationprovider.md`, `03-[API]-implement-deepltranslationprovider.md`, `04-[API]-add-pdfpig-and-implement-pdftextextractor.md`
