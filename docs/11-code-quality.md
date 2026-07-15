# 12. Code Organization, Error Handling & Security

This document covers sections 12–14 of the documentation requirements.

---

# 12. Code Organization

## Naming Conventions

### Backend (Java)

| Element | Convention | Example |
|---------|------------|---------|
| Packages | `com.tenalink.{domain}.{layer}` | `com.tenalink.auth.service` |
| Entities | `{Name}Entity` | `UserEntity`, `AppointmentEntity` |
| DTOs | `{Domain}Dto` with inner classes | `AuthDto.LoginRequest` |
| Repositories | `{Entity}Repository` | `UserRepository` |
| Services | `{Domain}Service` | `AppointmentService` |
| Controllers | `{Domain}Controller` | `HospitalController` |
| Migrations | `V{n}__{description}.sql` | `V2__add_patient_fields.sql` |
| DB roles | `ROLE_{NAME}` | `ROLE_PATIENT` |

### Frontend (JavaScript)

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase files and exports | `AdminDashboardPage.jsx` |
| API modules | `{domain}.api.js` | `appointments.api.js` |
| Hooks | `use{Name}` | `useAuth`, `useLanguage` |
| Constants | `ROLES`, UPPER_SNAKE | `constants/roles.js` |
| Routes | `{Role}Routes.jsx` | `DoctorRoutes.jsx` |

## Coding Patterns

### Backend

- **Constructor injection** for services and repositories
- **Lombok** `@Getter`/`@Setter` on entities
- **Spring Data JPA** repository interfaces
- **DTO mapping** via manual setter methods in controllers (`toResponse()`)
- **CommandLineRunner seeders** with `@ConditionalOnProperty`

### Frontend

- **Functional components** with hooks
- **Per-page data fetching** in `useEffect`
- **API layer separation** — pages import from `src/api/`
- **Role-based route modules** split by portal

## Dependency Injection

Spring manages all backend dependencies. No manual service locator pattern.

Frontend uses React Context for auth and language only.

## Separation of Concerns

| Layer | Responsibility |
|-------|----------------|
| Controller | HTTP mapping, status codes |
| Service | Business rules, orchestration |
| Repository | Data access |
| Entity | Persistence model |
| DTO | API contract |
| `src/api/` (frontend) | HTTP client wrappers |
| `src/pages/` | Route-level UI and data loading |
| `src/features/` | Reusable domain UI |

## Reusable Utilities

| Utility | Location | Purpose |
|---------|----------|---------|
| `sortByNewest` | `Frontend/src/utils/sort.js` | Sort arrays by date keys |
| `cn()` | `Frontend/src/lib/utils.js` | Tailwind class merging |
| `getDashboardRoute` | `Frontend/src/constants/roles.js` | Role → home path |
| `saveUser` | `Frontend/src/utils/savedUsers.js` | localStorage recent users |

---

# 13. Error Handling

## Backend Exception Handling

Each service has `GlobalExceptionHandler` (`@RestControllerAdvice`).

### auth-service

| Exception | HTTP status |
|-----------|-------------|
| `AuthenticationFailedException` | 401 |
| `DataIntegrityViolationException` | 409 |
| Generic `Exception` | 500 |

### user-service

| Exception | HTTP status |
|-----------|-------------|
| `PatientNotFoundException` | 404 |
| `ResourceNotFoundException` | 404 |
| Generic `Exception` | 500 |

### appointment, pharmacy, medical-records, admin, hospital services

| Exception | HTTP status |
|-----------|-------------|
| `RuntimeException` | 400 |
| Generic `Exception` | 500 |

### Error response body

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Date and time are required",
  "timestamp": "2026-06-29T10:00:00Z"
}
```

## Logging

- SLF4J loggers in services (e.g., `AuthService`, seeders, `ContextService`)
- Login attempts logged at INFO; failures at WARN
- Invalid JWT at DEBUG in `JwtAuthenticationFilter`

**No centralized log aggregation configured in code.**

## Frontend Error Handling

| Component | Behavior |
|-----------|----------|
| `apiClient.js` | Wraps axios errors as `{ original, message }`; 401 clears auth |
| `ErrorAlert` | Displays error message with optional retry |
| Pages | `try/catch` in `useEffect`; set local `error` state |

## Retry Mechanisms

**None implemented** in backend or frontend API layer.

## Validation Errors

No standardized validation error format (e.g., field-level errors). Missing Bean Validation on DTOs.

## Failure Scenarios

| Scenario | Behavior |
|----------|----------|
| Invalid login | 401, message "Invalid credentials" |
| User not found (context) | 500 from ContextController |
| Appointment not found on cancel | 400 RuntimeException |
| Patient not found | 404 |
| Network failure (frontend) | Error message from axios |
| Token expired | **Needs developer input** — likely 401 on protected calls if enforced |

---

# 14. Security

## Authentication

| Control | Status |
|---------|--------|
| BCrypt password hashing | ✅ auth-service |
| JWT issuance | ✅ 24h HMAC-SHA tokens |
| JWT client storage | ⚠️ localStorage (XSS exposure risk) |
| Server-side session | ❌ Not used |
| Refresh tokens | ❌ Not implemented |

## Authorization

| Control | Status |
|---------|--------|
| Frontend route guards | ✅ `ProtectedRoute` |
| Backend role checks | ❌ `permitAll()` on all services |
| Resource-level access control | ❌ Not implemented |
| Hospital/tenant isolation | ❌ Not implemented |

## Password Security

- BCrypt via Spring Security `BCryptPasswordEncoder`
- No password complexity rules on backend
- Default dev passwords in seed data (`patient123`, etc.)

## Secrets Management

- Dev JWT secret hardcoded in YAML
- Prod expects `JWT_SECRET` env var
- DB passwords in YAML defaults and `application.properties` (user-service)

## SQL Injection Protection

- JPA parameterized queries
- JDBC templates use `?` placeholders in auth-service

## XSS Protection

- React escapes JSX by default
- No `dangerouslySetInnerHTML` found in routed pages (not exhaustively verified on all files)

## CSRF Protection

**Disabled** on all Spring Security configurations.

## Input Validation

- Minimal server-side validation
- Some client-side form validation
- No request size limits configured in code

## Rate Limiting

**Not implemented.**

## CORS

Gateway allows configured origins (default `http://localhost:5173`), credentials enabled.

## Secure Headers

**No explicit security headers** (HSTS, CSP, X-Frame-Options) configured in gateway or services.

## Security Weaknesses Discovered

1. **Backend permits all requests** — JWT not validated on most services
2. **No API-level authorization** — any bearer token or unauthenticated call may work
3. **Register page bypasses backend** — accounts in localStorage only
4. **JWT in localStorage** — vulnerable to XSS theft
5. **Hardcoded credentials** in `user-service/application.properties`
6. **Dev JWT secret in source** — must be overridden in production
7. **No HTTPS enforcement** in application code
8. **Admin endpoints expose platform-wide data** without role checks
9. **Medical data access** not restricted to owning patient/doctor at API layer
10. **Demo passwords in documentation and seed scripts**

## HIPAA / Compliance

**Needs developer input** — no compliance controls (encryption at rest, audit of PHI access, BAA, etc.) are evident in code.
