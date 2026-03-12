using System.Threading.Channels;
using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;
using TranslationApp.Domain.Enums;

namespace TranslationApp.Application.Documents;

public sealed class AddTranslationJobHandler
{
    private readonly IDocumentRepository _documentRepository;
    private readonly ITranslationJobRepository _jobRepository;
    private readonly ChannelWriter<Guid> _jobQueue;

    public AddTranslationJobHandler(
        IDocumentRepository documentRepository,
        ITranslationJobRepository jobRepository,
        ChannelWriter<Guid> jobQueue)
    {
        _documentRepository = documentRepository;
        _jobRepository = jobRepository;
        _jobQueue = jobQueue;
    }

    /// <summary>
    /// Adds a new translation job for the given language, or returns the existing active/completed job.
    /// Failed jobs are replaced with a fresh Pending job.
    /// Returns null if the document is not found or does not belong to the user.
    /// </summary>
    public async Task<TranslationJobDto?> HandleAsync(AddTranslationJobCommand command, CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdForUserAsync(command.DocumentId, command.UserId, cancellationToken);
        if (document is null)
            return null;

        var existingJob = await _jobRepository.GetByDocumentAndLanguageAsync(document.Id, command.TargetLanguage, cancellationToken);

        // Return existing job if it is not failed (Pending, Processing, or Completed)
        if (existingJob is not null && existingJob.Status != JobStatus.Failed)
        {
            return ToDto(existingJob);
        }

        if (existingJob is { Status: JobStatus.Failed })
        {
            await _jobRepository.DeleteAsync(existingJob.Id, cancellationToken);
        }

        var job = new TranslationJob
        {
            Id = Guid.NewGuid(),
            DocumentId = document.Id,
            TargetLanguage = command.TargetLanguage,
            Status = JobStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _jobRepository.AddAsync(job, cancellationToken);
        await _jobQueue.WriteAsync(job.Id, cancellationToken);

        return ToDto(job);
    }

    private static TranslationJobDto ToDto(TranslationJob job) =>
        new(
            Id: job.Id,
            TargetLanguage: job.TargetLanguage,
            Status: job.Status.ToString(),
            TranslatedText: job.TranslatedText,
            ErrorMessage: job.ErrorMessage,
            CreatedAt: job.CreatedAt,
            CompletedAt: job.CompletedAt
        );
}
