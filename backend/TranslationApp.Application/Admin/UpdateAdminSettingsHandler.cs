using FluentValidation;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Admin;

public sealed class UpdateAdminSettingsHandler
{
    private readonly IAppSettingRepository _appSettingRepository;
    private readonly IValidator<UpdateAdminSettingsCommand> _validator;

    public UpdateAdminSettingsHandler(
        IAppSettingRepository appSettingRepository,
        IValidator<UpdateAdminSettingsCommand> validator)
    {
        _appSettingRepository = appSettingRepository;
        _validator = validator;
    }

    public async Task HandleAsync(UpdateAdminSettingsCommand command, CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(command, cancellationToken);

        foreach (var (key, value) in command.Request.Settings)
        {
            await _appSettingRepository.UpsertAsync(key, value, cancellationToken);
        }
    }
}
