using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Admin;

public sealed class GetAdminLanguagesHandler
{
    private readonly ISupportedLanguageRepository _languageRepository;

    public GetAdminLanguagesHandler(ISupportedLanguageRepository languageRepository)
    {
        _languageRepository = languageRepository;
    }

    public async Task<IEnumerable<LanguageDto>> HandleAsync(GetAdminLanguagesQuery query, CancellationToken cancellationToken = default)
    {
        var languages = await _languageRepository.GetAllAsync(cancellationToken);
        return languages.Select(l => new LanguageDto(l.Id, l.Code, l.Name, l.IsActive));
    }
}
