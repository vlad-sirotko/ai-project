# [UI] Implement in-progress tab content with Angular Material progress bar

## User Story
> As a user, I see a spinner while translation is in progress, without having to refresh the page.

## Description
Render the in-progress / pending tab panel content: a spinner icon, the text "Translation in progress… This may take a few moments.", and an Angular Material `<mat-progress-bar mode="indeterminate">` below the message. This panel is shown when `selectedJob().status` is `Processing` or `Pending`. The live polling implemented in the facade updates the store automatically, so the UI re-renders without any manual refresh.

## Acceptance Criteria
- [x] In-progress state (status `Processing` or `Pending`) shows the loading message and indeterminate `<mat-progress-bar>`
- [x] `MatProgressBarModule` imported in the component's `imports` array
- [x] Pending state shows "Queued — waiting to start." text (or merged with Processing message per feature doc layout)
- [x] Tab label for in-progress job has a spinning icon (`⟳` with CSS animation)
- [x] Panel layout matches the feature spec (icon + message on top, full-width progress bar below)
- [x] No copy button or retry button visible in this state

## Technical Notes
- Layer: UI
- Key files: `translation-detail.component.html`, `translation-detail.component.scss`
- Depends on: `06-[UI]-refactor-component-to-material-tab-layout.md`

## Implementation Notes
- `MatProgressBarModule` added to the standalone component's `imports` array; `<mat-progress-bar mode="indeterminate">` renders below the status message.
- `Processing` and `Pending` are kept as separate `@case` blocks with distinct messages ("in progress" vs "Queued"), both sharing the same progress bar and spinning `⟳` icon.
- The spin animation on the `⟳` inside `job-panel__msg` reuses the existing `@keyframes spin` rule; the class `spin` is applied to a `<span>` wrapping the character.
- The tab label `⟳` for in-progress jobs already animated via `tab-label__status--spin` CSS class from task 06.

## Status: ✅ Done
