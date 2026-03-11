using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Auth;

public sealed class UpdatePreferencesHandler
{
    private readonly IUserRepository _userRepository;

    public UpdatePreferencesHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task HandleAsync(UpdatePreferencesCommand command, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(command.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"User '{command.UserId}' not found.");

        user.PreferredTargetLanguage = command.PreferredTargetLanguage;

        await _userRepository.UpdateAsync(user, cancellationToken);
    }
}
