using Microsoft.Extensions.DependencyInjection;
using TranslationApp.Application.Interfaces;
using TranslationApp.Infrastructure.Repositories;

namespace TranslationApp.Infrastructure;

public static class InfrastructureServiceRegistration
{
    /// <summary>
    /// Registers all Infrastructure-layer services into the DI container.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
