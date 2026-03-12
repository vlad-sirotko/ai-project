# [API] Define ITranslationProvider interface

## User Story
> As a developer, I want a pluggable translation abstraction so that the active provider can be switched at runtime without code changes or restarts.

## Description
Define the `ITranslationProvider` interface in `TranslationApp.Application/Interfaces/`. This interface is the contract that all translation provider implementations must satisfy. The background service will depend on this abstraction, not on any concrete provider.

## Acceptance Criteria
- [x] `ITranslationProvider` interface is created in `TranslationApp.Application/Interfaces/ITranslationProvider.cs`
- [x] Interface exposes a `string ProviderName { get; }` property
- [x] Interface exposes `Task<string> TranslateTextAsync(string text, string sourceLang, string targetLang, CancellationToken cancellationToken)`
- [x] Interface has no external dependencies (Application layer must remain infrastructure-free)

## Technical Notes
- Layer: API (Application)
- Key file: `TranslationApp.Application/Interfaces/ITranslationProvider.cs`
- No dependencies on other tasks in this set

## Implementation Notes
- Interface created at `TranslationApp.Application/Interfaces/ITranslationProvider.cs` with no external using directives — only the `TranslationApp.Application.Interfaces` namespace
- `ProviderName` is a get-only property; `TranslateTextAsync` accepts a `CancellationToken` for cooperative cancellation support in the background service

## Status: ✅ Done
