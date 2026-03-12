# [UI] Implement failed-state tab content with retry button and add-language dropdown

## User Story
> As a user, I can retry a failed translation.
> As a user, I can add a new target language from the detail page.

## Description
Render the failed-job tab panel: an error icon, the "Translation failed" heading, the `errorMessage` (or a default message), and a "Retry" button that calls `facade.retryTranslation(selectedJob().targetLanguage)`. Below all tab content, wire up the `[+ Add language]` button to toggle an inline dropdown listing active languages not yet added to the document; selecting one calls `facade.addLanguage(langCode)`.

## Acceptance Criteria
- [ ] Failed state renders error icon, "✕ Translation failed" heading, and `job.errorMessage` (fallback: "Unable to extract text from the PDF.")
- [ ] "Retry" button calls `facade.retryTranslation(selectedJob().targetLanguage)` and is only visible on the Failed state
- [ ] `[+ Add language]` button toggles an inline dropdown (`showAddLanguage` boolean / signal)
- [ ] Dropdown lists languages from `LanguageStore.languages()` excluding those already present in `document.jobs` (by `targetLanguage` code)
- [ ] `LanguageStore` injected in the facade (not the component) to expose a `availableLanguages` computed signal
- [ ] Selecting a language from the dropdown calls `facade.addLanguage(langCode)` and closes the dropdown
- [ ] After `addLanguage` succeeds, the tab bar updates reactively and the new tab is auto-selected
- [ ] Error messages from `addLanguageError` / `retryError` signals displayed near respective buttons when non-null

## Technical Notes
- Layer: UI
- Key files: `translation-detail.component.html`, `translation-detail.component.scss`, `translation-detail.facade.ts`
- Depends on: `05-[UI]-extend-facade-with-add-language-and-retry.md`, `06-[UI]-refactor-component-to-material-tab-layout.md`
- `LanguageStore` is already `providedIn: 'root'` — no extra DI setup needed
