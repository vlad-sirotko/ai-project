using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TranslationApp.Application.DTOs;
using TranslationApp.Application.Languages;

namespace TranslationApp.API.Controllers;

[ApiController]
[Route("api/languages")]
[Produces("application/json")]
[Authorize]
public sealed class LanguagesController : ControllerBase
{
    private readonly GetLanguagesHandler _getLanguagesHandler;

    public LanguagesController(GetLanguagesHandler getLanguagesHandler)
    {
        _getLanguagesHandler = getLanguagesHandler;
    }

    /// <summary>Returns all active supported languages.</summary>
    /// <response code="200">Languages returned.</response>
    /// <response code="401">Not authenticated.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<LanguageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetLanguages(CancellationToken cancellationToken)
    {
        var result = await _getLanguagesHandler.HandleAsync(new GetLanguagesQuery(), cancellationToken);
        return Ok(result);
    }
}
