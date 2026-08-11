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
  return `package {{PACKAGE}}.module.${camelCase(module.name)}.entity;\n\nimport jakarta.persistence.*;\nimport java.time.*;\n\n@Entity\n@Table(name = "${sqlName(Entity)}")\npublic class ${Entity} {\n\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n${fields}\n}\n`;
}

export function repositoryTemplate(module) {
  const Entity = pascalCase(module.entity);
  return `package {{PACKAGE}}.module.${camelCase(module.name)}.repository;\n\nimport {{PACKAGE}}.module.${camelCase(module.name)}.entity.${Entity};\nimport org.springframework.data.jpa.repository.JpaRepository;\n\npublic interface ${Entity}Repository extends JpaRepository<${Entity}, Long> {\n}\n`;
}

export function controllerTemplate(module) {
  const Entity = pascalCase(module.entity);
  const path = kebabPath(module.name);
  return `package {{PACKAGE}}.module.${camelCase(module.name)}.controller;\n\nimport {{PACKAGE}}.module.${camelCase(module.name)}.entity.${Entity};\nimport {{PACKAGE}}.module.${camelCase(module.name)}.repository.${Entity}Repository;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.List;\n\n@RestController\n@RequestMapping("/api/v1/${path}")\npublic class ${Entity}Controller {\n    private final ${Entity}Repository repository;\n\n    public ${Entity}Controller(${Entity}Repository repository) { this.repository = repository; }\n\n    @GetMapping\n    public List<${Entity}> findAll() { return repository.findAll(); }\n\n    @PostMapping\n    public ${Entity} create(@RequestBody ${Entity} entity) { return repository.save(entity); }\n}\n`;
}

export function migrationTemplate(module) {
  const table = sqlName(module.entity);
  const columns = module.fields.map((field) => `    ${sqlName(field)} VARCHAR(255)`).join(',\n');
  return `CREATE TABLE ${table} (\n    id BIGINT NOT NULL AUTO_INCREMENT,\n${columns},\n    PRIMARY KEY (id)\n);\n`;
}

export function reactListTemplate(module) {
  const Entity = pascalCase(module.entity);
  return `import { useEffect, useState } from 'react';\nimport { Box, Button, Paper, Stack, Typography } from '@mui/material';\nimport axios from 'axios';\n\nexport default function ${Entity}List() {\n  const [rows, setRows] = useState([]);\n  useEffect(() => { axios.get('/api/v1/${kebabPath(module.name)}').then(({ data }) => setRows(data)); }, []);\n  return <Stack spacing={2}><Box><Typography variant="h4">${Entity}</Typography><Button variant="contained">Create ${Entity}</Button></Box><Paper sx={{ p: 2 }}>{rows.map((row) => <pre key={row.id}>{JSON.stringify(row, null, 2)}</pre>)}</Paper></Stack>;\n}\n`;
}

function kebabPath(value) {
  return camelCase(value).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^-/, '');
}
