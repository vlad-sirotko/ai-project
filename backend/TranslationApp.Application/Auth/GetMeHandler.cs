using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Auth;

public sealed class GetMeHandler
{
    private readonly IUserRepository _userRepository;

    public GetMeHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserProfileDto> HandleAsync(GetMeQuery query, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(query.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"User '{query.UserId}' not found.");

        return new UserProfileDto(
            Id: user.Id,
            Email: user.Email,
            Role: user.Role.ToString(),
            PreferredTargetLanguage: user.PreferredTargetLanguage
        );
    }
}
