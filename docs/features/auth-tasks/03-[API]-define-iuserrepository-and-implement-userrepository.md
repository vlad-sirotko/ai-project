# [API] Define IUserRepository and implement UserRepository

## User Story
> As a new user, I can register with email and password.
> As a registered user, I can log in and receive a JWT token.

## Description
Define the `IUserRepository` interface in `TranslationApp.Application` and implement it in `TranslationApp.Infrastructure`. The repository must support user creation, lookup by email, and lookup by ID, which are the operations required by the auth handlers.

## Acceptance Criteria
- [ ] `IUserRepository` interface defined in `TranslationApp.Application/Interfaces/` with at minimum: `GetByEmailAsync`, `GetByIdAsync`, `AddAsync`, `ExistsWithEmailAsync`
- [ ] `UserRepository` implementation in `TranslationApp.Infrastructure/Repositories/` uses `AppDbContext` exclusively
- [ ] Repository registered in DI in `Program.cs`
- [ ] No business logic in the repository — data access only

## Technical Notes
- Layer: API (Application + Infrastructure)
- Key files: `TranslationApp.Application/Interfaces/IUserRepository.cs`, `TranslationApp.Infrastructure/Repositories/UserRepository.cs`
- Depends on: `01-[DB]-create-user-entity-and-migration.md`
