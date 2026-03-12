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
    private readonly GetDocumentsHandler _getDocumentsHandler;
    private readonly GetDocumentByIdHandler _getDocumentByIdHandler;
    private readonly AddTranslationJobHandler _addTranslationJobHandler;

    public DocumentsController(
        UploadDocumentHandler uploadHandler,
        GetDocumentsHandler getDocumentsHandler,
        GetDocumentByIdHandler getDocumentByIdHandler,
        AddTranslationJobHandler addTranslationJobHandler)
    {
        _uploadHandler = uploadHandler;
        _getDocumentsHandler = getDocumentsHandler;
        _getDocumentByIdHandler = getDocumentByIdHandler;
        _addTranslationJobHandler = addTranslationJobHandler;
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

    /// <summary>Returns all documents with translation jobs for the authenticated user.</summary>
    /// <response code="200">List of documents.</response>
    /// <response code="401">Not authenticated.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<DocumentWithJobsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetDocuments(CancellationToken cancellationToken)
    {
        var query = new GetDocumentsQuery(GetCurrentUserId());
        var result = await _getDocumentsHandler.HandleAsync(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>Returns a single document with translation jobs by ID.</summary>
    /// <response code="200">Document found.</response>
    /// <response code="401">Not authenticated.</response>
    /// <response code="404">Document not found.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(DocumentWithJobsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDocumentById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetDocumentByIdQuery(id, GetCurrentUserId());
        var result = await _getDocumentByIdHandler.HandleAsync(query, cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    /// <summary>Adds a new translation job for an existing document, or retries a failed translation.</summary>
    /// <response code="200">Job created or existing active job returned.</response>
    /// <response code="400">Validation error (missing or empty target language).</response>
    /// <response code="401">Not authenticated.</response>
    /// <response code="404">Document not found or does not belong to the user.</response>
    [HttpPost("{id:guid}/translate")]
    [ProducesResponseType(typeof(TranslationJobDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> TranslateDocument(
        Guid id,
        [FromBody] AddTranslationRequest request,
        CancellationToken cancellationToken)
    {
        var command = new AddTranslationJobCommand(
            DocumentId: id,
            TargetLanguage: request.TargetLanguage,
            UserId: GetCurrentUserId()
        );

        var result = await _addTranslationJobHandler.HandleAsync(command, cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Unable to identify the current user.");
        return Guid.Parse(sub);
    }
}
