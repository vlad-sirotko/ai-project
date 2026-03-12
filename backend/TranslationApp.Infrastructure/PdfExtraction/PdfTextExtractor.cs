using System.Text;
using UglyToad.PdfPig;

namespace TranslationApp.Infrastructure.PdfExtraction;

public static class PdfTextExtractor
{
    public static string ExtractText(string filePath)
    {
        using var document = PdfDocument.Open(filePath);
        var sb = new StringBuilder();

        foreach (var page in document.GetPages())
        {
            var words = page.GetWords().ToList();
            if (words.Count == 0)
                continue;

            if (sb.Length > 0)
                sb.Append('\n');

            for (var i = 0; i < words.Count; i++)
            {
                if (i > 0)
                    sb.Append(' ');
                sb.Append(words[i].Text);
            }
        }

        return sb.ToString();
    }
}
