# [UI] Extend TranslationDetailFacade with selectedJobId and copy-text

## User Story
> As a user, I can switch between language tabs to read different translations of the same document.
> As a user, I can copy the translated text to clipboard.

## Description
Add `selectedJobId` as a writable signal to `TranslationDetailFacade`, a `selectJob(id)` method to update it, and a `selectedJob` computed signal derived from the document. Add a `copyTextCopied` boolean signal and a `copyText()` method that writes the selected job's `translatedText` to the clipboard via `navigator.clipboard.writeText()` and sets `copyTextCopied` to `true` for 2 seconds before reverting.

## Acceptance Criteria
- [ ] `selectedJobId` writable signal (initial value: first job's ID after document loads, or `null`)
- [ ] `selectedJob` computed signal returns the job matching `selectedJobId`
- [ ] `selectJob(id: string)` method updates `selectedJobId`
- [ ] `copyTextCopied` signal exposed as readonly boolean, starts `false`
- [ ] `copyText()` calls `navigator.clipboard.writeText(selectedJob()?.translatedText ?? '')`, sets `copyTextCopied` to `true`, resets to `false` after 2 seconds (`setTimeout`)
- [ ] `loadDocument` sets `selectedJobId` to the first job's ID after the initial document fetch (if present)
- [ ] All new signals/methods are `readonly` or `protected` as appropriate; no logic leaks into the component

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translation-detail/translation-detail.facade.ts`
- No new dependencies required
