using TranslationApp.Domain.Enums;

namespace TranslationApp.Domain.Entities;

public class TranslationJob
{
    public Guid Id { get; set; }
    public Guid DocumentId { get; set; }
    public string TargetLanguage { get; set; } = string.Empty;
    public JobStatus Status { get; set; } = JobStatus.Pending;
    public string? TranslatedText { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public Document Document { get; set; } = null!;
}
