export function buildBootstrapManifest(spec) {
  const packagePath = spec.project.packageName.replaceAll('.', '/');
  const appName = spec.project.name.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).map((x) => x[0].toUpperCase() + x.slice(1)).join('') || 'Application';
  const dbPort = spec.project.database === 'mysql' ? 3306 : 5432;

  return {
    backend: {
      buildTool: 'maven',
      java: String(spec.project.java),
      framework: 'spring-boot',
      mainClass: `${spec.project.packageName}.${appName}Application`,
      packagePath,
      database: spec.project.database,
      migration: spec.architecture.migration,
      security: spec.architecture.security,
      apiBasePath: '/api/v1',
      swaggerPath: '/swagger-ui.html'
    },
    frontend: {
      framework: 'react',
      bundler: 'vite',
      ui: 'mui',
      router: 'react-router-dom',
      apiClient: 'axios'
    },
    infrastructure: {
      databasePort: dbPort,
      backendPort: 8080,
      dockerCompose: true,
      githubActions: true
    }
  };
}
