# [API] Register Channel, translation providers, and background service in DI

## User Story
> As a developer, I want the translation infrastructure wired into the DI container so that the background service, channel, and providers are available throughout the app.

## Description
Wire up all translation flow infrastructure into the ASP.NET Core DI container. A single unbounded `Channel<Guid>` is registered as a singleton, exposing both its `ChannelWriter<Guid>` (used by upload handler) and `ChannelReader<Guid>` (used by the background service). Both `MockTranslationProvider` and `DeepLTranslationProvider` are registered as `ITranslationProvider` implementations (as a collection). `TranslationBackgroundService` is registered as a hosted service. `HttpClient` for DeepL is registered via `AddHttpClient`.

## Acceptance Criteria
- [ ] `Channel<Guid>.CreateUnbounded<Guid>()` is registered as a singleton in `InfrastructureServiceRegistration.cs` (or `Program.cs`)
- [ ] `ChannelWriter<Guid>` and `ChannelReader<Guid>` are both resolvable from DI (by registering the channel and then registering the writer/reader separately from it)
- [ ] `MockTranslationProvider` is registered as `ITranslationProvider` (singleton or scoped)
- [ ] `DeepLTranslationProvider` is registered as `ITranslationProvider` (singleton or scoped)
- [ ] Both providers are resolvable together as `IEnumerable<ITranslationProvider>`
- [ ] `TranslationBackgroundService` is registered via `services.AddHostedService<TranslationBackgroundService>()`
- [ ] `IHttpClientFactory` is available for `DeepLTranslationProvider` via `services.AddHttpClient()`
- [ ] App builds and starts without DI errors

## Technical Notes
- Layer: API (Infrastructure / Program.cs)
- Key files:
  - `TranslationApp.Infrastructure/InfrastructureServiceRegistration.cs`
  - `TranslationApp.API/Program.cs`
- Depends on: `02-[API]-implement-mocktranslationprovider.md`, `03-[API]-implement-deepltranslationprovider.md`, `05-[API]-implement-translationbackgroundservice.md`
