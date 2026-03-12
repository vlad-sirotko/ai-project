# [UI] Refactor TranslationDetailComponent to Angular Material tab bar layout

## User Story
> As a user, I can switch between language tabs to read different translations of the same document.
> As a user, I see a spinner while translation is in progress, without having to refresh the page.

## Description
Replace the current flat panel list in `TranslationDetailComponent` with an Angular Material `<mat-tab-group>` where each tab represents one `TranslationJob`. Each tab label shows a flag emoji (derived from the language code), the language name, and a status icon (`●` for Completed, `⟳` for Processing/Pending with CSS spin, `✕` for Failed). Switching tabs calls `facade.selectJob(job.id)` and all content is driven by the `facade.selectedJob()` signal — no additional HTTP calls.

## Acceptance Criteria
- [x] `MatTabGroup` / `MatTab` from Angular Material imported and used in the component
- [x] Each `TranslationJob` in `facade.document().jobs` renders as one `<mat-tab>`
- [x] Tab label contains: flag emoji (mapped from `targetLanguage` code), language name (from `LanguageStore` or a local pipe/helper), and status icon
- [x] In-progress and Pending status icons have a CSS `spin` animation
- [x] Selecting a tab calls `facade.selectJob(job.id)` — active tab is driven by `selectedJobId` signal
- [x] `OnPush` change detection retained; template reads only facade-exposed signals
- [x] Component template and styles updated; existing SCSS class names updated or extended as needed
- [x] Header still shows file name, source language, and upload date

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translation-detail/translation-detail.component.ts`, `.html`, `.scss`
- Depends on: `04-[UI]-extend-facade-with-selected-job-and-copy-text.md`
- Angular Material `MatTabsModule` must be added to the component's `imports` array
- Flag emoji mapping: a small helper (e.g., `flagEmoji(langCode: string): string`) can live in the component class or a shared pipe

## Implementation Notes
- `MatTabsModule` (containing `MatTabGroup` and `MatTab`) added to the standalone component's `imports` array. Angular Material was installed via `ng add @angular/material` with the Azure Blue theme.
- `selectedTabIndex` is a computed getter that maps `facade.selectedJobId()` to a tab index; `onTabChange(index)` converts the Material tab index back to a job ID and calls `facade.selectJob()`.
- `flagEmoji()` is a component-level helper (no pipe needed for a one-off mapping); `getLanguageName()` delegates to `LanguageStore.languages()` and falls back to the uppercased code.
- The spin animation is applied via a CSS `@keyframes spin` rule and toggled with the `tab-label__status--spin` class for `Pending`/`Processing` statuses.
- `StatusBadgeComponent` removed from `imports` since the template no longer uses it — import list is clean.
- `ChangeDetectionStrategy.OnPush` retained; all template bindings read from facade signals only.

## Status: ✅ Done
