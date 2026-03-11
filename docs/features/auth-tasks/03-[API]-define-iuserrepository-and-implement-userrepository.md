# [API] Define IUserRepository and implement UserRepository

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.

## Description
Define the `IUserRepository` interface in `TranslationApp.Application` and implement it in `TranslationApp.Infrastructure`. The repository must support user creation, lookup by email, and lookup by ID, which are the operations required by the auth handlers.

## Acceptance Criteria
- [x] `IUserRepository` interface defined in `TranslationApp.Application/Interfaces/` with at minimum: `GetByEmailAsync`, `GetByIdAsync`, `AddAsync`, `ExistsWithEmailAsync`
- [x] `UserRepository` implementation in `TranslationApp.Infrastructure/Repositories/` uses `AppDbContext` exclusively
- [x] Repository registered in DI in `Program.cs`
- [x] No business logic in the repository — data access only

## Technical Notes
- Layer: API (Application + Infrastructure)
- Key files: `TranslationApp.Application/Interfaces/IUserRepository.cs`, `TranslationApp.Infrastructure/Repositories/UserRepository.cs`
- Depends on: `01-[DB]-create-user-entity-and-migration.md`

## Implementation Notes
- `IUserRepository` defined in `TranslationApp.Application/Interfaces/` with `CancellationToken` support on all methods
- `UserRepository` is `public sealed` — uses `AppDbContext` exclusively; all read queries use `AsNoTracking()` for performance
- `InfrastructureServiceRegistration.AddInfrastructure()` extension method added to `TranslationApp.Infrastructure` to register all infra services without exposing internal types to the API project
- `Program.cs` updated to call `builder.Services.AddInfrastructure()` instead of registering types directly
- Build succeeded with 0 errors

## Status: ✅ Done
