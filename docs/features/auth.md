## Feature: Authentication

### Overview

JWT-based authentication with register and login. Users have one of two roles: `User` or `Admin`. Role is assigned at registration (default: `User`). Admin users get access to `/admin/**` routes.

### User Stories

- As a new user, I can register with email and password
- As a registered user, I can log in and receive a JWT token
- As a logged-in user, I can set my preferred translation target language
- As an admin user, I can access the admin panel

### Backend

**Endpoints**

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Creates new user, returns JWT |
| POST | /api/auth/login | Validates credentials, returns JWT |
| GET | /api/auth/me | Returns current user profile |
| PUT | /api/auth/me/preferences | Updates `PreferredTargetLanguage` |

**Handler: RegisterHandler**
- Validates email uniqueness
- Hashes password with BCrypt
- Creates `User` entity with Role=User, PreferredTargetLanguage="ru"
- Returns `AuthResponseDto` with JWT token and user info

**Handler: LoginHandler**
- Finds user by email
- Verifies BCrypt hash
- Generates JWT via `IJwtTokenService`
- Returns `AuthResponseDto`

**JWT Token Claims**
- `sub` — userId
- `email` — user email
- `role` — User or Admin
- `exp` — expiry (configurable, default 7 days)

### Frontend

**Pages**
- `LoginComponent` (`/auth/login`) — email + password form, link to register
- `RegisterComponent` (`/auth/register`) — email + password + confirm password form

**Facades**

Each component delegates all store and navigation calls to a component-scoped facade:

| Component | Facade | Responsibilities |
|---|---|---|
| `LoginComponent` | `LoginFacade` | Calls `AuthStore.login()`, navigates to `/app/upload` |
| `RegisterComponent` | `RegisterFacade` | Calls `AuthStore.register()`, navigates to `/app/upload` |

Facades are `@Injectable()` (no `providedIn`) registered in `providers` on the component, keeping them scoped and easily mockable in tests.

**AuthStore (signal-based)**
```
currentUser: signal<UserModel | null>
isAuthenticated: computed<boolean>
isAdmin: computed<boolean>
preferredTargetLanguage: signal<string>
```

- Token stored in `localStorage`
- On app init, token is read from localStorage and user profile fetched from `GET /api/auth/me`
- `AuthGuard` redirects unauthenticated users to `/auth/login`
- `AdminGuard` redirects non-admin users to `/app/upload`

### Models

**UserModel (frontend)**
```typescript
interface UserModel {
  id: string;
  email: string;
  role: 'User' | 'Admin';
  preferredTargetLanguage: string;
}
```

**AuthResponseDto (backend)**
```json
{
  "token": "eyJ...",
  "userId": "guid",
  "email": "user@example.com",
  "role": "User",
  "preferredTargetLanguage": "ru"
}
```
