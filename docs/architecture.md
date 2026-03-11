## Architecture Overview

### Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 20, Angular Material, SCSS, standalone components, Angular Signals |
| Backend | ASP.NET Core Web API, .NET 9, Clean Architecture |
| Database | SQLite via EF Core (Code First, auto-migrations) |
| Auth | JWT Bearer tokens |
| Translation | Pluggable `ITranslationProvider` — DeepL text API or Mock |
| PDF Extraction | PdfPig (.NET library, MIT license) |
| Background Jobs | `IHostedService` + `Channel<Guid>` (no external queue needed) |
| Real-time Status | Frontend polling (interval 3s on detail, 5s on list) |
| File Storage | Local disk `/uploads/` (Docker volume ready) |

---

### Backend Layer Dependencies

```
TranslationApp.API
    └── TranslationApp.Application
            └── TranslationApp.Domain

TranslationApp.Infrastructure
    └── TranslationApp.Application  (implements interfaces)
```

- `Domain` has zero external dependencies
- `Application` has no EF Core, no HTTP clients — only interfaces and CQRS handlers
- `Infrastructure` is the only layer allowed to use EF Core, PdfPig, DeepL SDK, JWT
- `API` wires DI registrations and exposes HTTP endpoints

---

### Database Schema

```sql
Users
  Id TEXT PRIMARY KEY
  Email TEXT UNIQUE NOT NULL
  PasswordHash TEXT NOT NULL
  Salt TEXT NOT NULL
  Role TEXT NOT NULL DEFAULT 'User'
  PreferredTargetLanguage TEXT NOT NULL DEFAULT 'ru'
  CreatedAt TEXT NOT NULL

Documents
  Id TEXT PRIMARY KEY
  UserId TEXT NOT NULL REFERENCES Users(Id)
  OriginalFileName TEXT NOT NULL
  OriginalFilePath TEXT NOT NULL
  SourceLanguage TEXT NOT NULL
  FileHash TEXT NOT NULL
  FileSizeBytes INTEGER NOT NULL
  UploadedAt TEXT NOT NULL

TranslationJobs
  Id TEXT PRIMARY KEY
  DocumentId TEXT NOT NULL REFERENCES Documents(Id) ON DELETE CASCADE
  TargetLanguage TEXT NOT NULL
  Status TEXT NOT NULL DEFAULT 'Pending'
  TranslatedText TEXT
  ErrorMessage TEXT
  CreatedAt TEXT NOT NULL
  CompletedAt TEXT

SupportedLanguages
  Id TEXT PRIMARY KEY
  Code TEXT UNIQUE NOT NULL
  Name TEXT NOT NULL
  IsActive INTEGER NOT NULL DEFAULT 1

AppSettings
  Key TEXT PRIMARY KEY
  Value TEXT NOT NULL
```

---

### Frontend Module Structure

```
src/app/
├── core/
│   ├── guards/         auth.guard.ts, admin.guard.ts
│   ├── interceptors/   jwt.interceptor.ts
│   ├── services/       auth.service.ts, document.service.ts, language.service.ts, admin.service.ts
│   └── stores/         auth.store.ts, translation.store.ts, language.store.ts
├── layouts/
│   ├── auth-layout/
│   ├── main-layout/
│   └── admin-layout/
├── shared/
│   ├── components/
│   │   ├── file-dropzone/
│   │   ├── status-badge/
│   │   ├── language-selector/
│   │   └── loading-spinner/
│   └── models/
│       ├── document.model.ts
│       ├── translation-job.model.ts
│       ├── language.model.ts
│       └── user.model.ts
└── features/
    ├── auth/
    │   ├── login/
    │   └── register/
    ├── documents/
    │   ├── upload/
    │   ├── translations-list/
    │   └── translation-detail/
    └── admin/
        ├── settings/
        └── languages/
```

---

### Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Translation storage (Phase 1) | DB column `TranslatedText TEXT` | Simplest; no extra file I/O; SQLite handles text well |
| Translation provider | Pluggable `ITranslationProvider` | Swap DeepL/Mock/Azure without changing business logic |
| Real-time updates | Polling (3s detail / 5s list) | No WebSocket/SignalR complexity; sufficient for this use case |
| Background jobs | `Channel<Guid>` + `IHostedService` | No external message queue; in-process, reliable enough for single-node app |
| Duplicate file detection | SHA-256 file hash | Prevents duplicate storage; fast lookup against indexed hash column |
| Document grouping | `Document` entity owns `TranslationJob[]` | Enables per-language jobs, tab UI, add-language without re-upload |
| Admin config storage | `AppSettings` table (key-value) | Runtime config changes without redeployment |
| Auth | JWT in localStorage | Acceptable for course project; simple to implement |
| Docker | Not in Phase 1 | Folder structure prepared (`/uploads/`, `app.db`) for easy volume mount later |

---

### Phase Roadmap

**Phase 1 — current scope**
- Full auth (register, login, preferences)
- Upload PDF, extract text, translate via pluggable provider
- Store translated text in DB
- View translated text in UI with tabs per language
- Admin: provider config + language management
- Polling-based status updates

**Phase 2 — future**
- Generate downloadable translated PDF (DeepL Document API)
- Download button on detail and list pages
- Word document support

**Phase 3 — future**
- Docker + docker-compose
- File size limits and upload quota per user
- SignalR for real-time status (replace polling)
