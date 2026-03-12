namespace TranslationApp.Application.Interfaces;

public interface ITranslationProvider
{
    string ProviderName { get; }

    Task<string> TranslateTextAsync(string text, string sourceLang, string targetLang, CancellationToken cancellationToken);
}
