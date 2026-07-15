# 11. Business Logic

## Domain Concepts

| Concept | Definition | Owning service |
|---------|------------|----------------|
| **User** | Authentication identity with role | auth-service (`auth_db.users`) |
| **Patient** | Healthcare consumer profile linked to user | user-service |
| **Doctor (Provider)** | Clinical provider profile linked to user | user-service |
| **Hospital** | Healthcare facility in directory | hospital-service |
| **Appointment** | Scheduled visit linking patient, doctor, hospital | appointment-service |
| **Prescription** | Medication order from doctor to patient | pharmacy-service |
| **Medical Event** | Timeline entry (visit, lab, document, etc.) | medical-records-service |
| **Audit Log** | Immutable admin action record | admin-service |
| **System Config** | Platform key-value settings | admin-service |

---

## Workflow 1: User Login

1. User submits identifier (email or Fayda ID) and password on `LoginPage`
2. `AuthContext.signIn` calls `POST /auth/login`
3. `AuthService` resolves user by email or Fayda ID
4. Password verified with BCrypt
5. JWT issued (24h, claims: userId, role)
6. Token temporarily stored; `GET /context/me` fetches `patientId` / `doctorId` / `adminId`
7. Full state persisted to `localStorage.authState`
8. User redirected to role dashboard (`getDashboardRoute`)

**Failure:** `AuthenticationFailedException` → 401 → error shown on login form

---

## Workflow 2: Patient Books Appointment

1. Patient navigates to `/patient/hospitals` → `GET /hospitals`
2. Selects hospital → `/patient/doctors?hospital=...` → `GET /doctors?hospitalId=` (filter not applied server-side)
3. Selects doctor → `/patient/book-appointment?doctor=...&hospital=...`
4. Page loads doctor (`GET /doctors/{id}`) and hospital (`GET /hospitals/{id}`)
5. Patient enters date, time, reason
6. Submit → `POST /appointments` with patient/doctor/hospital IDs and denormalized names
7. `AppointmentService.create()`:
   - Parses `date` + `time` to `scheduledAt`
   - Sets `status = SCHEDULED`
   - Persists to `appointment_db`
8. Patient redirected or shown confirmation

**Frontend sets status conceptually as "Pending"** but backend stores `SCHEDULED`.

---

## Workflow 3: Doctor Reviews Appointments

1. Doctor opens `/doctor/appointments`
2. `GET /appointments/doctor/{doctorId}` returns appointments sorted newest first
3. UI filters for `status === 'Pending'` — **will not match `SCHEDULED` from backend**
4. Approve/Reject buttons call `handleStatusUpdate` which **logs a warning** — no backend endpoint called

**Business rule gap:** Doctor acceptance/rejection is not implemented end-to-end.

---

## Workflow 4: Doctor Adds Medical Event

1. Doctor navigates from patient list to `/doctor/patients/:id/add-event`
2. Selects event type → template from `mockMedicalEventTemplates.js`
3. Fills form fields defined by template
4. Submit → `POST /records` with `MedicalEventDto.CreateRequest`
5. `MedicalEventService` persists event with `eventType` and JSON `eventData`
6. Event appears on patient timeline via `GET /records/patient/{id}/timeline`

---

## Workflow 5: Doctor Creates Prescription

1. Doctor navigates to `/doctor/patients/:id/prescribe`
2. Enters medication and dosage
3. Submit → `POST /prescriptions`
4. `PrescriptionService` creates record with status (set in service)
5. Visible on doctor prescriptions page and patient history prescriptions tab

---

## Workflow 6: Patient Views Medical History

1. Patient opens `/patient/history` → layout with tabs
2. **Timeline:** `GET /records/patient/{id}/timeline`
3. **Prescriptions:** `GET /prescriptions/patient/{id}`
4. **Labs:** timeline events filtered client-side by lab-related types
5. **Documents:** `GET /records/patient/{id}/documents`

`TimelineSearchContext` provides search/filter within history views.

---

## Workflow 7: Hospital Admin Oversight

1. Admin logs in → `/admin/dashboard`
2. Dashboard fetches:
   - `GET /auth/users/stats` — platform-wide user counts
   - `GET /audit-logs` — recent activity (bug: expects array, API returns paginated `{ content }`)
   - `GET /admin/appointments/overview` — platform-wide appointment stats
3. Admin pages list doctors (`GET /auth/users/role/PROVIDER`), patients, appointments — **all platform-wide, not hospital-scoped**

---

## Workflow 8: Super Admin Hospital Management

1. Super admin opens `/super-admin/hospitals`
2. `GET /hospitals` lists all hospitals
3. Create → `POST /hospitals` with facility details
4. Delete → `DELETE /hospitals/{id}`
5. Edit button in UI has **no handler wired**

---

## Workflow 9: Super Admin Platform Config

1. Navigate to `/super-admin/platform`
2. CRUD on `GET/POST/PUT/DELETE /system-config`
3. Key-value pairs stored in `admin_db.system_config`

---

## Workflow 10: Appointment Cancellation

1. `PUT /appointments/{id}/cancel` called (from API module; usage in UI **Needs developer input**)
2. Service loads appointment, sets `status = CANCELLED`, saves

No validation of who may cancel (patient vs admin vs doctor).

---

## Decision Logic

### Role normalization (frontend)

```
doctor/provider → DOCTOR
admin/hospital_admin → HOSPITAL_ADMIN
super_admin → SUPER_ADMIN
default → PATIENT
```

### Role normalization (backend register)

Null/blank role → `ROLE_PATIENT`; otherwise uppercase with `ROLE_` prefix.

### Patient/doctor ID resolution

`PatientController` / `DoctorController`: try lookup by domain ID first; on `ResourceNotFoundException`, retry by `userId`.

### Appointment scheduling

`date` and `time` are required strings; combined using system default timezone (`ZoneId.systemDefault()`).

---

## Validation Rules

| Layer | Rule |
|-------|------|
| Login | identifier and password non-blank |
| Register (frontend) | Fayda 12 chars, password ≥8 chars |
| Appointment create | date and time required |
| User entity | email unique, fayda_id unique |
| JPA | NOT NULL on core entity columns |

---

## Data Processing

### Medical event `eventData`

Stored as TEXT (JSON string). Mapped to structured `TimelineResponse` in `MedicalEventMapper`.

### Denormalized appointment fields

`patientName`, `doctorName`, `hospitalName`, `date`, `time` stored on appointment for display without cross-service joins.

### Audit logs

Append-only creation via `POST /audit-logs`. No update/delete endpoints in controller.

---

## Algorithms

No complex algorithms identified. Sorting:
- Appointments: `scheduledAt` DESC (repository queries)
- Users: `createdAt` DESC
- Audit logs: `timestamp` DESC
- Frontend: manual sort in some pages; `sortByNewest` utility exists but is not used everywhere
