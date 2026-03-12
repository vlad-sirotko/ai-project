using TranslationApp.Domain.Entities;

namespace TranslationApp.Application.Interfaces;

public interface IAppSettingRepository
{
    Task<IReadOnlyList<AppSetting>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AppSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task UpsertAsync(string key, string value, CancellationToken cancellationToken = default);
}
