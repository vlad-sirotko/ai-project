using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TranslationApp.Domain.Entities;
using TranslationApp.Domain.Enums;

namespace TranslationApp.Infrastructure.Persistence;

public static class DbSeeder
{
    /// <summary>
    /// Seeds the default admin user and default app settings.
    /// Runs only if the records don't already exist (idempotent).
    /// </summary>
    public static async Task SeedAsync(AppDbContext context, IConfiguration configuration, ILogger logger)
    {
        await SeedAdminUserAsync(context, configuration, logger);
        await SeedAppSettingsAsync(context, configuration, logger);
        await SeedSupportedLanguagesAsync(context, logger);
    }

    private static async Task SeedAdminUserAsync(AppDbContext context, IConfiguration configuration, ILogger logger)
    {
        var email = configuration["AdminSeed:Email"];
        var password = configuration["AdminSeed:Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning("AdminSeed:Email or AdminSeed:Password not configured. Skipping admin user seed.");
            return;
        }

        var exists = await context.Users.AnyAsync(u => u.Email == email);
        if (exists)
        {
            return;
        }

        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password, salt);

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = passwordHash,
            Salt = salt,
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();

        logger.LogInformation("Admin user seeded: {Email}", email);
    }

    private static async Task SeedAppSettingsAsync(AppDbContext context, IConfiguration configuration, ILogger logger)
    {
        await SeedSettingIfMissingAsync(context, "TranslationProvider", "Mock", logger);

        var deepLApiKey = configuration["DeepL:ApiKey"];
        if (!string.IsNullOrWhiteSpace(deepLApiKey))
        {
            await SeedSettingIfMissingAsync(context, "DeepLApiKey", deepLApiKey, logger);
        }
    }

    private static async Task SeedSettingIfMissingAsync(AppDbContext context, string key, string value, ILogger logger)
    {
        var exists = await context.AppSettings.AnyAsync(s => s.Key == key);
        if (exists)
        {
            return;
        }

        context.AppSettings.Add(new AppSetting { Key = key, Value = value });
        await context.SaveChangesAsync();

        logger.LogInformation("App setting seeded: {Key}", key);
    }

    private static async Task SeedSupportedLanguagesAsync(AppDbContext context, ILogger logger)
    {
        var anyExists = await context.SupportedLanguages.AnyAsync();
        if (anyExists)
        {
            return;
        }

        var languages = new[]
        {
            new SupportedLanguage { Id = Guid.NewGuid(), Code = "en", Name = "English", IsActive = true, IsDefaultSource = true,  IsDefaultTarget = false },
            new SupportedLanguage { Id = Guid.NewGuid(), Code = "ru", Name = "Russian", IsActive = true, IsDefaultSource = false, IsDefaultTarget = true  },
            new SupportedLanguage { Id = Guid.NewGuid(), Code = "pl", Name = "Polish",  IsActive = true, IsDefaultSource = false, IsDefaultTarget = false }
        };

        context.SupportedLanguages.AddRange(languages);
        await context.SaveChangesAsync();

        logger.LogInformation("Seeded {Count} supported languages.", languages.Length);
    }
}
