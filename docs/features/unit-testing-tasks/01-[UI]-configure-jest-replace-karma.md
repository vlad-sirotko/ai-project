# [UI] Configure Jest and remove Karma

## User Story
> As a developer, I can run all frontend unit tests with a single command (`npm test`) without needing a browser

## Description
Replace the deprecated Karma/Jasmine test runner with Jest + jest-preset-angular. Remove all Karma-related devDependencies from `package.json`, remove the `test` target in `angular.json`, install Jest packages, and create the two new configuration files (`jest.config.ts` and `setup-jest.ts`). Once complete, `npm test` must run all `*.spec.ts` files via Jest in Node.js without launching a browser.

## Acceptance Criteria
- [x] The following packages are removed from `package.json` devDependencies: `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `@types/jasmine`
- [x] The following packages are added to devDependencies: `jest`, `jest-preset-angular`, `@types/jest`, `ts-jest`
- [x] `frontend/jest.config.ts` exists and uses `jest-preset-angular` preset with correct `testMatch` and `collectCoverageFrom` patterns
- [x] `frontend/setup-jest.ts` exists and mocks `navigator.clipboard`
- [x] The `test` target (using `@angular/build:karma`) is removed from `angular.json`
- [x] The `"test"` script in `package.json` runs `jest`
- [x] `npm test` exits with zero errors on a clean checkout (existing `app.spec.ts` passes)
- [x] `npm test -- --coverage` generates an lcov coverage report

## Technical Notes
- Layer: UI
- Key files: `frontend/package.json`, `frontend/angular.json`, `frontend/jest.config.ts`, `frontend/setup-jest.ts`
- All remaining tasks (02–06) depend on this task being completed first

## Implementation Notes

- The app uses zoneless change detection (`provideZonelessChangeDetection`), so `setup-jest.ts` uses `setupZonelessTestEnv` from `jest-preset-angular/setup-env/zoneless` instead of the deprecated `jest-preset-angular/setup-jest` import
- `ts-node` and `@angular/platform-browser-dynamic` are required additional devDependencies for the TypeScript config file and zoneless test env respectively
- `jsconfig.spec.json` updated: `"types": ["jasmine"]` → `"types": ["jest"]` and added `"module": "CommonJS"` for Jest/Node.js compatibility
- `app.spec.ts` updated: replaced the broken auto-generated `should render title` test (checking for `h1` that no longer exists) with `should render router outlet`
- `npm install --legacy-peer-deps` is required due to Angular 20 peer dependency resolution in npm v7+

## Status: ✅ Done
