# [UI] Test shared pipes and presentational components

## User Story
> As a developer, the `FileSizePipe` formatting rules are verified with precise boundary values
> As a developer, key component interactions (form validation, error states, loading states) are verified automatically

## Description
Add spec files for `FileSizePipe`, `StatusBadgeComponent`, and `FileDropzoneComponent` — the three shared / presentational units that have no facade and require no service mocking. `FileSizePipe` is tested via direct instantiation; the two components use Angular `TestBed`.

## Acceptance Criteria

### FileSizePipe
- [x] Pipe is instantiated directly (`new FileSizePipe()`) — no `TestBed`
- [x] `0` bytes → `"0 B"`
- [x] `1023` bytes → `"1023 B"`
- [x] `1024` bytes → `"1 KB"`
- [x] `1 048 576` bytes → `"1.0 MB"`
- [x] At least one mid-range MB value is tested (e.g., `1 572 864` → `"1.5 MB"`)

### StatusBadgeComponent
- [x] `status = 'Pending'` renders the expected CSS class (e.g., `badge--pending`)
- [x] `status = 'Processing'` renders the processing class
- [x] `status = 'Completed'` renders the completed/success class
- [x] `status = 'Failed'` renders the error/failed class

### FileDropzoneComponent
- [x] Dropping a valid PDF file triggers the `fileSelected` output with the `File` object
- [x] Dropping an invalid file type triggers the error output without emitting a valid file
- [x] The drop target calls `preventDefault()` on `dragover`

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/shared/pipes/file-size.pipe.ts` / `.spec.ts`
  - `frontend/src/app/shared/components/status-badge/status-badge.component.ts` / `.spec.ts`
  - `frontend/src/app/shared/components/file-dropzone/file-dropzone.component.ts` / `.spec.ts`
- Simulate drop events with a synthetic `DragEvent` containing a mock `DataTransfer` + `File`
- Dependencies: `01-[UI]-configure-jest-replace-karma.md`

## Implementation Notes

- `FileSizePipe`: tested via direct instantiation — no TestBed needed since it's a pure transform with no Angular DI
- `StatusBadgeComponent`: uses `fixture.componentRef.setInput('status', ...)` for signal inputs (Angular 20 API), then `fixture.detectChanges()` before querying with `By.css`
- `FileDropzoneComponent`: the `fileSelected` output (`output()` API) is subscribed to via `component.fileSelected.subscribe(spy)`; drop events are simulated with a plain object cast to `DragEvent` since `DataTransfer` is not instantiable in JSDOM; the `file-invalid` CSS class (applied via `[class.file-invalid]`) is queried to verify error state
- All TestBed configs include `provideZonelessChangeDetection()` to match the app's change detection strategy

## Status: ✅ Done
