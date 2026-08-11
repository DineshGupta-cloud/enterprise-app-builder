import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createProjectSpec, validateProjectSpec } from './projectSpec.js';

const slug = value => String(value || 'module').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'module';
const className = value => String(value || 'Module').replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean).map(x => x[0].toUpperCase() + x.slice(1)).join('') || 'Module';

export async function generateGenericProject(input, outputDir) {
  const spec = createProjectSpec(input);
  const validation = validateProjectSpec(spec);
  if (!validation.valid) throw new Error(`Invalid ProjectSpec: ${validation.errors.join('; ')}`);

  const root = path.resolve(outputDir);
  const modules = spec.modules.map(module => ({
    name: module.name,
    key: slug(module.name),
    className: className(module.name),
    type: module.type || 'STANDARD',
    fields: module.fields || [],
    relationships: (spec.relationships || []).filter(r => r.source === module.name || r.target === module.name)
  }));

  await Promise.all([
    mkdir(path.join(root, 'backend'), { recursive: true }),
    mkdir(path.join(root, 'frontend'), { recursive: true }),
    mkdir(path.join(root, 'database'), { recursive: true }),
    mkdir(path.join(root, 'config'), { recursive: true })
  ]);

  const manifest = {
    generator: 'enterprise-app-builder',
    specVersion: spec.specVersion,
    project: spec.project,
    modules,
    relationships: spec.relationships,
    roles: spec.roles,
    dashboard: spec.dashboard,
    workflows: spec.workflows,
    reports: spec.reports,
    integrations: spec.integrations
  };

  await Promise.all([
    writeFile(path.join(root, 'project-spec.json'), JSON.stringify(spec, null, 2)),
    writeFile(path.join(root, 'generator-manifest.json'), JSON.stringify(manifest, null, 2)),
    writeFile(path.join(root, 'config', 'roles.json'), JSON.stringify(spec.roles, null, 2)),
    writeFile(path.join(root, 'config', 'dashboard.json'), JSON.stringify(spec.dashboard, null, 2)),
    writeFile(path.join(root, 'README.generated.md'), `# ${spec.project.name}\n\nGenerated from the generic Enterprise App Builder ProjectSpec.\n\nModules: ${modules.map(m => m.name).join(', ') || 'None'}\n`)
  ]);

  return { root, spec, manifest };
}

export function genericGeneratorCapabilities() {
  return {
    generic: true,
    crmSpecificCode: false,
    consumesProjectSpec: true,
    supports: ['modules', 'fields', 'relationships', 'roles', 'dashboard', 'workflows', 'reports', 'integrations']
  };
}
