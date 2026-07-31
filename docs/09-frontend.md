# 10. Frontend Documentation

## Technology

- **React 19** with functional components and hooks
- **React Router 7** for client-side routing
- **Vite 8** for development and production builds
- **Tailwind CSS 4** for styling
- **Axios** for HTTP
- **shadcn/ui + Radix** for UI primitives

## Application Entry

```
index.html → src/app/main.jsx → App.jsx → AuthProvider → LanguageProvider → AppRouter
```

---

## Routing

### Top-level (`src/app/Router.jsx`)

| Path | Guard | Layout |
|------|-------|--------|
| `/login` | Public | None |
| `/register` | Public | None |
| `/doctor/*` | `DOCTOR` | `Layout` |
| `/admin/*` | `HOSPITAL_ADMIN` | `Layout` |
| `/super-admin/*` | `SUPER_ADMIN` | `Layout` |
| `/*` | `PATIENT` | `Layout` |

### Patient routes (`PatientRoutes.jsx`)

| Path | Component |
|------|-----------|
| `/patient/dashboard` | `PatientDashboardPage` |
| `/patient/care workflows` | `Care workflowsPage` |
| `/patient/profile` | `ProfilePage` |
| `/patient/hospitals` | `HospitalsPage` (API-backed) |
| `/patient/doctors` | `DoctorsPage` |
| `/patient/book-care workflow` | `BookCare workflowPage` |
| `/patient/history/timeline` | `PatientTimelinePage` |
| `/patient/history/prescriptions` | `PrescriptionsPage` |
| `/patient/history/labs` | `LabsPage` |
| `/patient/history/documents` | `DocumentsPage` |

### Doctor routes (`DoctorRoutes.jsx`)

| Path | Component |
|------|-----------|
| `/doctor/dashboard` | `DoctorDashboardPage` |
| `/doctor/patients` | `DoctorPatientsPage` |
| `/doctor/patients/:patientId` | `DoctorPatientSummaryPage` |
| `/doctor/patients/:patientId/timeline` | `DoctorPatientTimelinePage` |
| `/doctor/patients/:patientId/add-event` | `AddMedicalEventPage` |
| `/doctor/patients/:patientId/prescribe` | `CreatePrescriptionPage` |
| `/doctor/care workflows` | `DoctorCare workflowsPage` |
| `/doctor/prescriptions` | `DoctorPrescriptionsPage` |

### Admin routes (`AdminRoutes.jsx`)

| Path | Component | Data source |
|------|-----------|-------------|
| `/admin/dashboard` | `AdminDashboardPage` | API |
| `/admin/hospitals` | `HospitalsPage` (shared) | **Static mock data** |
| `/admin/doctors` | `AdminDoctorsPage` | API |
| `/admin/patients` | `AdminPatientsPage` | API |
| `/admin/care workflows` | `AdminCare workflowsPage` | API |
| `/admin/settings` | `AdminSettingsPage` | API (read-only) |
| `/admin/users` | `AdminUsersPage` | API (not in sidebar) |
| `/admin/audit-logs` | `AuditLogsPage` | API |

### Super Admin routes (`SuperAdminRoutes.jsx`)

| Path | Component |
|------|-----------|
| `/super-admin/dashboard` | `SuperAdminDashboardPage` |
| `/super-admin/hospitals` | `SuperAdminHospitalsPage` |
| `/super-admin/hospital-admins` | `SuperAdminHospitalAdminsPage` |
| `/super-admin/audit-logs` | `SuperAdminAuditLogsPage` |
| `/super-admin/platform` | `SuperAdminSystemConfigPage` |

### Unrouted pages

`CheckoutPage.jsx`, `HealthRecordsPage.jsx`, `MapPage.jsx`, `ContactSupportPage.jsx`, `PrivacyPolicy.jsx`, `TermsOfService.jsx`, `history/OverviewPage.jsx`

---

## Component Hierarchy

```
App
└── AuthProvider
    └── LanguageProvider
        └── AppRouter
            ├── LoginPage / RegisterPage
            └── Layout
                ├── RoleSidebar (nav by role)
                ├── TopNav
                └── Outlet
                    └── [Role]Routes → Page components
                        └── Feature components (timeline, doctor widgets, etc.)
                        └── Shared (ErrorAlert, EmptyState, PageHeader)
                        └── UI primitives (Button, Card, Table, ...)
```

### Layout (`components/layouts/Layout.jsx`)

- Infers role from URL pathname
- Renders sidebar navigation from `RoleSidebar.jsx`
- Main content via React Router `<Outlet />`

### Sidebar navigation (`RoleSidebar.jsx`)

Role-specific `navItemsByRole` — not all routed pages appear in sidebar (e.g. `/admin/users`, `/admin/hospitals`).

---

## State Management

| Concern | Mechanism |
|---------|-----------|
| Authentication | `AuthContext` + `localStorage.authState` |
| Language | `LanguageContext` + `localStorage.tenalink-language` |
| Timeline filters | `TimelineSearchContext` (scoped to history layout) |
| Page data | Component `useState` + `useEffect` API fetches |
| Redux | Installed but **unused** |

**No React Query, SWR, or Zustand** for server state.

---

## Context Providers

### `AuthProvider`

**File:** `src/app/providers/AuthContext.jsx`

**Exports:** `useAuth()` → `{ authState, user, token, userId, role, patientId, doctorId, adminId, isLoading, signIn, signOut }`

### `LanguageProvider`

**File:** `src/app/providers/LanguageContext.jsx`

**Exports:** `useLanguage()` → `{ language, setLanguage, t }`

Translation objects for `en`, `am`, `ti`, `om` are empty `{}` — `t(key)` returns the key string.

### `TimelineSearchProvider`

**File:** `src/context/TimelineSearchContext.jsx`

Used in `MedicalHistoryLayout` for search term and filter state.

---

## API Communication

**Client:** `src/api/apiClient.js`

```javascript
baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1`
```

**Modules:** See [07 — API Reference](./07-api-reference.md) for endpoint mapping.

**Pattern per page:**
```javascript
useEffect(() => {
  let mounted = true;
  (async () => {
    const data = await someApi();
    if (mounted) setState(data);
  })();
  return () => { mounted = false; };
}, [deps]);
```

---

## Forms & Validation

| Page | Validation |
|------|------------|
| `LoginPage` | Client-side required fields; errors from `signIn` |
| `RegisterPage` | Fayda 12 digits, password ≥8 chars; **localStorage only** |
| `BookCare workflowPage` | Doctor required, date/time/reason required before submit |
| `AddMedicalEventPage` | Event type and required fields per template |
| `CreatePrescriptionPage` | Medication/dosage required |

No form library (React Hook Form, Formik) detected.

---

## Styling Approach

- **Tailwind utility classes** inline in JSX
- **shadcn/ui** components with `class-variance-authority` variants
- **`cn()` helper** — `clsx` + `tailwind-merge` in `src/lib/utils.js`
- **Global CSS** — minimal (`src/assets/styles/index.css` imports Tailwind)
- **Icons** — primarily `lucide-react`; auth pages use `react-icons`

---

## Key Feature Modules

### Timeline (`features/timeline/`)

- `PatientTimelineExperience` — fetches and renders medical events
- `TimelineEventCard`, `TimelineSearchBar`, `TimelineFilterBar`
- `MedicalEventDetailDrawer` — event detail side panel
- `timelineTypeMeta.js` — event type metadata/icons

### Doctor (`features/doctor/`)

- Patient search/summary UI components
- Medical event form (`EventFormSection`, `EventTypeSelector`, etc.)
- `mockMedicalEventTemplates.js` — UI templates for event types (used by `AddMedicalEventPage`)

### Patient (`features/patient/`)

- `Care workflowCard`, `PatientDashboardWidget`
- Legacy `*Storage.js` files (localStorage era)

### Audit (`features/Audit/`)

- `AuditLogCard`, `AuditFilters`
- `mockAuditLogs.js` — unused by live admin pages

---

## Protected Route Behavior

```javascript
// Simplified flow
if (isLoading) return <LoadingScreen />;
if (!user) return <Navigate to="/login" />;
if (!allowedRoles.includes(user.role)) return <Navigate to={getDashboardRoute(user.role)} />;
return children;
```

---

## Status Label Mismatch

Frontend care workflow pages use statuses like `Pending`, `Confirmed`, `Rejected`. Backend uses `SCHEDULED`, `COMPLETED`, `CANCELLED`. Filtering and display may not align with API data.

See [10 — Business Logic](./10-business-logic.md).
