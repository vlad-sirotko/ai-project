# [UI] Implement completed-job tab content with copy button

## User Story
> As a user, I can see the translated text of a completed job.
> As a user, I can copy the translated text to clipboard.

## Description
Inside the selected job's tab panel, render the completed-state content: a header "Translated Text (language name)", a read-only scrollable textarea containing `selectedJob().translatedText`, and a "📋 Copy Text" button that calls `facade.copyText()`. When `facade.copyTextCopied()` is `true`, the button label changes to "Copied ✓" for 2 seconds. The `[+ Add language]` button is rendered below the content panel for all states.

## Acceptance Criteria
- [ ] Completed state renders a labelled scrollable `<textarea readonly>` with `translatedText`
- [ ] "📋 Copy Text" button is visible only on the Completed state
- [ ] Button label shows "Copied ✓" while `facade.copyTextCopied()` is `true`, otherwise "📋 Copy Text"
- [ ] Button is disabled while `copyTextCopied` is `true` to prevent double-clicks
- [ ] `[+ Add language]` button is rendered outside the job panel (below tab content) and visible for all states
- [ ] Styles match the feature spec layout (scrollable textarea, button row)

## Technical Notes
- Layer: UI
- Key files: `translation-detail.component.html`, `translation-detail.component.scss`
- Depends on: `04-[UI]-extend-facade-with-selected-job-and-copy-text.md`, `06-[UI]-refactor-component-to-material-tab-layout.md`
