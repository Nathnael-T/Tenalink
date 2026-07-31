# 21. Known Limitations & 22. Future Improvements

---

# 21. Known Limitations

## Technical Debt

| Item | Description |
|------|-------------|
| No automated tests | Zero unit, integration, or E2E tests |
| Unused dependencies | Redux, react-table, jspdf, qrcode, framer-motion (partial) |
| Mock data in admin | `/admin/hospitals` uses static `HOSPITALS` array |
| Legacy localStorage | Register page, `seedMockData.js`, feature `*Storage.js` files |
| Dead code | `CheckoutPage.jsx`, unrouted pages, stale `api/client.js` mockRouter export |
| API.md outdated | Documents non-existent endpoints |
| Dual config | `user-service/application.properties` vs profile YAML |
| Entity/schema drift | `createdAt` on PatientEntity/DoctorEntity not in Flyway |

## Missing Features

| Feature | Status |
|---------|--------|
| Doctor approve/reject care workflows | UI only, no backend |
| Care workflow status update endpoint | Frontend API defined, backend missing |
| Refresh tokens | Not implemented |
| Hospital-scoped admin views | Admin sees all platform data |
| Department / staff management | Not implemented |
| User role assignment API | Read-only user listing |
| Hospital admin assignment | Not in API |
| Real-time cross-portal sync | Per-page fetch, no shared cache |
| Patient registration via API | Backend exists, frontend not wired |
| i18n translations | Language switcher scaffold only (empty catalogs) |
| Edit hospital (super admin) | Button not wired |

## Scalability Limitations

- Eight separate JVM processes per environment
- Seven PostgreSQL instances (or databases on one server)
- No message queue for async workflows
- No horizontal scaling configuration documented
- Cross-service JDBC reads to `user_db` create coupling

## Security Concerns

See [11 — Code Quality §14](./11-code-quality.md#14-security). Summary:
- Backend `permitAll()` on all services
- No resource-level authorization
- JWT in localStorage
- Hardcoded dev secrets in repo

## Performance Issues

- N+1 profile fetches on doctor dashboard
- Unpaginated doctor/user lists
- No caching layer

## Documentation Gaps

- No LICENSE file
- Conflicting demo credentials in README vs seed SQL
- **Needs developer input** on production URLs, CI/CD, monitoring

---

# 22. Future Improvements

## High Priority

| Improvement | Rationale |
|-------------|-----------|
| Enforce JWT + role authorization on all services | Critical security gap |
| Implement care workflow status workflow (accept/reject/complete) | Core clinical workflow broken |
| Wire registration to `POST /auth/register` | Users cannot self-register for real |
| Remove mock data from admin hospitals page | Data integrity |
| Add hospital/tenant scoping for hospital admins | Multi-tenant requirement |
| Introduce TanStack Query (or equivalent) for API state | Cross-portal consistency |
| Add automated test suite (auth, care workflows, API smoke) | No safety net for changes |
| Fix frontend/backend mismatches (patient PUT, audit pagination) | Active bugs |

## Medium Priority

| Improvement | Rationale |
|-------------|-----------|
| Docker Compose for local dev | Simplify 8-service startup |
| CI/CD pipeline (build, test, deploy) | Repeatable releases |
| Paginate all list endpoints | Performance at scale |
| Consolidate or remove unused npm/Maven deps | Smaller attack surface and bundles |
| Implement refresh tokens or shorter-lived JWT + rotation | Session security |
| Add `hospitalId` to auth context | Enable tenant isolation |
| Department and staff management APIs | Admin portal completeness |
| Centralized logging (ELK, CloudWatch) | Operations visibility |
| Rate limiting on gateway | Abuse prevention |
| Align care workflow status enums frontend/backend | UX correctness |

## Low Priority

| Improvement | Rationale |
|-------------|-----------|
| Complete i18n for Amharic, Tigrinya, Oromo | Scaffold exists |
| Route and implement MapPage, legal pages | Orphan pages |
| Remove dead code and legacy mocks | Code hygiene |
| Add OpenAPI/Swagger generation | API discoverability |
| Redis caching for hospital directory | Read-heavy, rarely changes |
| Migrate `DoctorController` to return DTOs not entities | API contract stability |
| Add Prettier + pre-commit hooks | Consistent formatting |
| HTTPS/HSTS/security headers on gateway | Production hardening |
| FHIR interoperability | **Needs developer input** on requirements |
