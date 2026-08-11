export const PROJECT_SPEC_VERSION = '1.0';
export const MODULE_TYPES = ['STANDARD', 'MASTER', 'TRANSACTION', 'WORKFLOW', 'DOCUMENT', 'APPROVAL', 'REPORT'];
export const RELATIONSHIP_TYPES = ['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY'];
export const DATA_SCOPES = ['ALL', 'COMPANY', 'BRANCH', 'DEPARTMENT', 'SELF'];
export const SUPPORTED = {
  java: ['17', '21'], database: ['mysql', 'postgresql'], backend: ['spring-boot'],
  frontend: ['react-mui'], security: ['jwt-rbac'], migration: ['flyway', 'liquibase']
};

export function createProjectSpec(input = {}) {
  return {
    specVersion: PROJECT_SPEC_VERSION,
    project: { name: input.project?.name || 'New Enterprise Application', packageName: input.project?.packageName || 'com.generated.app' },
    architecture: { java: input.architecture?.java || '17', database: input.architecture?.database || 'mysql', backend: 'spring-boot', frontend: 'react-mui', security: 'jwt-rbac', migration: input.architecture?.migration || 'flyway' },
    organization: input.organization || [], modules: input.modules || [], relationships: input.relationships || [], roles: input.roles || [],
    dashboard: input.dashboard || { widgets: [] }, workflows: input.workflows || [], reports: input.reports || [], integrations: input.integrations || []
  };
}

export function validateProjectSpec(spec) {
  const errors = [];
  if (!spec?.project?.name?.trim()) errors.push('project.name is required');
  if (!spec?.project?.packageName?.trim()) errors.push('project.packageName is required');
  if (!SUPPORTED.java.includes(String(spec?.architecture?.java))) errors.push('Unsupported Java version');
  if (!SUPPORTED.database.includes(spec?.architecture?.database)) errors.push('Unsupported database');
  if (!SUPPORTED.backend.includes(spec?.architecture?.backend)) errors.push('Unsupported backend');
  if (!SUPPORTED.frontend.includes(spec?.architecture?.frontend)) errors.push('Unsupported frontend');
  if (!SUPPORTED.security.includes(spec?.architecture?.security)) errors.push('Unsupported security');
  if (!Array.isArray(spec?.modules)) errors.push('modules must be an array');
  const names = new Set();
  for (const [index, module] of (spec?.modules ?? []).entries()) {
    if (!module?.name?.trim()) errors.push(`modules[${index}].name is required`);
    const key = String(module?.name || '').trim().toLowerCase();
    if (key && names.has(key)) errors.push(`Duplicate module: ${module.name}`);
    if (key) names.add(key);
    if (module?.type && !MODULE_TYPES.includes(module.type)) errors.push(`Invalid module type: ${module.type}`);
  }
  for (const relationship of spec?.relationships ?? []) {
    if (!names.has(String(relationship.source || '').trim().toLowerCase())) errors.push(`Unknown relationship source: ${relationship.source}`);
    if (!names.has(String(relationship.target || '').trim().toLowerCase())) errors.push(`Unknown relationship target: ${relationship.target}`);
    if (!RELATIONSHIP_TYPES.includes(relationship.type)) errors.push(`Invalid relationship type: ${relationship.type}`);
  }
  for (const role of spec?.roles ?? []) {
    if (!role?.name) errors.push('Every role requires a name');
    if (role?.scope && !DATA_SCOPES.includes(role.scope)) errors.push(`Invalid data scope: ${role.scope}`);
  }
  return { valid: errors.length === 0, errors };
}

export function normalizeProjectSpec(spec) {
  const normalized = structuredClone(spec);
  normalized.specVersion ??= PROJECT_SPEC_VERSION;
  normalized.modules ??= [];
  normalized.relationships ??= [];
  normalized.roles ??= [];
  return normalized;
}
