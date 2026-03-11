using System.Security.Cryptography;
using System.Threading.Channels;
using FluentValidation;
using TranslationApp.Application.DTOs;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Entities;
using TranslationApp.Domain.Enums;

namespace TranslationApp.Application.Documents;

public sealed class UploadDocumentHandler
{
    private readonly IDocumentRepository _documentRepository;
    private readonly ITranslationJobRepository _jobRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly ChannelWriter<Guid> _jobQueue;
    private readonly IValidator<UploadDocumentCommand> _validator;

    public UploadDocumentHandler(
        IDocumentRepository documentRepository,
        ITranslationJobRepository jobRepository,
        IFileStorageService fileStorageService,
        ChannelWriter<Guid> jobQueue,
        IValidator<UploadDocumentCommand> validator)
    {
        _documentRepository = documentRepository;
        _jobRepository = jobRepository;
        _fileStorageService = fileStorageService;
        _jobQueue = jobQueue;
        _validator = validator;
    }

    public async Task<UploadResponseDto> HandleAsync(UploadDocumentCommand command, CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(command, cancellationToken);

        var fileHash = ComputeSha256Hash(command.FileBytes);

        var document = await _documentRepository.GetByUserAndHashAsync(command.UserId, fileHash, cancellationToken);
        if (document is null)
        {
            document = new Document
            {
                Id = Guid.NewGuid(),
                UserId = command.UserId,
                OriginalFileName = command.FileName,
                OriginalFilePath = string.Empty,
                SourceLanguage = command.SourceLang,
                FileHash = fileHash,
                FileSizeBytes = command.FileSizeBytes,
                UploadedAt = DateTime.UtcNow
            };

            var savedPath = await _fileStorageService.SaveFileAsync(command.FileBytes, document.Id, cancellationToken);
            document.OriginalFilePath = savedPath;

            await _documentRepository.AddAsync(document, cancellationToken);
        }

        var existingJob = await _jobRepository.GetByDocumentAndLanguageAsync(document.Id, command.TargetLang, cancellationToken);
        if (existingJob is { Status: JobStatus.Completed })
        {
            return new UploadResponseDto(
                DocumentId: document.Id,
                JobId: existingJob.Id,
                Status: existingJob.Status,
                IsExisting: true
            );
        }

        var job = new TranslationJob
        {
            Id = Guid.NewGuid(),
            DocumentId = document.Id,
            TargetLanguage = command.TargetLang,
            Status = JobStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _jobRepository.AddAsync(job, cancellationToken);
        await _jobQueue.WriteAsync(job.Id, cancellationToken);

        return new UploadResponseDto(
            DocumentId: document.Id,
            JobId: job.Id,
            Status: job.Status,
            IsExisting: false
        );
    }

    private static string ComputeSha256Hash(byte[] data)
    {
        var hashBytes = SHA256.HashData(data);
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }
}
