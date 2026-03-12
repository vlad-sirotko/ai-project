using Microsoft.EntityFrameworkCore;
using TranslationApp.Domain.Entities;

namespace TranslationApp.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<AppSetting> AppSettings => Set<AppSetting>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<TranslationJob> TranslationJobs => Set<TranslationJob>();
    public DbSet<SupportedLanguage> SupportedLanguages => Set<SupportedLanguage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            entity.Property(u => u.Salt)
                .IsRequired();

            entity.Property(u => u.Role)
                .IsRequired()
                .HasConversion<string>();

            entity.Property(u => u.PreferredTargetLanguage)
                .HasMaxLength(10);

            entity.Property(u => u.CreatedAt)
                .IsRequired();
        });

        modelBuilder.Entity<AppSetting>(entity =>
        {
            entity.HasKey(s => s.Key);

            entity.Property(s => s.Key)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(s => s.Value)
                .IsRequired();
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(d => d.Id);

            entity.Property(d => d.OriginalFileName)
                .IsRequired()
                .HasMaxLength(512);

            entity.Property(d => d.OriginalFilePath)
                .IsRequired()
                .HasMaxLength(1024);

            entity.Property(d => d.SourceLanguage)
                .IsRequired()
                .HasMaxLength(10);

            entity.Property(d => d.FileHash)
                .IsRequired()
                .HasMaxLength(64);

            entity.Property(d => d.FileSizeBytes)
                .IsRequired();

            entity.Property(d => d.UploadedAt)
                .IsRequired();

            entity.HasIndex(d => new { d.UserId, d.FileHash })
                .IsUnique();

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TranslationJob>(entity =>
        {
            entity.HasKey(j => j.Id);

            entity.Property(j => j.TargetLanguage)
                .IsRequired()
                .HasMaxLength(10);

            entity.Property(j => j.Status)
                .IsRequired()
                .HasConversion<string>();

            entity.Property(j => j.TranslatedText)
                .HasColumnType("TEXT");

            entity.Property(j => j.ErrorMessage)
                .HasMaxLength(2048);

            entity.Property(j => j.CreatedAt)
                .IsRequired();

            entity.HasOne(j => j.Document)
                .WithMany(d => d.Jobs)
                .HasForeignKey(j => j.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SupportedLanguage>(entity =>
        {
            entity.HasKey(l => l.Id);

            entity.Property(l => l.Code)
                .IsRequired()
                .HasMaxLength(10);

            entity.HasIndex(l => l.Code)
                .IsUnique();

            entity.Property(l => l.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(l => l.IsActive)
                .IsRequired();

            entity.Property(l => l.IsDefaultSource)
                .IsRequired()
                .HasDefaultValue(false);

            entity.Property(l => l.IsDefaultTarget)
                .IsRequired()
                .HasDefaultValue(false);
        });
    }
}
