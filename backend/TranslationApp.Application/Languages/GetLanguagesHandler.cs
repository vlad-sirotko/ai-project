using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Languages;

public sealed class GetLanguagesHandler
{
    private readonly ISupportedLanguageRepository _languageRepository;

    public GetLanguagesHandler(ISupportedLanguageRepository languageRepository)
    {
        _languageRepository = languageRepository;
    }

    public async Task<IEnumerable<LanguageDto>> HandleAsync(GetLanguagesQuery query, CancellationToken cancellationToken = default)
    {
        var languages = await _languageRepository.GetActiveAsync(cancellationToken);
        return languages.Select(l => new LanguageDto(l.Id, l.Code, l.Name, l.IsActive, l.IsDefaultSource, l.IsDefaultTarget));
    }
}
