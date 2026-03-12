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
- [x] `settings` signal: `{ translationProvider: string; deeplApiKey: string; deeplFreeApi: boolean } | null`
- [x] `isLoading` signal (`boolean`); `saveError` signal (`string | null`)
- [x] `connectionStatus` signal: `'connected' | 'invalid' | 'mock' | 'idle'` with optional `charsRemaining` number
- [x] `loadSettings()` calls `AdminService.getSettings()` and maps to the typed signal
- [x] `saveSettings(values)` calls `AdminService.updateSettings()`, refreshes state, then updates `connectionStatus`
- [x] When provider is Mock, `connectionStatus` is automatically set to `'mock'`; when `'idle'` the status indicator is hidden

**Component:**
- [x] Standalone, `OnPush`, `AdminSettingsFacade` in `providers` array
- [x] Provider dropdown renders `Mock` and `DeepL` options bound to facade signal
- [x] API key input uses `type="password"`; toggle button switches to `type="text"` and back
- [x] **Save** button disabled while `isLoading()` is true
- [x] Inline `saveError` message rendered when non-null
- [x] Status indicator renders correct icon and text for each `connectionStatus` variant
- [x] `loadSettings()` called on component init

## Implementation Notes
- Component maintains a local `draft` signal (initialized from `facade.settings()` after load) to hold in-progress edits — the facade's `settings` signal reflects only the last persisted state
- `saveSettings(values)` receives the full draft value; no direct signal mutation from the component
- Connection status is inferred locally (no dedicated backend endpoint): Mock → `'mock'`; DeepL with non-empty key → `'connected'`; DeepL with empty key → `'invalid'`
- `DeepLFreeApi` is serialized as `'true'`/`'false'` string in the `Record<string, string>` payload to match the `AppSetting` key-value storage model
- DeepL-specific fields (API key, free-API checkbox) are conditionally rendered using `@if (draft().translationProvider === 'DeepL')`

## Status: ✅ Complete
