# [UI] Wire up JWT interceptor

## User Story
> As a registered user, I can log in and receive a JWT token.

## Description
Create an Angular HTTP interceptor that automatically attaches the `Authorization: Bearer <token>` header to every outbound request targeting `/api/**`. The token is read from `localStorage` via `AuthStore`.

## Acceptance Criteria
- [x] `JwtInterceptor` implemented as a functional interceptor (`HttpInterceptorFn`) in `frontend/src/app/core/interceptors/jwt.interceptor.ts`
- [x] Reads the JWT token from `AuthStore` (or `localStorage` directly); skips requests without a token
- [x] Attaches `Authorization: Bearer <token>` header only to requests whose URL contains `/api/`
- [x] Interceptor registered in `app.config.ts` via `withInterceptors([jwtInterceptor])`
- [x] Does **not** mutate the original request object — clones it before modifying headers

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/core/interceptors/jwt.interceptor.ts`, `frontend/src/app/app.config.ts`
- Depends on: `12-[UI]-implement-auth-store.md`

## Implementation Notes
- Functional `HttpInterceptorFn` — uses `inject(AuthStore)` inside the function body (supported in interceptor context)
- Two short-circuit checks: skip if URL doesn't include `/api/`, skip if no token in store
- Uses `req.clone({ setHeaders: ... })` — original request object never mutated
- `app.config.ts` updated from `withInterceptorsFromDi()` to `withInterceptors([jwtInterceptor])` (modern functional approach)
- Build verified: 0 errors

## Status: ✅ Done
