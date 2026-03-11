using Microsoft.Extensions.Hosting;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Infrastructure.Services;

public sealed class LocalFileStorageService : IFileStorageService
{
    private readonly string _uploadsPath;

    public LocalFileStorageService(IHostEnvironment environment)
    {
        _uploadsPath = Path.Combine(environment.ContentRootPath, "uploads");
    }

    public async Task<string> SaveFileAsync(byte[] fileBytes, Guid documentId, CancellationToken cancellationToken = default)
    {
        Directory.CreateDirectory(_uploadsPath);
        var filePath = Path.Combine(_uploadsPath, $"{documentId}.pdf");
        await File.WriteAllBytesAsync(filePath, fileBytes, cancellationToken);
        return filePath;
    }
}
