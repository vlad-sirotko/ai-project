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
