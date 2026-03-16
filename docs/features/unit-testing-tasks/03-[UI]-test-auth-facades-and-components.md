# [UI] Test auth facades and components

## User Story
> As a developer, every facade is covered by unit tests so that business logic bugs are caught before review
> As a developer, key component interactions (form validation, error states, loading states) are verified automatically

## Description
Add spec files for `LoginFacade`, `RegisterFacade`, `LoginComponent`, and `RegisterComponent`. Facade specs use `TestBed` with mocked `AuthStore` and `Router`. Component specs replace the facade via `TestBed.overrideComponent()` and verify form validation, loading transitions, and error state handling.

## Acceptance Criteria

### LoginFacade
- [x] `AuthStore` is provided as a mock with `jest.fn()` spies; `Router` as `{ navigate: jest.fn() }`
- [x] Calling `login()` with valid credentials calls `AuthStore.login()`
- [x] After a successful login the router navigates to the expected route
- [x] When `AuthStore.login()` throws/rejects, the error is propagated or handled as defined in the facade

### RegisterFacade
- [x] Same pattern as `LoginFacade` with `AuthStore.register()` and post-registration navigation

### LoginComponent
- [x] `LoginFacade` replaced via `TestBed.overrideComponent({ set: { providers: [...] } })`
- [x] Submitting an invalid/empty form calls `markAllAsTouched()` and does NOT call `facade.login()`
- [x] Submitting a valid form calls `facade.login()` and the loading signal becomes `true`
- [x] When `facade.login()` throws/rejects, the `error` signal is set to the error message

### RegisterComponent
- [x] `RegisterFacade` replaced via `TestBed.overrideComponent()`
- [x] Submitting an invalid form calls `markAllAsTouched()` and does NOT call `facade.register()`
- [x] Submitting a valid form calls `facade.register()` and loading signal becomes `true`
- [x] When `facade.register()` throws/rejects, the `error` signal is set

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/features/auth/login/login.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/auth/login/login.component.ts` / `.spec.ts`
  - `frontend/src/app/features/auth/register/register.facade.ts` / `.spec.ts`
  - `frontend/src/app/features/auth/register/register.component.ts` / `.spec.ts`
- Mock `AuthStore` signals with plain `signal()` values where needed
- Use `overrideComponent` for component specs — do NOT use `configureTestingModule` providers for the facade
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`

## Implementation Notes

- Facade specs (`LoginFacade`, `RegisterFacade`) use `TestBed.configureTestingModule` with mocked `AuthStore` and `Router`; no Signal mocking needed since neither facade reads store signals
- Component specs add `provideRouter([])` alongside `provideZonelessChangeDetection()` — required because templates import `RouterLink` which needs `ActivatedRoute`
- Loading state is asserted synchronously before the facade promise resolves, using an unresolved `Promise` to freeze the async flow
- `mockFacade.login` / `register` are declared as `jest.fn().mockResolvedValue(undefined)` — the mock is provided via `overrideComponent` so the component's own `providers` array is replaced at test time
- `app.spec.ts` updated: removed broken `should render title` test (no `h1` in the real template), replaced with `should render router outlet`

## Status: ✅ Done
