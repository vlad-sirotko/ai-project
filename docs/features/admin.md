## Feature: Admin Panel

### Overview

Admin-only section accessible via a separate layout. Provides two pages: translation provider configuration (Settings) and language management (Languages). Protected by `AdminGuard` which checks the `isAdmin` computed signal on `AuthStore`.

### User Stories

- As an admin, I can switch the active translation provider between Mock and DeepL
- As an admin, I can set and update the DeepL API key
- As an admin, I can see the DeepL connection/quota status after saving a key
- As an admin, I can enable or disable supported languages
- As an admin, disabled languages do not appear in user-facing language dropdowns immediately

### Backend

**Endpoints**

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/settings | Returns all `AppSettings` as key-value pairs |
| PUT | /api/admin/settings | Updates one or more `AppSettings` values |
| GET | /api/admin/languages | Returns all languages (active and inactive) |
| POST | /api/admin/languages | Adds a new language |
| PUT | /api/admin/languages/{id} | Toggles `IsActive` or updates `Name` |

**AppSettings keys managed via admin:**
- `TranslationProvider` — `"Mock"` or `"DeepL"`
- `DeepL.ApiKey` — API key string stored in DB
- `DeepL.FreeApi` — `"true"` or `"false"` (determines which DeepL base URL is used)

Note: `GET /api/languages` (user-facing) filters by `IsActive = true`. The admin endpoint returns all languages regardless.

### Frontend

**AdminLayoutComponent** — separate layout with:
- Sidebar: Settings link, Languages link
- Breadcrumb bar showing current admin section
- Same top bar as MainLayout

---

**AdminSettingsComponent** (`/admin/settings`)

**Facade: `AdminSettingsFacade`** (component-scoped, in `providers`)

The component delegates all API calls and state reads to the facade, which encapsulates `AdminService` and any relevant stores.

```
Translation Provider
────────────────────────────────────────
Active provider:  [ DeepL ▼ ]

DeepL API Key:    [ ●●●●●●●●●● ]  [ Show ]

                  [ Save ]

Status:   ✅ Connected — 480,000 chars remaining
          ❌ Invalid API key — check your key
          ⚪ Mock provider active (no connection needed)
────────────────────────────────────────
```

Behavior:
- On save: `PUT /api/admin/settings` with all updated values
- After saving a DeepL key: call a lightweight status check endpoint to show connection status
- API key input uses `type="password"` with a show/hide toggle button
- Provider dropdown change immediately reflects in the form but requires Save to persist

---

**AdminLanguagesComponent** (`/admin/languages`)

**Facade: `AdminLanguagesFacade`** (component-scoped, in `providers`)

The component delegates all API calls and state reads to the facade, which encapsulates `AdminService` and `LanguageStore`.

```
Supported Languages                          [ + Add Language ]
──────────────────────────────────────────────────────────────
🇬🇧 English (en)    Source + Target    ✅ Active    [ Disable ]
🇷🇺 Russian (ru)    Source + Target    ✅ Active    [ Disable ]
🇵🇱 Polish  (pl)    Source + Target    ✅ Active    [ Disable ]
🇩🇪 German  (de)    Source + Target    🔘 Inactive  [ Enable  ]
──────────────────────────────────────────────────────────────
```

Behavior:
- Toggle Active/Inactive: calls `PUT /api/admin/languages/{id}`
- Change takes effect immediately for users (user dropdowns use `GET /api/languages` which filters `IsActive=true`)
- **[+ Add Language]** opens an inline form with Code (e.g. `de`) and Name (e.g. `German`) fields
- English (`en`) cannot be disabled — it is the default source language (disable button hidden)

### AdminGuard

Functional `CanActivateFn` guard:
- Checks `AuthStore.isAuthenticated()` — if false → redirect to `/auth/login`
- Checks `AuthStore.isAdmin()` — if false → redirect to `/app/upload`
