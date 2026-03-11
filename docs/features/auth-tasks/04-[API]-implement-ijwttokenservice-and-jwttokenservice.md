# [API] Implement IJwtTokenService and JwtTokenService

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Define the `IJwtTokenService` interface in `TranslationApp.Application` and implement it in `TranslationApp.Infrastructure`. The service generates a signed JWT with the required claims and handles token validation.

## Acceptance Criteria
- [ ] `IJwtTokenService` interface defined in `TranslationApp.Application/Interfaces/` with at minimum `GenerateToken(User user): string`
- [ ] `JwtTokenService` implementation in `TranslationApp.Infrastructure/` reads the JWT secret, issuer, audience, and expiry from `appsettings.json`
- [ ] Generated token contains claims: `sub` (userId), `email`, `role`, `exp` (default 7 days)
- [ ] Service registered in DI in `Program.cs`
- [ ] JWT Bearer authentication configured in `Program.cs`

## Technical Notes
- Layer: API (Application + Infrastructure)
- Key files: `TranslationApp.Application/Interfaces/IJwtTokenService.cs`, `TranslationApp.Infrastructure/Services/JwtTokenService.cs`, `appsettings.json`, `TranslationApp.API/Program.cs`
- Depends on: `01-[DB]-create-user-entity-and-migration.md`
