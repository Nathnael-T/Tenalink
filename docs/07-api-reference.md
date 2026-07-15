# 8. API Reference

**Base URL (development):** `http://localhost:8080/api/v1`

All requests may include:
```
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Important:** Documentation in `Backend/API.md` contains outdated entries (`/auth/refresh`, `/auth/me`, `/prescriptions/{id}/status`, `/system-config/key/{key}`). This document reflects **actual controller code**.

**Authentication enforcement:** JWT is documented as required for protected operations, but backend services use `permitAll()` except auth-service's optional JWT parsing. Security is primarily client-side today.

---

## Authentication — `/auth`

### POST `/auth/login`

| | |
|---|---|
| **Purpose** | Authenticate user by email or Fayda ID |
| **Auth required** | No |

**Request body:**
```json
{
  "identifier": "patient1@tenalink.com",
  "password": "patient123"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": "40000001-0000-4000-8000-000000000001",
  "role": "ROLE_PATIENT"
}
```

**Status codes:** `200` success, `401` invalid credentials

**Validation:** `identifier` and `password` must be non-blank

---

### POST `/auth/register`

| | |
|---|---|
| **Purpose** | Register new user account |
| **Auth required** | No |

**Request body:**
```json
{
  "email": "new@example.com",
  "faydaId": "FAYDA000099",
  "password": "securepass",
  "fullName": "New User",
  "role": "PATIENT"
}
```

**Response `200`:** Same as login (`AuthResponse`)

**Side effect:** Creates `patients` row in `user_db` when role is `ROLE_PATIENT`

**Status codes:** `200`, `409` duplicate email/fayda (DataIntegrityViolation)

---

## Users — `/auth/users`

### GET `/auth/users`

| | |
|---|---|
| **Purpose** | Paginated list of all users |
| **Auth required** | Documented as JWT; not enforced server-side |

**Query parameters:**

| Param | Default | Description |
|-------|---------|-------------|
| `page` | `0` | Page index |
| `size` | `20` | Page size |

**Response `200`:**
```json
{
  "content": [
    {
      "id": "uuid",
      "email": "doctor1@tenalink.com",
      "faydaId": null,
      "fullName": "Dr. Kidist Assefa",
      "role": "ROLE_PROVIDER",
      "createdAt": "2025-09-01T10:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 30,
  "totalPages": 2
}
```

**Sort:** `createdAt` descending

---

### GET `/auth/users/role/{role}`

| | |
|---|---|
| **Purpose** | Users filtered by role |
| **Auth required** | Documented as JWT |

**Path parameter:** `role` — e.g. `PATIENT`, `PROVIDER`, `ADMIN` (auto-prefixed with `ROLE_`)

**Response `200`:** `UserDto.Response[]`

---

### GET `/auth/users/stats`

| | |
|---|---|
| **Purpose** | User counts by role |
| **Auth required** | Documented as JWT |

**Response `200`:**
```json
{
  "totalUsers": 30,
  "patients": 15,
  "doctors": 8,
  "admins": 6,
  "superAdmins": 1
}
```

---

## Context — `/context`

### GET `/context/me`

| | |
|---|---|
| **Purpose** | Resolve domain IDs for logged-in user |
| **Auth required** | Yes (JWT must parse in auth-service filter) |

**Response `200`:**
```json
{
  "userId": "uuid",
  "role": "ROLE_PATIENT",
  "patientId": "50000001-0000-4000-8000-000000000001",
  "doctorId": null,
  "adminId": null
}
```

**Status codes:** `200`, `401` unauthenticated, `500` on resolution failure

---

## Patients — `/patients`

### GET `/patients/{id}`

**Purpose:** Get patient profile by patient UUID or user UUID fallback

**Response `200`:** `PatientDto.Response`

**Status codes:** `200`, `404`

---

### GET `/patients/by-user/{userId}`

**Purpose:** Get patient by auth user ID

---

### POST `/patients/{id}`

**Purpose:** Create or update patient profile

**Request body:** `PatientDto.UpsertRequest`

**Note:** Frontend `patientApi.updateProfile` uses `PUT` but backend only exposes `POST`. **Mismatch — update may fail from UI.**

---

## Doctors — `/doctors`

### GET `/doctors`

**Purpose:** List all doctors

**Response `200`:** `DoctorEntity[]`

**Note:** Frontend sends `?hospitalId=` but backend ignores it.

---

### GET `/doctors/{id}`

**Purpose:** Get doctor by doctor ID or user ID fallback

---

## Appointments — `/appointments`

### POST `/appointments`

**Request body:**
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "hospitalId": "h1",
  "patientName": "Almaz Tesfaye",
  "doctorName": "Dr. Kidist Assefa",
  "hospitalName": "Addis General Hospital",
  "reason": "Checkup",
  "date": "2026-07-15",
  "time": "10:00"
}
```

**Response `200`:** `AppointmentEntity` with `status: "SCHEDULED"`

**Validation:** `date` and `time` required (service throws if missing)

---

### GET `/appointments/patient/{patientId}`

**Response `200`:** `AppointmentEntity[]` sorted `scheduledAt` DESC

---

### GET `/appointments/doctor/{doctorId}`

**Response `200`:** `AppointmentEntity[]` sorted `scheduledAt` DESC

---

### PUT `/appointments/{id}/cancel`

**Purpose:** Cancel appointment (`status → CANCELLED`)

**Response `200`:** Empty body

---

## Admin Appointments — `/admin/appointments`

### GET `/admin/appointments`

**Query:** `page` (0), `size` (20)

**Response:** Paginated `AppointmentEntity`, sorted `scheduledAt` DESC

**Scope:** Platform-wide (no hospital filter)

---

### GET `/admin/appointments/overview`

**Response `200`:**
```json
{
  "totalAppointments": 12,
  "scheduled": 5,
  "completed": 5,
  "cancelled": 2,
  "noShow": 0
}
```

---

## Prescriptions — `/prescriptions`

### POST `/prescriptions`

**Request:** `PrescriptionDto.CreateRequest` (`patientId`, `doctorId`, `medication`, `dosage`, etc.)

### GET `/prescriptions/patient/{patientId}`

### GET `/prescriptions/doctor/{doctorId}`

### PUT `/prescriptions/{id}/fulfill`

**Purpose:** Mark prescription fulfilled (not `/status` as in legacy API.md)

---

## Medical Records — `/records`

### POST `/records`

**Request:** `MedicalEventDto.CreateRequest`

**Response:** `MedicalEventDto.TimelineResponse`

### GET `/records/patient/{patientId}/timeline`

**Response:** `MedicalEventDto.TimelineResponse[]`

### GET `/records/patient/{patientId}/documents`

**Response:** Timeline entries filtered to `eventType = DOCUMENT`

---

## Audit Logs — `/audit-logs`

### POST `/audit-logs`

**Request:**
```json
{
  "adminId": "uuid",
  "action": "USER_ROLE_CHANGED",
  "targetResource": "user:uuid",
  "actorName": "Super Administrator",
  "role": "ROLE_SUPER_ADMIN"
}
```

### GET `/audit-logs`

**Query:** `page`, `size` — sorted `timestamp` DESC

### GET `/audit-logs/admin/{adminId}`

**Response:** `AuditLogEntity[]` for admin

---

## System Config — `/system-config`

### GET `/system-config`

**Response:** `SystemConfigEntity[]`

### GET `/system-config/{key}`

### POST `/system-config`

**Request:** `SystemConfigDto.CreateRequest` (`configKey`, `configValue`, `description`)

### PUT `/system-config/{key}`

**Request:** `SystemConfigDto.UpdateRequest`

### DELETE `/system-config/{key}`

---

## Hospitals — `/hospitals`

### GET `/hospitals`

**Query:** `page` (0), `size` (20)

**Response:** Paginated `HospitalDto.Response` (sorted by name ASC)

### GET `/hospitals/{id}`

### GET `/hospitals/specialty/{specialty}`

### POST `/hospitals`

**Request:** `HospitalDto.CreateRequest`

### PUT `/hospitals/{id}`

**Request:** `HospitalDto.UpdateRequest` (partial fields)

### DELETE `/hospitals/{id}`

---

## Paginated Response Format

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

## Error Response Format

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable message",
  "timestamp": "2026-06-29T12:00:00Z"
}
```

| Status | Typical cause |
|--------|---------------|
| 400 | `RuntimeException` in appointment/pharmacy/medical/admin/hospital services |
| 401 | `AuthenticationFailedException` (auth-service login) |
| 404 | Patient/doctor not found (user-service) |
| 409 | Duplicate user (auth-service) |
| 500 | Unhandled exception |

---

## Health Endpoints

Each service exposes (via Actuator):

- `GET /actuator/health`
- `GET /actuator/info`

Accessible on each service's direct port, not necessarily through gateway unless configured.

---

## Gateway Route Mapping

| Path prefix | Target service |
|-------------|----------------|
| `/api/v1/auth/**`, `/api/v1/context/**` | auth-service |
| `/api/v1/users/**`, `/api/v1/patients/**`, `/api/v1/doctors/**` | user-service |
| `/api/v1/appointments/**`, `/api/v1/admin/appointments/**` | appointment-service |
| `/api/v1/prescriptions/**` | pharmacy-service |
| `/api/v1/records/**` | medical-records-service |
| `/api/v1/audit-logs/**`, `/api/v1/system-config/**` | admin-service |
| `/api/v1/hospitals/**` | hospital-service |

**Gap:** `/api/v1/users/**` routes to user-service but no `/users` controller exists there. User APIs are at `/api/v1/auth/users` on auth-service.

---

## Frontend API Modules Not Matching Backend

| Frontend call | Issue |
|---------------|-------|
| `PUT /patients/{id}` | Backend only has `POST /patients/{id}` |
| `PUT /appointments/{id}` | No generic update endpoint |
| `PATCH /appointments/{id}/status` | Not implemented in backend |
| `DELETE /appointments/{id}` | Not implemented in backend |
| `PUT /prescriptions/{id}` | Not implemented |
| `DELETE /prescriptions/{id}` | Not implemented |

These functions exist in `Frontend/src/api/*.api.js` but are unused or will fail if called.
