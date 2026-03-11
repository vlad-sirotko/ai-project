using TranslationApp.Domain.Enums;

namespace TranslationApp.Application.DTOs;

public record UploadResponseDto(
    Guid DocumentId,
    Guid JobId,
    JobStatus Status,
    bool IsExisting
);
