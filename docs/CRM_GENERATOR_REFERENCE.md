# CRM Generator Reference

This example defines the minimum enterprise behavior the generator must be able to produce.

## Generated hierarchy

Company -> Branch -> Department -> Designation -> Employee -> User -> Role -> Permission

## Business modules

- Customer
- Lead
- Task

## Cross-module relationships

- Lead -> Customer (many-to-one)
- Lead -> Employee (many-to-one)
- Task -> Customer (many-to-one)
- Task -> Employee (many-to-one)

## Generated UI

Each module must expose an editable table with search, filters, sorting, pagination, create, edit, view and delete actions according to permissions.

Relationship fields should render as lookup/select controls rather than raw foreign-key IDs.

## Security

The example uses JWT authentication and role/permission based authorization with data scopes:

- ADMIN: ALL
- SALES_MANAGER: BRANCH
- SALES_EXECUTIVE: SELF

Backend authorization is authoritative; hiding a button in React is not considered sufficient security.

## Dashboard

The generated CRM dashboard includes module-driven widgets for Customers, Leads and Open Tasks. Widget queries must respect the logged-in user's data scope.

## Generator acceptance target

Running the CRM example through the generator should eventually produce a project that can:

1. build backend and frontend;
2. start MySQL and Flyway migrations;
3. authenticate with JWT;
4. enforce roles, permissions and data scope;
5. display the dashboard;
6. list, create, edit and delete CRM records through generated tables/forms;
7. resolve related Customer/Employee records through lookups;
8. run automated backend/frontend tests;
9. start through Docker Compose.

This file is a reference acceptance example, not a claim that every item is already implemented.
