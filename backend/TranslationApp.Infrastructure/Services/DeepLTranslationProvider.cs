using System.Net.Http.Json;
using System.Text.Json.Serialization;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Infrastructure.Services;

public sealed class DeepLTranslationProvider : ITranslationProvider
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IAppSettingRepository _appSettingRepository;

    public DeepLTranslationProvider(IHttpClientFactory httpClientFactory, IAppSettingRepository appSettingRepository)
    {
        _httpClientFactory = httpClientFactory;
        _appSettingRepository = appSettingRepository;
    }

    public string ProviderName => "DeepL";

    public async Task<string> TranslateTextAsync(string text, string sourceLang, string targetLang, CancellationToken cancellationToken)
    {
        var setting = await _appSettingRepository.GetByKeyAsync("DeepLApiKey", cancellationToken);
        if (string.IsNullOrWhiteSpace(setting?.Value))
            throw new InvalidOperationException("DeepL API key is not configured. Set 'DeepLApiKey' in application settings.");

        var client = _httpClientFactory.CreateClient();
        var formContent = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("auth_key", setting.Value),
            new KeyValuePair<string, string>("text", text),
            new KeyValuePair<string, string>("source_lang", sourceLang.ToUpperInvariant()),
            new KeyValuePair<string, string>("target_lang", targetLang.ToUpperInvariant()),
        });

        var response = await client.PostAsync("https://api-free.deepl.com/v2/translate", formContent, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException($"DeepL API returned {(int)response.StatusCode}: {errorBody}");
        }

        var result = await response.Content.ReadFromJsonAsync<DeepLResponse>(cancellationToken: cancellationToken);
        return result?.Translations.FirstOrDefault()?.Text
            ?? throw new InvalidOperationException("DeepL API returned an empty or unexpected response.");
    }

    private sealed record DeepLResponse(
        [property: JsonPropertyName("translations")] List<DeepLTranslation> Translations
    );

    private sealed record DeepLTranslation(
        [property: JsonPropertyName("text")] string Text
    );
}
