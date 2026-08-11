# Generator Architecture

## Objective

Generate production-oriented applications from a versioned `ProjectSpec` without coupling the UI to generated source code.

## Core layers

### 1. Specification

The UI produces a versioned JSON contract.

### 2. Validation

Reject invalid package names, duplicate module names, invalid Java identifiers, duplicate fields and unsupported technology combinations.

### 3. Normalization

Convert the specification into canonical names and defaults. For example, `customer_number` becomes the Java property `customerNumber` and SQL column `customer_number`.

### 4. Template engine

Templates are grouped by concern:

```text
templates/
├── backend/
│   ├── entity/
│   ├── dto/
│   ├── repository/
│   ├── service/
│   ├── controller/
│   ├── mapper/
│   ├── exception/
│   └── security/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── validation/
├── database/
├── tests/
└── deployment/
```

### 5. Output assembly

Write files into an isolated generated-project directory, validate expected files, then package the directory as a ZIP.

## Generated backend standard

Each business module should support:

- entity
- request/response DTOs
- mapper
- repository
- service interface and implementation
- REST controller
- Bean Validation
- pagination and sorting
- search specification hooks
- audit fields
- centralized error handling
- security/permission hooks
- OpenAPI documentation

## Generated frontend standard

Each module should support:

- list page
- create/edit form
- detail page
- API service
- validation schema
- loading/error/empty states
- pagination
- search/filter controls
- permission-aware actions

## Quality gate

A generated project is considered valid only when:

1. the backend compiles;
2. frontend dependencies resolve and build;
3. database migration syntax is valid;
4. generated tests compile;
5. required files exist;
6. no secrets are embedded in generated source.
