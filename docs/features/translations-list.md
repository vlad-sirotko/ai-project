## Feature: Translations List

### Overview

The main hub page showing all documents a user has uploaded, grouped with their translation jobs. Users can navigate to the detail page, add a new language to an existing document, or retry failed jobs.

### User Stories

- As a user, I can see all my uploaded documents and their translation statuses
- As a user, I can see multiple language translations grouped under one document
- As a user, I can click to view a completed translation
- As a user, I can add a new target language to an existing document without re-uploading
- As a user, I can retry a failed translation job

### Backend

**Endpoint**
```
GET /api/documents
```
Returns all `Document` records for the authenticated user, each with a nested array of all `TranslationJob` records (all statuses).

**Response**
```json
[
  {
    "id": "guid",
    "originalFileName": "contract.pdf",
    "sourceLanguage": "en",
    "fileSizeBytes": 102400,
    "uploadedAt": "2026-03-10T09:00:00Z",
    "jobs": [
      { "id": "guid", "targetLanguage": "ru", "status": "Completed", "createdAt": "...", "completedAt": "..." },
      { "id": "guid", "targetLanguage": "pl", "status": "Processing", "createdAt": "...", "completedAt": null }
    ]
  }
]
```

**Add language to existing document**
```
POST /api/documents/{documentId}/translate
Body: { "targetLang": "pl" }
```
Creates a new `TranslationJob` for an existing Document. Returns the new job. Does not re-upload or re-process the file (original file path is on the Document record).

### Frontend

**TranslationsListComponent** (`/app/translations`)

```
My Translations                                       [ Upload New ]

contract.pdf    EN    Mar 10    📄 120 KB
  🇷🇺 Russian   ● Done                               [View →]
  🇵🇱 Polish    ⟳ Processing
  [ + Add language ▼ ]

report.pdf      EN    Mar 11    📄 84 KB
  🇷🇺 Russian   ○ Pending
  [ + Add language ▼ ]

invoice.pdf     PL    Mar 9     📄 45 KB
  🇬🇧 English   ✕ Failed                            [Retry]
  [ + Add language ▼ ]
```

**Status badges** (`StatusBadgeComponent`):
- `○ Pending` — grey
- `⟳ Processing` — blue, spinning CSS animation
- `● Done` — green
- `✕ Failed` — red

**[View →] button:**
- Only shown on jobs with Status=Completed
- Navigates to `/app/translations/{documentId}` and pre-selects that language tab

**[Retry] button:**
- Only shown on Failed jobs
- Calls `POST /api/documents/{documentId}/translate` with the same targetLang
- Replaces the failed job row with a new Pending entry

**[+ Add language] dropdown:**
- Lists all active languages from `LanguageStore` except the document's source language
- Languages that already have a job (any status) shown as disabled with label "(already added)"
- On select: calls `DocumentService.addLanguage(documentId, targetLang)`, refreshes `TranslationStore`

**Auto-refresh:**
- If any job across all documents has Status=Pending or Processing → poll `GET /api/documents` every 5 seconds
- Stops when all jobs are in terminal status
- Uses `interval(5000)` + `takeUntil` pattern same as detail page
