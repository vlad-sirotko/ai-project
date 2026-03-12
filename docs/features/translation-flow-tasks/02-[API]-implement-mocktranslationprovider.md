# [API] Implement MockTranslationProvider

## User Story
> As a developer, I want a mock translation provider so that I can test the full translation flow in development without calling an external API.

## Description
Implement `MockTranslationProvider` in `TranslationApp.Infrastructure/Services/`. This provider satisfies `ITranslationProvider` and returns the input text prefixed with `[MOCK-{targetLang}]`. It is the default provider used in development and is set as the default seed value for the `TranslationProvider` app setting.

## Acceptance Criteria
- [ ] `MockTranslationProvider` is created in `TranslationApp.Infrastructure/Services/MockTranslationProvider.cs`
- [ ] Implements `ITranslationProvider`
- [ ] `ProviderName` returns `"Mock"` (matches the `TranslationProvider` app setting value)
- [ ] `TranslateTextAsync` returns the input text prefixed with `[MOCK-{targetLang}] ` (e.g., `[MOCK-ru] Hello world`)
- [ ] No external HTTP calls; method completes synchronously (wrapped in `Task.FromResult`)

## Technical Notes
- Layer: API (Infrastructure)
- Key file: `TranslationApp.Infrastructure/Services/MockTranslationProvider.cs`
- Depends on: `01-[API]-define-itranslationprovider-interface.md`
