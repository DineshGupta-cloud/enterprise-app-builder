import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createProjectSpec, validateProjectSpec } from './projectSpec.js';

const slug = value => String(value || 'module').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'module';
const camel = value => String(value || 'module').replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^[A-Z]/, c => c.toLowerCase()) || 'module';
const pascal = value => camel(value).replace(/^./, c => c.toUpperCase());
const javaType = type => ({ long: 'Long', integer: 'Integer', boolean: 'Boolean', date: 'LocalDate', datetime: 'LocalDateTime', decimal: 'BigDecimal' }[String(type || 'string').toLowerCase()] || 'String');

function entity(spec, m) {
  const fields = (m.fields || []).filter(f => f.name).map(f => `    private ${javaType(f.type)} ${camel(f.name)};`).join('\n');
  return `package ${spec.project.packageName}.modules.${slug(m.name).replaceAll('-', '')};\n\nimport jakarta.persistence.*;\nimport lombok.Getter;\nimport lombok.Setter;\n\n@Entity\n@Table(name = "${slug(m.name).replaceAll('-', '_')}")\n@Getter @Setter\npublic class ${pascal(m.name)} {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n${fields}\n}`;
}

function repository(spec, m) {
  return `package ${spec.project.packageName}.modules.${slug(m.name).replaceAll('-', '')};\n\nimport org.springframework.data.jpa.repository.JpaRepository;\n\npublic interface ${pascal(m.name)}Repository extends JpaRepository<${pascal(m.name)}, Long> {\n}`;
}

function dto(m) {
  const fields = (m.fields || []).filter(f => f.name).map(f => `    private ${javaType(f.type)} ${camel(f.name)};`).join('\n');
  return `package ${m.name};\n\npublic class ${pascal(m.name)}Request {\n${fields}\n}`;
}

function service(spec, m) {
  const n = pascal(m.name);
  return `package ${spec.project.packageName}.modules.${slug(m.name).replaceAll('-', '')};\n\nimport lombok.RequiredArgsConstructor;\nimport org.springframework.stereotype.Service;\nimport java.util.List;\n\n@Service\n@RequiredArgsConstructor\npublic class ${n}Service {\n    private final ${n}Repository repository;\n    public List<${n}> findAll() { return repository.findAll(); }\n    public ${n} findById(Long id) { return repository.findById(id).orElseThrow(); }\n    public ${n} save(${n} value) { return repository.save(value); }\n    public void delete(Long id) { repository.deleteById(id); }\n}`;
}

function controller(spec, m) {
  const n = pascal(m.name), url = slug(m.name), pkg = `${spec.project.packageName}.modules.${slug(m.name).replaceAll('-', '')}`;
  return `package ${pkg};\n\nimport lombok.RequiredArgsConstructor;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.List;\n\n@RestController\n@RequestMapping("/api/v1/${url}")\n@RequiredArgsConstructor\npublic class ${n}Controller {\n    private final ${n}Service service;\n    @GetMapping public List<${n}> findAll() { return service.findAll(); }\n    @GetMapping("/{id}") public ${n} findById(@PathVariable Long id) { return service.findById(id); }\n    @PostMapping public ${n} create(@RequestBody ${n} value) { return service.save(value); }\n    @PutMapping("/{id}") public ${n} update(@PathVariable Long id, @RequestBody ${n} value) { value.setId(id); return service.save(value); }\n    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }\n}`;
}

export async function generateCrudArtifacts(input, outputDir) {
  const spec = createProjectSpec(input);
  const check = validateProjectSpec(spec);
  if (!check.valid) throw new Error(`Invalid ProjectSpec: ${check.errors.join('; ')}`);
  const root = path.resolve(outputDir);
  for (const m of spec.modules) {
    const key = slug(m.name);
    const base = path.join(root, 'backend/src/main/java', ...spec.project.packageName.split('.'), 'modules', key.replaceAll('-', ''));
    await mkdir(base, { recursive: true });
    await writeFile(path.join(base, `${pascal(m.name)}.java`), entity(spec, m));
    await writeFile(path.join(base, `${pascal(m.name)}Repository.java`), repository(spec, m));
    await writeFile(path.join(base, `${pascal(m.name)}Service.java`), service(spec, m));
    await writeFile(path.join(base, `${pascal(m.name)}Request.java`), dto(m));
    await writeFile(path.join(base, `${pascal(m.name)}Controller.java`), controller(spec, m));
  }
  return { generatedModules: spec.modules.length, generatedLayers: ['entity', 'dto', 'repository', 'service', 'controller'] };
}
