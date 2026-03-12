using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TranslationApp.Application.Admin;
using TranslationApp.Application.Auth;
using TranslationApp.Application.Documents;
using TranslationApp.Application.Languages;

namespace TranslationApp.Application;

public static class ApplicationServiceRegistration
{
    /// <summary>
    /// Registers all Application-layer services into the DI container.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<RegisterHandler>();
        services.AddScoped<LoginHandler>();
        services.AddScoped<GetMeHandler>();
        services.AddScoped<UpdatePreferencesHandler>();
        services.AddScoped<UploadDocumentHandler>();
        services.AddScoped<GetDocumentsHandler>();
        services.AddScoped<GetDocumentByIdHandler>();

        services.AddScoped<GetLanguagesHandler>();

        services.AddScoped<GetAdminSettingsHandler>();
        services.AddScoped<UpdateAdminSettingsHandler>();
        services.AddScoped<GetAdminLanguagesHandler>();
        services.AddScoped<AddLanguageHandler>();
        services.AddScoped<ToggleLanguageHandler>();

        services.AddValidatorsFromAssemblyContaining<RegisterCommandValidator>();

        return services;
    }
}
