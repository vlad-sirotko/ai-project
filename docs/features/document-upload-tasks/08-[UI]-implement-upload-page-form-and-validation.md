# [UI] Implement Upload Page Form and Validation

## User Story
> As a user, I can select source and target languages, and my last-used target language is pre-selected. I see a warning if my file is over 20MB before submitting.

## Description
Implement the `UploadComponent` at `/app/upload` with the full upload form. The component composes `FileDropzoneComponent` and `LanguageSelectorComponent`, wires them together via an `UploadFacade` (component-scoped provider), pre-fills the target language from `AuthStore.preferredTargetLanguage`, and enforces client-side validation rules. The facade is the only layer the component communicates with — no direct store or service calls in the component class.

## Acceptance Criteria
- [x] `UploadComponent` is a standalone `OnPush` component registered at `/app/upload` (lazy-loaded under `MainLayoutComponent`)
- [x] `UploadFacade` is provided in `UploadComponent.providers` (component-scoped)
- [x] `FileDropzoneComponent` and `LanguageSelectorComponent` are composed in the template
- [x] Target language is pre-filled from `AuthStore.preferredTargetLanguage` signal via the facade
- [x] Client-side validation enforces:
  - [x] A file must be selected before submitting
  - [x] File must have `.pdf` extension
  - [x] Source and target languages must be different
  - [x] Warning label shown (not blocking) when selected file exceeds 20 MB
- [x] Inline error messages are displayed for each failed validation rule
- [x] Loading state is shown while the upload is in progress (submit button disabled)
- [x] Route is protected by `AuthGuard`

## Technical Notes
- Layer: UI
- Key files / classes involved:
  - `src/app/features/documents/upload/upload.component.ts`
  - `src/app/features/documents/upload/upload.component.html`
  - `src/app/features/documents/upload/upload.component.scss`
  - `src/app/features/documents/upload/upload.facade.ts`
  - `src/app/core/stores/auth.store.ts` (preferredTargetLanguage signal)
  - `src/app/app.routes.ts` (route registration)
- Dependencies:
  - `06-[UI]-create-file-dropzone-component.md`
  - `07-[UI]-create-language-selector-component.md`
  - `09-[UI]-wire-up-document-service-upload-call.md`
  - `10-[UI]-navigate-to-translation-detail-on-success.md`

## Implementation Notes
- `UploadFacade` is `@Injectable()` (no `providedIn`) — declared in `providers: [UploadFacade]` on the component, making it component-scoped
- Validation is a single `validationErrors` computed signal returning a `Record<string, string>`; `isValid` is a computed boolean derived from it
- `fileTooLargeWarning` is a separate computed signal (non-blocking, only shows a warning)
- `_targetLang` signal is initialized from `authStore.preferredTargetLanguage()` at construction time
- Template uses Angular `@if` / `@else` control flow and native `<form (ngSubmit)>`; no `ReactiveFormsModule` needed
- `authGuard` is applied at the parent `/app` route level in `app.routes.ts` — no per-child guard needed
- Angular build: 0 errors, `upload-component` lazy chunk ~39 KB

## Status: ✅ Done
