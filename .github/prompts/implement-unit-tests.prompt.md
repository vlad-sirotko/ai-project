---
name: implement-unit-tests
description: >
  Implements frontend unit tests for Angular components, facades, and pipes.
  Follows Jest + jest-preset-angular conventions, Angular best practices, and
  the project's facade pattern. Runs the tests and reports failures for review.
agent: angularExpert
---

Use the **angularExpert** agent for all implementation work in this prompt.

Your task is to implement unit tests **only for the task files explicitly provided in the context**. Do not scan the project for additional task files — work exclusively with what has been attached. Follow Jest + jest-preset-angular conventions and the project's facade pattern.

---

## Step 1 — Read instructions and task context

Before writing any code:
1. Read `.github/instructions/angular.instructions.md` for Angular coding standards and the facade pattern rules.
2. Read the task file(s) from context to understand what needs to be tested and the acceptance criteria.
3. Read the source file(s) under test (component, facade, or pipe) before writing any assertions — never guess the public API.

---

## Step 2 — Mocking conventions (apply consistently to every spec)

### Services
Mock with a plain object of `jest.fn()` spies. Return controlled values using `of()` for observables or `Promise.resolve()` for promises. For error paths use `throwError(() => new Error('...'))`.

```typescript
const mockDocumentService = {
  uploadDocument: jest.fn().mockReturnValue(of({ id: '1' })),
  getDocuments: jest.fn().mockReturnValue(of([])),
};
```

### Signal-based stores
Mock with a plain object whose properties are `signal()` values — do NOT instantiate the real store.

```typescript
const mockAuthStore = {
  user: signal<User | null>(null),
  token: signal<string | null>(null),
  login: jest.fn(),
  logout: jest.fn(),
};
```

### Router
Always mock as `{ navigate: jest.fn() }`.

### navigator.clipboard
Already mocked globally in `setup-jest.ts` — do not re-mock in individual specs.

### Component facades (facade pattern rule)
Because each facade is declared in the component's own `providers` array, it **cannot** be overridden via `configureTestingModule`. Always use:

```typescript
TestBed.overrideComponent(MyComponent, {
  set: { providers: [{ provide: MyFacade, useValue: mockFacade }] },
});
```

---

## Step 3 — TestBed requirements

| Situation | Approach |
|---|---|
| Pure class / pipe with no Angular DI | Direct instantiation — no `TestBed` |
| Facade that uses `effect()` or `takeUntilDestroyed` | `TestBed.configureTestingModule` — required for injection context |
| All other facades | `TestBed.configureTestingModule` with mocked providers |
| Component spec | `TestBed.configureTestingModule` + `TestBed.overrideComponent` for the facade |

---

## Step 4 — Write the spec files

For each task:
- Create the `.spec.ts` file **co-located** with the source file.
- Structure: `describe` block per class, `it` block per acceptance criterion.
- Use `beforeEach` for setup; keep tests independent.
- Prefer `expect(...).toBe(...)` for primitives, `expect(...).toEqual(...)` for objects.
- Use `fixture.detectChanges()` after signal/input changes in component tests.
- Access the DOM via `fixture.debugElement.query(By.css('...'))` — never use `document.querySelector`.
- Remove all unused imports after writing the spec.

---

## Step 5 — Verify implementation

After writing all specs:
1. Run `npx tsc --noEmit` from the `frontend/` directory and fix all TypeScript errors before proceeding.
2. Check that every acceptance criterion in the task file has a corresponding `it(...)` block.
3. Ensure no spec imports real stores, real services, or real routers — only mocks.

---

## Step 6 — Run the tests

Run the tests from the `frontend/` directory:

```bash
npm test -- --testPathPattern=<spec-file-name>
```

If all tests pass:
- Update the task file: add `## Implementation Notes` with key decisions, then add `## Status: ✅ Done` at the bottom.

If any tests **fail**:
- Show me the exact failure output.
- Explain what is failing and why.
- **Stop and ask me how to proceed** — do not attempt to silently change the spec to make a failing test pass. Only fix genuine bugs in the spec (e.g. wrong selector, wrong mock return value). If the failure reveals a bug in the source file, tell me and wait for my decision.

---

## Step 7 — Final check

After all tasks in the context are done, run the full test suite once:

```bash
npm test
```

Report the total pass/fail count. If there are failures unrelated to the current tasks, list them separately so I can decide whether to address them in this session.

---

## General rules

- Follow all rules from `.github/instructions/angular.instructions.md` and `.github/instructions/global.instructions.md`.
- Check the task file for dependency tasks — ensure they are marked `✅ Done` before starting the current one.
- Do not implement tasks already marked `## Status: ✅ Done`.
- Delete all unnecessary imports after implementation.
- Do not change source files to make tests pass unless you are certain the source file contains a bug — ask me first.
