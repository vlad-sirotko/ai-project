# [UI] Implement Add-Language Dropdown in Translations List Template

## User Story
> As a user, I can add a new target language to an existing document without re-uploading

## Description
Add a `[+ Add language ▼]` dropdown button to each document card in `TranslationsListComponent`. The dropdown lists all active languages from `LanguageStore`, excluding the document's source language. Languages that already have a job (any status) are shown as disabled with an "(already added)" label. Selecting a language calls `facade.addLanguage(document.id, langCode)`.

## Acceptance Criteria
- [ ] Each document card shows a `[+ Add language ▼]` dropdown button
- [ ] Dropdown lists all `LanguageStore.activeLanguages` except the document's `sourceLanguage`
- [ ] Languages that already have a job (any status) are rendered as disabled with "(already added)" text
- [ ] Selecting an available language calls `facade.addLanguage(document.id, selectedLangCode)`
- [ ] After selection, the dropdown closes and the store refreshes showing the new Pending job row
- [ ] Dropdown uses Angular Material `mat-menu` or a native `<select>` — consistent with existing component style

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translations-list/translations-list.component.html`, `translations-list.component.ts`
- Helper computed: for each document, derive `alreadyAddedCodes = new Set(doc.jobs.map(j => j.targetLanguage))` to determine disabled state
- Depends on task 02 (`addLanguage` facade method)
- Depends on `LanguageStore.activeLanguages` signal (already available)

## Implementation Notes
- The dropdown uses Angular Material `mat-menu` (`MatMenuModule`) via `[matMenuTriggerFor]` on a styled plain `<button class="add-lang-btn">`. Angular Material was already installed in the project (`@angular/material ^20`).
- `facade.activeLanguages` exposes `LanguageStore.activeLanguages` directly from the facade; languages are loaded once in `loadDocuments()` via `languageStore.loadLanguages()` (which is a no-op if already loaded).
- The document's `sourceLanguage` is excluded from the dropdown with `@if (lang.code !== doc.sourceLanguage)`.
- Languages that already have a job are rendered as `[disabled]` `mat-menu-item` entries with `(already added)` appended to the label. The check is done via `facade.isAlreadyAdded(doc, lang.code)` — a pure facade method that reads `doc.jobs`.
- After selecting a language, `facade.addLanguage()` is called, which calls `loadDocuments()` on success, refreshing the store and causing the new Pending job to appear without a page reload. Polling restarts automatically.

## Status: ✅ Done
