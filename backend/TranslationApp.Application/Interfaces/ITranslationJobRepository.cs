using TranslationApp.Domain.Entities;

namespace TranslationApp.Application.Interfaces;

public interface ITranslationJobRepository
{
    Task<TranslationJob?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TranslationJob?> GetByIdWithDocumentAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TranslationJob>> GetByDocumentIdAsync(Guid documentId, CancellationToken cancellationToken = default);
    Task<TranslationJob?> GetByDocumentAndLanguageAsync(Guid documentId, string targetLanguage, CancellationToken cancellationToken = default);
    Task AddAsync(TranslationJob job, CancellationToken cancellationToken = default);
    Task UpdateAsync(TranslationJob job, CancellationToken cancellationToken = default);
}
