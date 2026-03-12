using TranslationApp.Application.Interfaces;

namespace TranslationApp.Infrastructure.Services;

public sealed class MockTranslationProvider : ITranslationProvider
{
    public string ProviderName => "Mock";

    public Task<string> TranslateTextAsync(string text, string sourceLang, string targetLang, CancellationToken cancellationToken)
    {
        return Task.FromResult($"[MOCK-{targetLang}] {text}");
    }
}
