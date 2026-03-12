using System.Threading.Channels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TranslationApp.Application.Interfaces;
using TranslationApp.Domain.Enums;
using TranslationApp.Infrastructure.PdfExtraction;

namespace TranslationApp.Infrastructure.Services;

/// <summary>
/// Long-running hosted service that processes translation jobs from the job queue channel.
/// One failed job never stops the service — exceptions are caught and recorded per job.
/// </summary>
public sealed class TranslationBackgroundService : BackgroundService
{
    private readonly ChannelReader<Guid> _jobQueue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<TranslationBackgroundService> _logger;

    public TranslationBackgroundService(
        ChannelReader<Guid> jobQueue,
        IServiceScopeFactory scopeFactory,
        ILogger<TranslationBackgroundService> logger)
    {
        _jobQueue = jobQueue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var jobId in _jobQueue.ReadAllAsync(stoppingToken))
        {
            await ProcessJobAsync(jobId, stoppingToken);
        }
    }

    private async Task ProcessJobAsync(Guid jobId, CancellationToken stoppingToken)
    {
        // Each job gets its own scope so scoped services (EF Core DbContext, repositories) are properly disposed
        await using var scope = _scopeFactory.CreateAsyncScope();
        var jobRepo = scope.ServiceProvider.GetRequiredService<ITranslationJobRepository>();
        var settingRepo = scope.ServiceProvider.GetRequiredService<IAppSettingRepository>();
        var providers = scope.ServiceProvider.GetRequiredService<IEnumerable<ITranslationProvider>>();

        var job = await jobRepo.GetByIdWithDocumentAsync(jobId, stoppingToken);
        if (job is null)
        {
            _logger.LogWarning("Translation job {JobId} not found in database; skipping.", jobId);
            return;
        }

        try
        {
            job.Status = JobStatus.Processing;
            await jobRepo.UpdateAsync(job, stoppingToken);

            var extractedText = PdfTextExtractor.ExtractText(job.Document.OriginalFilePath);

            // Read provider setting per-job so admin changes take effect immediately
            var providerSetting = await settingRepo.GetByKeyAsync("TranslationProvider", stoppingToken);
            var providerName = providerSetting?.Value ?? string.Empty;

            var provider = providers.FirstOrDefault(p =>
                string.Equals(p.ProviderName, providerName, StringComparison.OrdinalIgnoreCase))
                ?? providers.First(p => p.ProviderName == "Mock");

            var translatedText = await provider.TranslateTextAsync(
                extractedText,
                job.Document.SourceLanguage,
                job.TargetLanguage,
                stoppingToken);

            job.TranslatedText = translatedText;
            job.Status = JobStatus.Completed;
            job.CompletedAt = DateTime.UtcNow;
            await jobRepo.UpdateAsync(job, stoppingToken);

            _logger.LogInformation(
                "Translation job {JobId} completed successfully using provider '{Provider}'.",
                jobId, provider.ProviderName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Translation job {JobId} failed.", jobId);

            try
            {
                job.Status = JobStatus.Failed;
                job.ErrorMessage = ex.Message;
                await jobRepo.UpdateAsync(job, CancellationToken.None);
            }
            catch (Exception updateEx)
            {
                _logger.LogError(updateEx, "Failed to persist Failed status for job {JobId}.", jobId);
            }
        }
    }
}
