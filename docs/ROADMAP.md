# Enterprise App Builder - Completion Plan

This repository is being built as a reusable enterprise application generator, not as a single CRM application.

## Target generated stack

- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- JWT authentication
- RBAC
- MySQL/PostgreSQL
- Flyway
- OpenAPI
- React + Vite + MUI
- Axios
- Docker Compose
- GitHub Actions

## Standard module catalog

Organization: Company, Branch, Department, Designation, Employee.

Security: User, Role, Permission.

CRM: Customer, Lead, Vendor, Product, Task, Activity, Note, Follow-up.

Every module is a preset only; users can add custom modules and fields.

## Generator quality gates

A release is considered complete only when a generated sample application can:

1. Install backend dependencies.
2. Start the selected database with Docker Compose.
3. Run Flyway migrations.
4. Seed roles, permissions and an initial administrator.
5. Start Spring Boot successfully.
6. Authenticate and receive a JWT.
7. Enforce role-protected endpoints.
8. Execute CRUD operations with validation, pagination and error responses.
9. Start the React application.
10. Log in and persist the authenticated session.
11. Display generated module tables and forms.
12. Build and run automated backend and frontend tests.
13. Build the backend Docker image.
14. Pass the generated GitHub Actions workflow.

## Definition of done

Do not describe a generated project as production-ready merely because files were created. The generated sample must pass the quality gates above. Secrets must be supplied through environment variables and must never be generated as committed credentials.
