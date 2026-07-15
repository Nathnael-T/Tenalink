# TenaLink Health Platform

A multi-portal healthcare platform connecting **patients**, **doctors**, **hospital administrators**, and **super administrators** through a React SPA and Spring Boot microservices backend.

📚 **Full documentation:** [docs/README.md](./docs/README.md)

---

## Features

- **Patient portal** — Book appointments, view medical history (timeline, prescriptions, labs, documents), manage profile
- **Doctor workspace** — Patient management, medical events, prescriptions, appointment requests
- **Hospital admin console** — Doctors, patients, appointments, audit logs, settings
- **Super admin console** — Hospital management, hospital admins, platform configuration, global audit
- **Microservices API** — Domain-separated services with dedicated PostgreSQL databases
- **JWT authentication** — Role-based portal routing with identity context (patient/doctor/admin IDs)

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios, shadcn/ui |
| Backend | Java 21, Spring Boot 3.4.5, Spring Cloud Gateway, Spring Data JPA |
| Database | PostgreSQL 16 (7 databases) |
| Auth | JWT (HMAC-SHA), BCrypt |
| Migrations | Flyway |

See [docs/01-overview-and-stack.md](./docs/01-overview-and-stack.md) for the complete stack breakdown.

---

## Architecture

```
Frontend (React + Vite :5173)  →  Gateway (:8080)
                                      │
        ┌─────────┬─────────┬─────────┼─────────┬─────────┬─────────┐
        ▼         ▼         ▼         ▼         ▼         ▼         ▼
      Auth      User      Appt     Pharm    MedRec    Admin    Hospital
      :8081     :8082     :8083    :8085     :8086     :8087     :8088
```

| Service | Port | Database |
|---------|------|----------|
| gateway-service | 8080 | — |
| auth-service | 8081 | auth_db |
| user-service | 8082 | user_db |
| appointment-service | 8083 | appointment_db |
| pharmacy-service | 8085 | pharmacy_db |
| medical-records-service | 8086 | medical_record_db |
| admin-service | 8087 | admin_db |
| hospital-service | 8088 | hospital_db |

Diagrams and request flows: [docs/02-architecture.md](./docs/02-architecture.md)

---

## Prerequisites

- **Java 21** (Temurin or Oracle)
- **Maven 3.9+**
- **Node.js 20+** and npm
- **PostgreSQL 16**

---

## Installation

### 1. Databases

```sql
CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE appointment_db;
CREATE DATABASE pharmacy_db;
CREATE DATABASE medical_record_db;
CREATE DATABASE admin_db;
CREATE DATABASE hospital_db;
```

Import demo data (optional):

```bash
psql -U postgres -d auth_db -f database/auth_db.sql
# Repeat for each file in database/
```

See [database/README_IMPORT.md](./database/README_IMPORT.md).

### 2. Backend

```bash
cd Backend
mvn clean compile
```

### 3. Frontend

```bash
cd Frontend
npm install
```

---

## Configuration

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | API gateway URL |

### Backend (common)

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `dev` | Spring profile |
| `SPRING_DATASOURCE_URL` | (in dev YAML) | Primary JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | `2001` | DB password |
| `JWT_SECRET` | dev default in YAML | JWT signing key (required in prod) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Gateway CORS |

Full variable reference: [docs/04-configuration.md](./docs/04-configuration.md)

---

## Running Locally

### Backend (8 processes)

```bash
cd Backend
mvn spring-boot:run -pl gateway-service &
mvn spring-boot:run -pl auth-service &
mvn spring-boot:run -pl user-service &
mvn spring-boot:run -pl appointment-service &
mvn spring-boot:run -pl pharmacy-service &
mvn spring-boot:run -pl medical-records-service &
mvn spring-boot:run -pl admin-service &
mvn spring-boot:run -pl hospital-service &
```

### Frontend

```bash
cd Frontend
npm run dev
```

Open http://localhost:5173

### Demo credentials (from `database/auth_db.sql`)

| Email | Password | Role |
|-------|----------|------|
| super@tenalink.com | super123 | Super Admin |
| admin1@tenalink.com | admin123 | Hospital Admin |
| doctor1@tenalink.com | doctor123 | Doctor |
| patient1@tenalink.com | patient123 | Patient |

---

## Running Tests

No automated test suite is currently in the repository.

```bash
# When tests are added:
cd Backend && mvn test
cd Frontend && npm test
```

---

## Deployment

| Component | Documented target |
|-----------|-------------------|
| Frontend | Vercel (set `VITE_API_BASE_URL`) |
| Backend | Render / Railway / Fly.io per service |
| Database | Managed PostgreSQL (Supabase, Neon, Railway) |

Production checklist: [docs/12-operations.md](./docs/12-operations.md#17-deployment)

**Note:** No Docker or CI/CD configuration exists in the repository.

---

## Project Structure

```
Tenalink/
├── Backend/           # 8 Spring Boot microservices (Maven)
├── Frontend/          # React + Vite SPA
├── database/          # SQL seed/import scripts
├── docs/              # Full technical documentation
└── README.md          # This file
```

Detailed tree: [docs/03-project-structure.md](./docs/03-project-structure.md)

---

## API Overview

Gateway base URL: `http://localhost:8080/api/v1`

| Module | Prefix | Examples |
|--------|--------|----------|
| Auth | `/auth` | `POST /login`, `POST /register` |
| Users | `/auth/users` | `GET /users`, `GET /users/stats` |
| Context | `/context` | `GET /me` |
| Patients | `/patients` | `GET /{id}`, `POST /{id}` |
| Doctors | `/doctors` | `GET /`, `GET /{id}` |
| Appointments | `/appointments` | `POST /`, `GET /patient/{id}`, `PUT /{id}/cancel` |
| Admin appointments | `/admin/appointments` | `GET /`, `GET /overview` |
| Prescriptions | `/prescriptions` | `POST /`, `GET /patient/{id}`, `PUT /{id}/fulfill` |
| Medical records | `/records` | `POST /`, `GET /patient/{id}/timeline` |
| Audit | `/audit-logs` | `GET /`, `POST /` |
| System config | `/system-config` | CRUD by key |
| Hospitals | `/hospitals` | CRUD, filter by specialty |

Complete API reference: [docs/07-api-reference.md](./docs/07-api-reference.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/README.md](./docs/README.md) | Documentation index |
| [docs/02-architecture.md](./docs/02-architecture.md) | Architecture & diagrams |
| [docs/05-database.md](./docs/05-database.md) | Schema & ER diagrams |
| [docs/08-authentication-authorization.md](./docs/08-authentication-authorization.md) | Auth flows |
| [docs/14-developer-guide.md](./docs/14-developer-guide.md) | Developer setup & extension |
| [docs/15-user-guide.md](./docs/15-user-guide.md) | End-user guide |
| [docs/16-limitations-and-roadmap.md](./docs/16-limitations-and-roadmap.md) | Known issues & improvements |

---

## License

**Needs developer input** — No LICENSE file is present in the repository.

---

## Contributing

**Needs developer input** — No CONTRIBUTING.md exists.

General expectations:
1. Add Flyway migrations for schema changes (do not edit applied migrations)
2. Match existing package and naming conventions
3. Run `npm run lint` for frontend changes
4. Update [docs/07-api-reference.md](./docs/07-api-reference.md) for new endpoints

---

## Known Issues (Summary)

- Backend services use `permitAll()` — JWT not enforced on most endpoints
- Register page does not call backend API
- Doctor appointment approve/reject is not wired to backend
- Admin hospitals page uses static mock data
- No automated tests

Full list: [docs/16-limitations-and-roadmap.md](./docs/16-limitations-and-roadmap.md)
