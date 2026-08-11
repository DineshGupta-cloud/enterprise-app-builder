import { validateProjectSpec, normalizeProjectSpec } from './projectSpec.js';
import { moduleEntity, moduleRepository, moduleService, moduleController, exceptionTemplate, exceptionHandlerTemplate, auditTemplate, migrationTemplate } from './enterpriseTemplates.js';
import { companySeedTemplate, companyApiReadmeTemplate } from './companyModule.js';

export function generateEnterpriseProject(input) {
  const validation = validateProjectSpec(input);
  if (!validation.valid) throw new Error(validation.errors.join('\n'));
  const spec = normalizeProjectSpec(input);
  const files = {};
  const pkg = spec.project.packageName;
  const pkgPath = pkg.replaceAll('.', '/');
  const shared = `backend/src/main/java/${pkgPath}/shared`;
  files[`${shared}/exception/ResourceNotFoundException.java`] = exceptionTemplate().replaceAll('{{PACKAGE}}', pkg);
  files[`${shared}/exception/GlobalExceptionHandler.java`] = exceptionHandlerTemplate().replaceAll('{{PACKAGE}}', pkg);
  files[`${shared}/audit/Auditable.java`] = auditTemplate().replaceAll('{{PACKAGE}}', pkg);

  for (const [index, module] of spec.modules.entries()) {
    const segment = module.name.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    const base = `backend/src/main/java/${pkgPath}/module/${segment}`;
    files[`${base}/entity/${module.entity}.java`] = moduleEntity(module).replaceAll('{{PACKAGE}}', pkg);
    files[`${base}/repository/${module.entity}Repository.java`] = moduleRepository(module).replaceAll('{{PACKAGE}}', pkg);
    files[`${base}/service/${module.entity}Service.java`] = moduleService(module).replaceAll('{{PACKAGE}}', pkg);
    files[`${base}/controller/${module.entity}Controller.java`] = moduleController(module).replaceAll('{{PACKAGE}}', pkg);
    files[`backend/src/main/resources/db/migration/V${String(index + 1).padStart(3, '0')}__create_${segment}.sql`] = migrationTemplate(module);

    if (module.name.toLowerCase() === 'company') {
      files[`backend/src/main/resources/db/migration/V${String(index + 1).padStart(3, '0')}__seed_company.sql`] = companySeedTemplate();
      files[`docs/modules/company.md`] = companyApiReadmeTemplate();
    }
  }

  files['generated/project-spec.json'] = JSON.stringify(spec, null, 2);
  files['generated/GENERATION-MANIFEST.md'] = `# Enterprise Generation Manifest\n\nVersion: ${spec.version}\n\nGenerated layers: Entity, Repository, Service, Controller, exception handling, audit base, Flyway migrations.\n\nFoundation module: Company.\n`;
  return { spec, files };
}
