---
description: 'Project structure, architecture decisions, and conventions for the PDF Translation App'
applyTo: '**'
---

## Project: PDF Translation App

A full-stack application that allows users to upload PDF files, translate them into multiple languages, and view the translated text in the browser. Built with Angular 20 (frontend), ASP.NET Core Clean Architecture (backend), SQLite via EF Core (database), and JWT authentication.

---

## Repository Layout

```
ai-project/
├── backend/                           # ASP.NET Core solution
│   ├── TranslationApp.sln
│   ├── TranslationApp.Domain/         # Entities, enums — no external dependencies
│   ├── TranslationApp.Application/    # Use cases, interfaces, DTOs, handlers
│   ├── TranslationApp.Infrastructure/ # EF Core, repositories, providers, background services
│   └── TranslationApp.API/            # Controllers, middleware, Program.cs
├── frontend/                          # Angular 20 application
│   └── src/app/
│       ├── core/                      # Guards, interceptors, services, signal stores
│       ├── layouts/                   # AuthLayout, MainLayout, AdminLayout
│       ├── shared/                    # Reusable components and models
│       └── features/                  # Lazy-loaded feature modules (auth, documents, admin)
├── uploads/                           # Original uploaded PDFs (runtime, not committed)
├── docs/                              # Feature documentation
│   ├── architecture.md
│   └── features/
│       ├── auth.md
│       ├── document-upload.md
│       ├── translation-flow.md
│       ├── translations-list.md
│       ├── translation-detail.md
│       └── admin.md
└── .github/
    └── instructions/                  # Copilot instruction files
```

---

## Backend Architecture: Clean Architecture

Dependencies flow inward only: `API → Application → Domain`. Infrastructure depends on Application interfaces.

### Layer Responsibilities

- **Domain** — Pure C# entities and enums. No EF Core, no external packages.
- **Application** — CQRS-style handlers (Command/Query + Handler pattern). Defines interfaces (`ITranslationProvider`, `IDocumentRepository`, etc.). Uses FluentValidation.
- **Infrastructure** — Implements interfaces. Contains EF Core `AppDbContext`, migrations, repositories, `LocalFileStorageService`, `JwtTokenService`, translation providers, and `TranslationBackgroundService`.
- **API** — ASP.NET Core controllers, JWT Bearer auth, Swagger, global exception middleware. Registers all DI.

### Key Interfaces (defined in Application, implemented in Infrastructure)

- `ITranslationProvider` — pluggable translation abstraction. Implementations: `DeepLTranslationProvider`, `MockTranslationProvider`.
- `IDocumentRepository` / `ITranslationJobRepository` / `IUserRepository`
- `IFileStorageService` — saves and retrieves uploaded PDF files
- `IJwtTokenService` — generates and validates JWT tokens

---

## Domain Model

### Entities

**User**
- `Id`, `Email`, `PasswordHash`, `Salt`, `Role` (User/Admin), `PreferredTargetLanguage`, `CreatedAt`

**Document** — parent of all translations for one uploaded file
- `Id`, `UserId` (FK), `OriginalFileName`, `OriginalFilePath`, `SourceLanguage`, `FileHash` (SHA-256, for duplicate detection), `FileSizeBytes`, `UploadedAt`

**TranslationJob** — one per target language per Document
- `Id`, `DocumentId` (FK), `TargetLanguage`, `Status` (Pending/Processing/Completed/Failed), `TranslatedText`, `ErrorMessage`, `CreatedAt`, `CompletedAt`

**SupportedLanguage**
- `Id`, `Code` (en/ru/pl), `Name`, `IsActive`

**AppSetting**
- `Key`, `Value` — runtime config (active provider, DeepL API key)

### Relationships

- `User` (1) → (many) `Document`
- `Document` (1) → (many) `TranslationJob`
- Cascading delete: deleting a Document deletes its TranslationJobs

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET | /api/auth/me | User | Get current user profile |
| PUT | /api/auth/me/preferences | User | Update preferred target language |
| POST | /api/documents/upload | User | Upload PDF, creates Document + TranslationJob |
| GET | /api/documents | User | List user's documents with nested jobs |
| GET | /api/documents/{id} | User | Get document with all translation jobs |
| POST | /api/documents/{id}/translate | User | Add new language to existing document |
| GET | /api/languages | User | List active supported languages |
| GET | /api/admin/settings | Admin | Get app settings |
| PUT | /api/admin/settings | Admin | Update app settings (provider, API key) |
| GET | /api/admin/languages | Admin | List all languages |
| POST | /api/admin/languages | Admin | Add new language |
| PUT | /api/admin/languages/{id} | Admin | Toggle language active/inactive |

---

## Translation Flow

1. User uploads PDF → `POST /api/documents/upload`
2. API computes SHA-256 hash of file:
   - If Document with same hash exists for this user → reuse it (no duplicate file saved)
   - Otherwise → save file to `/uploads/{documentId}.pdf`, create `Document` row
3. Check if `TranslationJob` for requested target language already exists and is Completed → return existing job immediately
4. Create new `TranslationJob` (Status=Pending), write job ID to `Channel<Guid>`
5. `TranslationBackgroundService` reads from Channel:
   - Calls `PdfTextExtractor.ExtractText()` (PdfPig) to get text from PDF
   - Calls `ITranslationProvider.TranslateTextAsync(text, sourceLang, targetLang)`
   - On success: saves `TranslatedText` to job row, Status=Completed
   - On failure: Status=Failed, ErrorMessage set
6. Frontend polls `GET /api/documents/{documentId}` every 3 seconds until terminal status

---

## Frontend Architecture

### Routing

```
/                       → redirect to /app/upload
/auth/login             → AuthLayout + LoginComponent
/auth/register          → AuthLayout + RegisterComponent
/app/upload             → MainLayout + UploadComponent (AuthGuard)
/app/translations       → MainLayout + TranslationsListComponent (AuthGuard)
/app/translations/:id   → MainLayout + TranslationDetailComponent (AuthGuard)
/admin/settings         → AdminLayout + AdminSettingsComponent (AdminGuard)
/admin/languages        → AdminLayout + AdminLanguagesComponent (AdminGuard)
```

### Layouts

- `AuthLayoutComponent` — centered card, no navigation
- `MainLayoutComponent` — top bar + sidebar with Upload / My Files links
- `AdminLayoutComponent` — admin sidebar with Settings / Languages links

### State Management (Angular Signals)

- `AuthStore` — current user, JWT token, `preferredTargetLanguage` signal
- `TranslationStore` — documents list, selected document with nested jobs
- `LanguageStore` — active supported languages

### Conventions

- All components are standalone
- Use `input()`, `output()`, `viewChild()` functions (Angular 20), not decorators
- Signal-based stores injected via `inject()`
- HTTP calls in services only — never in components
- `OnPush` change detection on all components
- Lazy-loaded routes for each feature folder
- JWT interceptor attaches Bearer token to all `/api/**` requests
- `AuthGuard` and `AdminGuard` use `CanActivateFn` functional guards

---

## Database

- SQLite file: `app.db` at project root (configurable via `ConnectionStrings:DefaultConnection`)
- Migrations auto-applied on startup in development (`Database.Migrate()` in `Program.cs`)
- Default seed data: English, Russian, Polish languages; `TranslationProvider=Mock` app setting; one admin user (credentials from `appsettings.Development.json`)
- Repositories are the only layer that accesses `AppDbContext` directly

---

## Security Notes

- Passwords hashed with BCrypt (salt stored separately)
- JWT secret stored in `appsettings.json` (use environment variable in production)
- Angular sanitizes all displayed text via built-in DomSanitizer
- File upload validated: PDF only, max 20MB
- Route guards enforce role-based access on both frontend and backend
