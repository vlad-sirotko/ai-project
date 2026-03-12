# [API] Add PdfPig and implement PdfTextExtractor

## User Story
> As a user, I want the app to extract the readable text from my uploaded PDF so that it can be translated.

## Description
Add the PdfPig NuGet package to `TranslationApp.Infrastructure` and create a `PdfTextExtractor` static class in `TranslationApp.Infrastructure/PdfExtraction/`. The extractor opens a PDF from a file path, iterates all pages, collects all text blocks, and joins them with newlines. Phase 1 is plain text only — no layout or formatting data is preserved.

## Acceptance Criteria
- [ ] `UglyToad.PdfPig` NuGet package is added to `TranslationApp.Infrastructure.csproj`
- [ ] `PdfTextExtractor` static class is created in `TranslationApp.Infrastructure/PdfExtraction/PdfTextExtractor.cs`
- [ ] `ExtractText(string filePath)` method opens the PDF using PdfPig's `PdfDocument.Open(filePath)`
- [ ] Iterates all pages; for each page collects all `IWord` text blocks
- [ ] Returns all text joined with newlines (`\n`)
- [ ] Multi-page documents are handled (each page's text is appended)
- [ ] Returns an empty string (does not throw) if the PDF contains no extractable text

## Technical Notes
- Layer: API (Infrastructure)
- Key files:
  - `TranslationApp.Infrastructure/TranslationApp.Infrastructure.csproj` (add package reference)
  - `TranslationApp.Infrastructure/PdfExtraction/PdfTextExtractor.cs`
- No dependencies on other tasks in this set
