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
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        return services;
    }
}
