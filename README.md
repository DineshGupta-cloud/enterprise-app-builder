# Enterprise App Builder

A production-oriented, configuration-driven platform for generating different kinds of enterprise web applications from a visual ProjectSpec.

## Product definition

**This is a generic enterprise application builder, not a CRM generator.** CRM is the golden reference example; the generator itself is domain-neutral.

```text
Visual Builder → ProjectSpec → Generic Generator → Runtime Artifacts → Runnable Application
```

## Current implementation

The generator now has a runtime artifact layer in `generator/src/runtimeArtifactGenerator.js`. It consumes the same generic ProjectSpec and emits:

- Flyway-style SQL tables for configured modules;
- Spring Boot/JPA entity source for configured modules;
- React module page source for configured modules;
- a generated runtime manifest containing modules, relationships and roles.

The generator is intentionally driven by configuration rather than CRM-specific source code.

## Target completion pipeline

```text
Visual Builder
  → ProjectSpec
  → Generic Generator
  → Spring Boot source
  → React source
  → Database / Flyway migrations
  → JWT / RBAC
  → CRUD / DTO / Mapper / Service / Controller
  → Relationships
  → Editable DataGrid / Forms
  → Dashboard
  → Automated Tests
  → Docker
  → Build/test validation
  → Validated ZIP Project
```

## Generic ProjectSpec

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

Supported module types: `STANDARD`, `MASTER`, `TRANSACTION`, `WORKFLOW`, `DOCUMENT`, `APPROVAL`, `REPORT`.

Supported relationships: `ONE_TO_ONE`, `ONE_TO_MANY`, `MANY_TO_ONE`, `MANY_TO_MANY`.

Supported data scopes: `ALL`, `COMPANY`, `BRANCH`, `DEPARTMENT`, `SELF`.

The model and validation live in `generator/src/projectSpec.js`.

## CRM golden example

`generator/examples/crm-project-spec.json` is only a reference specification demonstrating that the generic model can describe Company/Branch/Employee, Customer, Lead and Task relationships plus role scopes. It is not embedded in the generator.

The same architecture is intended to generate HRMS, ERP, inventory, hospital, school, banking, e-commerce or a custom application.

## Generated application target

```text
Generated Application
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/
│       │   ├── security/
│       │   └── modules/
│       └── resources/db/migration/
├── frontend/
│   └── src/modules/
├── database/
├── docker-compose.yml
└── .github/workflows/
```

## Quality gate

A generated application is complete only when database, backend, frontend, JWT/RBAC, data scopes, CRUD, relationships, dashboard, tests and Docker work together and the project can be packaged as a validated ZIP.

## Run the Builder

Prerequisites: Node.js 20+, npm 10+, Git.

```bash
git clone https://github.com/DineshGupta-cloud/enterprise-app-builder.git
cd enterprise-app-builder/frontend
npm install
npm run dev
```

Open the Vite URL shown by the terminal.

## Roadmap

- [x] Generic ProjectSpec model and validation
- [x] Generic generator foundation
- [x] CRM golden/reference specification
- [x] Runtime artifact generation foundation
- [x] Generated database migration foundation
- [x] Generated JPA entity foundation
- [x] Generated React module foundation
- [ ] Complete DTO/mapper/repository/service/controller generation
- [ ] JWT authentication generation
- [ ] Complete RBAC/data-scope enforcement generation
- [ ] Relationship-aware database/frontend generation
- [ ] Editable DataGrid/forms generation
- [ ] Dashboard generation
- [ ] Test generation and build validation
- [ ] Docker end-to-end validation
- [ ] Validated ZIP export
- [ ] GitHub repository export

## Principles

1. Configuration over hard-coded domain logic.
2. CRM is a reference implementation, never the product model.
3. Backend, frontend and database are generated from the same ProjectSpec.
4. Security is enabled by default for protected APIs.
5. Database changes use migrations.
6. The generator must validate output before offering a project for download.
7. A new domain must be representable without modifying generator core domain logic.
