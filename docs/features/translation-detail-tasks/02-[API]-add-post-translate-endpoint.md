# [API] Add POST /api/documents/{id}/translate endpoint

## User Story
> As a user, I can add a new target language from the detail page.
> As a user, I can retry a failed translation.

## Description
Add a `TranslateDocument` action to `DocumentsController` that accepts a target language code in the request body, delegates to `AddTranslationJobHandler`, and returns the resulting `TranslationJobDto`. Returns `404` when the document does not belong to the authenticated user.

## Acceptance Criteria
- [x] `POST /api/documents/{id}/translate` endpoint exists on `DocumentsController`
- [x] Request body is a small DTO or record containing `TargetLanguage` (required, non-empty string)
- [x] Authenticated user ID is extracted from JWT claims and passed to the handler
- [x] Returns `200 OK` with the `TranslationJobDto` on success
- [x] Returns `404 Not Found` when the document is not found / does not belong to the user
- [x] Swagger `[ProducesResponseType]` annotations are present (200, 400, 401, 404)
- [x] `AddTranslationJobHandler` is constructor-injected into the controller

## Technical Notes
- Layer: API
- Key files: `TranslationApp.API/Controllers/DocumentsController.cs`
- Request DTO: `TranslationApp.Application/DTOs/AddTranslationRequest.cs` (new small record)
- Depends on: `01-[API]-implement-add-translation-job-command-and-handler.md`

## Implementation Notes
- `AddTranslationRequest` is a `sealed record` in `TranslationApp.Application/DTOs/` decorated with `[Required]` on `TargetLanguage`; the ASP.NET Core model binder returns 400 automatically if it is missing.
- `TranslateDocument` follows the same `null → 404 / dto → 200` pattern used by `GetDocumentById`, keeping the controller consistent.
- `AddTranslationJobHandler` is constructor-injected alongside the existing handlers; no service-locator or `IMediator` abstraction is introduced, matching the project's direct-handler style.
- The route uses `{id:guid}` constraint, so malformed GUIDs receive a 400 before reaching the action.

## Status: ✅ Done
