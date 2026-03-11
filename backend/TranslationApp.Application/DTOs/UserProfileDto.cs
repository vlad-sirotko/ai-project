namespace TranslationApp.Application.DTOs;

public record UserProfileDto(
    Guid Id,
    string Email,
    string Role,
    string? PreferredTargetLanguage
);
