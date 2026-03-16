# [UI] Configure Jest and remove Karma

## User Story
> As a developer, I can run all frontend unit tests with a single command (`npm test`) without needing a browser

## Description
Replace the deprecated Karma/Jasmine test runner with Jest + jest-preset-angular. Remove all Karma-related devDependencies from `package.json`, remove the `test` target in `angular.json`, install Jest packages, and create the two new configuration files (`jest.config.ts` and `setup-jest.ts`). Once complete, `npm test` must run all `*.spec.ts` files via Jest in Node.js without launching a browser.

## Acceptance Criteria
- [ ] The following packages are removed from `package.json` devDependencies: `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `@types/jasmine`
- [ ] The following packages are added to devDependencies: `jest`, `jest-preset-angular`, `@types/jest`, `ts-jest`
- [ ] `frontend/jest.config.ts` exists and uses `jest-preset-angular` preset with correct `testMatch` and `collectCoverageFrom` patterns
- [ ] `frontend/setup-jest.ts` exists, imports `jest-preset-angular/setup-jest`, and mocks `navigator.clipboard`
- [ ] The `test` target (using `@angular/build:karma`) is removed from `angular.json`
- [ ] The `"test"` script in `package.json` runs `jest`
- [ ] `npm test` exits with zero errors on a clean checkout (existing `app.spec.ts` passes)
- [ ] `npm test -- --coverage` generates an lcov coverage report

## Technical Notes
- Layer: UI
- Key files: `frontend/package.json`, `frontend/angular.json`, `frontend/jest.config.ts`, `frontend/setup-jest.ts`
- All remaining tasks (02–06) depend on this task being completed first
