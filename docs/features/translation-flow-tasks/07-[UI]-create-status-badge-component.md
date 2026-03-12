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
- [ ] `StatusBadgeComponent` is created as a standalone component in `frontend/src/app/shared/components/status-badge/`
- [ ] Accepts a required `status` input of type `'Pending' | 'Processing' | 'Completed' | 'Failed'`
- [ ] Renders different CSS classes per status (e.g. `badge--pending`, `badge--processing`, `badge--completed`, `badge--failed`)
- [ ] The Processing state icon has a CSS `@keyframes` spin animation
- [ ] Uses `OnPush` change detection
- [ ] Component is exported and importable from other standalone components
- [ ] Basic SCSS styles are included in the component's `.scss` file

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/shared/components/status-badge/status-badge.component.ts`
  - `frontend/src/app/shared/components/status-badge/status-badge.component.html`
  - `frontend/src/app/shared/components/status-badge/status-badge.component.scss`
- No dependencies on other tasks in this set
