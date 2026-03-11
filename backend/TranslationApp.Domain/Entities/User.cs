using TranslationApp.Domain.Enums;

namespace TranslationApp.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Salt { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public string? PreferredTargetLanguage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
