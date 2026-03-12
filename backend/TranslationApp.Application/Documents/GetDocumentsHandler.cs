using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Documents;

public sealed class GetDocumentsHandler
{
    private readonly IDocumentRepository _documentRepository;

    public GetDocumentsHandler(IDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<IReadOnlyList<DocumentWithJobsDto>> HandleAsync(GetDocumentsQuery query, CancellationToken cancellationToken = default)
    {
        var documents = await _documentRepository.GetAllByUserIdAsync(query.UserId, cancellationToken);

        return documents.Select(d => new DocumentWithJobsDto(
            Id: d.Id,
            OriginalFileName: d.OriginalFileName,
            SourceLanguage: d.SourceLanguage,
            FileSizeBytes: d.FileSizeBytes,
            UploadedAt: d.UploadedAt,
            Jobs: d.Jobs
                .GroupBy(j => j.TargetLanguage)
                .Select(g => g.OrderByDescending(j => j.CreatedAt).First())
                .Select(j => new TranslationJobDto(
                    Id: j.Id,
                    TargetLanguage: j.TargetLanguage,
                    Status: j.Status.ToString(),
                    TranslatedText: j.TranslatedText,
                    ErrorMessage: j.ErrorMessage,
                    CreatedAt: j.CreatedAt,
                    CompletedAt: j.CompletedAt
                )).ToList()
        )).ToList();
    }
}
