# Generated Project Guide

## Enterprise App Builder

The builder generates a complete application blueprint and source project from the Builder UI.

### Standard architecture

- Java 17 + Spring Boot
- Spring Data JPA
- MySQL/PostgreSQL
- Flyway migrations
- Spring Security/JWT/RBAC
- OpenAPI/Swagger
- React + Vite + MUI
- Axios
- Docker Compose
- GitHub Actions

### Organizational modules

Company -> Branch -> Department -> Designation -> Employee -> User -> Role/Permission

### Business modules

Customers, Leads, Vendors, Products, Tasks, Notes and Follow-ups can be added from the module designer.

### Generated-project principles

1. Keep configuration in a ProjectSpec.
2. Generate backend before frontend dependencies on it.
3. Use database migrations rather than `ddl-auto=create`.
4. Keep secrets in environment variables.
5. Protect application APIs with JWT and role-based authorization.
6. Generate tests with every module.

### Local run

After downloading the generated ZIP:

```bash
# database + backend infrastructure
docker compose up -d db

# backend
cd backend
mvn spring-boot:run

# frontend, in another terminal
cd frontend
npm install
npm run dev
```

Swagger is exposed at `/swagger-ui.html` when the generated backend is running.
