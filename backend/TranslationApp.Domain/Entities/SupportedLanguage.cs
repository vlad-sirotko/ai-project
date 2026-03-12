namespace TranslationApp.Domain.Entities;

public class SupportedLanguage
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool IsDefaultSource { get; set; } = false;
    public bool IsDefaultTarget { get; set; } = false;
}
