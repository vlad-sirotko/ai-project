using FluentValidation;
using TranslationApp.Application.DTOs;

namespace TranslationApp.Application.Admin;

public record AddLanguageCommand(AddLanguageRequest Request);

public sealed class AddLanguageCommandValidator : AbstractValidator<AddLanguageCommand>
{
    public AddLanguageCommandValidator()
    {
        RuleFor(x => x.Request.Code)
            .NotEmpty()
            .Matches(@"^[a-z]{2,5}$")
            .WithMessage("Code must be 2–5 lowercase letters only.");

        RuleFor(x => x.Request.Name)
            .NotEmpty()
            .MaximumLength(100);
    }
}
