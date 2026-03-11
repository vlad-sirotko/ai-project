using FluentValidation;
using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;

namespace TranslationApp.Application.Auth;

public sealed class LoginHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IValidator<LoginCommand> _validator;

    public LoginHandler(
        IUserRepository userRepository,
        IJwtTokenService jwtTokenService,
        IValidator<LoginCommand> validator)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
        _validator = validator;
    }

    public async Task<AuthResponseDto> HandleAsync(LoginCommand command, CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(command, cancellationToken);

        var user = await _userRepository.GetByEmailAsync(command.Email, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(command.Password, user.PasswordHash);
        if (!isPasswordValid)
            throw new UnauthorizedAccessException("Invalid email or password.");

        var token = _jwtTokenService.GenerateToken(user);

        return new AuthResponseDto(
            Token: token,
            UserId: user.Id,
            Email: user.Email,
            Role: user.Role.ToString(),
            PreferredTargetLanguage: user.PreferredTargetLanguage
        );
    }
}
