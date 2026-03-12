namespace TranslationApp.Application.Documents;

public sealed record GetDocumentByIdQuery(Guid DocumentId, Guid UserId);
