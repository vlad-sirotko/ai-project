namespace TranslationApp.Application.DTOs;

public sealed record TranslationJobDto(
    Guid Id,
    string TargetLanguage,
    string Status,
    string? TranslatedText,
    string? ErrorMessage,
    DateTime CreatedAt,
    DateTime? CompletedAt
);
