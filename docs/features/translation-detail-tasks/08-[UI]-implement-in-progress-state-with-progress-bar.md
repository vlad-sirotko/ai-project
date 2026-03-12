# [UI] Implement in-progress tab content with Angular Material progress bar

## User Story
> As a user, I see a spinner while translation is in progress, without having to refresh the page.

## Description
Render the in-progress / pending tab panel content: a spinner icon, the text "Translation in progress… This may take a few moments.", and an Angular Material `<mat-progress-bar mode="indeterminate">` below the message. This panel is shown when `selectedJob().status` is `Processing` or `Pending`. The live polling implemented in the facade updates the store automatically, so the UI re-renders without any manual refresh.

## Acceptance Criteria
- [ ] In-progress state (status `Processing` or `Pending`) shows the loading message and indeterminate `<mat-progress-bar>`
- [ ] `MatProgressBarModule` imported in the component's `imports` array
- [ ] Pending state shows "Queued — waiting to start." text (or merged with Processing message per feature doc layout)
- [ ] Tab label for in-progress job has a spinning icon (`⟳` with CSS animation)
- [ ] Panel layout matches the feature spec (icon + message on top, full-width progress bar below)
- [ ] No copy button or retry button visible in this state

## Technical Notes
- Layer: UI
- Key files: `translation-detail.component.html`, `translation-detail.component.scss`
- Depends on: `06-[UI]-refactor-component-to-material-tab-layout.md`
