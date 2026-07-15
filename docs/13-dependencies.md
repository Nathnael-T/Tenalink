# 18. Dependencies

## Backend (Maven)

### Parent (`Backend/pom.xml`)

| Dependency | Purpose |
|------------|---------|
| `spring-boot-starter-parent` 3.4.5 | BOM, plugin management |
| `spring-cloud-dependencies` 2024.0.1 | Gateway version alignment |

### All domain services

| Dependency | Purpose | Alternative |
|------------|---------|-------------|
| `spring-boot-starter-web` | REST API, embedded Tomcat | Quarkus, Micronaut |
| `spring-boot-starter-data-jpa` | ORM, repositories | MyBatis, jOOQ |
| `spring-boot-starter-security` | Security filter chain | Apache Shiro |
| `spring-boot-starter-actuator` | Health endpoints | Custom health checks |
| `postgresql` | JDBC driver | Other JDBC drivers |
| `flyway-core` | Migrations | Liquibase |
| `jjwt-*` 0.12.6 | JWT (primarily auth-service) | Auth0 java-jwt, Nimbus |
| `lombok` | Reduce boilerplate | Manual getters/setters, records |

### gateway-service

| Dependency | Purpose | Alternative |
|------------|---------|-------------|
| `spring-cloud-starter-gateway` | Reactive API gateway | Kong, NGINX, Traefik |

### auth-service additional

| Dependency | Purpose |
|------------|---------|
| `spring-boot-starter-jdbc` | Cross-DB access to user_db |

---

## Frontend (npm)

### Core runtime

| Package | Version | Purpose | Alternative |
|---------|---------|---------|-------------|
| `react` | ^19.2.6 | UI library | Preact, Vue |
| `react-dom` | ^19.2.6 | DOM rendering | — |
| `react-router-dom` | ^7.17.0 | Routing | TanStack Router |
| `axios` | ^1.17.0 | HTTP client | fetch, ky |
| `vite` | ^8.0.12 | Build tool | Webpack, Parcel |

### Styling & UI

| Package | Purpose | Alternative |
|---------|---------|-------------|
| `tailwindcss` | Utility CSS | CSS Modules, styled-components |
| `@tailwindcss/vite` | Tailwind Vite integration | PostCSS plugin |
| `shadcn` | Component CLI/config | Material UI, Chakra |
| `radix-ui` | Headless primitives | Reach UI |
| `class-variance-authority` | Component variants | — |
| `clsx`, `tailwind-merge` | Class composition | — |
| `lucide-react` | Icons | Heroicons, Font Awesome |

### Maps & documents

| Package | Purpose | Used in routed code? |
|---------|---------|---------------------|
| `leaflet`, `react-leaflet` | Maps | Only unrouted `MapPage.jsx` |
| `jspdf` | PDF generation | Not found in `src/` usage |
| `qrcode` | QR codes | Not found in `src/` usage |

### Animation & fonts

| Package | Purpose | Used? |
|---------|---------|-------|
| `framer-motion` | Animations | Not found in routed pages |
| `@fontsource-variable/geist` | Font | Not found imported in `src/` |
| `tw-animate-css` | CSS animations | Unclear |

### State (unused)

| Package | Purpose | Status |
|---------|---------|--------|
| `@reduxjs/toolkit` | State management | **Unused** |
| `react-redux` | React bindings | **Unused** |
| `@tanstack/react-table` | Data tables | **Unused** |

### Dev tooling

| Package | Purpose |
|---------|---------|
| `eslint` | Linting |
| `eslint-plugin-react-hooks` | Hooks rules |
| `@vitejs/plugin-react` | React Fast Refresh |
| `@types/react` | Type hints (JS project) |

---

## Why Key Dependencies Exist

| Choice | Rationale (inferred from codebase) |
|--------|-------------------------------------|
| Microservices | Domain separation, independent databases |
| Spring Cloud Gateway | Single entry point, CORS, route to services |
| PostgreSQL | Relational healthcare data, Flyway support |
| JWT | Stateless auth for SPA |
| Vite + React | Fast dev experience, modern SPA |
| Tailwind + shadcn | Rapid UI development with accessible primitives |

---

## Dependency Risks

1. **Unused packages** increase bundle size and maintenance surface
2. **JJWT on all services** but only used in auth — unnecessary classpath
3. **React 19** — ensure ecosystem compatibility
4. **No lockfile policy documented** — `package-lock.json` presence **Needs verification**
