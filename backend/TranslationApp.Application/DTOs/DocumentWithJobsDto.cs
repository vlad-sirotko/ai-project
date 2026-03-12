namespace TranslationApp.Application.DTOs;

public sealed record DocumentWithJobsDto(
    Guid Id,
    string OriginalFileName,
    string SourceLanguage,
    long FileSizeBytes,
    DateTime UploadedAt,
    IReadOnlyList<TranslationJobDto> Jobs
);
