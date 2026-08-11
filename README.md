# Enterprise App Builder

A production-oriented application scaffolding platform for generating enterprise web applications from configuration.

## Vision

Generate consistent React + Spring Boot + MySQL applications using reusable templates instead of starting every project from scratch.

## Current release

**v0.1.0 – Foundation**

The first release provides a working browser-based project designer UI, configuration model, module builder, and downloadable JSON project specification. The architecture is intentionally prepared for the next generator service that will emit real Spring Boot/React source trees.

## Planned capabilities

- Project wizard
- Enterprise module generator
- Spring Boot backend templates
- React + MUI frontend templates
- MySQL/Flyway database migrations
- JWT/RBAC configuration
- CRUD + pagination + search generation
- API/OpenAPI generation
- Validation and test generation
- Docker and CI/CD templates
- GitHub project export
- AI-assisted code generation

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Architecture

```text
enterprise-app-builder/
├── frontend/                 # React application builder UI
├── generator/                # Generator contracts and templates (next phase)
├── docs/                     # Architecture and product documentation
└── .github/                  # CI workflow
```

## Design principles

1. Configuration over hard-coded generation.
2. Enterprise conventions by default.
3. Backend first, frontend second, tests third.
4. Generated code must be understandable and maintainable.
5. Every generated module should support validation, audit fields, API documentation, pagination, and security hooks.

## Roadmap

- [x] Repository foundation
- [x] Project configuration model
- [x] Module designer UI
- [x] JSON specification export
- [ ] Spring Boot generator engine
- [ ] React generator engine
- [ ] MySQL/Flyway generator
- [ ] ZIP project export
- [ ] GitHub repository export
- [ ] AI generation assistant
- [ ] Docker/CI/CD generation
