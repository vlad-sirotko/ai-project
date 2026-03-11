## Feature: Translation Flow (Background Processing)

### Overview

Translation is asynchronous. After a job is created, it is processed by a background service. The frontend polls for status updates every 3 seconds until a terminal state is reached.

### Translation Provider Abstraction

All translation logic goes through `ITranslationProvider`:

```csharp
public interface ITranslationProvider
{
    string ProviderName { get; }
    Task<string> TranslateTextAsync(
        string text,
        string sourceLang,
        string targetLang,
        CancellationToken cancellationToken);
}
```

**Implementations**
- `MockTranslationProvider` — returns input text prefixed with `[MOCK-{targetLang}]`. Used in development. Default provider.
- `DeepLTranslationProvider` — calls DeepL text translation API with the API key stored in `AppSettings`.

Active provider is determined at runtime by reading `AppSetting` with Key=`TranslationProvider`. Switching provider requires no code change or restart — the background service reads the setting fresh per job.

### Background Processing: TranslationBackgroundService

`TranslationBackgroundService` implements `IHostedService` and runs for the entire application lifetime.

**Processing loop:**
1. Wait for a job ID from `Channel<Guid>`
2. Load `TranslationJob` from DB (with parent `Document`)
3. Set Status=Processing, save to DB
4. Extract text from PDF using `PdfTextExtractor.ExtractText(filePath)` (PdfPig)
5. Read active provider name from `AppSettings` table
6. Resolve correct `ITranslationProvider` implementation
7. Call `provider.TranslateTextAsync(extractedText, sourceLang, targetLang)`
8. Save result:
   - Success → `TranslatedText = result`, `Status = Completed`, `CompletedAt = now`
   - Failure → `Status = Failed`, `ErrorMessage = exception.Message`

**Error handling:**
- Exceptions are caught per-job — one failed job does not stop the service
- Job stays in `Failed` state and can be retried by the user

### PDF Text Extraction

`PdfTextExtractor` in `TranslationApp.Infrastructure/PdfExtraction/`:
- Wraps PdfPig library (MIT license, no native dependencies)
- Extracts all text blocks page by page, joined with newlines
- Handles multi-page documents
- Phase 1: plain text only (no layout/formatting data)

### Polling Strategy (Frontend)

In `TranslationDetailComponent`:
- On init: load document via `GET /api/documents/{id}`
- If any job is Pending or Processing → start `interval(3000)` polling
- Each tick: fetch `GET /api/documents/{id}`, update `TranslationStore`
- When all jobs reach terminal status → `takeUntil(destroy$)` stops the interval
- Subscription cleaned up on `OnDestroy`

In `TranslationsListComponent`:
- Same strategy but interval is `5000ms` (less aggressive, full list view)

### Status Values

| Status | Meaning | UI Representation |
|---|---|---|
| Pending | Job queued, not yet started | Grey badge |
| Processing | Background service is actively working | Blue badge + spinning icon |
| Completed | `TranslatedText` saved to DB | Green badge |
| Failed | Error during extraction or translation | Red badge + error message shown |
