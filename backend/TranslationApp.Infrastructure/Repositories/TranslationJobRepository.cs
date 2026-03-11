using Microsoft.EntityFrameworkCore;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;
using TranslationApp.Infrastructure.Persistence;

namespace TranslationApp.Infrastructure.Repositories;

public sealed class TranslationJobRepository : ITranslationJobRepository
{
    private readonly AppDbContext _context;

    public TranslationJobRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<TranslationJob?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.TranslationJobs
            .AsNoTracking()
            .FirstOrDefaultAsync(j => j.Id == id, cancellationToken);

    public async Task<IReadOnlyList<TranslationJob>> GetByDocumentIdAsync(Guid documentId, CancellationToken cancellationToken = default)
    {
        var results = await _context.TranslationJobs
            .AsNoTracking()
            .Where(j => j.DocumentId == documentId)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync(cancellationToken);

        return results;
    }

    public Task<TranslationJob?> GetByDocumentAndLanguageAsync(Guid documentId, string targetLanguage, CancellationToken cancellationToken = default) =>
        _context.TranslationJobs
            .AsNoTracking()
            .FirstOrDefaultAsync(j => j.DocumentId == documentId && j.TargetLanguage == targetLanguage, cancellationToken);

    public async Task AddAsync(TranslationJob job, CancellationToken cancellationToken = default)
    {
        await _context.TranslationJobs.AddAsync(job, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(TranslationJob job, CancellationToken cancellationToken = default)
    {
        _context.TranslationJobs.Update(job);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
