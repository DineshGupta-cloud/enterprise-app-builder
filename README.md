# Enterprise App Builder

A production-oriented application scaffolding platform for generating enterprise web applications from a visual project definition.

## Vision

Create a new enterprise application from configuration instead of starting every project from scratch. The builder is designed to generate a consistent, maintainable **React + Spring Boot + MySQL/PostgreSQL** application with security, database migrations, CRUD modules, tests, Docker and CI/CD templates.

## Target stack

### Backend
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- Spring Security
- JWT authentication
- Role-based access control (RBAC)
- Flyway
- OpenAPI / Swagger
- Maven

### Frontend
- React
- Vite
- Material UI (MUI)
- React Router
- Axios
- Generated authentication and CRUD screens

### Infrastructure
- MySQL or PostgreSQL
- Docker / Docker Compose
- GitHub Actions
- Environment-based configuration

## Builder workflow

```text
Create Application
      ↓
Project Settings
      ↓
Database
      ↓
Authentication / RBAC
      ↓
Modules
      ↓
Fields / Relationships
      ↓
Review
      ↓
Generate Application
      ↓
Download ZIP
      ↓
Run with Docker / Maven / npm
```

## Enterprise module catalog

The builder supports reusable presets for common enterprise applications. Presets are not a limitation; custom modules can be defined from the module designer.

### Organization

```text
Company
  └── Branch
       └── Department
            └── Designation
                 └── Employee
                      └── User
                           ├── Role
                           └── Permission
```

### CRM

- Customer
- Lead
- Vendor
- Product
- Task
- Activity
- Note
- Follow-up

## Generated application architecture

```text
Generated Application
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/
│       │   ├── application bootstrap
│       │   ├── security/
│       │   ├── shared/
│       │   └── module/
│       └── resources/
│           ├── application.yml
│           └── db/migration/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── auth/
│       ├── layout/
│       ├── modules/
│       └── services/
├── docker-compose.yml
└── .github/workflows/
```

## Generated module architecture

Every generated business module is intended to follow:

```text
Entity
  ↓
DTO / Request / Response
  ↓
Mapper
  ↓
Repository
  ↓
Service
  ↓
Controller
  ↓
Validation / Exception Handling / Security
```

Generated frontend modules follow:

```text
API service
  ↓
List / Table
  ↓
Create / Edit Form
  ↓
Validation
  ↓
Pagination / Search / Sorting
```

## Quality gate

A generated sample application is considered complete only when it can pass the following checks:

- Database starts successfully
- Flyway migrations execute successfully
- Seed data loads
- Spring Boot starts successfully
- Login returns a JWT
- JWT-protected endpoints reject unauthenticated requests
- RBAC restrictions work
- Generated CRUD endpoints work
- Validation and global error handling work
- Pagination, filtering and sorting work where configured
- React application builds successfully
- React login/authentication works
- Generated CRUD table and forms build and operate
- Backend tests pass
- Frontend tests pass
- Docker image builds successfully
- Docker Compose starts the application stack
- GitHub Actions build/test workflow passes

## Run the Builder locally

Prerequisites:

- Node.js 20+ recommended
- npm 10+ recommended
- Git

Clone the repository:

```bash
git clone https://github.com/DineshGupta-cloud/enterprise-app-builder.git
cd enterprise-app-builder
```

Start the Builder UI:

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL displayed by the terminal.

## Create a new application

1. Open the Builder UI.
2. Create a new project.
3. Enter the application name and Java package name.
4. Select MySQL or PostgreSQL.
5. Configure authentication and roles.
6. Add the modules you need.
7. Define fields and relationships.
8. Review the generated project specification.
9. Click **Generate Application**.
10. Download the generated ZIP.

## Run a generated application

After extracting a generated project:

### Start the database

```bash
docker compose up -d db
```

### Start the backend

```bash
cd backend
mvn spring-boot:run
```

### Start the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Swagger is available at:

```text
http://localhost:8080/swagger-ui.html
```

The exact generated ports and environment variables are defined by the generated project configuration.

## Environment configuration

Do not commit real passwords, JWT secrets, API keys or production credentials. Generated applications should read environment-specific secrets from environment variables or an external secret manager.

Typical local variables include:

```text
DB_NAME=enterprise_db
DB_USER=app
DB_PASSWORD=app
SERVER_PORT=8080
```

## Repository structure

```text
enterprise-app-builder/
├── frontend/                 # Builder UI
├── generator/                # Generator engine, contracts and templates
├── docs/                     # Architecture and generated-project guides
└── .github/                  # CI configuration
```

## Development principles

1. Configuration over hard-coded generation.
2. Enterprise conventions by default.
3. Backend, frontend, database and infrastructure must be generated from the same ProjectSpec.
4. Generated code must be understandable and maintainable.
5. Security must be enabled by default for protected APIs.
6. Database changes use migrations rather than destructive automatic schema creation.
7. Secrets must never be generated as production credentials.
8. Every generated module should support validation, audit fields, API documentation, pagination and security hooks where applicable.
9. The generator should validate its output before offering a project for download.

## Project status

**Foundation → Enterprise Generator implementation**

The repository contains the Builder UI, project specification model, generator templates and generated-project documentation. The remaining implementation work is to keep integrating and validating the complete generation pipeline so that the Builder produces a genuinely runnable end-to-end application rather than a collection of disconnected templates.

## Roadmap

- [x] Repository foundation
- [x] Project configuration model
- [x] Module designer UI
- [x] JSON specification export
- [x] Generator bootstrap templates
- [x] Organization module templates
- [x] Generated-project run documentation
- [ ] Fully integrated Spring Boot generator
- [ ] Fully integrated React generator
- [ ] Complete MySQL/PostgreSQL + Flyway generation
- [ ] JWT authentication and RBAC generation
- [ ] Complete DTO/mapper/service/controller generation
- [ ] Generated CRUD forms/tables
- [ ] Backend and frontend test generation
- [ ] Validated ZIP project export
- [ ] Docker end-to-end validation
- [ ] GitHub repository export
- [ ] AI-assisted generation

## License

This project is currently maintained as a private development initiative. Add an explicit open-source license before publishing reusable source code under open-source terms.
