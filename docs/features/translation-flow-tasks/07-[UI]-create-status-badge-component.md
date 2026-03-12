# [UI] Create StatusBadgeComponent

## User Story
> As a user, I can immediately understand the status of any translation job at a glance from a consistently styled badge.

## Description
Create a reusable `StatusBadgeComponent` in `frontend/src/app/shared/components/status-badge/`. It accepts a `status` input and renders an appropriately styled badge. The Processing badge includes a CSS spin animation on its icon. This component is used by both `TranslationsListComponent` and `TranslationDetailComponent`.

**Status → visual mapping:**
| Status | Colour | Icon / label |
|---|---|---|
| `Pending` | Grey | `○ Pending` |
| `Processing` | Blue | `⟳ Processing` (icon spins via CSS) |
| `Completed` | Green | `● Done` |
| `Failed` | Red | `✕ Failed` |

## Acceptance Criteria
- [x] `StatusBadgeComponent` is created as a standalone component in `frontend/src/app/shared/components/status-badge/`
- [x] Accepts a required `status` input of type `'Pending' | 'Processing' | 'Completed' | 'Failed'`
- [x] Renders different CSS classes per status (e.g. `badge--pending`, `badge--processing`, `badge--completed`, `badge--failed`)
- [x] The Processing state icon has a CSS `@keyframes` spin animation
- [x] Uses `OnPush` change detection
- [x] Component is exported and importable from other standalone components
- [x] Basic SCSS styles are included in the component's `.scss` file

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/shared/components/status-badge/status-badge.component.ts`
  - `frontend/src/app/shared/components/status-badge/status-badge.component.html`
  - `frontend/src/app/shared/components/status-badge/status-badge.component.scss`
- No dependencies on other tasks in this set

## Implementation Notes

- `JobStatus` type (`'Pending' | 'Processing' | 'Completed' | 'Failed'`) defined in `shared/models/translation-job.model.ts` and imported by the component
- Uses Angular 20 `input.required<JobStatus>()` (no `@Input` decorator)
- Template uses `@switch` / `@case` (Angular new control flow) for status-to-content mapping
- `[ngClass]` binds the modifier class as `'badge--' + status().toLowerCase()` (e.g. `badge--processing`)
- Spin animation applied via `badge__icon--spin` CSS class on the icon `<span>` only, so the label text stays still
- Exported from `shared/index.ts` barrel for clean imports
- `TranslationJobModel` and `DocumentModel` created in `shared/models/` as prerequisites for tasks 08/09

## Status: ✅ Done
