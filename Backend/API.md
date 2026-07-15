# TenaLink API Documentation

Gateway base URL: `http://localhost:8080` (dev) / configured via env (prod)

All endpoints accept `Authorization: Bearer <jwt>` for authenticated requests.

---

## Authentication (`/api/v1/auth`)

| Method | Path               | Description              | Auth     |
|--------|---------------------|--------------------------|----------|
| POST   | `/auth/register`    | Register new user        | None     |
| POST   | `/auth/login`       | Login (email/faydaId)    | None     |
| GET    | `/auth/users`       | List users (paginated)   | JWT      |
| GET    | `/auth/users?page=0&size=20` | Paginated users | JWT      |
| GET    | `/auth/users/role/{role}` | Users by role       | JWT      |
| GET    | `/auth/users/stats` | User count statistics    | JWT      |

## Context (`/api/v1/context`)

| Method | Path        | Description                    | Auth |
|--------|-------------|--------------------------------|------|
| GET    | `/context/me` | Get current user identity ctx | JWT  |

## Patients (`/api/v1/patients`)

| Method | Path                       | Description             | Auth  |
|--------|----------------------------|-------------------------|-------|
| GET    | `/patients/{id}`           | Get patient by ID       | JWT   |
| GET    | `/patients/by-user/{uid}`  | Get patient by user ID  | JWT   |

## Appointments (`/api/v1/appointments`)

| Method | Path                          | Description              | Auth  |
|--------|-------------------------------|--------------------------|-------|
| GET    | `/appointments/patient/{pid}` | Appointments by patient  | JWT   |
| GET    | `/appointments/doctor/{did}`  | Appointments by doctor   | JWT   |
| POST   | `/appointments`               | Create appointment       | JWT   |
| PUT    | `/appointments/{id}/cancel`   | Cancel appointment       | JWT   |

## Admin Appointments (`/api/v1/admin/appointments`)

| Method | Path                                    | Description               | Auth  |
|--------|-----------------------------------------|---------------------------|-------|
| GET    | `/admin/appointments?page=0&size=20`    | List all (paginated)      | JWT   |
| GET    | `/admin/appointments/overview`          | Appointment statistics    | JWT   |

## Prescriptions (`/api/v1/prescriptions`)

| Method | Path                              | Description               | Auth  |
|--------|-----------------------------------|---------------------------|-------|
| GET    | `/prescriptions/patient/{pid}`    | Prescriptions by patient  | JWT   |
| GET    | `/prescriptions/doctor/{did}`     | Prescriptions by doctor   | JWT   |
| POST   | `/prescriptions`                  | Create prescription       | JWT   |
| PUT    | `/prescriptions/{id}/status`      | Update prescription status| JWT   |

## Medical Records (`/api/v1/records`)

| Method | Path                           | Description               | Auth  |
|--------|--------------------------------|---------------------------|-------|
| GET    | `/records/patient/{pid}`       | Timeline by patient       | JWT   |
| POST   | `/records`                     | Create medical event      | JWT   |

## Audit Logs (`/api/v1/audit-logs`)

| Method | Path                                  | Description              | Auth  |
|--------|---------------------------------------|--------------------------|-------|
| GET    | `/audit-logs?page=0&size=20`         | List all (paginated)     | JWT   |
| GET    | `/audit-logs/admin/{adminId}`        | Logs by admin            | JWT   |
| POST   | `/audit-logs`                        | Create audit log         | JWT   |

## System Config (`/api/v1/system-config`)

| Method | Path                           | Description               | Auth  |
|--------|--------------------------------|---------------------------|-------|
| GET    | `/system-config`               | List all config entries   | JWT   |
| GET    | `/system-config/key/{key}`     | Get config by key         | JWT   |
| PUT    | `/system-config/key/{key}`     | Update config by key      | JWT   |

## Hospitals (`/api/v1/hospitals`)

| Method | Path                                  | Description              | Auth  |
|--------|---------------------------------------|--------------------------|-------|
| GET    | `/hospitals?page=0&size=20`          | List all (paginated)     | None  |
| GET    | `/hospitals/{id}`                    | Get hospital by ID       | None  |
| GET    | `/hospitals/specialty/{specialty}`   | Filter by specialty      | None  |
| POST   | `/hospitals`                         | Create hospital          | JWT   |
| PUT    | `/hospitals/{id}`                    | Update hospital          | JWT   |
| DELETE | `/hospitals/{id}`                    | Delete hospital          | JWT   |

---

## Paginated Response Format

All paginated endpoints return:

```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

## Error Response Format

All errors return:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable message"
}
```

## Health Endpoints

Each service exposes `/actuator/health` when running.
# TenaLink API

Gateway base URL: `http://localhost:8080`

## Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `GET|POST /api/v1/users/**`
- `GET|POST /api/v1/records/**`
- `GET|POST|PATCH /api/v1/appointments/**`
- `GET|POST /api/v1/pharmacy/**`
- `GET|POST /api/v1/admin/**`

All protected services accept `Authorization: Bearer <jwt>`. Medical record events and audit logs are append-only.
