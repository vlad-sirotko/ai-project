# [DB] Seed admin user and default app settings

## User Story
> As an admin user, I can access the admin panel.

## Description
Add seed data to the database so that a default admin user is available on first run. Credentials are read from `appsettings.Development.json`. Also seed the `TranslationProvider=Mock` app setting entry in the `AppSettings` table.

## Acceptance Criteria
- [x] A default admin user is seeded with `Role=Admin` and BCrypt-hashed password sourced from `appsettings.Development.json`
- [x] `TranslationProvider` app setting row is seeded with value `Mock`
- [x] Seed logic runs only during development (or is idempotent / guarded by existence check)
- [x] Existing data is not duplicated on repeated startups

## Technical Notes
- Layer: DB
- Key files: `TranslationApp.Infrastructure/Persistence/AppDbContext.cs` or a dedicated `DbSeeder.cs`, `appsettings.Development.json`
- Depends on: `01-[DB]-create-user-entity-and-migration.md`

## Implementation Notes
- Added `AppSetting` entity (`Key`/`Value`, PK on `Key`) to `TranslationApp.Domain/Entities/` and `AppDbContext`
- `AddAppSettings` migration generated to create the `AppSettings` table
- `BCrypt.Net-Next 4.0.3` installed in `TranslationApp.Infrastructure` for password hashing
- `DbSeeder` created in `TranslationApp.Infrastructure/Persistence/DbSeeder.cs`:
  - Admin email/password read from `AdminSeed:Email` / `AdminSeed:Password` in configuration
  - Idempotent: checks for existing record before inserting
  - Seeds `TranslationProvider=Mock` app setting
- `Program.cs` updated: registers `AppDbContext` with SQLite, calls `Database.Migrate()` on startup, then `DbSeeder.SeedAsync()` in Development environment only
- Admin credentials stored in `appsettings.Development.json` (excluded from git via `.gitignore`)
- Smoke-tested: `app.db` created, admin user and `TranslationProvider=Mock` confirmed present

## Status: ✅ Done
