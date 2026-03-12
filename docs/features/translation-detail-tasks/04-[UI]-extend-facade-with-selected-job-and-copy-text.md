# [UI] Extend TranslationDetailFacade with selectedJobId and copy-text

## User Story
> As a user, I can switch between language tabs to read different translations of the same document.
> As a user, I can copy the translated text to clipboard.

## Description
Add `selectedJobId` as a writable signal to `TranslationDetailFacade`, a `selectJob(id)` method to update it, and a `selectedJob` computed signal derived from the document. Add a `copyTextCopied` boolean signal and a `copyText()` method that writes the selected job's `translatedText` to the clipboard via `navigator.clipboard.writeText()` and sets `copyTextCopied` to `true` for 2 seconds before reverting.

## Acceptance Criteria
- [x] `selectedJobId` writable signal (initial value: first job's ID after document loads, or `null`)
- [x] `selectedJob` computed signal returns the job matching `selectedJobId`
- [x] `selectJob(id: string)` method updates `selectedJobId`
- [x] `copyTextCopied` signal exposed as readonly boolean, starts `false`
- [x] `copyText()` calls `navigator.clipboard.writeText(selectedJob()?.translatedText ?? '')`, sets `copyTextCopied` to `true`, resets to `false` after 2 seconds (`setTimeout`)
- [x] `loadDocument` sets `selectedJobId` to the first job's ID after the initial document fetch (if present)
- [x] All new signals/methods are `readonly` or `protected` as appropriate; no logic leaks into the component

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translation-detail/translation-detail.facade.ts`
- No new dependencies required

## Implementation Notes
- `_selectedJobId` is a private writable signal; `selectedJobId` and `selectedJob` are exposed as readonly via `.asReadonly()` and `computed()` respectively.
- `selectedJob` is a `computed` signal that derives directly from the store's `document` signal and `_selectedJobId` — no extra state to synchronise.
- `loadDocument` guards with `!this._selectedJobId()` before auto-selecting the first job, so a subsequent re-fetch (during polling) never resets the active tab.
- `copyText()` uses the native Clipboard API (`navigator.clipboard.writeText`) and resets `copyTextCopied` via `setTimeout` — no external library needed.

## Status: ✅ Done
