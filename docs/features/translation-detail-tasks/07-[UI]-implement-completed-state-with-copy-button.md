# [UI] Implement completed-job tab content with copy button

## User Story
> As a user, I can see the translated text of a completed job.
> As a user, I can copy the translated text to clipboard.

## Description
Inside the selected job's tab panel, render the completed-state content: a header "Translated Text (language name)", a read-only scrollable textarea containing `selectedJob().translatedText`, and a "📋 Copy Text" button that calls `facade.copyText()`. When `facade.copyTextCopied()` is `true`, the button label changes to "Copied ✓" for 2 seconds. The `[+ Add language]` button is rendered below the content panel for all states.

## Acceptance Criteria
- [x] Completed state renders a labelled scrollable `<textarea readonly>` with `translatedText`
- [x] "📋 Copy Text" button is visible only on the Completed state
- [x] Button label shows "Copied ✓" while `facade.copyTextCopied()` is `true`, otherwise "📋 Copy Text"
- [x] Button is disabled while `copyTextCopied` is `true` to prevent double-clicks
- [x] `[+ Add language]` button is rendered outside the job panel (below tab content) and visible for all states
- [x] Styles match the feature spec layout (scrollable textarea, button row)

## Technical Notes
- Layer: UI
- Key files: `translation-detail.component.html`, `translation-detail.component.scss`
- Depends on: `04-[UI]-extend-facade-with-selected-job-and-copy-text.md`, `06-[UI]-refactor-component-to-material-tab-layout.md`

## Implementation Notes
- Completed state renders a `job-panel__header-row` flex row with an `<h3>` heading showing "Translated Text (language name)" and the copy button flush-right.
- The copy button uses `[disabled]="facade.copyTextCopied()"` — Angular sets `disabled` attribute, preventing double-clicks; SCSS targets `:disabled` pseudo-class to show a green confirmation color.
- `[+ Add language]` is placed outside `<mat-tab-group>` in a `detail__add-lang` section so it is always visible regardless of the active tab.
- The textarea keeps `resize: vertical` for comfort but has a 200 px minimum height.

## Status: ✅ Done
