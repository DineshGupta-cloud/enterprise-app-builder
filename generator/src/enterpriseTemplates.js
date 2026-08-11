import { camelCase, pascalCase, sqlName } from './naming.js';

const typeOf = (field) => {
  const n = field.toLowerCase();
  if (n === 'active' || n.startsWith('is')) return 'Boolean';
  if (n.endsWith('id') || n === 'id') return 'Long';
  if (n.includes('date') && !n.includes('time')) return 'LocalDate';
  if (n.includes('time') || n.endsWith('at')) return 'LocalDateTime';
  return 'String';
};

export function moduleEntity(module) {
  const Entity = pascalCase(module.entity);
  const fields = module.fields.map((f) => `    @Column(name = "${sqlName(f)}")\n    private ${typeOf(f)} ${camelCase(f)};`).join('\n\n');
  return `package {{PACKAGE}}.module.${camelCase(module.name)}.entity;\n\nimport jakarta.persistence.*;\nimport java.time.*;\n\n@Entity\n@Table(name = "${sqlName(Entity)}")\npublic class ${Entity} {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n${fields}\n\n    public Long getId() { return id; }\n    public void setId(Long id) { this.id = id; }\n}\n`;
}

export function moduleRepository(module) {
  const Entity = pascalCase(module.entity); const segment = camelCase(module.name);
  return `package {{PACKAGE}}.module.${segment}.repository;\n\nimport {{PACKAGE}}.module.${segment}.entity.${Entity};\nimport org.springframework.data.jpa.repository.JpaRepository;\n\npublic interface ${Entity}Repository extends JpaRepository<${Entity}, Long> { }\n`;
}

export function moduleService(module) {
  const Entity = pascalCase(module.entity); const segment = camelCase(module.name);
  return `package {{PACKAGE}}.module.${segment}.service;\n\nimport {{PACKAGE}}.module.${segment}.entity.${Entity};\nimport {{PACKAGE}}.module.${segment}.repository.${Entity}Repository;\nimport org.springframework.data.domain.*;\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class ${Entity}Service {\n    private final ${Entity}Repository repository;\n    public ${Entity}Service(${Entity}Repository repository) { this.repository = repository; }\n    public Page<${Entity}> list(Pageable pageable) { return repository.findAll(pageable); }\n    public ${Entity} get(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("${Entity}", id)); }\n    public ${Entity} create(${Entity} value) { return repository.save(value); }\n    public ${Entity} update(Long id, ${Entity} value) { get(id); value.setId(id); return repository.save(value); }\n    public void delete(Long id) { get(id); repository.deleteById(id); }\n}\n`;
}

export function moduleController(module) {
  const Entity = pascalCase(module.entity); const segment = camelCase(module.name); const path = segment.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/^-/, '');
  return `package {{PACKAGE}}.module.${segment}.controller;\n\nimport {{PACKAGE}}.module.${segment}.entity.${Entity};\nimport {{PACKAGE}}.module.${segment}.service.${Entity}Service;\nimport org.springframework.data.domain.*;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\n@RequestMapping("/api/v1/${path}")\npublic class ${Entity}Controller {\n    private final ${Entity}Service service;\n    public ${Entity}Controller(${Entity}Service service) { this.service = service; }\n    @GetMapping public Page<${Entity}> list(Pageable pageable) { return service.list(pageable); }\n    @GetMapping("/{id}") public ${Entity} get(@PathVariable Long id) { return service.get(id); }\n    @PostMapping public ${Entity} create(@RequestBody ${Entity} value) { return service.create(value); }\n    @PutMapping("/{id}") public ${Entity} update(@PathVariable Long id, @RequestBody ${Entity} value) { return service.update(id, value); }\n    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }\n}\n`;
}

export function exceptionTemplate() { return `package {{PACKAGE}}.shared.exception;\n\npublic class ResourceNotFoundException extends RuntimeException {\n    public ResourceNotFoundException(String resource, Object id) { super(resource + " not found: " + id); }\n}\n`; }
export function exceptionHandlerTemplate() { return `package {{PACKAGE}}.shared.exception;\n\nimport org.springframework.http.*;\nimport org.springframework.web.bind.annotation.*;\n\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    @ExceptionHandler(ResourceNotFoundException.class)\n    ResponseEntity<ApiError> notFound(ResourceNotFoundException ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(ex.getMessage())); }\n    record ApiError(String message) {}\n}\n`; }
export function auditTemplate() { return `package {{PACKAGE}}.shared.audit;\n\nimport jakarta.persistence.*;\nimport java.time.*;\n\n@MappedSuperclass\npublic abstract class Auditable {\n    @Column(nullable=false, updatable=false) private LocalDateTime createdAt;\n    private LocalDateTime updatedAt;\n    @PrePersist void created() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }\n    @PreUpdate void updated() { updatedAt = LocalDateTime.now(); }\n}\n`; }
export function migrationTemplate(module) { const table = sqlName(module.entity); const cols = module.fields.map((f) => `    ${sqlName(f)} VARCHAR(255)`).join(',\n'); return `CREATE TABLE ${table} (\n    id BIGINT NOT NULL AUTO_INCREMENT,\n${cols},\n    created_at DATETIME NOT NULL,\n    updated_at DATETIME NULL,\n    PRIMARY KEY (id)\n);\n`; }
