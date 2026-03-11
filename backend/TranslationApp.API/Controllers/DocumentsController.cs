using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TranslationApp.Application.Documents;
using TranslationApp.Application.DTOs;

namespace TranslationApp.API.Controllers;

[ApiController]
[Route("api/documents")]
[Produces("application/json")]
[Authorize]
public sealed class DocumentsController : ControllerBase
{
    private readonly UploadDocumentHandler _uploadHandler;

    public DocumentsController(UploadDocumentHandler uploadHandler)
    {
        _uploadHandler = uploadHandler;
    }

    /// <summary>Uploads a PDF file and creates a translation job for the specified target language.</summary>
    /// <response code="200">Upload accepted; returns document and job info.</response>
    /// <response code="400">Validation error (invalid file type, size exceeded, missing fields).</response>
    /// <response code="401">Not authenticated.</response>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(UploadResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromForm] string sourceLang,
        [FromForm] string targetLang,
        CancellationToken cancellationToken)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, cancellationToken);
        var fileBytes = ms.ToArray();

        var command = new UploadDocumentCommand(
            FileBytes: fileBytes,
            FileName: file.FileName,
            ContentType: file.ContentType,
            FileSizeBytes: file.Length,
            SourceLang: sourceLang,
            TargetLang: targetLang,
            UserId: GetCurrentUserId()
        );

        var result = await _uploadHandler.HandleAsync(command, cancellationToken);
        return Ok(result);
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Unable to identify the current user.");
        return Guid.Parse(sub);
    }
}
