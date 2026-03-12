# [API] Register Channel, translation providers, and background service in DI

## User Story
> As a developer, I want the translation infrastructure wired into the DI container so that the background service, channel, and providers are available throughout the app.

## Description
Wire up all translation flow infrastructure into the ASP.NET Core DI container. A single unbounded `Channel<Guid>` is registered as a singleton, exposing both its `ChannelWriter<Guid>` (used by upload handler) and `ChannelReader<Guid>` (used by the background service). Both `MockTranslationProvider` and `DeepLTranslationProvider` are registered as `ITranslationProvider` implementations (as a collection). `TranslationBackgroundService` is registered as a hosted service. `HttpClient` for DeepL is registered via `AddHttpClient`.

## Acceptance Criteria
- [x] `Channel<Guid>.CreateUnbounded<Guid>()` is registered as a singleton in `InfrastructureServiceRegistration.cs` (or `Program.cs`)
- [x] `ChannelWriter<Guid>` and `ChannelReader<Guid>` are both resolvable from DI (by registering the channel and then registering the writer/reader separately from it)
- [x] `MockTranslationProvider` is registered as `ITranslationProvider` (singleton or scoped)
- [x] `DeepLTranslationProvider` is registered as `ITranslationProvider` (singleton or scoped)
- [x] Both providers are resolvable together as `IEnumerable<ITranslationProvider>`
- [x] `TranslationBackgroundService` is registered via `services.AddHostedService<TranslationBackgroundService>()`
- [x] `IHttpClientFactory` is available for `DeepLTranslationProvider` via `services.AddHttpClient()`
- [x] App builds and starts without DI errors

## Technical Notes
- Layer: API (Infrastructure / Program.cs)
- Key files:
  - `TranslationApp.Infrastructure/InfrastructureServiceRegistration.cs`
  - `TranslationApp.API/Program.cs`
- Depends on: `02-[API]-implement-mocktranslationprovider.md`, `03-[API]-implement-deepltranslationprovider.md`, `05-[API]-implement-translationbackgroundservice.md`

## Implementation Notes

- `Channel<Guid>.CreateUnbounded<Guid>(new UnboundedChannelOptions { SingleReader = true })` created in `Program.cs` and all three singletons (channel, writer, reader) registered separately so each can be injected independently
- Both providers registered as `ITranslationProvider` (scoped) so `IEnumerable<ITranslationProvider>` resolves both; the providers are scoped (not singleton) because `DeepLTranslationProvider` depends on scoped `IAppSettingRepository`
- Concrete-type registrations removed — the background service selects providers by `ProviderName` from `IEnumerable<ITranslationProvider>`, so there is no need for separate concrete registrations that would cause double instantiation
- `AddHostedService<TranslationBackgroundService>()` added to `InfrastructureServiceRegistration` to keep all Infrastructure wiring in one place
- `AddHttpClient()` was already present and remains in `InfrastructureServiceRegistration`

## Status: ✅ Done
