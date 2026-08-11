export function pascalCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

export function camelCase(value) {
  const result = pascalCase(value);
  return result ? result[0].toLowerCase() + result.slice(1) : result;
}

export function kebabCase(value) {
  return camelCase(value).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function sqlName(value) {
  return kebabCase(value).replaceAll('-', '_');
}
