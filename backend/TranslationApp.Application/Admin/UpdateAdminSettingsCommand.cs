using FluentValidation;
using TranslationApp.Application.DTOs;

namespace TranslationApp.Application.Admin;

public record UpdateAdminSettingsCommand(UpdateAdminSettingsRequest Request);

public sealed class UpdateAdminSettingsCommandValidator : AbstractValidator<UpdateAdminSettingsCommand>
{
    private static readonly HashSet<string> ValidProviders = new() { "Mock", "DeepL" };

    public UpdateAdminSettingsCommandValidator()
    {
        RuleFor(x => x.Request.Settings)
            .NotNull()
            .WithMessage("Settings must not be null.");

        RuleFor(x => x.Request.Settings)
            .Must(settings =>
                !settings.TryGetValue("TranslationProvider", out var provider) ||
                ValidProviders.Contains(provider))
            .When(x => x.Request.Settings is not null)
            .WithMessage("TranslationProvider must be 'Mock' or 'DeepL'.");
    }
}
