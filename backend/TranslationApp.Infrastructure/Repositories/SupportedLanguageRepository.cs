using Microsoft.EntityFrameworkCore;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;
using TranslationApp.Infrastructure.Persistence;

namespace TranslationApp.Infrastructure.Repositories;

public sealed class SupportedLanguageRepository : ISupportedLanguageRepository
{
    private readonly AppDbContext _context;

    public SupportedLanguageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<SupportedLanguage>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.SupportedLanguages
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<SupportedLanguage>> GetActiveAsync(CancellationToken cancellationToken = default) =>
        await _context.SupportedLanguages
            .AsNoTracking()
            .Where(l => l.IsActive)
            .ToListAsync(cancellationToken);

    public Task<SupportedLanguage?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.SupportedLanguages
            .AsNoTracking()
            .FirstOrDefaultAsync(l => l.Id == id, cancellationToken);

    public async Task AddAsync(SupportedLanguage language, CancellationToken cancellationToken = default)
    {
        await _context.SupportedLanguages.AddAsync(language, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(SupportedLanguage language, CancellationToken cancellationToken = default)
    {
        _context.SupportedLanguages.Update(language);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
