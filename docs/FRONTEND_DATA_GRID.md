# Generated Frontend Data Grid

Every generated CRUD module should expose a real editable data table, not a read-only mock.

## Required behavior

- Load records from the generated REST API.
- Server-side pagination.
- Search, filtering and sorting.
- Create record.
- Edit record.
- Delete record when the current permission allows it.
- Row-level loading and error states.
- Form validation.
- Permission-aware actions.
- Relationship fields rendered as selectable references.
- Refresh after mutations.

## API contract

```text
GET    /api/v1/{module}?page=0&size=20&sort=id,desc
GET    /api/v1/{module}/{id}
POST   /api/v1/{module}
PUT    /api/v1/{module}/{id}
DELETE /api/v1/{module}/{id}
```

The generator derives `{module}` and fields from `ProjectSpec`.

## UI contract

```text
ModulePage
├── PageToolbar
│   ├── Search
│   ├── Filters
│   └── Add
├── DataGrid
│   ├── Generated columns
│   ├── Edit action
│   └── Delete action
└── ModuleForm
    ├── Generated fields
    ├── Relationship selectors
    ├── Validation
    └── Save / Cancel
```

## Security

The frontend must not treat hidden buttons as authorization. The backend remains authoritative. Create/update/delete actions are displayed according to permissions for usability, while every API request is protected by Spring Security/RBAC and data-scope rules.

## Dashboard

Generated dashboards consume the same module APIs and dashboard aggregation endpoints. Widgets are generated from the selected modules and relationships and are filtered by the logged-in user's permissions and data scope.
