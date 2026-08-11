import { validateProjectSpec, normalizeProjectSpec } from './projectSpec.js';
import { entityTemplate, repositoryTemplate, controllerTemplate, migrationTemplate, reactListTemplate } from './templates.js';

export function generateProject(input) {
  const validation = validateProjectSpec(input);
  if (!validation.valid) throw new Error(`Invalid project specification:\n${validation.errors.join('\n')}`);

  const spec = normalizeProjectSpec(input);
  const files = {};
  const pkg = spec.project.packageName;

  for (const module of spec.modules) {
    const segment = module.name.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    files[`backend/src/main/java/${pkg.replaceAll('.', '/')}/module/${segment}/entity/${module.entity}.java`] = entityTemplate(module).replaceAll('{{PACKAGE}}', pkg);
    files[`backend/src/main/java/${pkg.replaceAll('.', '/')}/module/${segment}/repository/${module.entity}Repository.java`] = repositoryTemplate(module).replaceAll('{{PACKAGE}}', pkg);
    files[`backend/src/main/java/${pkg.replaceAll('.', '/')}/module/${segment}/controller/${module.entity}Controller.java`] = controllerTemplate(module).replaceAll('{{PACKAGE}}', pkg);
    files[`backend/src/main/resources/db/migration/V1__create_${segment}.sql`] = migrationTemplate(module);
    files[`frontend/src/modules/${segment}/${module.entity}List.jsx`] = reactListTemplate(module);
  }

  files['generated/project-spec.json'] = JSON.stringify(spec, null, 2);
  files['generated/GENERATION-MANIFEST.md'] = `# Generation Manifest\n\nGenerated from specification version ${spec.version}.\n\nModules: ${spec.modules.map((m) => m.entity).join(', ')}\n`;
  return { spec, files };
}
