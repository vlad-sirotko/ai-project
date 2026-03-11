## Feature: Translation Detail

### Overview

Shows a single document with all its translation jobs displayed as language tabs. Completed translations show the translated text in a scrollable panel. In-progress jobs show a spinner. Users can add more languages or copy the translated text to clipboard.

### User Stories

- As a user, I can see the translated text of a completed job
- As a user, I can switch between language tabs to read different translations of the same document
- As a user, I see a spinner while translation is in progress, without having to refresh the page
- As a user, I can copy the translated text to clipboard
- As a user, I can add a new target language from the detail page
- As a user, I can retry a failed translation

### Backend

**Endpoint**
```
GET /api/documents/{documentId}
```
Returns single Document with all nested TranslationJobs including the `TranslatedText` field.

**Response**
```json
{
  "id": "guid",
  "originalFileName": "contract.pdf",
  "sourceLanguage": "en",
  "fileSizeBytes": 102400,
  "uploadedAt": "2026-03-10T09:00:00Z",
  "jobs": [
    {
      "id": "guid",
      "targetLanguage": "ru",
      "status": "Completed",
      "translatedText": "Это договор об оказании услуг...",
      "createdAt": "...",
      "completedAt": "..."
    },
    {
      "id": "guid",
      "targetLanguage": "pl",
      "status": "Processing",
      "translatedText": null,
      "createdAt": "...",
      "completedAt": null
    }
  ]
}
```

### Frontend

**TranslationDetailComponent** (`/app/translations/:documentId`)

**Facade: `TranslationDetailFacade`** (component-scoped, in `providers`)

The component delegates all data fetching, polling, clipboard interactions, and mutations to the facade, which encapsulates `DocumentService`, `TranslationStore`, and the polling interval/cleanup logic.

**Layout — job in progress:**
```
← Back to My Translations

contract.pdf    EN    Mar 10

[ 🇷🇺 Russian ● ]  [ 🇵🇱 Polish ⟳ ]

────────────────────────────────────────
  ⟳  Translation in progress...
     This may take a few moments.

  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ← Angular Material indeterminate progress bar
────────────────────────────────────────

[ + Add language ]
```

**Layout — job completed:**
```
← Back to My Translations

contract.pdf    EN    Mar 10    ● Completed

[ 🇷🇺 Russian ● ]  [ 🇵🇱 Polish ● ]

────────────────────────────────────────
  Translated Text (Russian)

  ┌────────────────────────────────────────┐
  │  Это договор об оказании услуг между   │
  │  компанией «Альфа» и клиентом «Бета»  │   ← scrollable, read-only textarea
  │                                        │
  │  Статья 1. Предмет договора            │
  │  ...                                   │
  └────────────────────────────────────────┘

[ 📋 Copy Text ]   [ + Add language ]
────────────────────────────────────────
```

**Layout — job failed:**
```
[ 🇩🇪 German ✕ ]

────────────────────────────────────────
  ✕ Translation failed

  Unable to extract text from the PDF.
  The document may be scanned or image-only.

  [ Retry ]
────────────────────────────────────────
```

**Tab behavior:**
- Each tab = one `TranslationJob` (one target language)
- Tab label: flag emoji + language name + status icon
- In-progress tab label: status icon has CSS spin animation
- Selecting a tab updates `selectedJobId` signal — no additional API call (all job data already loaded)
- Active tab content rendered based on the selected job's status

**Polling:**
- On component init: load document via `GET /api/documents/{documentId}`
- If any job is Pending or Processing → start `interval(3000)`
- Each tick: fetch document, update `TranslationStore` → UI re-renders reactively via signals
- When all jobs reach terminal status → stop polling via `takeUntil`
- Interval subscription cleaned up on `OnDestroy`

**Copy Text:**
- Uses `navigator.clipboard.writeText(translatedText)`
- Button label temporarily changes to "Copied ✓" for 2 seconds then reverts

**[+ Add language] button:**
- Opens inline dropdown listing active languages not yet added to this document
- On select: calls `POST /api/documents/{documentId}/translate`
- New Pending tab added to the tab bar reactively (no page reload)
- Automatically switches to the new tab

**[Retry] button (on failed tab):**
- Calls `POST /api/documents/{documentId}/translate` with the same targetLang
- Replaces failed job with new Pending job, starts polling
