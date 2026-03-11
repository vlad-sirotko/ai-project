# [DB] Create User entity and migration

## User Story
> As a new user, I can register with email and password.

## Description
Define the `User` domain entity in `TranslationApp.Domain` and create the corresponding EF Core migration in `TranslationApp.Infrastructure`. The entity must capture all fields required for authentication and preferences.

## Acceptance Criteria
- [x] `User` entity exists in `TranslationApp.Domain/Entities/` with properties: `Id` (Guid), `Email`, `PasswordHash`, `Salt`, `Role` (enum: User/Admin), `PreferredTargetLanguage`, `CreatedAt`
- [x] `UserRole` enum exists in `TranslationApp.Domain/Enums/`
- [x] `AppDbContext` includes a `DbSet<User>` with appropriate column constraints (unique index on `Email`)
- [x] EF Core migration generated and applied successfully
- [x] `User` entity has no dependencies on Application or Infrastructure layers

## Technical Notes
- Layer: DB
- Key files: `TranslationApp.Domain/Entities/User.cs`, `TranslationApp.Domain/Enums/UserRole.cs`, `TranslationApp.Infrastructure/Persistence/AppDbContext.cs`, `TranslationApp.Infrastructure/Migrations/`
- No dependencies on other tasks in this set

## Implementation Notes
- Solution scaffolded with four projects: `TranslationApp.Domain`, `TranslationApp.Application`, `TranslationApp.Infrastructure`, `TranslationApp.API` targeting net7.0
- `UserRole` stored as string in SQLite via `HasConversion<string>()` for readability
- `AppDbContextFactory` added in Infrastructure for design-time EF tooling support
- Migration `InitialCreate` generated with `dotnet-ef 7.0.20`; creates `Users` table with unique index on `Email`
- Build succeeded with 0 errors

## Status: ✅ Done
