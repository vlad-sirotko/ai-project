# [UI] Create FileDropzoneComponent

## User Story
> As a user, I can drag and drop a PDF onto the upload area or click to browse and select a file.

## Description
Create a reusable `FileDropzoneComponent` in `src/app/shared/components/file-dropzone/`. The component supports both drag-and-drop and click-to-browse file selection. It emits the selected `File` object via an `output()` signal. It also displays the selected file name and size as feedback, and applies appropriate visual states (idle, dragover, file-selected).

## Acceptance Criteria
- [x] `FileDropzoneComponent` is a standalone `OnPush` component
- [x] Supports drag-and-drop: handles `dragover`, `dragleave`, `drop` events
- [x] Supports click-to-browse via a hidden `<input type="file" accept=".pdf">`
- [x] Emits selected `File` via `output()` named `fileSelected`
- [x] Displays selected file name and size (formatted) when a file is chosen
- [x] Visual state changes: idle border → highlighted border on dragover → file-selected state
- [x] Accepts optional `accept` input (defaults to `".pdf"`) for reusability
- [x] Component is exported from `shared/` barrel

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/shared/components/file-dropzone/file-dropzone.component.ts`
  - `src/app/shared/components/file-dropzone/file-dropzone.component.html`
  - `src/app/shared/components/file-dropzone/file-dropzone.component.scss`
- Dependencies: none (pure presentational component)

## Implementation Notes
- Uses `input()`, `output()`, `viewChild.required()` and `signal()` (Angular 20 / zoneless project with `provideZonelessChangeDetection()`)
- `isDragOver` and `selectedFile` are writable signals; template uses `@if` control flow with `as` binding
- `viewChild.required<ElementRef<HTMLInputElement>>('fileInput')` references the hidden file input; `openFilePicker()` calls `.click()` on it
- `formatFileSize()` formats bytes as B / KB / MB
- Three visual states via CSS classes: default (dashed grey), `.dragover` (blue), `.file-selected` (solid green)
- Placeholder and file-info sections have `pointer-events: none` to prevent click event interference
- Barrel export added at `src/app/shared/index.ts`
- Angular build succeeded with 0 errors

## Status: ✅ Done
