# [UI] Style Translations List Page

## User Story
> As a user, I can see all my uploaded documents and their translation statuses

## Description
Write the SCSS for `TranslationsListComponent` to match the wireframe layout: a page header with title and "Upload New" button, document cards showing file metadata, job rows with flag/language name, status badge, and action buttons, plus the add-language dropdown row at the bottom of each card.

## Acceptance Criteria
- [ ] Page header row shows "My Translations" title left-aligned and an "Upload New" button right-aligned
- [ ] Each document renders as a card with: filename, source language badge, upload date, and file size
- [ ] Each job row shows: language name (with flag emoji), status badge, and optional action button (`[View →]` or `[Retry]`) aligned to the right
- [ ] `[+ Add language ▼]` row is visually separated at the bottom of each card
- [ ] Processing spinner animation (CSS `@keyframes rotate`) is scoped to the status badge spin
- [ ] Layout is responsive — cards stack and text wraps correctly at mobile widths
- [ ] Styles follow existing SCSS conventions (BEM-style class names, SCSS variables for colours/spacing where used in the project)

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/features/documents/translations-list/translations-list.component.scss`
- Spinning animation for Processing badge may live in `StatusBadgeComponent`'s own SCSS (task 01) — avoid duplicating it here
- Depends on tasks 01, 04, 05 for the DOM elements to be present before styling

## Implementation Notes
- The CSS spin animation for the Processing badge is kept exclusively in `StatusBadgeComponent`'s SCSS — it is not duplicated here.
- A new `.doc-card__add-lang` block is visually separated from the jobs list with a `border-top: 1px dashed` and a light background, sitting at the bottom of each card.
- `.add-lang-btn` is styled as a small outlined button (no fill) to avoid visual competition with the primary action links.
- `.job-row__retry-btn` uses a red border and text colour consistent with the `Failed` status badge palette; it is disabled (opacity 0.5, no pointer) when the retry is in-flight.
- The `doc-card__header` gains `flex-wrap: wrap` so filename and metadata wrap correctly at narrow widths; at ≤600 px the header stacks vertically and action buttons drop their `margin-left: auto` so they stay left-aligned.
- A `FileSizePipe` was created in `shared/pipes/file-size.pipe.ts` and exported from the shared barrel to format `doc.fileSizeBytes` as `KB`/`MB` in the document metadata row.

## Status: ✅ Done
