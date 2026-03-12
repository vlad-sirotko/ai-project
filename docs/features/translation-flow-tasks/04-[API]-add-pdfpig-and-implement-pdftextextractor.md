# [API] Add PdfPig and implement PdfTextExtractor

## User Story
> As a user, I want the app to extract the readable text from my uploaded PDF so that it can be translated.

## Description
Add the PdfPig NuGet package to `TranslationApp.Infrastructure` and create a `PdfTextExtractor` static class in `TranslationApp.Infrastructure/PdfExtraction/`. The extractor opens a PDF from a file path, iterates all pages, collects all text blocks, and joins them with newlines. Phase 1 is plain text only — no layout or formatting data is preserved.

## Acceptance Criteria
- [x] `UglyToad.PdfPig` NuGet package is added to `TranslationApp.Infrastructure.csproj`
- [x] `PdfTextExtractor` static class is created in `TranslationApp.Infrastructure/PdfExtraction/PdfTextExtractor.cs`
- [x] `ExtractText(string filePath)` method opens the PDF using PdfPig's `PdfDocument.Open(filePath)`
- [x] Iterates all pages; for each page collects all `IWord` text blocks
- [x] Returns all text joined with newlines (`\n`)
- [x] Multi-page documents are handled (each page's text is appended)
- [x] Returns an empty string (does not throw) if the PDF contains no extractable text

## Technical Notes
- Layer: API (Infrastructure)
- Key files:
  - `TranslationApp.Infrastructure/TranslationApp.Infrastructure.csproj` (add package reference)
  - `TranslationApp.Infrastructure/PdfExtraction/PdfTextExtractor.cs`
- No dependencies on other tasks in this set

## Implementation Notes
- `UglyToad.PdfPig` version `1.7.0-custom-5` (prerelease) added — this is the latest available version on NuGet
- `PdfTextExtractor` is a `static` class with a single `static` method — no state, no DI needed
- `PdfDocument.Open(filePath)` wrapped in `using` to ensure the file handle is released
- Words are joined with a space per page (`page.GetWords()` returns individual word tokens); pages are joined with `\n`
- Empty pages are filtered out before joining, so blank pages don't produce spurious blank lines
- If the PDF contains no extractable text, the word list is empty and `string.Join` returns `""`

## Status: ✅ Done
