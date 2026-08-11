# Branching Strategy

## Repository branches

The repository currently has one active branch:

```text
main
```

The intended development model is:

```text
main
 ├── feature/builder-generator-integration
 ├── feature/generated-jwt-rbac
 ├── feature/generated-crud
 ├── feature/generated-tests
 └── feature/e2e-validation
```

Feature branches should be short-lived and merged into `main` only after the relevant tests pass.

## Current integration order

1. `feature/builder-generator-integration` — connect Builder Generate action to the generator engine.
2. `feature/generated-jwt-rbac` — generate User, Role, Permission, JWT and Spring Security code.
3. `feature/generated-crud` — generate complete backend/frontend CRUD.
4. `feature/generated-tests` — generate backend/frontend tests.
5. `feature/e2e-validation` — validate a clean generated project with database, backend, frontend and Docker.

## Generated application branches

The Builder itself does not assume that generated applications use a particular Git branching strategy. The generated application README recommends:

```text
main
 ├── feature/<module-name>
 ├── fix/<issue-name>
 └── release/<version>
```

Production repositories should protect `main` and require CI checks before merge.

## Important

The GitHub integration available to this development session currently exposes `main` as the repository branch. If feature-branch creation is unavailable, implementation changes remain on `main` rather than pretending a feature branch was created.
