using FluentValidation;
using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;

namespace TranslationApp.Application.Admin;

public sealed class AddLanguageHandler
{
    private readonly ISupportedLanguageRepository _languageRepository;
    private readonly IValidator<AddLanguageCommand> _validator;

    public AddLanguageHandler(
        ISupportedLanguageRepository languageRepository,
        IValidator<AddLanguageCommand> validator)
    {
        _languageRepository = languageRepository;
        _validator = validator;
    }

    public async Task<LanguageDto> HandleAsync(AddLanguageCommand command, CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(command, cancellationToken);

        var existing = await _languageRepository.GetAllAsync(cancellationToken);
        if (existing.Any(l => l.Code.Equals(command.Request.Code, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException($"A language with code '{command.Request.Code}' already exists.");

        var language = new SupportedLanguage
        {
            Id = Guid.NewGuid(),
            Code = command.Request.Code.ToLowerInvariant(),
            Name = command.Request.Name,
            IsActive = true
        };

        await _languageRepository.AddAsync(language, cancellationToken);

        return new LanguageDto(language.Id, language.Code, language.Name, language.IsActive);
    }
}
