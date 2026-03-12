using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Admin;

public sealed class ToggleLanguageHandler
{
    private readonly ISupportedLanguageRepository _languageRepository;

    public ToggleLanguageHandler(ISupportedLanguageRepository languageRepository)
    {
        _languageRepository = languageRepository;
    }

    public async Task HandleAsync(ToggleLanguageCommand command, CancellationToken cancellationToken = default)
    {
        var language = await _languageRepository.GetByIdAsync(command.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Language with ID '{command.Id}' was not found.");

        if (language.IsActive && language.Code.Equals("en", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("English ('en') cannot be disabled.");

        language.IsActive = !language.IsActive;

        await _languageRepository.UpdateAsync(language, cancellationToken);
    }
}
