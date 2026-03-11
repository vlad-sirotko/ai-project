# [UI] Wire up JWT interceptor

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Create an Angular HTTP interceptor that automatically attaches the `Authorization: Bearer <token>` header to every outbound request targeting `/api/**`. The token is read from `localStorage` via `AuthStore`.

## Acceptance Criteria
- [ ] `JwtInterceptor` implemented as a functional interceptor (`HttpInterceptorFn`) in `frontend/src/app/core/interceptors/jwt.interceptor.ts`
- [ ] Reads the JWT token from `AuthStore` (or `localStorage` directly); skips requests without a token
- [ ] Attaches `Authorization: Bearer <token>` header only to requests whose URL contains `/api/`
- [ ] Interceptor registered in `app.config.ts` via `withInterceptors([jwtInterceptor])`
- [ ] Does **not** mutate the original request object — clones it before modifying headers

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/interceptors/jwt.interceptor.ts`, `frontend/src/app/app.config.ts`
- Depends on: `12-[UI]-implement-auth-store.md`
