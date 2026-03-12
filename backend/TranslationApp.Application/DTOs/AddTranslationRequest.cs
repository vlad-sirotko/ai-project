using System.ComponentModel.DataAnnotations;

namespace TranslationApp.Application.DTOs;

public sealed record AddTranslationRequest(
    [Required] string TargetLanguage
);
