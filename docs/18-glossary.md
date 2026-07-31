# 24. Glossary

| Term | Definition |
|------|------------|
| **TenaLink / Tenalink** | The healthcare platform project name |
| **Portal** | Role-specific UI area (Patient, Doctor, Admin, Super Admin) in the single React SPA |
| **Microservice** | Independently deployable backend service with its own database |
| **Gateway** | `gateway-service` — single HTTP entry point routing to downstream services |
| **Fayda ID** | Ethiopian national digital ID used as an alternative login identifier |
| **JWT** | JSON Web Token — bearer token for authentication (24h expiry) |
| **authState** | Frontend localStorage key holding token, userId, role, and domain IDs |
| **Identity context** | Response from `GET /context/me` mapping user to patientId/doctorId/adminId |
| **Provider** | Backend role `ROLE_PROVIDER` — maps to frontend `DOCTOR` |
| **Hospital Admin** | Backend `ROLE_ADMIN` — maps to frontend `HOSPITAL_ADMIN` |
| **Super Admin** | Backend `ROLE_SUPER_ADMIN` — platform-wide administration |
| **Patient record** | Row in `user_db.patients` linked to `auth_db.users` via `user_id` |
| **Doctor record** | Row in `user_db.doctors` linked to auth user |
| **Care workflow** | Scheduled encounter linking patient, doctor, and hospital |
| **Medical event** | Timeline entry in `medical_record_db` with typed JSON payload |
| **Prescription** | Medication order in `pharmacy_db` |
| **Audit log** | Immutable record of an administrative action |
| **System config** | Platform key-value configuration in `admin_db` |
| **Flyway** | Database migration tool; SQL files in `db/migration/` |
| **Denormalized fields** | Copied names on care workflows (patientName, etc.) for display without joins |
| **Database-per-service** | Pattern where each microservice owns its PostgreSQL schema/database |
| **UserDbConfig** | Secondary JDBC configuration for cross-reads of `user_db` |
| **Seeder** | `CommandLineRunner` that populates demo data when `app.seed.enabled=true` |
| **ProtectedRoute** | React Router guard checking authentication and role |
| **shadcn/ui** | Copy-paste component library built on Radix UI + Tailwind |
| **BFF** | Backend-for-Frontend — gateway aggregates API access for the SPA |
| **PHI** | Protected Health Information — **Needs developer input** on handling policies |
| **ICU / Lab / Radiology flags** | Boolean hospital capability fields on `hospitals` table |
| **Timeline** | Chronological view of `medical_events` for a patient |
| **SCHEDULED** | Default backend care workflow status on creation |
| **permitAll** | Spring Security config allowing unauthenticated access to all endpoints |

## Role Mapping Reference

| Backend (`auth_db.users.role`) | Frontend (`ROLES.*`) | Dashboard path |
|-------------------------------|----------------------|----------------|
| `ROLE_PATIENT` | `PATIENT` | `/patient/dashboard` |
| `ROLE_PROVIDER` | `DOCTOR` | `/doctor/dashboard` |
| `ROLE_ADMIN` | `HOSPITAL_ADMIN` | `/admin/dashboard` |
| `ROLE_SUPER_ADMIN` | `SUPER_ADMIN` | `/super-admin/dashboard` |

## Service Port Reference

| Service | Port |
|---------|------|
| gateway-service | 8080 |
| auth-service | 8081 |
| user-service | 8082 |
| legacy placeholder | 8083 |
| pharmacy-service | 8085 |
| medical-records-service | 8086 |
| admin-service | 8087 |
| hospital-service | 8088 |

## Database Name Reference

| Service | Database |
|---------|----------|
| auth-service | `auth_db` |
| user-service | `user_db` |
| legacy placeholder | `legacy placeholder_db` |
| pharmacy-service | `pharmacy_db` |
| medical-records-service | `medical_record_db` |
| admin-service | `admin_db` |
| hospital-service | `hospital_db` |
