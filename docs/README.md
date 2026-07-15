# TenaLink Documentation

Professional technical documentation for the TenaLink Health Platform. All content is derived from codebase analysis unless marked **Needs developer input**.

## Documentation Index

| Document | Topics |
|----------|--------|
| [01 — Overview & Technology Stack](./01-overview-and-stack.md) | Executive summary, purpose, users, features, full tech stack |
| [02 — Architecture](./02-architecture.md) | System design, diagrams, request lifecycle, data flow |
| [03 — Project Structure](./03-project-structure.md) | Repository tree, folder responsibilities |
| [04 — Configuration](./04-configuration.md) | Environment variables, Spring profiles, secrets |
| [05 — Database](./05-database.md) | Schemas, tables, relationships, migrations, ER diagrams |
| [06 — Backend Services](./06-backend-services.md) | Microservices, controllers, services, repositories |
| [07 — API Reference](./07-api-reference.md) | Complete endpoint documentation with examples |
| [08 — Authentication & Authorization](./08-authentication-authorization.md) | JWT flow, roles, security model |
| [09 — Frontend](./09-frontend.md) | Pages, routing, components, state management |
| [10 — Business Logic](./10-business-logic.md) | Workflows, domain rules, validation |
| [11 — Code Quality](./11-code-quality.md) | Code organization, error handling, security analysis |
| [12 — Operations](./12-operations.md) | Performance, testing, deployment |
| [13 — Dependencies](./13-dependencies.md) | Backend and frontend dependency reference |
| [14 — Developer Guide](./14-developer-guide.md) | Local setup, debugging, extending the system |
| [15 — User Guide](./15-user-guide.md) | End-user portal walkthroughs |
| [16 — Limitations & Roadmap](./16-limitations-and-roadmap.md) | Known issues, technical debt, future improvements |
| [17 — Code Walkthrough](./17-code-walkthrough.md) | Startup to shutdown lifecycle |
| [18 — Glossary](./18-glossary.md) | Domain terminology |

## Quick Links

- **Root README:** [../README.md](../README.md)
- **Backend API notes (legacy):** [../Backend/API.md](../Backend/API.md)
- **Database seed scripts:** [../database/](../database/)
- **Gateway config:** [../Backend/gateway-service/src/main/resources/application.yml](../Backend/gateway-service/src/main/resources/application.yml)

## Unanswered Questions

See [Unanswered Questions](#unanswered-questions-for-developers) at the bottom of this page.

---

## Unanswered Questions for Developers

The following items could not be determined from the codebase and require developer input:

1. **License** — No `LICENSE` file exists in the repository. What license applies to this project?
2. **Production URLs** — What are the production gateway and frontend URLs?
3. **CI/CD** — No GitHub Actions, Jenkins, or other CI pipelines were found. How are builds and deployments automated in practice?
4. **Monitoring & alerting** — Actuator health endpoints exist, but no APM, logging aggregation, or alerting configuration was found. What is used in production?
5. **Multi-tenancy policy** — Hospital admins currently see platform-wide data. Is per-hospital isolation a planned requirement or out of scope?
6. **Register flow** — `RegisterPage` writes to `localStorage` only; backend `POST /auth/register` exists but is not called from the UI. Which registration path is intended for production?
7. **Demo credentials** — Root `README.md` lists `admin@tenalink.com` / `doctor@tenalink.com` / `patient@tenalink.com`, but seed data uses `admin1@tenalink.com`, `doctor1@tenalink.com`, `patient1@tenalink.com`. Which set is authoritative?
8. **Refresh tokens** — `Backend/API.md` mentions `POST /auth/refresh` and `GET /auth/me`, but no such endpoints exist in `AuthController`. Are these planned or deprecated documentation?
9. **Organizational ownership** — Who maintains this codebase (team, organization, contact)?
10. **HIPAA / regulatory compliance** — Are there compliance requirements for medical data handling in target deployments?
