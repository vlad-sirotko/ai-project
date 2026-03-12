using Microsoft.Extensions.DependencyInjection;
using TranslationApp.Application.Interfaces;
using TranslationApp.Infrastructure.Repositories;
using TranslationApp.Infrastructure.Services;

namespace TranslationApp.Infrastructure;

public static class InfrastructureServiceRegistration
{
    /// <summary>
    /// Registers all Infrastructure-layer services into the DI container.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDocumentRepository, DocumentRepository>();
        services.AddScoped<ITranslationJobRepository, TranslationJobRepository>();
        services.AddScoped<IAppSettingRepository, AppSettingRepository>();
        services.AddScoped<ISupportedLanguageRepository, SupportedLanguageRepository>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IFileStorageService, LocalFileStorageService>();

        // Register both providers as ITranslationProvider so IEnumerable<ITranslationProvider> resolves both
        services.AddScoped<ITranslationProvider, MockTranslationProvider>();
        services.AddScoped<ITranslationProvider, DeepLTranslationProvider>();

        services.AddHttpClient();
        services.AddHostedService<TranslationBackgroundService>();

        return services;
    }
}
