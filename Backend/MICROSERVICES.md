# Healthcare Microservices Platform

## Overall layout (multi-module Maven)

```
healthcare-platform/                    ← parent POM (this repo)
├── pom.xml
├── healthcare-common/                  ← shared library (JWT, exceptions, events)
├── auth-service/                       ← port 8081, DB auth_db
├── user-service/                       ← port 8082, DB user_db
├── appointment-service/                ← port 8083, DB appointment_db
├── hospital-service/                   ← port 8084, DB hospital_db
├── pharmacy-service/                   ← port 8085, DB pharmacy_db
├── medical-record-service/             ← port 8086, DB medical_record_db
├── admin-service/                      ← port 8087
├── location-service/                   ← port 8088, DB location_db
├── api-gateway/                        ← port 8080 (Spring Cloud Gateway)
└── monolith-legacy/                    ← original modular monolith (reference only)
```

### Multi-module vs multi-repo

| Approach | When to use |
|----------|-------------|
| **Multi-module (current)** | One team, shared `healthcare-common`, atomic refactors, simpler local dev |
| **Multi-repo** | Independent teams/releases per service; publish `healthcare-common` to Maven Central / GitHub Packages |

To split into separate repos later:

1. Publish `healthcare-common` as a versioned artifact (`0.1.0`).'
2. Copy each `*-service` folder to its own Git repo with a standalone `pom.xml` (change parent to `spring-boot-starter-parent`).
3. Add each service to CI/CD independently.

---

## Service map

| Service | Package | Port | Database | Frontend |
|---------|---------|------|----------|----------|
| auth-service | `com.healthcare.auth` | 8081 | `auth_db` | Login, Register |
| user-service | `com.healthcare.user` | 8082 | `user_db` | Profile |
| appointment-service | `com.healthcare.appointment` | 8083 | `appointment_db` | Appointments |
| hospital-service | `com.healthcare.hospital` | 8084 | `hospital_db` | Hospitals |
| pharmacy-service | `com.healthcare.pharmacy` | 8085 | `pharmacy_db` | Pharmacy |
| medical-record-service | `com.healthcare.medicalrecord` | 8086 | `medical_record_db` | Medical History |
| admin-service | `com.healthcare.admin` | 8087 | `admin_db` | Admin |
| location-service | `com.healthcare.location` | 8088 | `location_db` | Map |
| api-gateway | `com.healthcare.gateway` | 8080 | — | Single entry URL |

---

## Onion Architecture (per service)

```
com.healthcare.<service>/
├── domain/           ← entities, value objects, repository ports, domain services
├── application/      ← DTOs, MapStruct mappers, application services
├── infrastructure/   ← JPA, security, WebClient/Feign, config
└── interfaces/       ← REST controllers, exception handlers
```

**Rule:** `domain` has zero Spring dependencies. Dependencies point inward.

---

## healthcare-common

Shared **only** for cross-cutting technical concerns — not domain entities.

- `com.healthcare.common.exception.*`
- `com.healthcare.common.security.JwtProperties`, `JwtTokenUtil`
- `com.healthcare.common.dto.ApiErrorResponse`
- `com.healthcare.common.event.UserRegisteredEvent`

Each service defines its own `UserId` / `AppointmentId` in its bounded context.

---

## Inter-service communication

### Synchronous (implemented example)

**appointment-service → hospital-service** via `WebClient`:

```java
// appointment-service/infrastructure/external/HospitalServiceClient.java
GET {hospital-service}/api/v1/hospitals/{id}
```

Configure in `application.yml`:

```yaml
healthcare:
  clients:
    hospital-service:
      base-url: http://localhost:8084
      validate: false   # dev only
```

### Alternative: OpenFeign

Add to consumer `pom.xml`:

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```java
@FeignClient(name = "hospital-service", url = "${healthcare.clients.hospital-service.base-url}")
public interface HospitalClient {
    @GetMapping("/api/v1/hospitals/{id}")
    void getHospital(@PathVariable String id);
}
```

### Asynchronous (recommended next step)

`auth-service` publishes `UserRegisteredEvent` → `user-service` creates `Patient` profile (Kafka/RabbitMQ).

---

## JWT flow

1. **auth-service** issues JWT (`JwtTokenUtil` + shared secret).
2. Client sends `Authorization: Bearer <token>` to gateway or services.
3. Resource services (`appointment-service`, etc.) validate with `JwtAuthenticationFilter` + `healthcare-common`.

Use the **same** `healthcare.jwt.secret` in every service (or switch to OAuth2 / JWKS later).

---

## Build & run

```powershell
# Build all modules
mvn clean install

# Run individually (separate terminals)
mvn -pl auth-service spring-boot:run
mvn -pl appointment-service spring-boot:run
mvn -pl api-gateway spring-boot:run

# Via gateway
curl http://localhost:8080/api/v1/auth/login -H "Content-Type: application/json" -d "{\"email\":\"a@b.com\",\"password\":\"password123\"}"
```

---

## Fully implemented examples

See source trees for:

- **auth-service** — complete onion layers, JWT, Flyway, MapStruct `UserMapper`
- **appointment-service** — complete onion layers, JWT filter, `HospitalServiceClient` (WebClient)

Other services include `pom.xml`, `application.yml`, main class, and `STRUCTURE.md` for the remaining layers.

---

## API Gateway routes

Configured in `api-gateway/src/main/resources/application.yml` — routes `/api/v1/**` to service ports. Point your React frontend at `http://localhost:8080`.
