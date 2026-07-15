# Tenalink Development SQL Dataset

Permanent development data for all Tenalink microservice databases. These files replace the Java `CommandLineRunner` seeders (`app.seed.enabled=true`) with idempotent SQL imports.

**Prerequisites:** PostgreSQL with Flyway migrations already applied on each database. The scripts truncate application tables only and never touch `flyway_schema_history`.

---

## Import Order

Import in this order so cross-service UUID references resolve correctly:

| Order | Database | File | Depends on |
|------:|----------|------|------------|
| 1 | `auth_db` | `auth_db.sql` | — |
| 2 | `user_db` | `user_db.sql` | `auth_db.users.id` (logical) |
| 3 | `hospital_db` | `hospital_db.sql` | — |
| 4 | `appointment_db` | `appointment_db.sql` | `user_db` patients/doctors, hospital UUID mapping |
| 5 | `medical_record_db` | `medical_record_db.sql` | `user_db` patients/doctors |
| 6 | `pharmacy_db` | `pharmacy_db.sql` | `user_db` patients/doctors, completed appointments |
| 7 | `admin_db` | `admin_db.sql` | `auth_db` admin user IDs (logical) |

---

## PostgreSQL Commands

Set connection variables (adjust user/host as needed):

```bash
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
```

Run each script against its database:

```bash
psql -d auth_db            -f database/auth_db.sql
psql -d user_db            -f database/user_db.sql
psql -d hospital_db        -f database/hospital_db.sql
psql -d appointment_db     -f database/appointment_db.sql
psql -d medical_record_db  -f database/medical_record_db.sql
psql -d pharmacy_db        -f database/pharmacy_db.sql
psql -d admin_db           -f database/admin_db.sql
```

**Windows (PowerShell):**

```powershell
$env:PGHOST = "localhost"
$env:PGPORT = "5432"
$env:PGUSER = "postgres"

psql -d auth_db            -f database\auth_db.sql
psql -d user_db            -f database\user_db.sql
psql -d hospital_db        -f database\hospital_db.sql
psql -d appointment_db     -f database\appointment_db.sql
psql -d medical_record_db  -f database\medical_record_db.sql
psql -d pharmacy_db        -f database\pharmacy_db.sql
psql -d admin_db           -f database\admin_db.sql
```

**One-liner (bash):**

```bash
for db in auth_db user_db hospital_db appointment_db medical_record_db pharmacy_db admin_db; do
  psql -d "$db" -f "database/${db}.sql" || exit 1
done
```

> **Note:** `medical_record_db` uses file `medical_record_db.sql` (underscore), not `medical-record_db.sql`.

---

## Clearing Data Before Import

Each SQL file clears its own tables at the start using `TRUNCATE ... RESTART IDENTITY CASCADE` inside a transaction. You do **not** need a separate cleanup step when re-importing.

To manually clear a single database without re-importing:

```sql
-- auth_db
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- user_db
TRUNCATE TABLE patients, doctors RESTART IDENTITY CASCADE;

-- hospital_db
TRUNCATE TABLE hospitals RESTART IDENTITY CASCADE;

-- appointment_db
TRUNCATE TABLE appointments RESTART IDENTITY CASCADE;

-- medical_record_db
TRUNCATE TABLE medical_events RESTART IDENTITY CASCADE;

-- pharmacy_db
TRUNCATE TABLE prescriptions RESTART IDENTITY CASCADE;

-- admin_db
TRUNCATE TABLE audit_logs, system_config RESTART IDENTITY CASCADE;
```

**Never run:** `TRUNCATE flyway_schema_history` or `DROP TABLE flyway_schema_history`.

---

## Verification Queries

After import, run these checks:

```sql
-- auth_db
SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role;
SELECT COUNT(*) AS total_users FROM users;

-- user_db
SELECT COUNT(*) AS doctors FROM doctors;
SELECT COUNT(*) AS patients FROM patients;

-- hospital_db
SELECT id, name, specialty FROM hospitals ORDER BY id;

-- appointment_db
SELECT status, COUNT(*) FROM appointments GROUP BY status ORDER BY status;

-- medical_record_db
SELECT event_type, COUNT(*) FROM medical_events GROUP BY event_type ORDER BY event_type;

-- pharmacy_db
SELECT status, COUNT(*) FROM prescriptions GROUP BY status ORDER BY status;

-- admin_db
SELECT COUNT(*) AS audit_logs FROM audit_logs;
SELECT config_key, config_value FROM system_config ORDER BY config_key;
```

**Cross-service integrity (run from any DB with `\c` as needed):**

```sql
-- All appointment patient_ids exist in user_db.patients (manual check)
-- Compare appointment_db.appointments.patient_id against user_db.patients.id

-- Hospital UUID mapping used in appointments:
-- h1 -> 60000001-0001-4001-8001-000000000001
-- h2 -> 60000001-0001-4001-8001-000000000002
-- h3 -> 60000001-0001-4001-8001-000000000003
-- h4 -> 60000001-0001-4001-8001-000000000004
-- h5 -> 60000001-0001-4001-8001-000000000005
```

---

## Expected Record Counts

| Database | Table | Count |
|----------|-------|------:|
| `auth_db` | `users` | **30** |
| `user_db` | `doctors` | **8** |
| `user_db` | `patients` | **15** |
| `hospital_db` | `hospitals` | **5** |
| `appointment_db` | `appointments` | **25** |
| `medical_record_db` | `medical_events` | **40** |
| `pharmacy_db` | `prescriptions` | **20** |
| `admin_db` | `audit_logs` | **50** |
| `admin_db` | `system_config` | **8** |

### User breakdown (`auth_db.users`)

| Role | Count |
|------|------:|
| `ROLE_SUPER_ADMIN` | 1 |
| `ROLE_ADMIN` | 6 |
| `ROLE_PROVIDER` | 8 |
| `ROLE_PATIENT` | 15 |

### Appointment status breakdown

| Status | Count |
|--------|------:|
| `COMPLETED` | 10 |
| `SCHEDULED` | 10 |
| `CANCELLED` | 5 |

---

## Test Login Credentials

Passwords are BCrypt-hashed (strength 10). Plaintext passwords for development:

| Role | Email pattern | Password |
|------|---------------|----------|
| Super Admin | `super@tenalink.com` | `super123` |
| Admin | `admin1@tenalink.com` … `admin6@tenalink.com` | `admin123` |
| Doctor | `doctor1@tenalink.com` … `doctor8@tenalink.com` | `doctor123` |
| Patient | `patient1@tenalink.com` … `patient15@tenalink.com` | `patient123` |

---

## Dataset Highlights

- **Ethiopian names** for all users; Addis Ababa hospital addresses and `+251` phone numbers.
- **Patients** include blood type, allergies (JSON array), chronic conditions, and emergency contacts embedded in `chronic_conditions` JSON (no dedicated column in schema).
- **Hospitals** include coordinates, wait times, and facility flags (`icu_available`, `lab_available`, etc.).
- **Appointments** include denormalized `patient_name`, `doctor_name`, `hospital_name`, `date`, `time`, and `reason` fields.
- **Medical events** cover `DIAGNOSIS`, `LAB_RESULT`, `PRESCRIPTION`, `VITALS`, `ALLERGY`, `VISIT_CREATED`, and `DOCUMENT` types.
- **Prescriptions** are linked to patients/doctors from completed appointments; statuses `ACTIVE` and `FULFILLED`.
- **Audit logs** reference real admin user UUIDs from `auth_db`.
- All timestamps fall within the last year (Aug 2025 – Jun 2026).

---

## Important Notes

1. **Keep seeders disabled:** Leave `app.seed.enabled: false` in `application-dev.yml` for all services.
2. **No Flyway changes:** Schema is defined by existing migrations only.
3. **Hospital ID types:** `hospital_db.hospitals.id` is `VARCHAR` (`h1`–`h5`). `appointment_db` and `medical_record_db` use deterministic UUIDs mapped to those hospitals (see mapping above).
4. **Re-import is safe:** Scripts use `TRUNCATE` + `INSERT` in transactions; re-running replaces all development data.
5. **Start services after import:** Run each microservice so Flyway validates schema, then verify via API or verification queries above.
