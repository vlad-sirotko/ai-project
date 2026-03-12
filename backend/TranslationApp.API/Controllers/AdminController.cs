using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TranslationApp.Application.Admin;
using TranslationApp.Application.DTOs;

namespace TranslationApp.API.Controllers;

[ApiController]
[Route("api/admin")]
[Produces("application/json")]
[Authorize(Roles = "Admin")]
public sealed class AdminController : ControllerBase
{
    private readonly GetAdminSettingsHandler _getSettingsHandler;
    private readonly UpdateAdminSettingsHandler _updateSettingsHandler;
    private readonly GetAdminLanguagesHandler _getLanguagesHandler;
    private readonly AddLanguageHandler _addLanguageHandler;
    private readonly ToggleLanguageHandler _toggleLanguageHandler;

    public AdminController(
        GetAdminSettingsHandler getSettingsHandler,
        UpdateAdminSettingsHandler updateSettingsHandler,
        GetAdminLanguagesHandler getLanguagesHandler,
        AddLanguageHandler addLanguageHandler,
        ToggleLanguageHandler toggleLanguageHandler)
    {
        _getSettingsHandler = getSettingsHandler;
        _updateSettingsHandler = updateSettingsHandler;
        _getLanguagesHandler = getLanguagesHandler;
        _addLanguageHandler = addLanguageHandler;
        _toggleLanguageHandler = toggleLanguageHandler;
    }

    /// <summary>Returns all application settings.</summary>
    /// <response code="200">Settings returned.</response>
    /// <response code="401">Not authenticated.</response>
    /// <response code="403">Not an admin.</response>
    [HttpGet("settings")]
    [ProducesResponseType(typeof(IEnumerable<AppSettingDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetSettings(CancellationToken cancellationToken)
    {
        var result = await _getSettingsHandler.HandleAsync(new GetAdminSettingsQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>Updates one or more application settings.</summary>
    /// <response code="204">Settings updated.</response>
    /// <response code="400">Validation error.</response>
    /// <response code="401">Not authenticated.</response>
    /// <response code="403">Not an admin.</response>
    [HttpPut("settings")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateAdminSettingsRequest request, CancellationToken cancellationToken)
    {
        await _updateSettingsHandler.HandleAsync(new UpdateAdminSettingsCommand(request), cancellationToken);
        return NoContent();
    }

    /// <summary>Returns all supported languages (active and inactive).</summary>
    /// <response code="200">Languages returned.</response>
    /// <response code="401">Not authenticated.</response>
    /// <response code="403">Not an admin.</response>
    [HttpGet("languages")]
    [ProducesResponseType(typeof(IEnumerable<LanguageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetLanguages(CancellationToken cancellationToken)
    {
        var result = await _getLanguagesHandler.HandleAsync(new GetAdminLanguagesQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>Adds a new supported language.</summary>
    /// <response code="201">Language created.</response>
    /// <response code="400">Validation error or duplicate code.</response>
    /// <response code="401">Not authenticated.</response>
    /// <response code="403">Not an admin.</response>
    [HttpPost("languages")]
    [ProducesResponseType(typeof(LanguageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> AddLanguage([FromBody] AddLanguageRequest request, CancellationToken cancellationToken)
    {
        var result = await _addLanguageHandler.HandleAsync(new AddLanguageCommand(request), cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>Toggles a language's active/inactive state.</summary>
    /// <response code="200">Language updated.</response>
    /// <response code="400">Cannot disable English.</response>
    /// <response code="401">Not authenticated.</response>
    /// <response code="403">Not an admin.</response>
    /// <response code="404">Language not found.</response>
    [HttpPut("languages/{id:guid}")]
    [ProducesResponseType(typeof(LanguageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleLanguage([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var result = await _toggleLanguageHandler.HandleAsync(new ToggleLanguageCommand(id), cancellationToken);
        return Ok(result);
    }
}
