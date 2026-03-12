using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
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
        var apiKeySetting = await _appSettingRepository.GetByKeyAsync("DeepLApiKey", cancellationToken);
        if (string.IsNullOrWhiteSpace(apiKeySetting?.Value))
            throw new InvalidOperationException("DeepL API key is not configured. Set 'DeepLApiKey' in application settings.");

        var freeApiSetting = await _appSettingRepository.GetByKeyAsync("DeepLFreeApi", cancellationToken);
        var isFreeApi = string.Equals(freeApiSetting?.Value, "true", StringComparison.OrdinalIgnoreCase);
        var baseUrl = isFreeApi ? "https://api-free.deepl.com" : "https://api.deepl.com";

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("DeepL-Auth-Key", apiKeySetting.Value);

        var body = new
        {
            text = new[] { text },
            source_lang = sourceLang.ToUpperInvariant(),
            target_lang = targetLang.ToUpperInvariant(),
        };

        var response = await client.PostAsJsonAsync($"{baseUrl}/v2/translate", body, cancellationToken);
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
