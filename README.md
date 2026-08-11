# Enterprise App Builder

A production-oriented, configuration-driven platform for generating different kinds of enterprise web applications from a visual ProjectSpec.

## Product definition

**This is a generic enterprise application builder, not a CRM generator.**

CRM is maintained as a reference/golden example used to validate the generic generator. The same generator architecture is intended to support HRMS, ERP, inventory, hospital, school, banking, e-commerce, or a completely custom application.

```text
Visual Builder
      ↓
ProjectSpec
      ↓
Generic Generator
      ↓
Backend + Frontend + Database + Security + Infrastructure
      ↓
Validated Runnable Application
```

## Target completion pipeline

```text
Visual Builder
  → ProjectSpec
  → Generic Generator
  → Runnable Backend
  → Runnable Frontend
  → Database / Migrations
  → JWT / RBAC
  → CRUD / DTO / Mapper / Service / Controller
  → Relationships
  → Editable DataGrid / Forms
  → Dashboard
  → Automated Tests
  → Docker
  → Validated ZIP Project
```

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
- Data-scope authorization
- Flyway
- OpenAPI / Swagger
- Maven

### Frontend
- React
- Vite
- Material UI (MUI)
- React Router
- Axios
- Generated authentication, dashboard, CRUD tables and forms

### Infrastructure
- MySQL or PostgreSQL
- Docker / Docker Compose
- GitHub Actions
- Environment-based configuration

## Generic ProjectSpec

The generator consumes a domain-neutral ProjectSpec. It must not require CRM-specific modules.

```text
ProjectSpec
├── Project
├── Organization
├── Modules
│   ├── Fields
│   ├── Relationships
│   ├── Validation
│   ├── UI
│   └── Workflow
├── Roles
├── Permissions
├── Data Scopes
├── Dashboard
├── Reports
├── Integrations
└── Deployment
```

### Supported module types

```text
STANDARD
MASTER
TRANSACTION
WORKFLOW
DOCUMENT
APPROVAL
REPORT
```

### Supported relationships

```text
ONE_TO_ONE
ONE_TO_MANY
MANY_TO_ONE
MANY_TO_MANY
```

### Supported data scopes

```text
ALL
COMPANY
BRANCH
DEPARTMENT
SELF
```

The generic ProjectSpec model and validation live in `generator/src/projectSpec.js`.

## Generic generator

`generator/src/genericGenerator.js` consumes the ProjectSpec and creates a generated-project manifest/configuration structure without hard-coded CRM business logic.

The generator derives module keys, class names, fields and relationships from the specification and carries roles, dashboard, workflows, reports and integrations into the generated project configuration.

## Reference example: CRM

CRM is a **golden/reference project**, not the product definition.

The example is available at:

`generator/examples/crm-project-spec.json`

It demonstrates:

```text
Company → Branch → Department → Designation → Employee

Customer
Lead → Customer / Employee
Task → Customer / Employee

ADMIN            → ALL
SALES_MANAGER    → BRANCH
SALES_EXECUTIVE  → SELF
```

The same generic engine must be capable of accepting a different ProjectSpec such as:

```text
HRMS
Employee / Attendance / Leave / Payroll

Inventory
Product / Warehouse / Stock / Purchase / Supplier

Hospital
Patient / Doctor / Appointment / Billing

School
Student / Teacher / Course / Attendance / Result
```

without adding application-specific generator code for each domain.

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
│       │   └── modules/
│       └── resources/
│           ├── application.yml
│           └── db/migration/
├── frontend/
│   ├── package.json
│   └── src/
│       ├── auth/
│       ├── dashboard/
│       ├── layout/
│       ├── modules/
│       └── services/
├── database/
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

Frontend modules are intended to follow:

```text
API service
  ↓
Editable DataGrid
  ↓
Create / Edit Form
  ↓
Relationship Lookups
  ↓
Validation
  ↓
Pagination / Search / Sorting
  ↓
Permission-aware actions
```

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
Organization
      ↓
Modules
      ↓
Fields / Validation
      ↓
Relationships
      ↓
Data Scopes
      ↓
Dashboard / Reports / Workflows
      ↓
Review ProjectSpec
      ↓
Generate Application
      ↓
Validate Build / Tests
      ↓
Download ZIP
```

## Quality gate

A generated application is considered complete only when it can pass:

- Database starts successfully
- Flyway migrations execute successfully
- Seed data loads
- Spring Boot starts successfully
- Login returns a JWT
- JWT-protected endpoints reject unauthenticated requests
- RBAC restrictions work at the backend
- Data scopes are enforced at the backend
- Generated CRUD endpoints work
- Relationships work through generated APIs and UI lookups
- Validation and global error handling work
- Pagination, filtering and sorting work where configured
- React application builds successfully
- React authentication works
- Generated editable tables and forms operate
- Dashboard loads data according to the logged-in user's scope
- Backend tests pass
- Frontend tests pass
- Docker image builds successfully
- Docker Compose starts the application stack
- Generated project can be packaged as a ZIP

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
5. Configure authentication, roles, permissions and data scopes.
6. Add any modules required by the application.
7. Define fields, validation and relationships.
8. Configure dashboard, reports and workflows as required.
9. Review the generated ProjectSpec.
10. Click **Generate Application**.
11. Run the generator validation/build checks.
12. Download the generated ZIP when validation succeeds.

## Project status

**Generic ProjectSpec → Generator Integration**

Implemented foundation:

- Builder project model
- Generic ProjectSpec creation and validation
- Generic module/relationship/data-scope contracts
- ProjectSpec-driven generic generator pipeline
- CRM golden/reference ProjectSpec
- Generator and generated-project documentation
- Dashboard/module metadata contracts
- JWT/RBAC migration configuration foundation

The remaining work is to connect the generic generator to the complete production code generators and validate generated applications end-to-end.

## Roadmap

- [x] Repository foundation
- [x] Generic ProjectSpec model
- [x] ProjectSpec validation
- [x] Module designer foundation
- [x] Relationship contract
- [x] Data-scope contract
- [x] CRM golden/reference specification
- [x] Generic generator pipeline foundation
- [ ] Fully integrated Spring Boot source generation
- [ ] Complete DTO/mapper/service/controller generation
- [ ] Complete database schema + Flyway generation
- [ ] JWT authentication generation
- [ ] Complete RBAC and data-scope enforcement generation
- [ ] Fully generated React DataGrid/forms
- [ ] Relationship-aware frontend generation
- [ ] Generated dashboard implementation
- [ ] Backend and frontend test generation
- [ ] Build/test validation of generated projects
- [ ] Docker end-to-end validation
- [ ] Validated ZIP export
- [ ] GitHub repository export
- [ ] AI-assisted ProjectSpec generation

## Development principles

1. Configuration over hard-coded domain logic.
2. CRM is a reference implementation, never the generator's product model.
3. Backend, frontend, database and infrastructure are generated from the same ProjectSpec.
4. Generated code must be understandable and maintainable.
5. Security is enabled by default for protected APIs.
6. Database changes use migrations.
7. Secrets are never generated as production credentials.
8. Generated modules support validation, audit fields, API documentation, pagination and security hooks where applicable.
9. The generator must validate its output before offering a project for download.
10. A new application domain should be representable by ProjectSpec without modifying the generator's core domain logic.

## License

This project is currently maintained as a private development initiative. Add an explicit open-source license before publishing reusable source code under open-source terms.
