# [UI] Test layout and language-selector facades

## User Story
> As a developer, every facade is covered by unit tests so that business logic bugs are caught before review

## Description
Add spec files for `MainLayoutFacade` and `LanguageSelectorFacade`. Both facades depend only on signal-based stores and `Router`, making them straightforward to test in `TestBed` with lightweight mocks. No component specs are required for these facades as their host components are layout shells without complex interactions.

## Acceptance Criteria

### MainLayoutFacade
- [ ] `AuthStore` is mocked with plain `signal()` values for `user` / `email` / `role` as applicable
- [ ] `Router` is provided as `{ navigate: jest.fn() }`
- [ ] `userEmail` computed signal returns the email from the mocked store
- [ ] `isAdmin` computed signal returns `true` when role is `Admin`, `false` for `User`
- [ ] Calling `logout()` invokes `AuthStore.logout()` and navigates to the login route

### LanguageSelectorFacade
- [ ] `LanguageStore` is mocked with a plain `signal()` for its language list
- [ ] The `languages` signal exposed by the facade equals the value from the mocked store
- [ ] Calling `loadLanguages()` on the facade invokes `LanguageStore.loadLanguages()`

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/layouts/main-layout/main-layout.facade.ts` / `.spec.ts`
  - `frontend/src/app/shared/components/language-selector/language-selector.facade.ts` / `.spec.ts`
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`
