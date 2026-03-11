namespace TranslationApp.Application.DTOs;

public record AuthResponseDto(
    string Token,
    Guid UserId,
    string Email,
    string Role,
    string? PreferredTargetLanguage
);
