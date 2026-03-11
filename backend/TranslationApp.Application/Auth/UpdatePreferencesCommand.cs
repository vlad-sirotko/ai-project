namespace TranslationApp.Application.Auth;

public record UpdatePreferencesCommand(Guid UserId, string? PreferredTargetLanguage);
