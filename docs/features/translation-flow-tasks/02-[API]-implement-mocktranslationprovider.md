# [API] Implement MockTranslationProvider

## User Story
> As a developer, I want a mock translation provider so that I can test the full translation flow in development without calling an external API.

## Description
Implement `MockTranslationProvider` in `TranslationApp.Infrastructure/Services/`. This provider satisfies `ITranslationProvider` and returns the input text prefixed with `[MOCK-{targetLang}]`. It is the default provider used in development and is set as the default seed value for the `TranslationProvider` app setting.

## Acceptance Criteria
- [x] `MockTranslationProvider` is created in `TranslationApp.Infrastructure/Services/MockTranslationProvider.cs`
- [x] Implements `ITranslationProvider`
- [x] `ProviderName` returns `"Mock"` (matches the `TranslationProvider` app setting value)
- [x] `TranslateTextAsync` returns the input text prefixed with `[MOCK-{targetLang}] ` (e.g., `[MOCK-ru] Hello world`)
- [x] No external HTTP calls; method completes synchronously (wrapped in `Task.FromResult`)

## Technical Notes
- Layer: API (Infrastructure)
- Key file: `TranslationApp.Infrastructure/Services/MockTranslationProvider.cs`
- Depends on: `01-[API]-define-itranslationprovider-interface.md`

## Implementation Notes
- Class declared `sealed` since no further inheritance is expected
- `ProviderName` returns the string literal `"Mock"`, matching the `TranslationProvider` app setting seed value used to resolve the active provider at runtime
- `TranslateTextAsync` uses `Task.FromResult` — no async state machine overhead, no external HTTP calls
- Output format: `[MOCK-{targetLang}] {text}` (e.g. `[MOCK-ru] Hello world`)

## Status: ✅ Done
