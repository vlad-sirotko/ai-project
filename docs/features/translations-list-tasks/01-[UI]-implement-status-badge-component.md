# [UI] Implement StatusBadgeComponent

## User Story
> As a user, I can see all my uploaded documents and their translation statuses

## Description
Create (or complete) the shared `StatusBadgeComponent` that renders a visual badge for each `TranslationJob` status. The component must cover all four possible states — Pending, Processing, Completed, and Failed — with distinct icons, colours, and a CSS spinning animation on the Processing state.

## Acceptance Criteria
- [ ] Component accepts a `status` input of type `string` (values: `Pending`, `Processing`, `Completed`, `Failed`)
- [ ] `Pending` renders `○ Pending` in grey
- [ ] `Processing` renders `⟳ Processing` in blue with a CSS spin animation on the icon
- [ ] `Completed` renders `● Done` in green
- [ ] `Failed` renders `✕ Failed` in red
- [ ] Component is standalone and uses `OnPush` change detection
- [ ] Component is exported from the shared barrel / usable via import in any feature component

## Technical Notes
- Layer: UI
- Key files: `frontend/src/app/shared/components/status-badge/status-badge.component.ts`, `.html`, `.scss`
- Uses Angular `input()` function (Angular 20 style), not `@Input()` decorator
- No dependencies on other tasks in this set

## Implementation Notes
- The `status` input is typed as `JobStatus` (`'Pending' | 'Processing' | 'Completed' | 'Failed'`) rather than a plain `string`, which is strictly more type-safe while satisfying the acceptance criteria values. The template uses Angular 20 `@switch`/`@case` control flow to render the correct icon and label per status.
- The spinning animation is implemented via a CSS `@keyframes spin` rule applied to the `.badge__icon--spin` modifier class (only used on the Processing icon), keeping the animation purely in SCSS with no JS involvement.
- The component is already exported from `frontend/src/app/shared/index.ts` so any feature can import it directly from the shared barrel.

## Status: ✅ Done
