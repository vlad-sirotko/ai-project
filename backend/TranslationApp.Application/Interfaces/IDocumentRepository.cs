using TranslationApp.Domain.Entities;

namespace TranslationApp.Application.Interfaces;

public interface IDocumentRepository
{
    Task<Document?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Document?> GetByUserAndHashAsync(Guid userId, string fileHash, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Document>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Document>> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Document?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Document document, CancellationToken cancellationToken = default);
}
