# 1. Executive Summary

## Project Name

**TenaLink** (also written **Tenalink** in code paths)

## Purpose

TenaLink is a multi-portal healthcare platform that connects patients, doctors, hospital administrators, and super administrators through a unified backend. It supports appointment booking, medical record timelines, prescriptions, hospital discovery, and platform administration.

## Problem It Solves

The platform addresses fragmented healthcare coordination by providing:

- A single patient portal for appointments, medical history, and profile management
- A doctor workspace for patient care, prescriptions, and appointment requests
- Hospital and super-admin consoles for operational and platform-wide oversight
- A microservices backend with domain-separated data stores

## Intended Users

| Role | Portal path | Description |
|------|-------------|-------------|
| **Patient** | `/patient/*` | Books appointments, views medical history, manages profile |
| **Doctor (Provider)** | `/doctor/*` | Manages patients, appointments, prescriptions, medical events |
| **Hospital Admin** | `/admin/*` | Oversees doctors, patients, appointments, audit logs, settings |
| **Super Admin** | `/super-admin/*` | Manages hospitals, hospital admins, platform config, global audit |

## Key Features

- JWT-based authentication with role-based portal routing
- Appointment creation, listing, and cancellation
- Medical event timeline (visits, labs, documents)
- Electronic prescriptions (create, list, fulfill)
- Hospital directory with specialty filtering
- Audit logging and system configuration (super admin)
- Multi-database microservices architecture behind an API gateway

## Overall System Overview

```
┌─────────────────────────────────────────────────────────────┐
│              React SPA (Vite, port 5173)                    │
│   Patient │ Doctor │ Hospital Admin │ Super Admin portals   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP /api/v1/*
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           Spring Cloud Gateway (port 8080)                  │
└──┬────┬────┬────┬────┬────┬────┬────────────────────────────┘
   │    │    │    │    │    │    │
   ▼    ▼    ▼    ▼    ▼    ▼    ▼
 Auth User Appt Pharm Med  Admin Hosp
 8081 8082 8083 8085 8086 8087 8088
   │    │    │    │    │    │    │
   ▼    ▼    ▼    ▼    ▼    ▼    ▼
 auth user appt pharm med  admin hosp
 _db  _db  _db  _db  _db  _db  _db
```

Each backend service owns a dedicated PostgreSQL database. Cross-service reads (e.g., auth-service resolving patient/doctor IDs) use JDBC against `user_db`.

---

# 2. Technology Stack

## Backend

| Technology | Version | Why Used | Where Used | Role |
|------------|---------|----------|------------|------|
| **Java** | 21 | LTS runtime for Spring Boot 3.x | All backend modules | Primary backend language |
| **Spring Boot** | 3.4.5 | Microservice framework | All 8 services | Application runtime, DI, web layer |
| **Spring Cloud Gateway** | 4.2.0 (via BOM 2024.0.1) | API routing, CORS | `gateway-service` | Single entry point for clients |
| **Spring Data JPA** | (Boot managed) | ORM / repositories | Domain services | Persistence layer |
| **PostgreSQL** | 16 (documented prerequisite) | Relational storage | 7 databases | Primary data store |
| **Flyway** | (Boot managed) | Schema migrations | All domain services | Versioned DB migrations |
| **Spring Security** | (Boot managed) | Security filter chain | All services | CSRF disable; JWT filter in auth only |
| **JJWT** | 0.12.6 | JWT creation and parsing | `auth-service` (+ unused deps in other services) | Token signing (HMAC-SHA) |
| **BCrypt** | via Spring Security | Password hashing | `auth-service` | Credential storage |
| **Lombok** | (optional) | Boilerplate reduction | Entities, DTOs | `@Getter`, `@Setter`, etc. |
| **Maven** | 3.9+ | Build and dependency management | `Backend/pom.xml` | Multi-module build |
| **Spring Actuator** | (Boot managed) | Health/info endpoints | All services | `/actuator/health`, `/actuator/info` |

## Frontend

| Technology | Version | Why Used | Where Used | Role |
|------------|---------|----------|------------|------|
| **React** | 19.2.6 | UI library | `Frontend/src` | Component-based UI |
| **Vite** | 8.0.12 | Dev server and bundler | `vite.config.js` | Build tooling |
| **React Router** | 7.17.0 | Client-side routing | `src/app/Router.jsx`, route modules | Portal navigation |
| **Axios** | 1.17.0 | HTTP client | `src/api/apiClient.js` | Backend API calls |
| **Tailwind CSS** | 4.3.0 | Utility-first styling | JSX class names | UI styling |
| **shadcn/ui + Radix** | various | Accessible UI primitives | `src/components/ui/` | Buttons, dialogs, tables |
| **Lucide React** | 1.17.0 | Icons | Layouts, pages | Iconography |
| **Leaflet** | 1.9.4 | Maps | `MapPage.jsx` (not routed) | Map display |
| **Framer Motion** | 12.40.0 | Animations | Listed in `package.json` | **Needs developer input** — no imports found in routed pages |

## Installed but Unused (Frontend)

| Package | Notes |
|---------|-------|
| `@reduxjs/toolkit`, `react-redux` | In `package.json`; no store/slices in `src/` |
| `@tanstack/react-table` | In `package.json`; no usage found in `src/` |
| `jspdf`, `qrcode` | In `package.json`; no usage found in routed code |

## Databases

| Database | Service | Purpose |
|----------|---------|---------|
| `auth_db` | auth-service | User accounts and credentials |
| `user_db` | user-service (+ JDBC from auth, appointment, pharmacy, medical-records) | Patients and doctors |
| `appointment_db` | appointment-service | Appointments |
| `pharmacy_db` | pharmacy-service | Prescriptions |
| `medical_record_db` | medical-records-service | Medical timeline events |
| `admin_db` | admin-service | Audit logs, system config |
| `hospital_db` | hospital-service | Hospital directory |

## Authentication

| Technology | Role |
|------------|------|
| JWT (HMAC-SHA, 24h expiry) | Issued by `auth-service` on login/register |
| BCrypt | Password hashing before storage |
| Bearer token in `Authorization` header | Frontend attaches from `localStorage.authState` |

**Refresh tokens:** Not implemented in code. **Needs developer input** if planned.

## Build Tools

| Tool | Scope |
|------|-------|
| Maven | Backend compile, package, run |
| npm | Frontend install, dev, build, lint |
| Vite | Frontend production bundle |
| ESLint 10 | Frontend linting (`eslint.config.js`) |

## Deployment Tools

Documented in root `README.md` (Vercel for frontend; Render/Railway/Fly.io for backend). **No Docker, docker-compose, or CI configuration files were found in the repository.**

## External Services

**Needs developer input** — No third-party API integrations (payment, SMS, email, FHIR, etc.) were found in the codebase.

## ORMs

Spring Data JPA (Hibernate) is used across all domain services. Raw JDBC (`JdbcTemplate`) is used for cross-database reads in auth, appointment, pharmacy, and medical-records services.
