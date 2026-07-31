# 3. Project Architecture

## Overall Architecture

TenaLink uses a **microservices architecture** with a **Backend-for-Frontend (BFF) style API gateway**. The frontend is a single React SPA with **role-based routing** to four logical portals. Each domain service follows a **layered architecture**:

```
Controller → Service → Repository → Entity (JPA)
```

There is no shared library module; services are independent Maven modules communicating only via HTTP (through the gateway) or direct JDBC to `user_db` where configured.

## Design Philosophy

- **Database per service** — Each microservice owns its PostgreSQL schema
- **Gateway as single client entry point** — All frontend traffic targets port 8080
- **Role-based portals** — One SPA, multiple route trees guarded by `ProtectedRoute`
- **Append-oriented medical data** — Medical events and audit logs are created, not updated in normal flows
- **Dev seeding optional** — Bootstrap seeders gated by `app.seed.enabled=true` (default `false` in `application-dev.yml`)

## Architectural Style

| Layer | Style |
|-------|-------|
| Backend | **Microservices** + **Layered** (Controller / Service / Repository) |
| Frontend | **Component-based SPA** with feature folders |
| Integration | **API Gateway** (Spring Cloud Gateway) |

Not used: Clean Architecture strict boundaries, event-driven messaging, CQRS, or shared Redux store.

## High-Level Architecture

```mermaid
flowchart TB
  subgraph client [Client Tier]
    Browser[Browser - React SPA :5173]
  end

  subgraph gateway [Gateway Tier]
    GW[Spring Cloud Gateway :8080]
  end

  subgraph services [Service Tier]
    AUTH[auth-service :8081]
    USER[user-service :8082]
    PHARM[pharmacy-service :8085]
    MED[medical-records-service :8086]
    ADMIN[admin-service :8087]
    HOSP[hospital-service :8088]
  end

  subgraph data [Data Tier]
    ADB[(auth_db)]
    UDB[(user_db)]
    PDB[(pharmacy_db)]
    MRDB[(medical_record_db)]
    ADDB[(admin_db)]
    HDB[(hospital_db)]
  end

  Browser -->|HTTPS REST /api/v1| GW
  GW --> AUTH & USER & PHARM & MED & ADMIN & HOSP
  AUTH --> ADB
  AUTH -.->|JDBC| UDB
  USER --> UDB
  PHARM --> PDB
  PHARM -.->|JDBC| UDB
  MED --> MRDB
  MED -.->|JDBC| UDB
  ADMIN --> ADDB
  HOSP --> HDB
```

## Request Lifecycle

```mermaid
sequenceDiagram
  participant C as React Client
  participant G as Gateway :8080
  participant S as Target Service
  participant DB as PostgreSQL

  C->>C: Read JWT from localStorage.authState
  C->>G: HTTP request + Authorization Bearer
  G->>G: CORS check (CorsWebFilter)
  G->>S: Route by path predicate
  Note over S: Most services: permitAll()
  Note over S: auth-service: JwtAuthenticationFilter parses JWT
  S->>DB: JPA / JDBC query
  DB-->>S: Result
  S-->>G: JSON response
  G-->>C: JSON response
  alt 401 from gateway or client interceptor
    C->>C: Clear authState, redirect /login
  end
```

## Component Interaction (Frontend)

```mermaid
flowchart LR
  main[main.jsx] --> App[App.jsx]
  App --> AuthProvider
  App --> LanguageProvider
  App --> Router[AppRouter]
  Router --> Public[Login / Register]
  Router --> Layout[Layout + RoleSidebar]
  Layout --> AdminRoutes
  Layout --> DoctorRoutes
  Layout --> PatientRoutes
  Layout --> SuperAdminRoutes
  AdminRoutes --> Pages[Page Components]
  Pages --> API[src/api/*.api.js]
  API --> apiClient[apiClient.js]
  apiClient --> Gateway
```

## Data Flow — Care Record Access

```mermaid
sequenceDiagram
  participant P as Patient Portal
  participant G as Gateway
  participant M as medical-records-service
  participant U as user-service

  P->>G: GET /medical-events
  G->>M: Forward
  M->>U: Resolve patient/doctor references
  M-->>P: Medical timeline payload
```

## Deployment Architecture (Documented)

```mermaid
flowchart LR
  subgraph prod [Documented Production - Needs developer input for actual setup]
    Vercel[Vercel - Frontend]
    Render[Render/Railway/Fly.io - 8 Java services]
    PG[(Managed PostgreSQL x7)]
  end

  Users[Users] --> Vercel
  Vercel -->|VITE_API_BASE_URL| GW[Gateway]
  GW --> Render
  Render --> PG
```

No Docker or Kubernetes manifests exist in the repository.

## Dependency Flow (Backend)

```
gateway-service
  └── spring-cloud-starter-gateway, actuator

auth-service, user-service, pharmacy-service,
medical-records-service, admin-service, hospital-service
  └── spring-boot-starter-web
  └── spring-boot-starter-data-jpa
  └── spring-boot-starter-security
  └── postgresql, flyway-core
  └── jjwt (used in auth-service; present but unused in others)
```

Parent POM (`Backend/pom.xml`) manages Spring Boot 3.4.5 and Spring Cloud BOM only.

## Authentication Flow

See [08 — Authentication & Authorization](./08-authentication-authorization.md) for the full sequence diagram.

## Database Relationships (Cross-Service)

There are **no foreign keys across databases**. Relationships are logical UUID/string references:

- `users.id` (auth_db) ↔ `patients.user_id` / `doctors.user_id` (user_db)
- `medical_events.patient_id`, `author_id` → user_db IDs
- `prescriptions.patient_id`, `doctor_id` → user_db IDs
- `medical_events.patient_id`, `author_id` → user_db IDs
- `prescriptions.patient_id`, `doctor_id` → user_db IDs
- `audit_logs.admin_id` → `users.id` (auth_db)

See [05 — Database](./05-database.md) for ER diagrams per database.
