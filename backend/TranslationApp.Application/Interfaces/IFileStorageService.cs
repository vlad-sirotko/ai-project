namespace TranslationApp.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(byte[] fileBytes, Guid documentId, CancellationToken cancellationToken = default);
}
