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
    }
}
