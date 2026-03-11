# [UI] Create FileDropzoneComponent

## User Story
> As a user, I can drag and drop a PDF onto the upload area or click to browse and select a file.

## Description
Create a reusable `FileDropzoneComponent` in `src/app/shared/components/file-dropzone/`. The component supports both drag-and-drop and click-to-browse file selection. It emits the selected `File` object via an `output()` signal. It also displays the selected file name and size as feedback, and applies appropriate visual states (idle, dragover, file-selected).

## Acceptance Criteria
- [ ] `FileDropzoneComponent` is a standalone `OnPush` component
- [ ] Supports drag-and-drop: handles `dragover`, `dragleave`, `drop` events
- [ ] Supports click-to-browse via a hidden `<input type="file" accept=".pdf">`
- [ ] Emits selected `File` via `output()` named `fileSelected`
- [ ] Displays selected file name and size (formatted) when a file is chosen
- [ ] Visual state changes: idle border → highlighted border on dragover → file-selected state
- [ ] Accepts optional `accept` input (defaults to `".pdf"`) for reusability
- [ ] Component is exported from `shared/` barrel

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/shared/components/file-dropzone/file-dropzone.component.ts`
  - `src/app/shared/components/file-dropzone/file-dropzone.component.html`
  - `src/app/shared/components/file-dropzone/file-dropzone.component.scss`
- Dependencies: none (pure presentational component)
