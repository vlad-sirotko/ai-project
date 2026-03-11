using System.Net;
using System.Text.Json;
using FluentValidation;

namespace TranslationApp.API.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray());

            await WriteJsonResponse(context, HttpStatusCode.BadRequest, new
            {
                status = 400,
                title = "Validation failed.",
                errors
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            await WriteJsonResponse(context, HttpStatusCode.Unauthorized, new
            {
                status = 401,
                title = ex.Message
            });
        }
        catch (KeyNotFoundException ex)
        {
            await WriteJsonResponse(context, HttpStatusCode.NotFound, new
            {
                status = 404,
                title = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            await WriteJsonResponse(context, HttpStatusCode.BadRequest, new
            {
                status = 400,
                title = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception.");
            await WriteJsonResponse(context, HttpStatusCode.InternalServerError, new
            {
                status = 500,
                title = "An unexpected error occurred."
            });
        }
    }

    private static Task WriteJsonResponse(HttpContext context, HttpStatusCode statusCode, object body)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;
        return context.Response.WriteAsync(JsonSerializer.Serialize(body, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));
    }
}
