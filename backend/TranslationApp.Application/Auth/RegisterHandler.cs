using FluentValidation;
using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;
using TranslationApp.Domain.Enums;

namespace TranslationApp.Application.Auth;

public sealed class RegisterHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IValidator<RegisterCommand> _validator;

    public RegisterHandler(
        IUserRepository userRepository,
        IJwtTokenService jwtTokenService,
        IValidator<RegisterCommand> validator)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
        _validator = validator;
    }

    public async Task<AuthResponseDto> HandleAsync(RegisterCommand command, CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(command, cancellationToken);

        if (await _userRepository.ExistsWithEmailAsync(command.Email, cancellationToken))
            throw new InvalidOperationException($"Email '{command.Email}' is already registered.");

        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(command.Password, salt);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = command.Email,
            PasswordHash = passwordHash,
            Salt = salt,
            Role = UserRole.User,
            PreferredTargetLanguage = "ru",
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user, cancellationToken);

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
