namespace TranslationApp.Application.Documents;

public sealed record AddTranslationJobCommand(
    Guid DocumentId,
    string TargetLanguage,
    Guid UserId
);
