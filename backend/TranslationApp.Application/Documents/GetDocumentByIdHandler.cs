using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Documents;

public sealed class GetDocumentByIdHandler
{
    private readonly IDocumentRepository _documentRepository;

    public GetDocumentByIdHandler(IDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<DocumentWithJobsDto?> HandleAsync(GetDocumentByIdQuery query, CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdForUserAsync(query.DocumentId, query.UserId, cancellationToken);

        if (document is null)
            return null;

        return new DocumentWithJobsDto(
            Id: document.Id,
            OriginalFileName: document.OriginalFileName,
            SourceLanguage: document.SourceLanguage,
            FileSizeBytes: document.FileSizeBytes,
            UploadedAt: document.UploadedAt,
            Jobs: document.Jobs.Select(j => new TranslationJobDto(
                Id: j.Id,
                TargetLanguage: j.TargetLanguage,
                Status: j.Status.ToString(),
                TranslatedText: j.TranslatedText,
                ErrorMessage: j.ErrorMessage,
                CreatedAt: j.CreatedAt,
                CompletedAt: j.CompletedAt
            )).ToList()
        );
    }
}
