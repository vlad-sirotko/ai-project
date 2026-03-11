using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TranslationApp.Application.Auth;

namespace TranslationApp.Application;

public static class ApplicationServiceRegistration
{
    /// <summary>
    /// Registers all Application-layer services into the DI container.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<RegisterHandler>();
        services.AddValidatorsFromAssemblyContaining<RegisterCommandValidator>();

        return services;
    }
}
