# [API] Implement DeepLTranslationProvider

## User Story
> As an admin, I want to switch to DeepL as the active translation provider so that users get real high-quality translations.

## Description
Implement `DeepLTranslationProvider` in `TranslationApp.Infrastructure/Services/`. This provider satisfies `ITranslationProvider` and calls the DeepL free/pro text translation REST API. The API key is read at call time from the `AppSettings` table (Key = `DeepLApiKey`), so it can be updated via the Admin UI without restarting the app.

## Acceptance Criteria
- [x] `DeepLTranslationProvider` is created in `TranslationApp.Infrastructure/Services/DeepLTranslationProvider.cs`
- [x] Implements `ITranslationProvider`
- [x] `ProviderName` returns `"DeepL"`
- [x] `TranslateTextAsync` reads `DeepLApiKey` from `IAppSettingRepository` at call time (not cached)
- [x] Calls the DeepL text translation endpoint (`https://api-free.deepl.com/v2/translate` for free tier)
- [x] Sends `auth_key`, `text`, `source_lang`, and `target_lang` parameters
- [x] Returns the translated text string from the response
- [x] Throws a descriptive exception if the API key is missing or the API returns a non-success status code

## Technical Notes
- Layer: API (Infrastructure)
- Key files: `TranslationApp.Infrastructure/Services/DeepLTranslationProvider.cs`
- Uses `HttpClient` (inject `IHttpClientFactory` or a named/typed client)
- Depends on: `01-[API]-define-itranslationprovider-interface.md`
- Does not depend on MockTranslationProvider

## Implementation Notes
- Class is `sealed` — no inheritance expected
- `IAppSettingRepository` is injected alongside `IHttpClientFactory`; the API key is fetched per call so admin changes take effect immediately without restart
- Uses `FormUrlEncodedContent` with `auth_key`, `text`, `source_lang`, `target_lang` matching the DeepL REST v2 form-encoded API
- Language codes are uppercased before sending (DeepL requires e.g. `EN`, `RU`)
- On non-2xx response, the error body is included in the exception message for diagnostics
- Response deserialization uses private `sealed record` types (`DeepLResponse`, `DeepLTranslation`) with `[JsonPropertyName]` to avoid polluting the public API
- `AddHttpClient()` and concrete registrations for `DeepLTranslationProvider` / `MockTranslationProvider` added to `InfrastructureServiceRegistration` so DI can resolve them by concrete type when the background service selects the active provider
- C# 12 collection expression syntax avoided — project targets net7.0 (C# 11)

## Status: ✅ Done
