import { camelCase, pascalCase, sqlName } from './naming.js';

const javaType = (field) => {
  const name = field.toLowerCase();
  if (name === 'id' || name.endsWith('id')) return 'Long';
  if (name === 'active' || name.startsWith('is')) return 'Boolean';
  if (name.includes('date')) return 'LocalDate';
  if (name.includes('time') || name.endsWith('at')) return 'LocalDateTime';
  return 'String';
};

export function entityTemplate(module) {
  const Entity = pascalCase(module.entity);
  const fields = module.fields.map((field) => `    @Column(name = "${sqlName(field)}")\n    private ${javaType(field)} ${camelCase(field)};`).join('\n\n');
  return `package {{PACKAGE}}.module.${camelCase(module.name)}.entity;\n\nimport jakarta.persistence.*;\nimport java.time.*;\n\n@Entity\n@Table(name = "${sqlName(Entity)}")\npublic class ${Entity} {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n${fields}\n\n    public Long getId() { return id; }\n    public void setId(Long id) { this.id = id; }\n}\n`;
}

export function dtoTemplate(module) {
  const Entity = pascalCase(module.entity);
  const fields = module.fields.map((field) => `    private ${javaType(field)} ${camelCase(field)};`).join('\n');
  return `package {{PACKAGE}}.module.${camelCase(module.name)}.dto;\n\npublic class ${Entity}Request {\n${fields}\n}\n`;
}

export function repositoryTemplate(module) {
  const Entity = pascalCase(module.entity);
  return `package {{PACKAGE}}.module.${camelCase(module.name)}.repository;\n\nimport {{PACKAGE}}.module.${camelCase(module.name)}.entity.${Entity};\nimport org.springframework.data.jpa.repository.JpaRepository;\n\npublic interface ${Entity}Repository extends JpaRepository<${Entity}, Long> {\n}\n`;
}

export function serviceTemplate(module) {
  const Entity = pascalCase(module.entity);
  const segment = camelCase(module.name);
  return `package {{PACKAGE}}.module.${segment}.service;\n\nimport {{PACKAGE}}.module.${segment}.entity.${Entity};\nimport {{PACKAGE}}.module.${segment}.repository.${Entity}Repository;\nimport org.springframework.data.domain.*;\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class ${Entity}Service {\n    private final ${Entity}Repository repository;\n    public ${Entity}Service(${Entity}Repository repository) { this.repository = repository; }\n    public Page<${Entity}> findAll(Pageable pageable) { return repository.findAll(pageable); }\n    public ${Entity} findById(Long id) { return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("${Entity} not found: " + id)); }\n    public ${Entity} create(${Entity} entity) { return repository.save(entity); }\n    public ${Entity} update(Long id, ${Entity} entity) { findById(id); entity.setId(id); return repository.save(entity); }\n    public void delete(Long id) { if (!repository.existsById(id)) throw new IllegalArgumentException("${Entity} not found: " + id); repository.deleteById(id); }\n}\n`;
}

export function controllerTemplate(module) {
  const Entity = pascalCase(module.entity);
  const segment = camelCase(module.name);
  const path = kebabPath(module.name);
  return `package {{PACKAGE}}.module.${segment}.controller;\n\nimport {{PACKAGE}}.module.${segment}.entity.${Entity};\nimport {{PACKAGE}}.module.${segment}.service.${Entity}Service;\nimport org.springframework.data.domain.*;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\n@RequestMapping("/api/v1/${path}")\npublic class ${Entity}Controller {\n    private final ${Entity}Service service;\n    public ${Entity}Controller(${Entity}Service service) { this.service = service; }\n    @GetMapping public Page<${Entity}> findAll(Pageable pageable) { return service.findAll(pageable); }\n    @GetMapping("/{id}") public ${Entity} findById(@PathVariable Long id) { return service.findById(id); }\n    @PostMapping public ${Entity} create(@RequestBody ${Entity} entity) { return service.create(entity); }\n    @PutMapping("/{id}") public ${Entity} update(@PathVariable Long id, @RequestBody ${Entity} entity) { return service.update(id, entity); }\n    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }\n}\n`;
}

export function exceptionHandlerTemplate() {
  return `package {{PACKAGE}}.shared.exception;\n\nimport org.springframework.http.*;\nimport org.springframework.web.bind.annotation.*;\n\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    @ExceptionHandler(IllegalArgumentException.class)\n    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {\n        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(ex.getMessage()));\n    }\n    public record ErrorResponse(String message) {}\n}\n`;
}

export function auditEntityTemplate() {
  return `package {{PACKAGE}}.shared.audit;\n\nimport jakarta.persistence.*;\nimport java.time.*;\n\n@MappedSuperclass\npublic abstract class AuditableEntity {\n    @Column(nullable = false, updatable = false)\n    private LocalDateTime createdAt;\n    private LocalDateTime updatedAt;\n    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }\n    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }\n}\n`;
}

export function migrationTemplate(module) {
  const table = sqlName(module.entity);
  const columns = module.fields.map((field) => `    ${sqlName(field)} VARCHAR(255)`).join(',\n');
  return `CREATE TABLE ${table} (\n    id BIGINT NOT NULL AUTO_INCREMENT,\n${columns},\n    created_at DATETIME NOT NULL,\n    updated_at DATETIME NULL,\n    PRIMARY KEY (id)\n);\n`;
}

export function reactListTemplate(module) {
  const Entity = pascalCase(module.entity);
  return `import { useEffect, useState } from 'react';\nimport { Button, Paper, Stack, Typography } from '@mui/material';\nimport axios from 'axios';\n\nexport default function ${Entity}List() {\n  const [rows, setRows] = useState([]);\n  useEffect(() => { axios.get('/api/v1/${kebabPath(module.name)}').then(({ data }) => setRows(data.content ?? data)); }, []);\n  return <Stack spacing={2}><Stack direction="row" justifyContent="space-between"><Typography variant="h4">${Entity}</Typography><Button variant="contained">Create ${Entity}</Button></Stack><Paper sx={{ p: 2 }}>{rows.map((row) => <pre key={row.id}>{JSON.stringify(row, null, 2)}</pre>)}</Paper></Stack>;\n}\n`;
}

function kebabPath(value) { return camelCase(value).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^-/, ''); }
