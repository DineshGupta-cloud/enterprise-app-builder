export const SUPPORTED = {
  java: ['17', '21'],
  database: ['mysql', 'postgresql'],
  backend: ['spring-boot'],
  frontend: ['react-mui'],
  security: ['jwt-rbac'],
  migration: ['flyway', 'liquibase']
};

export function validateProjectSpec(spec) {
  const errors = [];
  if (!spec?.project?.name?.trim()) errors.push('project.name is required');
  if (!spec?.project?.packageName?.trim()) errors.push('project.packageName is required');
  if (!SUPPORTED.java.includes(String(spec?.project?.java))) errors.push('Unsupported Java version');
  if (!SUPPORTED.database.includes(spec?.project?.database)) errors.push('Unsupported database');
  if (!SUPPORTED.backend.includes(spec?.architecture?.backend)) errors.push('Unsupported backend');
  if (!SUPPORTED.frontend.includes(spec?.architecture?.frontend)) errors.push('Unsupported frontend');
  if (!SUPPORTED.security.includes(spec?.architecture?.security)) errors.push('Unsupported security');
  if (!Array.isArray(spec?.modules) || spec.modules.length === 0) errors.push('At least one module is required');

  for (const [index, module] of (spec?.modules ?? []).entries()) {
    if (!module.name?.trim()) errors.push(`modules[${index}].name is required`);
    if (!module.entity?.trim()) errors.push(`modules[${index}].entity is required`);
    if (!module.fields?.trim()) errors.push(`modules[${index}].fields is required`);
  }
  return { valid: errors.length === 0, errors };
}

export function normalizeProjectSpec(spec) {
  const normalized = structuredClone(spec);
  normalized.version ??= '0.1.0';
  normalized.modules = (normalized.modules ?? []).map((module) => ({
    ...module,
    name: module.name.trim(),
    entity: module.entity.trim(),
    fields: module.fields.split(',').map((field) => field.trim()).filter(Boolean)
  }));
  return normalized;
}
