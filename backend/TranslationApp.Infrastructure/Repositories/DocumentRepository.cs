using Microsoft.EntityFrameworkCore;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;
using TranslationApp.Infrastructure.Persistence;

namespace TranslationApp.Infrastructure.Repositories;

public sealed class DocumentRepository : IDocumentRepository
{
    private readonly AppDbContext _context;

    public DocumentRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<Document?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

    public Task<Document?> GetByUserAndHashAsync(Guid userId, string fileHash, CancellationToken cancellationToken = default) =>
        _context.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.UserId == userId && d.FileHash == fileHash, cancellationToken);

    public async Task<IReadOnlyList<Document>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var results = await _context.Documents
            .AsNoTracking()
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync(cancellationToken);

        return results;
    }

    public async Task AddAsync(Document document, CancellationToken cancellationToken = default)
    {
        await _context.Documents.AddAsync(document, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
