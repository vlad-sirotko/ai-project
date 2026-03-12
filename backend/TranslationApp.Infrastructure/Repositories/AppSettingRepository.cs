using Microsoft.EntityFrameworkCore;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;
using TranslationApp.Infrastructure.Persistence;

namespace TranslationApp.Infrastructure.Repositories;

public sealed class AppSettingRepository : IAppSettingRepository
{
    private readonly AppDbContext _context;

    public AppSettingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<AppSetting>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.AppSettings
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public Task<AppSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default) =>
        _context.AppSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Key == key, cancellationToken);

    public async Task UpsertAsync(string key, string value, CancellationToken cancellationToken = default)
    {
        var existing = await _context.AppSettings
            .FirstOrDefaultAsync(s => s.Key == key, cancellationToken);

        if (existing is null)
        {
            _context.AppSettings.Add(new AppSetting { Key = key, Value = value });
        }
        else
        {
            existing.Value = value;
            _context.AppSettings.Update(existing);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
