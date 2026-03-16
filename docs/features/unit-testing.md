## Feature: Unit Testing (Frontend)

### Overview

Replace the deprecated Karma/Jasmine test runner with **Jest + jest-preset-angular** and add a comprehensive unit-test suite covering all facades, key components, and shared pipes. Jest runs in Node.js (no browser required), integrates with Angular's `TestBed`, and is the recommended testing stack for Angular projects in 2025+.

Scope: UI only. Backend unit tests are handled separately in the .NET solution.

### User Stories

- As a developer, I can run all frontend unit tests with a single command (`npm test`) without needing a browser
- As a developer, I can see per-file coverage by running `npm test -- --coverage`
- As a developer, every facade is covered by unit tests so that business logic bugs are caught before review
- As a developer, key component interactions (form validation, error states, loading states) are verified automatically
- As a developer, the `FileSizePipe` formatting rules are verified with precise boundary values

### Framework Decision

| Option | Decision |
|---|---|
| **Jest + jest-preset-angular** | ✅ Selected — fast (no browser), Angular 20 compatible, modern standard |
| Jasmine + Karma | ❌ Karma is officially deprecated by the Angular team |
| Vitest + @analogjs/vitest-angular | Viable alternative but adds Analog dependency to a plain Angular project |

### Replaced Configuration

The following Karma-related packages are **removed** from `package.json` devDependencies:

- `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`
- `@types/jasmine`

The `test` target in `angular.json` (using `@angular/build:karma`) is **removed**.

Jest uses the same `describe` / `it` / `expect` globals as Jasmine — the existing `app.spec.ts` continues to work without changes.

### New Configuration Files

**`frontend/setup-jest.ts`**

```typescript
import 'jest-preset-angular/setup-jest';
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: jest.fn().mockResolvedValue(undefined) },
  writable: true,
});
```

**`frontend/jest.config.ts`**

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterFramework: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/src/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/**/*.config.ts',
    '!src/app/**/*.model.ts',
    '!src/app/app.ts',
    '!src/app/app.config.ts',
  ],
};

export default config;
```

### Test Scope

#### Pipes

| File | Strategy |
|---|---|
| `FileSizePipe` | Direct instantiation — no `TestBed` needed |

Boundary values tested: `0 B`, `1023 B`, `1024 → "1 KB"`, `1 048 576 → "1.0 MB"`, mid-range MB.

#### Facades

All facades are `@Injectable()` with no `providedIn`, making them straightforward to instantiate in `TestBed` with mocked dependencies.

| Facade | Dependencies mocked | Notes |
|---|---|---|
| `LoginFacade` | `AuthStore`, `Router` | Verifies `login()` call and navigation |
| `RegisterFacade` | `AuthStore`, `Router` | Mirror of LoginFacade pattern |
| `MainLayoutFacade` | `AuthStore` (signals), `Router` | `userEmail`, `isAdmin` computed; `logout()` |
| `LanguageSelectorFacade` | `LanguageStore` | Signal delegation; `loadLanguages()` |
| `AdminSettingsFacade` | `AdminService` | `loadSettings`, `saveSettings`, all `connectionStatus` branches, `mapToViewModel` |
| `AdminLanguagesFacade` | `AdminService`, `LanguageStore` | `loadLanguages`, `toggleLanguage`, `addLanguage` success and error paths |
| `UploadFacade` | `AuthStore`, `DocumentService`, `LanguageStore`, `Router` | Requires `TestBed` — uses `effect()` in constructor; all `validationErrors` branches, `fileTooLargeWarning`, `submit()` |
| `TranslationsListFacade` | `DocumentService`, `TranslationStore`, `LanguageStore`, `DestroyRef` | Requires `TestBed` — uses `takeUntilDestroyed` |
| `TranslationDetailFacade` | `DocumentService`, `TranslationStore`, `LanguageStore`, `DestroyRef` | Requires `TestBed`; `availableLanguages` computed, `selectJob`, `addLanguage` early-return when no documentId |

> Polling logic (`startPolling` / `stopPolling$`) is deliberately excluded from unit tests — RxJS marble testing is recommended as a follow-up.

#### Components

Component tests use Angular's `TestBed`. Because each facade is registered in the component's own `providers` array, facades must be replaced using `TestBed.overrideComponent()`, not via `configureTestingModule` providers.

| Component | What is tested |
|---|---|
| `LoginComponent` | Invalid form → `markAllAsTouched`, facade not called; valid submit → loading transitions; facade throws → `error` signal set |
| `RegisterComponent` | Mirror of LoginComponent pattern |
| `UploadComponent` | Template bound to facade signals; submit triggers `facade.submit()` |
| `StatusBadgeComponent` | Each `status` input renders correct CSS class |
| `FileDropzoneComponent` | Drop event emits file; invalid file type triggers error output |
| `AdminSettingsComponent` | Facade mock via `overrideComponent`; form bindings and save interaction |
| `AdminLanguagesComponent` | Facade mock via `overrideComponent`; toggle and add language interactions |

### Mocking Conventions

- **Services** are mocked with `jest.fn()` spies returning controlled `Observable` or `Promise` values via `of()` / `Promise.resolve()`
- **Signal-based stores** are mocked with plain objects whose properties are `signal()` values — no store logic runs
- **Router** is mocked with `{ navigate: jest.fn() }`
- **`navigator.clipboard`** is mocked globally in `setup-jest.ts`
- Component facades are replaced via `overrideComponent({ set: { providers: [{ provide: FacadeClass, useValue: mockFacade }] } })`

### Running Tests

```bash
# from frontend/
npm test                    # run all specs once
npm test -- --watch         # re-run on file change
npm test -- --coverage      # generate lcov coverage report
npm test -- --testPathPattern=login.facade  # run a single spec file
```

### Tasks

See `docs/features/unit-testing-tasks/` for the full task breakdown.
