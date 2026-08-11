import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createProjectSpec, validateProjectSpec } from './projectSpec.js';

const slug = value => String(value || 'module').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'module';
const javaName = value => String(value || 'Module').replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean).map(v => v[0].toUpperCase() + v.slice(1)).join('') || 'Module';
const sqlType = type => ({ string: 'VARCHAR(255)', text: 'TEXT', long: 'BIGINT', integer: 'INT', boolean: 'BOOLEAN', date: 'DATE', datetime: 'DATETIME', decimal: 'DECIMAL(19,4)' }[String(type || 'string').toLowerCase()] || 'VARCHAR(255)');

function sqlMigration(spec) {
  return spec.modules.map(m => {
    const fields = (m.fields || []).filter(f => f.name).map(f => `    ${slug(f.name).replaceAll('-', '_')} ${sqlType(f.type)}${f.required ? ' NOT NULL' : ''}`).join(',\n');
    return `CREATE TABLE ${slug(m.name).replaceAll('-', '_')} (\n    id BIGINT AUTO_INCREMENT PRIMARY KEY${fields ? ',\n' + fields : ''}\n);`;
  }).join('\n\n') + '\n';
}

function javaEntity(spec, module) {
  const fields = (module.fields || []).filter(f => f.name).map(f => `    private String ${slug(f.name).replaceAll('-', '_')};`).join('\n');
  return `package ${spec.project.packageName}.module.${slug(module.name).replaceAll('-', '')};\n\nimport jakarta.persistence.*;\nimport lombok.Getter;\nimport lombok.Setter;\n\n@Entity\n@Table(name = "${slug(module.name).replaceAll('-', '_')}")\n@Getter\n@Setter\npublic class ${javaName(module.name)} {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n${fields}\n}`;
}

function reactModule(module) {
  const key = slug(module.name);
  return `import { useEffect, useState } from 'react';\n\nexport default function ${javaName(module.name)}Page() {\n  const [rows, setRows] = useState([]);\n  useEffect(() => { fetch('/api/v1/${key}').then(r => r.json()).then(data => setRows(data.content ?? data)); }, []);\n  return <div><h1>${module.name}</h1><table><thead><tr>${(module.fields || []).map(f => `<th>${f.name}</th>`).join('')}<th>Actions</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}>${(module.fields || []).map(f => `<td>{row.${slug(f.name).replaceAll('-', '_')}}</td>`).join('')}<td><button onClick={() => fetch('/api/v1/${key}/' + row.id, { method: 'DELETE' }).then(() => setRows(rows.filter(x => x.id !== row.id)))}>Delete</button></td></tr>)}</tbody></table></div>;\n}`;
}

export async function generateRuntimeArtifacts(input, outputDir) {
  const spec = createProjectSpec(input);
  const check = validateProjectSpec(spec);
  if (!check.valid) throw new Error(`Invalid ProjectSpec: ${check.errors.join('; ')}`);
  const root = path.resolve(outputDir);
  const backendJava = path.join(root, 'backend/src/main/java', ...spec.project.packageName.split('.'), 'module');
  const migration = path.join(root, 'backend/src/main/resources/db/migration');
  const frontendModules = path.join(root, 'frontend/src/modules');
  await mkdir(backendJava, { recursive: true });
  await mkdir(migration, { recursive: true });
  await mkdir(frontendModules, { recursive: true });
  await writeFile(path.join(migration, 'V1__generated_modules.sql'), sqlMigration(spec));
  for (const module of spec.modules) {
    await writeFile(path.join(backendJava, `${javaName(module.name)}.java`), javaEntity(spec, module));
    await writeFile(path.join(frontendModules, `${slug(module.name)}.jsx`), reactModule(module));
  }
  await writeFile(path.join(root, 'generated-runtime-manifest.json'), JSON.stringify({ generatedFrom: 'ProjectSpec', modules: spec.modules.map(m => slug(m.name)), relationships: spec.relationships, roles: spec.roles }, null, 2));
  return { root, generatedModules: spec.modules.length };
}
