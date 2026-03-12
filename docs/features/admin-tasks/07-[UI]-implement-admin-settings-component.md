# [UI] Implement AdminSettingsComponent with Facade and DeepL Status

## User Story
> As an admin, I can switch the active translation provider between Mock and DeepL, set and update the DeepL API key, and see the DeepL connection/quota status after saving.

## Description
Build the entire settings page as a cohesive unit:

1. **`AdminSettingsFacade`** (component-scoped) — encapsulates `AdminService`, exposes `settings`, `isLoading`, `saveError`, and `connectionStatus` signals; maps the flat `AppSettingDto[]` to a typed view model.
2. **`AdminSettingsComponent`** — standalone component that renders the provider dropdown, password-type DeepL API key field with show/hide toggle, **Save** button, and a connection status indicator.

Connection status variants: ✅ Connected (chars remaining), ❌ Invalid API key, ⚪ Mock provider active (no connection needed). Status shows after the first successful save and clears on provider change.

## Acceptance Criteria
**Facade:**
- [ ] `settings` signal: `{ translationProvider: string; deeplApiKey: string; deeplFreeApi: boolean } | null`
- [ ] `isLoading` signal (`boolean`); `saveError` signal (`string | null`)
- [ ] `connectionStatus` signal: `'connected' | 'invalid' | 'mock' | 'idle'` with optional `charsRemaining` number
- [ ] `loadSettings()` calls `AdminService.getSettings()` and maps to the typed signal
- [ ] `saveSettings(values)` calls `AdminService.updateSettings()`, refreshes state, then updates `connectionStatus`
- [ ] When provider is Mock, `connectionStatus` is automatically set to `'mock'`; when `'idle'` the status indicator is hidden

**Component:**
- [ ] Standalone, `OnPush`, `AdminSettingsFacade` in `providers` array
- [ ] Provider dropdown renders `Mock` and `DeepL` options bound to facade signal
- [ ] API key input uses `type="password"`; toggle button switches to `type="text"` and back
- [ ] **Save** button disabled while `isLoading()` is true
- [ ] Inline `saveError` message rendered when non-null
- [ ] Status indicator renders correct icon and text for each `connectionStatus` variant
- [ ] `loadSettings()` called on component init

## Technical Notes
- Layer: UI
- Key files:
  - `frontend/src/app/features/admin/settings/admin-settings.facade.ts`
  - `frontend/src/app/features/admin/settings/admin-settings.component.ts` (+ `.html`, `.scss`)
- Depends on: `05-[UI]-scaffold-admin-section.md`, `06-[UI]-create-admin-service.md`
- If the backend has no dedicated status-check endpoint, infer status from whether `DeepL.ApiKey` is non-empty after a successful save
