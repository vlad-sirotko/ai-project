using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TranslationApp.Application.Auth;
using TranslationApp.Application.DTOs;

namespace TranslationApp.API.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public sealed class AuthController : ControllerBase
{
    private readonly RegisterHandler _registerHandler;
    private readonly LoginHandler _loginHandler;
    private readonly GetMeHandler _getMeHandler;
    private readonly UpdatePreferencesHandler _updatePreferencesHandler;

    public AuthController(
        RegisterHandler registerHandler,
        LoginHandler loginHandler,
        GetMeHandler getMeHandler,
        UpdatePreferencesHandler updatePreferencesHandler)
    {
        _registerHandler = registerHandler;
        _loginHandler = loginHandler;
        _getMeHandler = getMeHandler;
        _updatePreferencesHandler = updatePreferencesHandler;
    }

    /// <summary>Registers a new user and returns a JWT token.</summary>
    /// <response code="201">Registration successful.</response>
    /// <response code="400">Validation error or email already taken.</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        var result = await _registerHandler.HandleAsync(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>Logs in and returns a JWT token.</summary>
    /// <response code="200">Login successful.</response>
    /// <response code="401">Invalid credentials.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        var result = await _loginHandler.HandleAsync(command, cancellationToken);
        return Ok(result);
    }

    /// <summary>Returns the current authenticated user's profile.</summary>
    /// <response code="200">User profile returned.</response>
    /// <response code="401">Not authenticated.</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _getMeHandler.HandleAsync(new GetMeQuery(userId), cancellationToken);
        return Ok(result);
    }

    /// <summary>Updates the current user's preferred target language.</summary>
    /// <response code="204">Preferences updated.</response>
    /// <response code="401">Not authenticated.</response>
    [HttpPut("me/preferences")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesRequest request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        await _updatePreferencesHandler.HandleAsync(
            new UpdatePreferencesCommand(userId, request.PreferredTargetLanguage), cancellationToken);
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Unable to identify the current user.");
        return Guid.Parse(sub);
    }
}

/// <summary>Request body for updating user preferences.</summary>
public record UpdatePreferencesRequest(string? PreferredTargetLanguage);
