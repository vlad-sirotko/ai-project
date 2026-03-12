using TranslationApp.Domain.Entities;

namespace TranslationApp.Application.Interfaces;

public interface ISupportedLanguageRepository
{
    Task<IReadOnlyList<SupportedLanguage>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SupportedLanguage>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<SupportedLanguage?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(SupportedLanguage language, CancellationToken cancellationToken = default);
    Task UpdateAsync(SupportedLanguage language, CancellationToken cancellationToken = default);
}
