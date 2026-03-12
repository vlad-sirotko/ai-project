# [UI] Refactor TranslationDetailComponent to Angular Material tab bar layout

## User Story
> As a user, I can switch between language tabs to read different translations of the same document.
> As a user, I see a spinner while translation is in progress, without having to refresh the page.

## Description
Replace the current flat panel list in `TranslationDetailComponent` with an Angular Material `<mat-tab-group>` where each tab represents one `TranslationJob`. Each tab label shows a flag emoji (derived from the language code), the language name, and a status icon (`●` for Completed, `⟳` for Processing/Pending with CSS spin, `✕` for Failed). Switching tabs calls `facade.selectJob(job.id)` and all content is driven by the `facade.selectedJob()` signal — no additional HTTP calls.

## Acceptance Criteria
- [ ] `MatTabGroup` / `MatTab` from Angular Material imported and used in the component
- [ ] Each `TranslationJob` in `facade.document().jobs` renders as one `<mat-tab>`
- [ ] Tab label contains: flag emoji (mapped from `targetLanguage` code), language name (from `LanguageStore` or a local pipe/helper), and status icon
- [ ] In-progress and Pending status icons have a CSS `spin` animation
- [ ] Selecting a tab calls `facade.selectJob(job.id)` — active tab is driven by `selectedJobId` signal
- [ ] `OnPush` change detection retained; template reads only facade-exposed signals
- [ ] Component template and styles updated; existing SCSS class names updated or extended as needed
- [ ] Header still shows file name, source language, and upload date

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translation-detail/translation-detail.component.ts`, `.html`, `.scss`
- Depends on: `04-[UI]-extend-facade-with-selected-job-and-copy-text.md`
- Angular Material `MatTabsModule` must be added to the component's `imports` array
- Flag emoji mapping: a small helper (e.g., `flagEmoji(langCode: string): string`) can live in the component class or a shared pipe
