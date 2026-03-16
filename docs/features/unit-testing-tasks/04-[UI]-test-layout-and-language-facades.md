# [UI] Test layout and language-selector facades

## User Story
> As a developer, every facade is covered by unit tests so that business logic bugs are caught before review

## Description
Add spec files for `MainLayoutFacade` and `LanguageSelectorFacade`. Both facades depend only on signal-based stores and `Router`, making them straightforward to test in `TestBed` with lightweight mocks. No component specs are required for these facades as their host components are layout shells without complex interactions.

## Acceptance Criteria

### MainLayoutFacade
- [x] `AuthStore` is mocked with plain `signal()` values for `user` / `email` / `role` as applicable
- [x] `Router` is provided as `{ navigate: jest.fn() }`
- [x] `userEmail` computed signal returns the email from the mocked store
- [x] `isAdmin` computed signal returns `true` when role is `Admin`, `false` for `User`
- [x] Calling `logout()` invokes `AuthStore.logout()` and navigates to the login route

### LanguageSelectorFacade
- [x] `LanguageStore` is mocked with a plain `signal()` for its language list
- [x] The `languages` signal exposed by the facade equals the value from the mocked store
- [x] Calling `loadLanguages()` on the facade invokes `LanguageStore.loadLanguages()`

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/layouts/main-layout/main-layout.facade.ts` / `.spec.ts`
  - `frontend/src/app/shared/components/language-selector/language-selector.facade.ts` / `.spec.ts`
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`

## Implementation Notes

- `MainLayoutFacade`: `AuthStore.currentUser` and `AuthStore.isAdmin` are exposed as signal functions on the mock object — the facade calls them as `this.authStore.currentUser()` and `this.authStore.isAdmin()` respectively, so the mock properties are assigned the signal directly (which is also callable)
- `LanguageSelectorFacade`: The facade delegates `activeLanguages` and `isLoading` directly as Signal references from the store, and `loadLanguages()` delegates to the store method — validated that signal identity and delegation are preserved
- Both facades have no `effect()` or `takeUntilDestroyed` so no special injection context needed beyond standard `TestBed.configureTestingModule`

## Status: ✅ Done
