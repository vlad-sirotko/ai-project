# [API] Implement DeepLTranslationProvider

## User Story
> As an admin, I want to switch to DeepL as the active translation provider so that users get real high-quality translations.

## Description
Implement `DeepLTranslationProvider` in `TranslationApp.Infrastructure/Services/`. This provider satisfies `ITranslationProvider` and calls the DeepL free/pro text translation REST API. The API key is read at call time from the `AppSettings` table (Key = `DeepLApiKey`), so it can be updated via the Admin UI without restarting the app.

## Acceptance Criteria
- [ ] `DeepLTranslationProvider` is created in `TranslationApp.Infrastructure/Services/DeepLTranslationProvider.cs`
- [ ] Implements `ITranslationProvider`
- [ ] `ProviderName` returns `"DeepL"`
- [ ] `TranslateTextAsync` reads `DeepLApiKey` from `IAppSettingRepository` at call time (not cached)
- [ ] Calls the DeepL text translation endpoint (`https://api-free.deepl.com/v2/translate` for free tier)
- [ ] Sends `auth_key`, `text`, `source_lang`, and `target_lang` parameters
- [ ] Returns the translated text string from the response
- [ ] Throws a descriptive exception if the API key is missing or the API returns a non-success status code

## Technical Notes
- Layer: API (Infrastructure)
- Key files: `TranslationApp.Infrastructure/Services/DeepLTranslationProvider.cs`
- Uses `HttpClient` (inject `IHttpClientFactory` or a named/typed client)
- Depends on: `01-[API]-define-itranslationprovider-interface.md`
- Does not depend on MockTranslationProvider
