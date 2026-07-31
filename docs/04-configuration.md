# 5. Configuration

## Configuration Files

### Backend — per service

| File | Purpose |
|------|---------|
| `application.yml` | Active profile, server port, JPA `open-in-view: false`, actuator exposure |
| `application-dev.yml` | Local PostgreSQL URLs, Flyway, `ddl-auto: validate`, JWT secret default, `app.seed.enabled` |
| `application-prod.yml` | Env-var datasource, `ddl-auto: none`, JWT from env |

**Exception:** `user-service` also has `application.properties` with hardcoded credentials and `ddl-auto=update`. This may conflict with profile-based config when both are loaded. **Needs developer input** on which file takes precedence in deployment.

**Exception:** `gateway-service` has only `application.yml` (no dev/prod split).

### Frontend

| File | Purpose |
|------|---------|
| `.env` | `VITE_API_BASE_URL=http://localhost:8080` |
| `.env.local` | Same + unused `VITE_API_URL` |
| `vite.config.js` | React plugin, Tailwind plugin, `@` alias → `./src` |
| `tailwind.config.js` | Content paths for Tailwind |
| `eslint.config.js` | ESLint flat config |
| `components.json` | shadcn/ui configuration |

## Spring Profiles

| Profile | Active when | Behavior |
|---------|-------------|----------|
| `dev` | Default (`SPRING_PROFILES_ACTIVE` unset or `dev`) | Local DB, Flyway migrate, validate schema |
| `prod` | `SPRING_PROFILES_ACTIVE=prod` | Env-driven URLs, no DDL, no seed |

Root `README.md` states dev "seeds demo data automatically" but `application-dev.yml` sets `app.seed.enabled: false`. Demo data is loaded via `database/*.sql` scripts or by enabling seeders manually.

## Secrets Management

| Secret | Storage (dev) | Storage (prod) |
|--------|---------------|----------------|
| JWT signing key | `jwt.secret` in YAML (default 64+ char string) | `JWT_SECRET` env var |
| DB passwords | YAML defaults (`postgres` / `2001`) | `SPRING_DATASOURCE_PASSWORD` env var |
| user_db JDBC (auth) | `userdb.datasource.*` in dev YAML | `USERDB_DATASOURCE_*` env vars |

**No vault integration, encrypted secrets, or rotation mechanism exists in code.**

## Logging Configuration

No custom `logback.xml` or `log4j2` configuration was found. Services use Spring Boot default logging (SLF4J + Logback).

Log statements exist in services (e.g., `AuthService`, `ContextService`, seeders) at `INFO` / `WARN` / `ERROR` / `DEBUG` levels.

## CORS Configuration

**File:** `Backend/gateway-service/src/main/java/com/tenalink/gateway/CorsConfig.java`

| Setting | Value |
|---------|-------|
| Allowed origins | `${cors.allowed-origins}` (default `http://localhost:5173`) |
| Methods | GET, POST, PUT, DELETE, OPTIONS, PATCH |
| Headers | Authorization, Content-Type, Accept, Origin, X-Requested-With |
| Credentials | `true` |

## Gateway Service Routing

**File:** `Backend/gateway-service/src/main/resources/application.yml`

Downstream URIs configurable via environment variables (see table below).

## Environment Variables

### Global / All Backend Services

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | No | `dev` | Spring profile (`dev` or `prod`) |
| `SERVER_PORT` | No | Per-service port in `application.yml` | HTTP listen port |
| `SPRING_DATASOURCE_URL` | Prod: Yes | Dev: in YAML | Primary JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | No | `postgres` | Primary DB username |
| `SPRING_DATASOURCE_PASSWORD` | No | `2001` (dev YAML) | Primary DB password |
| `JWT_SECRET` | Prod: Yes | Dev default in YAML | HMAC key for JWT (min 256 bits recommended) |

### auth-service (additional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `USERDB_DATASOURCE_URL` | Prod: Yes | Dev: in YAML | JDBC URL for `user_db` cross-reads |
| `USERDB_DATASOURCE_USERNAME` | No | `postgres` | user_db username |
| `USERDB_DATASOURCE_PASSWORD` | No | `2001` | user_db password |
| `app.seed.enabled` | No | `false` | Enable `UserDataSeeder` when `true` |

### gateway-service

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173` | Comma-separated allowed origins |
| `AUTH_SERVICE_URL` | No | `http://localhost:8081` | auth-service upstream |
| `USER_SERVICE_URL` | No | `http://localhost:8082` | user-service upstream |
| `CARE_WORKFLOW_SERVICE_URL` | No | `http://localhost:8083` | legacy placeholder upstream |
| `PHARMACY_SERVICE_URL` | No | `http://localhost:8085` | pharmacy-service upstream |
| `MEDICAL_RECORDS_SERVICE_URL` | No | `http://localhost:8086` | medical-records-service upstream |
| `ADMIN_SERVICE_URL` | No | `http://localhost:8087` | admin-service upstream |
| `HOSPITAL_SERVICE_URL` | No | `http://localhost:8088` | hospital-service upstream |

### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:8080` | Gateway base URL (used in `apiClient.js`) |
| `VITE_API_URL` | No | Set in `.env.local` only | **Not referenced in source code** |

## Service Ports (Default)

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

Port 8084 is unused.

## Build Configuration

### Backend (Maven)

```bash
cd Backend
mvn clean compile          # Compile all modules
mvn clean package -DskipTests  # Build JARs (documented for deployment)
mvn spring-boot:run -pl {module}  # Run single service
```

Parent artifact: `com.tenalink:tenalink-backend:0.0.1-SNAPSHOT` (packaging `pom`).

### Frontend (npm)

```bash
cd Frontend
npm install
npm run dev      # Vite dev server :5173
npm run build    # Production bundle → dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Runtime Configuration Notes

1. **All 8 backend processes** must be running for full functionality (or deployed equivalents).
2. **7 PostgreSQL databases** must exist before first startup (Flyway creates tables).
3. Frontend expects gateway at `VITE_API_BASE_URL` with path prefix `/api/v1`.
