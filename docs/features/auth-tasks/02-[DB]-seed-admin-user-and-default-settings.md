# [DB] Seed admin user and default app settings

## User Story
> As an admin user, I can access the admin panel.

## Description
Add seed data to the database so that a default admin user is available on first run. Credentials are read from `appsettings.Development.json`. Also seed the `TranslationProvider=Mock` app setting entry in the `AppSettings` table.

## Acceptance Criteria
- [ ] A default admin user is seeded with `Role=Admin` and BCrypt-hashed password sourced from `appsettings.Development.json`
- [ ] `TranslationProvider` app setting row is seeded with value `Mock`
- [ ] Seed logic runs only during development (or is idempotent / guarded by existence check)
- [ ] Existing data is not duplicated on repeated startups

## Technical Notes
- Layer: DB
- Key files: `TranslationApp.Infrastructure/Persistence/AppDbContext.cs` or a dedicated `DbSeeder.cs`, `appsettings.Development.json`
- Depends on: `01-[DB]-create-user-entity-and-migration.md`
