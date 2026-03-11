using TranslationApp.Domain.Entities;

namespace TranslationApp.Application.Interfaces;

public interface IJwtTokenService
{
    /// <summary>
    /// Generates a signed JWT for the given user.
    /// </summary>
    string GenerateToken(User user);
}
