namespace TranslationApp.Application.DTOs;

public record LanguageDto(Guid Id, string Code, string Name, bool IsActive, bool IsDefaultSource, bool IsDefaultTarget);
