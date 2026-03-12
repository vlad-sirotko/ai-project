using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Admin;

public sealed class GetAdminSettingsHandler
{
    private readonly IAppSettingRepository _appSettingRepository;

    public GetAdminSettingsHandler(IAppSettingRepository appSettingRepository)
    {
        _appSettingRepository = appSettingRepository;
    }

    public async Task<IEnumerable<AppSettingDto>> HandleAsync(GetAdminSettingsQuery query, CancellationToken cancellationToken = default)
    {
        var settings = await _appSettingRepository.GetAllAsync(cancellationToken);
        return settings.Select(s => new AppSettingDto(s.Key, s.Value));
    }
}
