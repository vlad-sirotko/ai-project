# [API] Define ITranslationProvider interface

## User Story
> As a developer, I want a pluggable translation abstraction so that the active provider can be switched at runtime without code changes or restarts.

## Description
Define the `ITranslationProvider` interface in `TranslationApp.Application/Interfaces/`. This interface is the contract that all translation provider implementations must satisfy. The background service will depend on this abstraction, not on any concrete provider.

## Acceptance Criteria
- [ ] `ITranslationProvider` interface is created in `TranslationApp.Application/Interfaces/ITranslationProvider.cs`
- [ ] Interface exposes a `string ProviderName { get; }` property
- [ ] Interface exposes `Task<string> TranslateTextAsync(string text, string sourceLang, string targetLang, CancellationToken cancellationToken)`
- [ ] Interface has no external dependencies (Application layer must remain infrastructure-free)

## Technical Notes
- Layer: API (Application)
- Key file: `TranslationApp.Application/Interfaces/ITranslationProvider.cs`
- No dependencies on other tasks in this set
