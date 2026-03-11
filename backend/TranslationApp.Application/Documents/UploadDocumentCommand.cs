using FluentValidation;

namespace TranslationApp.Application.Documents;

public record UploadDocumentCommand(
    byte[] FileBytes,
    string FileName,
    string ContentType,
    long FileSizeBytes,
    string SourceLang,
    string TargetLang,
    Guid UserId
);

public sealed class UploadDocumentCommandValidator : AbstractValidator<UploadDocumentCommand>
{
    private const long MaxFileSizeBytes = 20 * 1024 * 1024; // 20 MB

    public UploadDocumentCommandValidator()
    {
        RuleFor(x => x.ContentType)
            .Equal("application/pdf")
            .WithMessage("Only PDF files are supported.");

        RuleFor(x => x.FileSizeBytes)
            .GreaterThan(0)
            .LessThanOrEqualTo(MaxFileSizeBytes)
            .WithMessage("File size must not exceed 20 MB.");

        RuleFor(x => x.FileName)
            .NotEmpty()
            .MaximumLength(512);

        RuleFor(x => x.SourceLang)
            .NotEmpty()
            .MaximumLength(10);

        RuleFor(x => x.TargetLang)
            .NotEmpty()
            .MaximumLength(10);

        RuleFor(x => x.UserId)
            .NotEmpty();
    }
}
