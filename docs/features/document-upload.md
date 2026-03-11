## Feature: Document Upload

### Overview

Users upload a PDF file and select source and target languages. The backend creates a `Document` record and a `TranslationJob` record, then queues the job for background processing. Duplicate detection prevents re-saving the same file.

### User Stories

- As a user, I can drag and drop a PDF onto the upload area or click to browse
- As a user, I can pick source and target languages from dropdowns
- As a user, my last-used target language is pre-selected (from my profile preference)
- As a user, if I upload the same PDF I uploaded before, the file is not saved twice
- As a user, if a completed translation for that language already exists, I am redirected to it immediately without waiting

### Backend

**Endpoint**
```
POST /api/documents/upload
Content-Type: multipart/form-data

Fields:
  file         — PDF file (required, max 20MB, .pdf only)
  sourceLang   — language code e.g. "en"
  targetLang   — language code e.g. "ru"
```

**Handler: UploadDocumentHandler**

1. Validate file: PDF MIME type (`application/pdf`), max 20MB
2. Compute SHA-256 hash of file bytes
3. Look up existing `Document` for this user with matching `FileHash`:
   - Found → reuse existing Document, skip file save
   - Not found → save file to `/uploads/{newDocumentId}.pdf`, create new `Document` row
4. Look up existing `TranslationJob` for (DocumentId, TargetLanguage) with Status=Completed:
   - Found → return existing job immediately (no new job created)
5. Create new `TranslationJob` (Status=Pending)
6. Write job ID to `Channel<Guid>` for background processing
7. Return `UploadResponseDto`

**Response**
```json
{
  "documentId": "guid",
  "jobId": "guid",
  "status": "Pending",
  "isExisting": false
}
```

### Frontend

**UploadComponent** (`/app/upload`)

**Facade: `UploadFacade`** (component-scoped, in `providers`)

The component interacts with the facade only — no direct store or service calls from the template or component class. The facade encapsulates:
- `DocumentService.upload()` — file upload API call
- `LanguageStore` — active languages for dropdowns
- `AuthStore.preferredTargetLanguage` — pre-fill target language
- `Router` — navigate to detail page on success

```
[ File Dropzone — drag & drop or click to browse ]
  Selected: contract.pdf (120 KB)

From: [ English ▼ ]   To: [ Russian ▼ ]

[ Translate ]
```

Behavior:
- `FileDropzoneComponent` emits the selected `File` object on file selection
- `LanguageSelectorComponent` reads active languages from `LanguageStore`
- Target language pre-filled from `AuthStore.preferredTargetLanguage`
- On submit: calls `DocumentService.upload(file, sourceLang, targetLang)`
- On success: navigate to `/app/translations/{documentId}`
- On error: show inline error message

**Client-side Validation**
- File must be selected
- File must be `.pdf` extension
- Source and target languages must differ
- File size shown as warning label if over 20MB before submit

### Models

**UploadResponseDto (backend)**
```json
{
  "documentId": "guid",
  "jobId": "guid",
  "status": "Pending",
  "isExisting": false
}
```
