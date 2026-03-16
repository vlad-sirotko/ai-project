# [UI] Test shared pipes and presentational components

## User Story
> As a developer, the `FileSizePipe` formatting rules are verified with precise boundary values
> As a developer, key component interactions (form validation, error states, loading states) are verified automatically

## Description
Add spec files for `FileSizePipe`, `StatusBadgeComponent`, and `FileDropzoneComponent` — the three shared / presentational units that have no facade and require no service mocking. `FileSizePipe` is tested via direct instantiation; the two components use Angular `TestBed`.

## Acceptance Criteria

### FileSizePipe
- [ ] Pipe is instantiated directly (`new FileSizePipe()`) — no `TestBed`
- [ ] `0` bytes → `"0 B"`
- [ ] `1023` bytes → `"1023 B"`
- [ ] `1024` bytes → `"1 KB"`
- [ ] `1 048 576` bytes → `"1.0 MB"`
- [ ] At least one mid-range MB value is tested (e.g., `1 572 864` → `"1.5 MB"`)

### StatusBadgeComponent
- [ ] `status = 'Pending'` renders the expected CSS class (e.g., `badge--pending`)
- [ ] `status = 'Processing'` renders the processing class
- [ ] `status = 'Completed'` renders the completed/success class
- [ ] `status = 'Failed'` renders the error/failed class

### FileDropzoneComponent
- [ ] Dropping a valid PDF file triggers the `fileSelected` output with the `File` object
- [ ] Dropping an invalid file type triggers the error output without emitting a valid file
- [ ] The drop target calls `preventDefault()` on `dragover`

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/shared/pipes/file-size.pipe.ts` / `.spec.ts`
  - `frontend/src/app/shared/components/status-badge/status-badge.component.ts` / `.spec.ts`
  - `frontend/src/app/shared/components/file-dropzone/file-dropzone.component.ts` / `.spec.ts`
- Simulate drop events with a synthetic `DragEvent` containing a mock `DataTransfer` + `File`
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`
