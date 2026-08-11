# Application Bootstrap

The generator now targets a complete application bootstrap rather than isolated source files.

Bootstrap layers:

- Spring Boot Maven project
- application.yml
- MySQL/PostgreSQL driver selection
- Flyway
- Spring Security baseline
- OpenAPI/Swagger
- React/Vite/MUI shell
- Docker Compose
- Backend Dockerfile
- GitHub Actions

The bootstrap output is intentionally configuration-driven by ProjectSpec.