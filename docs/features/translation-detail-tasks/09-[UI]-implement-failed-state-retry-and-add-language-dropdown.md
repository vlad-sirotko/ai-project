# [UI] Implement failed-state tab content with retry button and add-language dropdown

## User Story
> As a user, I can retry a failed translation.
> As a user, I can add a new target language from the detail page.

## Description
Render the failed-job tab panel: an error icon, the "Translation failed" heading, the `errorMessage` (or a default message), and a "Retry" button that calls `facade.retryTranslation(selectedJob().targetLanguage)`. Below all tab content, wire up the `[+ Add language]` button to toggle an inline dropdown listing active languages not yet added to the document; selecting one calls `facade.addLanguage(langCode)`.

## Acceptance Criteria
- [x] Failed state renders error icon, "✕ Translation failed" heading, and `job.errorMessage` (fallback: "Unable to extract text from the PDF.")
- [x] "Retry" button calls `facade.retryTranslation(selectedJob().targetLanguage)` and is only visible on the Failed state
- [x] `[+ Add language]` button toggles an inline dropdown (`showAddLanguage` boolean / signal)
- [x] Dropdown lists languages from `LanguageStore.languages()` excluding those already present in `document.jobs` (by `targetLanguage` code)
- [x] `LanguageStore` injected in the facade (not the component) to expose a `availableLanguages` computed signal
- [x] Selecting a language from the dropdown calls `facade.addLanguage(langCode)` and closes the dropdown
- [x] After `addLanguage` succeeds, the tab bar updates reactively and the new tab is auto-selected
- [x] Error messages from `addLanguageError` / `retryError` signals displayed near respective buttons when non-null

## Technical Notes
- Layer: UI
- Key files: `translation-detail.component.html`, `translation-detail.component.scss`, `translation-detail.facade.ts`
- Depends on: `05-[UI]-extend-facade-with-add-language-and-retry.md`, `06-[UI]-refactor-component-to-material-tab-layout.md`
- `LanguageStore` is already `providedIn: 'root'` — no extra DI setup needed

## Implementation Notes
- `LanguageStore` moved from the component to the facade; the component no longer injects any store or service directly, satisfying the facade-pattern rule.
- `availableLanguages` is a `computed` signal in the facade that filters `languageStore.activeLanguages()` by codes already present in `document.jobs`, recomputing reactively when either signal changes.
- `showAddLanguage` is a local `signal<boolean>` in the component (pure UI toggle state) — not in the facade, since it has no business logic.
- `onAddLanguage(code)` in the component calls `facade.addLanguage(code)` then sets `showAddLanguage(false)`, closing the dropdown immediately.
- The dropdown renders an empty-state message when `availableLanguages().length === 0` so users know all languages are already added.
- Failed state uses a distinct `job-panel__error-heading` (bold red) separate from the `job-panel__msg--error` paragraph for the error detail.

## Status: ✅ Done
