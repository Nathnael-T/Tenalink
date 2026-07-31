# 15. Performance, Testing & Deployment

This document covers sections 15–17.

---

# 15. Performance

## Caching

**No caching layer** (Redis, Caffeine, HTTP cache headers) is implemented in backend or frontend.

## Database Optimization

| Technique | Usage |
|-----------|-------|
| Indexes | `idx_user_role`, `idx_audit_timestamp`, `idx_hospital_specialty`, `idx_appt_doctor_id`, `idx_appt_patient_id` |
| Pagination | User list, care workflows admin, audit logs, hospitals |
| `open-in-view: false` | Set in all services — good practice to avoid lazy-loading in views |

## Lazy Loading

JPA default lazy loading for associations — entities have minimal `@ManyToOne` relationships (mostly flat entities).

## Pagination

Paginated endpoints return Spring Data `Page` mapped to `{ content, page, size, totalElements, totalPages }`.

Non-paginated list endpoints (`GET /doctors`, role-based user lists) return full collections.

## Background Jobs

**None.** All operations are synchronous HTTP request/response.

## Concurrency

Standard Spring Boot Tomcat thread pool per service. **No explicit concurrency configuration** found.

## Performance Bottlenecks (Inferred)

1. **Multiple service startup** — 8 JVM processes required locally
2. **N+1 cross-service patterns** — doctor dashboard fetches profile per care workflow patient
3. **Full list endpoints** — doctors, users by role without pagination
4. **No CDN/static asset strategy** documented for frontend
5. **Gateway single point** — all traffic through one process

## Possible Optimizations

| Priority | Suggestion |
|----------|------------|
| Medium | Add React Query with stale-time to reduce duplicate fetches |
| Medium | Paginate `GET /doctors` and role-based user lists |
| Medium | Batch patient profile endpoint for doctor dashboard |
| Low | Add Redis caching for hospital directory |
| Low | Enable HTTP compression on gateway |

---

# 16. Testing

## Test Structure

**No automated tests were found** in the repository.

| Test type | Status |
|-----------|--------|
| Unit tests (`*Test.java`) | ❌ Not found |
| Integration tests | ❌ Not found |
| Frontend tests (`*.test.jsx`, `*.spec.jsx`) | ❌ Not found |
| E2E tests (Playwright, Cypress) | ❌ Not found |

## Maven

`mvn clean package -DskipTests` is documented for deployment — implies tests may be expected in future but are skipped.

## How to Run Tests

**Needs developer input** — no test runner configured.

Suggested commands if tests are added:
```bash
# Backend
cd Backend && mvn test

# Frontend (if Vitest/Jest added)
cd Frontend && npm test
```

## Mocking Strategy

Not applicable — no test suite. Frontend uses mock data files for some legacy UI (`mockMedicalEventTemplates.js`, static hospitals page).

## Coverage

**Not measured.** No coverage tooling (JaCoCo, Istanbul) configured.

---

# 17. Deployment

## Build Process

### Backend
```bash
cd Backend
mvn clean package -DskipTests
# Output: each service/target/*.jar
```

### Frontend
```bash
cd Frontend
npm install
npm run build
# Output: Frontend/dist/
```

## Deployment Steps (from README)

### Frontend — Vercel
1. Connect `Frontend/` directory
2. Set `VITE_API_BASE_URL` to production gateway URL
3. Deploy static build

### Backend — Render / Railway / Fly.io
1. Build: `mvn clean package -DskipTests`
2. Start: `java -jar target/*.jar`
3. Set `SPRING_PROFILES_ACTIVE=prod`
4. Configure datasource and JWT env vars per service
5. Deploy gateway first, then domain services

### Database
- Managed PostgreSQL (Supabase, Neon, Railway per README)
- Create 7 databases
- Flyway runs migrations on startup

## Required Services (Production)

| Service | Count |
|---------|-------|
| PostgreSQL databases | 7 |
| Java microservices | 8 |
| Static frontend host | 1 |
| API gateway | 1 (included in 8) |

## Docker Configuration

**No Dockerfile or docker-compose found.** Container deployment **Needs developer input**.

## CI/CD Pipeline

**No CI/CD configuration found** (no `.github/workflows`, Jenkinsfile, etc.).

Tooling scripts exist under `Backend/.github/modernize/java-upgrade/hooks/scripts/` but are not deployment pipelines.

## Production Configuration

- `application-prod.yml` per service: env-var datasources, `ddl-auto: none`
- `JWT_SECRET` required
- Gateway downstream URLs via env vars

## Monitoring

| Capability | Status |
|------------|--------|
| Spring Actuator health | ✅ `/actuator/health` per service |
| Spring Actuator info | ✅ `/actuator/info` |
| APM (Datadog, New Relic) | ❌ Not in code |
| Centralized logging | ❌ Not in code |
| Alerting | **Needs developer input** |

## Logging (Production)

Default Spring Boot logging to stdout. Log shipping **Needs developer input**.
