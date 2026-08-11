import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createProjectSpec, validateProjectSpec } from './projectSpec.js';

export async function generateSecurityArtifacts(input, outputDir) {
  const spec = createProjectSpec(input);
  const check = validateProjectSpec(spec);
  if (!check.valid) throw new Error(`Invalid ProjectSpec: ${check.errors.join('; ')}`);
  const root = path.resolve(outputDir);
  const pkg = spec.project.packageName;
  const dir = path.join(root, 'backend/src/main/java', ...pkg.split('.'), 'security');
  await mkdir(dir, { recursive: true });
  const config = `package ${pkg}.security;\n\nimport org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\nimport org.springframework.security.config.annotation.web.builders.HttpSecurity;\nimport org.springframework.security.config.http.SessionCreationPolicy;\nimport org.springframework.security.web.SecurityFilterChain;\n\n@Configuration\npublic class SecurityConfig {\n    @Bean\n    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {\n        http.csrf(csrf -> csrf.disable())\n            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(a -> a.requestMatchers(\"/api/v1/auth/**\", \"/actuator/health\").permitAll().anyRequest().authenticated());\n        return http.build();\n    }\n}`;
  await writeFile(path.join(dir, 'SecurityConfig.java'), config);
  await mkdir(path.join(root, 'config'), { recursive: true });
  await writeFile(path.join(root, 'config', 'security.json'), JSON.stringify({ authentication: spec.project.authentication || 'jwt', roles: spec.roles || [], dataScopes: ['ALL', 'COMPANY', 'BRANCH', 'DEPARTMENT', 'SELF'] }, null, 2));
  return { generated: true, roles: (spec.roles || []).length, authentication: spec.project.authentication || 'jwt' };
}
