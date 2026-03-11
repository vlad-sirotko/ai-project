# [API] Implement IJwtTokenService and JwtTokenService

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Define the `IJwtTokenService` interface in `TranslationApp.Application` and implement it in `TranslationApp.Infrastructure`. The service generates a signed JWT with the required claims and handles token validation.

## Acceptance Criteria
- [x] `IJwtTokenService` interface defined in `TranslationApp.Application/Interfaces/` with at minimum `GenerateToken(User user): string`
- [x] `JwtTokenService` implementation in `TranslationApp.Infrastructure/` reads the JWT secret, issuer, audience, and expiry from `appsettings.json`
- [x] Generated token contains claims: `sub` (userId), `email`, `role`, `exp` (default 7 days)
- [x] Service registered in DI in `Program.cs`
- [x] JWT Bearer authentication configured in `Program.cs`

## Technical Notes
- Layer: API (Application + Infrastructure)
- Key files: `TranslationApp.Application/Interfaces/IJwtTokenService.cs`, `TranslationApp.Infrastructure/Services/JwtTokenService.cs`, `appsettings.json`, `TranslationApp.API/Program.cs`
- Depends on: `01-[DB]-create-user-entity-and-migration.md`

## Implementation Notes
- `IJwtTokenService` defined in `TranslationApp.Application/Interfaces/` with `GenerateToken(User user): string`
- `JwtTokenService` reads `Jwt:Secret`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpiryDays` from configuration; throws `InvalidOperationException` if secret is missing
- Token claims: `sub` (userId), `email`, `role` (via `ClaimTypes.Role` for ASP.NET Core policy support), `jti`; expiry defaults to 7 days
- `Microsoft.AspNetCore.Authentication.JwtBearer 7.0.20` installed in Infrastructure and API projects
- `JwtTokenService` registered via `AddInfrastructure()` extension method
- `appsettings.json` updated with `Jwt` section (secret left empty for production); dev secret in `appsettings.Development.json` (gitignored)
- `Program.cs`: `AddAuthentication` + `AddJwtBearer` configured; `UseAuthentication()` added before `UseAuthorization()` in pipeline
- Build succeeded with 0 errors

## Status: ✅ Done
