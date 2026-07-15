# 7. Backend Services

## Module Overview

| Module | Port | Main class | Primary DB | Secondary DB access |
|--------|------|------------|------------|---------------------|
| gateway-service | 8080 | `com.tenalink.gateway.GatewayApplication` | — | — |
| auth-service | 8081 | `com.tenalink.auth.AuthApplication` | auth_db | user_db (JDBC) |
| user-service | 8082 | `com.tenalink.user.Application` | user_db | — |
| appointment-service | 8083 | `com.tenalink.appointment.Application` | appointment_db | user_db (JDBC) |
| pharmacy-service | 8085 | `com.tenalink.pharmacy.Application` | pharmacy_db | user_db (JDBC) |
| medical-records-service | 8086 | `com.tenalink.medicalrecords.Application` | medical_record_db | user_db (JDBC) |
| admin-service | 8087 | `com.tenalink.admin.Application` | admin_db | — |
| hospital-service | 8088 | `com.tenalink.hospital.Application` | hospital_db | — |

---

## gateway-service

**Responsibilities:** Route HTTP requests to downstream services; apply CORS.

**Key classes:**
- `GatewayApplication` — entry point
- `CorsConfig` — `CorsWebFilter` bean

**Dependencies:** Spring Cloud Gateway, Actuator

**Error handling:** Gateway-level errors only; no custom `@RestControllerAdvice`

**No controllers** — routing defined in `application.yml` only.

---

## auth-service

### Controllers

#### `AuthController` (`/api/v1/auth`)

| Method | Responsibility |
|--------|----------------|
| `POST /login` | Authenticate by email or Fayda ID + password |
| `POST /register` | Create user; auto-create patient row for `ROLE_PATIENT` |

**Inputs:** `AuthDto.LoginRequest`, `AuthDto.RegisterRequest`  
**Outputs:** `AuthDto.AuthResponse` (`token`, `userId`, `role`)  
**Dependencies:** `AuthService`, `BCryptPasswordEncoder`

#### `UserController` (`/api/v1/auth/users`)

| Method | Responsibility |
|--------|----------------|
| `GET /` | Paginated user list, sorted `createdAt` DESC |
| `GET /role/{role}` | Users by role |
| `GET /stats` | Role count statistics |

**Dependencies:** `UserRepository`

#### `ContextController` (`/api/v1/context`)

| Method | Responsibility |
|--------|----------------|
| `GET /me` | Resolve identity context for authenticated user |

**Inputs:** JWT via `Authentication`  
**Outputs:** `ContextDto.IdentityContext`  
**Dependencies:** `ContextService` (JDBC lookup for patient/doctor IDs)

### Services

#### `AuthService`
- `register()` — saves user, optionally inserts patient via JDBC
- `login()` — validates credentials, issues JWT (24h expiry)
- `createResponse()` — builds JWT with `sub=userId`, `claim role`

#### `ContextService`
- Resolves `patientId`, `doctorId`, or `adminId` based on role
- Uses `UserRepository` + `userDbJdbcTemplate`

### Security

- `SecurityConfig` — `permitAll()`, CSRF disabled
- `JwtAuthenticationFilter` — parses Bearer token, sets `SecurityContext`
- Invalid tokens: logged at DEBUG, request continues (no 401 from filter)

### Bootstrap

- `UserDataSeeder` — demo users when `app.seed.enabled=true`

### Error handling

- `AuthenticationFailedException` → 401
- `DataIntegrityViolationException` → 409
- Generic `Exception` → 500

---

## user-service

### Controllers

#### `PatientController` (`/api/v1/patients`)

| Method | Responsibility |
|--------|----------------|
| `GET /{id}` | Get patient by patient ID or user ID fallback |
| `GET /by-user/{userId}` | Get patient by auth user ID |
| `POST /{id}` | Upsert patient profile |

#### `DoctorController` (`/api/v1/doctors`)

| Method | Responsibility |
|--------|----------------|
| `GET /` | List all doctors (returns `DoctorEntity` list) |
| `GET /{id}` | Get doctor by doctor ID or user ID fallback |

**Note:** Frontend passes `hospitalId` query param to `GET /doctors` but controller does not filter by it.

### Services

- `PatientService` — find/upsert patient records
- `DoctorService` — list and resolve doctors

### Exceptions

- `PatientNotFoundException` → 404
- `ResourceNotFoundException` → 404

**No seeder** in user-service.

---

## appointment-service

### Controllers

#### `AppointmentController` (`/api/v1/appointments`)

| Method | Responsibility |
|--------|----------------|
| `POST /` | Create appointment (`status=SCHEDULED`) |
| `GET /patient/{patientId}` | List by patient, `scheduledAt` DESC |
| `GET /doctor/{doctorId}` | List by doctor, `scheduledAt` DESC |
| `PUT /{id}/cancel` | Set status `CANCELLED` |

#### `AdminAppointmentController` (`/api/v1/admin/appointments`)

| Method | Responsibility |
|--------|----------------|
| `GET /` | Paginated all appointments, `scheduledAt` DESC |
| `GET /overview` | Count by status |

### `AppointmentService`

- Parses `date` + `time` strings into `scheduledAt` Instant
- Requires both date and time on create
- No hospital-scoped filtering on admin endpoints

### Bootstrap

- `AppointmentSeeder` — sample appointments via JDBC for doctor/patient IDs

---

## pharmacy-service

### `PrescriptionController` (`/api/v1/prescriptions`)

| Method | Responsibility |
|--------|----------------|
| `POST /` | Create prescription |
| `GET /patient/{patientId}` | List by patient |
| `GET /doctor/{doctorId}` | List by doctor |
| `PUT /{id}/fulfill` | Mark prescription fulfilled |

### `PrescriptionService`

- Sets medication, dosage, patient/doctor IDs, timestamp, status on create
- `fulfill()` updates status

### Bootstrap

- `PrescriptionSeeder`

---

## medical-records-service

### `MedicalEventController` (`/api/v1/records`)

| Method | Responsibility |
|--------|----------------|
| `POST /` | Create medical event |
| `GET /patient/{patientId}/timeline` | Patient timeline |
| `GET /patient/{patientId}/documents` | Events where `eventType=DOCUMENT` |

### `MedicalEventService` + `MedicalEventMapper`

- Maps create requests to entities
- Builds `TimelineResponse` DTOs for frontend

### Bootstrap

- `MedicalEventSeeder`

---

## admin-service

### `AuditLogController` (`/api/v1/audit-logs`)

| Method | Responsibility |
|--------|----------------|
| `POST /` | Create audit log entry |
| `GET /admin/{adminId}` | Logs for specific admin |
| `GET /` | Paginated all logs, `timestamp` DESC |

### `SystemConfigController` (`/api/v1/system-config`)

| Method | Responsibility |
|--------|----------------|
| `GET /` | List all config |
| `GET /{key}` | Get by key |
| `POST /` | Create config |
| `PUT /{key}` | Update config |
| `DELETE /{key}` | Delete config |

### Bootstrap

- `AdminDataSeeder`

---

## hospital-service

### `HospitalController` (`/api/v1/hospitals`)

| Method | Responsibility |
|--------|----------------|
| `GET /` | Paginated list (sorted by name ASC) |
| `GET /{id}` | Get by ID |
| `GET /specialty/{specialty}` | Filter by specialty |
| `POST /` | Create (ID format `h-{8-char-uuid-prefix}`) |
| `PUT /{id}` | Partial update |
| `DELETE /{id}` | Delete hospital |

### `HospitalService`

- CRUD operations on `HospitalEntity`
- `getAll()` non-paginated sorts by `createdAt` DESC (not used by controller paginated endpoint)

### Bootstrap

- `HospitalSeeder`

---

## Shared Patterns

### SecurityConfig (all domain services)

```java
// Pattern: CSRF disabled, all requests permitted
http.csrf(csrf -> csrf.disable())
    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
```

Only auth-service adds `JwtAuthenticationFilter`.

### GlobalExceptionHandler pattern

Most services return `ErrorResponse`:
```json
{ "status": 400, "error": "Bad Request", "message": "...", "timestamp": "..." }
```

### UserDbConfig

Services with cross-DB reads define:
- `@Primary` datasource → service's own DB
- `userDbDataSource` + `userDbJdbcTemplate` → `user_db`

---

## Middleware / Filters

| Component | Service | Role |
|-----------|---------|------|
| `JwtAuthenticationFilter` | auth-service | JWT parsing |
| `CorsWebFilter` | gateway-service | CORS headers |
| Axios request interceptor | frontend (not backend) | Attach Bearer token |
| Axios response interceptor | frontend | 401 → logout redirect |

**No rate limiting, request logging middleware, or API versioning middleware** found in backend code.

---

## Schedulers / Workers / Queues

**None found** in the codebase. No `@Scheduled` tasks, message queues, or background workers.

**Needs developer input** if async processing is planned.
