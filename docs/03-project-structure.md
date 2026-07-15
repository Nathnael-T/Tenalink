# 4. Project Structure

## Repository Tree

```
Tenalink/
├── Backend/                          # Maven multi-module Spring Boot backend
│   ├── pom.xml                       # Parent POM (8 modules)
│   ├── API.md                        # Legacy API notes (partially outdated)
│   ├── ARCHITECTURE.md               # Backend architecture notes
│   ├── MICROSERVICES.md              # Service overview notes
│   ├── gateway-service/              # API gateway (:8080)
│   ├── auth-service/                 # Auth & users (:8081, auth_db)
│   ├── user-service/                 # Patients & doctors (:8082, user_db)
│   ├── appointment-service/          # Appointments (:8083, appointment_db)
│   ├── pharmacy-service/             # Prescriptions (:8085, pharmacy_db)
│   ├── medical-records-service/      # Medical events (:8086, medical_record_db)
│   ├── admin-service/                # Audit & config (:8087, admin_db)
│   └── hospital-service/             # Hospitals (:8088, hospital_db)
├── Frontend/                         # React + Vite SPA
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env / .env.local
│   ├── components.json               # shadcn config
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   ├── scripts/                      # Build/maintenance scripts
│   └── src/
│       ├── app/                      # Entry, router, providers
│       ├── api/                      # HTTP API modules
│       ├── assets/styles/            # Global CSS
│       ├── components/               # layouts, shared, ui
│       ├── constants/                # roles.js
│       ├── context/                  # TimelineSearchContext
│       ├── features/                 # doctor, patient, timeline, Audit
│       ├── lib/                      # utils (cn)
│       ├── mock/                     # Legacy mock users
│       ├── pages/                    # Route page components
│       ├── routes/                   # Route definitions per role
│       └── utils/                    # sort, seedMockData, savedUsers
├── database/                         # SQL seed/import scripts per DB
│   ├── auth_db.sql
│   ├── user_db.sql
│   ├── appointment_db.sql
│   ├── pharmacy_db.sql
│   ├── medical_record_db.sql
│   ├── admin_db.sql
│   ├── hospital_db.sql
│   └── README_IMPORT.md
├── docs/                             # This documentation set
└── README.md                         # Project quick start
```

---

## Backend Folder Reference

### `Backend/gateway-service/`

| Responsibility | API routing, CORS, graceful shutdown |
|----------------|--------------------------------------|
| Key files | `GatewayApplication.java`, `CorsConfig.java`, `application.yml` |
| Interacts with | All downstream services via configured URIs |

### `Backend/auth-service/`

| Responsibility | Login, register, JWT issuance, user listing, identity context |
|----------------|---------------------------------------------------------------|
| Key packages | `controller/`, `service/`, `entity/`, `repository/`, `config/`, `bootstrap/`, `exception/` |
| Databases | `auth_db` (primary), `user_db` (JDBC for patient creation on register) |
| Interacts with | Gateway; frontend via `/auth/**`, `/context/**` |

### `Backend/user-service/`

| Responsibility | Patient and doctor profile CRUD |
|----------------|----------------------------------|
| Key packages | `controller/PatientController`, `DoctorController`, `service/`, `entity/`, `repository/` |
| Database | `user_db` |
| Interacts with | Gateway; frontend via `/patients/**`, `/doctors/**` |

### `Backend/appointment-service/`

| Responsibility | Appointment lifecycle, admin appointment views |
|----------------|------------------------------------------------|
| Key packages | `AppointmentController`, `AdminAppointmentController`, `service/`, `bootstrap/` |
| Databases | `appointment_db`, `user_db` (JDBC in seeder) |
| Interacts with | Gateway; `/appointments/**`, `/admin/appointments/**` |

### `Backend/pharmacy-service/`

| Responsibility | Prescription create, list, fulfill |
|----------------|-----------------------------------|
| Database | `pharmacy_db` |
| Interacts with | Gateway; `/prescriptions/**` |

### `Backend/medical-records-service/`

| Responsibility | Medical timeline events and documents |
|----------------|---------------------------------------|
| Database | `medical_record_db` |
| Interacts with | Gateway; `/records/**` |

### `Backend/admin-service/`

| Responsibility | Audit logs, system configuration |
|----------------|----------------------------------|
| Database | `admin_db` |
| Interacts with | Gateway; `/audit-logs/**`, `/system-config/**` |

### `Backend/hospital-service/`

| Responsibility | Hospital directory CRUD |
|----------------|-------------------------|
| Database | `hospital_db` |
| Interacts with | Gateway; `/hospitals/**` |

### Per-service standard layout

```
{service}/src/main/java/com/tenalink/{domain}/
├── Application.java          # @SpringBootApplication entry
├── config/                   # SecurityConfig, UserDbConfig (where applicable)
├── controller/               # REST controllers
├── service/                  # Business logic
├── repository/               # Spring Data JPA
├── entity/                   # JPA entities
├── dto/                      # Request/response DTOs
├── bootstrap/                # CommandLineRunner seeders
└── exception/                # GlobalExceptionHandler, custom exceptions

{service}/src/main/resources/
├── application.yml
├── application-dev.yml
├── application-prod.yml
└── db/migration/             # Flyway SQL migrations
```

---

## Frontend Folder Reference

### `Frontend/src/app/`

| File | Purpose |
|------|---------|
| `main.jsx` | React DOM entry |
| `App.jsx` | Wraps `AuthProvider`, `LanguageProvider`, `AppRouter` |
| `Router.jsx` | Top-level routes and `ProtectedRoute` guards |
| `providers/AuthContext.jsx` | Auth state, login, context fetch |
| `providers/LanguageContext.jsx` | i18n scaffold (empty translations) |

### `Frontend/src/routes/`

Role-specific nested routes: `AdminRoutes.jsx`, `DoctorRoutes.jsx`, `PatientRoutes.jsx`, `SuperAdminRoutes.jsx`.

### `Frontend/src/pages/`

Page components organized by role: `admin/`, `doctor/`, `patient/`, `super-admin/`, `auth/`, `shared/`.

### `Frontend/src/api/`

Axios wrappers per domain: `apiClient.js`, `auth.api.js`, `appointments.api.js`, `hospitals.api.js`, etc.

### `Frontend/src/components/`

| Subfolder | Purpose |
|-----------|---------|
| `layouts/` | `Layout.jsx`, `RoleSidebar`, `TopNav`, `Footer` |
| `shared/` | `ProtectedRoute`, `ErrorAlert`, `EmptyState`, `LoadingScreen` |
| `ui/` | shadcn/Radix primitives |

### `Frontend/src/features/`

Domain-specific UI: `timeline/`, `doctor/`, `patient/`, `Audit/`. Includes some legacy mock data files.

### `Frontend/src/context/`

`TimelineSearchContext.jsx` — search/filter state for medical history pages.

### `database/`

SQL scripts for manual data import; separate from Flyway migrations in each service.

---

## Cross-Folder Interactions

```
Frontend/src/api/*.api.js
    → apiClient.js (base URL, JWT interceptor)
        → Gateway :8080/api/v1
            → Backend/{service}/controller
                → service → repository → PostgreSQL
```

Auth flow additionally:

```
AuthContext.signIn
    → auth.api.login
    → auth.api.getMe (context)
    → localStorage.authState
```
