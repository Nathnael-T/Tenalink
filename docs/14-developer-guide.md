# 19. Developer Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 21 |
| Maven | 3.9+ |
| Node.js | 20+ |
| npm | (bundled with Node) |
| PostgreSQL | 16 |

---

## Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd Tenalink
```

### 2. Create databases

```sql
CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE legacy placeholder_db;
CREATE DATABASE pharmacy_db;
CREATE DATABASE medical_record_db;
CREATE DATABASE admin_db;
CREATE DATABASE hospital_db;
```

### 3. Import seed data (optional)

See `database/README_IMPORT.md` and run SQL scripts in `database/` for demo data.

Alternatively, enable Java seeders per service:
```yaml
# application-dev.yml or env
app.seed.enabled: true
```

**Note:** Default `application-dev.yml` has `app.seed.enabled: false`.

### 4. Backend dependencies

```bash
cd Backend
mvn clean compile
```

### 5. Frontend dependencies

```bash
cd Frontend
npm install
```

---

## Configuration

1. Copy or verify `Frontend/.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

2. Adjust PostgreSQL credentials in each service's `application-dev.yml` if not using defaults (`postgres` / `2001`).

3. Ensure `jwt.secret` is consistent if running services with JWT validation needs.

---

## Run Locally

### Start backend (8 terminals or background processes)

```bash
cd Backend
mvn spring-boot:run -pl gateway-service
mvn spring-boot:run -pl auth-service
mvn spring-boot:run -pl user-service
mvn spring-boot:run -pl legacy placeholder
mvn spring-boot:run -pl pharmacy-service
mvn spring-boot:run -pl medical-records-service
mvn spring-boot:run -pl admin-service
mvn spring-boot:run -pl hospital-service
```

**Startup order:** Gateway can start anytime; domain services must have DB available for Flyway.

### Start frontend

```bash
cd Frontend
npm run dev
```

Open http://localhost:5173

### Verify health

```bash
curl http://localhost:8080/actuator/health  # May not proxy through gateway
curl http://localhost:8081/actuator/health  # auth-service direct
```

---

## Demo Credentials

From `database/auth_db.sql` seed data:

| Email | Password | Role |
|-------|----------|------|
| `super@tenalink.com` | `super123` | Super Admin |
| `admin1@tenalink.com` | `admin123` | Hospital Admin |
| `doctor1@tenalink.com` | `doctor123` | Doctor |
| `patient1@tenalink.com` | `patient123` | Patient |

Root `README.md` lists different emails (`admin@tenalink.com`, etc.) — use seed SQL as authoritative unless **developer confirms otherwise**.

---

## Seed the Database

### Option A: SQL scripts
```bash
psql -U postgres -d auth_db -f database/auth_db.sql
# Repeat for each database/*.sql
```

### Option B: Java seeders
Set `app.seed.enabled=true` and restart each service with a seeder.

---

## Run Tests

**No tests exist.** See [12 — Operations](./12-operations.md#16-testing).

---

## Debug

### Backend
- Attach IDE debugger to Spring Boot process (port 5005 if configured — **not preconfigured in YAML**)
- Enable DEBUG on `com.tenalink` loggers via `application.yml` override
- Check Flyway migration errors in startup logs

### Frontend
- React DevTools browser extension
- Network tab for API calls to `:8080/api/v1`
- Inspect `localStorage.authState` for token issues

### Common issues

| Issue | Check |
|-------|-------|
| 401 on login | auth-service running, DB seeded, credentials |
| Empty patient data | `GET /context/me` returned `patientId`; user_db patients table |
| CORS errors | Gateway `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173` |
| Flyway validate failure | Entity/schema mismatch; run pending migrations |
| Admin audit widget empty | API returns `{ content: [] }` not array — frontend bug |

---

## Add a New Feature

### Backend endpoint (example flow)

1. Add Flyway migration if schema changes: `{service}/src/main/resources/db/migration/V{n}__*.sql`
2. Update/create `Entity` and `Repository`
3. Add business logic in `Service`
4. Expose via `Controller` under `/api/v1/...`
5. Add gateway route in `gateway-service/.../application.yml` if new path prefix
6. Document in `docs/07-api-reference.md`

### Frontend page

1. Create page in `src/pages/{role}/`
2. Add route in appropriate `*Routes.jsx`
3. Add nav item in `RoleSidebar.jsx` if needed
4. Create API functions in `src/api/`
5. Use `useAuth()` for role-specific IDs

---

## Add a New Microservice

1. Create module in `Backend/pom.xml` `<modules>`
2. Copy structure from existing service (pom, Application, SecurityConfig, application.yml)
3. Create dedicated PostgreSQL database
4. Add Flyway `V1__initial_schema.sql`
5. Register gateway route
6. Add env vars to deployment docs

---

## Add a New API Endpoint

See [06 — Backend Services](./06-backend-services.md) for layer pattern.

---

## Deploy Updates

1. Run Flyway migrations (automatic on service start)
2. Build JARs: `mvn clean package -DskipTests`
3. Deploy updated service JARs (rolling per service)
4. Deploy frontend static build with correct `VITE_API_BASE_URL`
5. **Needs developer input** for zero-downtime and rollback procedures

---

## Code Style

- Backend: standard Java/Spring conventions, Lombok entities
- Frontend: ESLint via `npm run lint`
- No Prettier config found

---

## Contribution Guide

**Needs developer input** — no `CONTRIBUTING.md` exists.

Suggested process:
1. Fork / branch from main
2. Follow existing package structure
3. Add Flyway migration for schema changes (never edit applied migrations)
4. Run `npm run lint` for frontend changes
5. Open PR with description of service(s) affected
