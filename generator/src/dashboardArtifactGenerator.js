import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createProjectSpec, validateProjectSpec } from './projectSpec.js';

export async function generateDashboardArtifacts(input, outputDir) {
  const spec = createProjectSpec(input);
  const check = validateProjectSpec(spec);
  if (!check.valid) throw new Error(`Invalid ProjectSpec: ${check.errors.join('; ')}`);
  const root = path.resolve(outputDir);
  const dir = path.join(root, 'frontend/src/dashboard');
  await mkdir(dir, { recursive: true });
  const widgets = spec.dashboard?.widgets || spec.modules.map(m => ({ type: 'TABLE', module: m.name }));
  const page = `import { useEffect, useState } from 'react';\n\nexport default function Dashboard() {\n  const [stats, setStats] = useState([]);\n  useEffect(() => { setStats(${JSON.stringify(widgets)}); }, []);\n  return <main><h1>Dashboard</h1><div>{stats.map((w, i) => <section key={i}><h3>{w.title || w.module || w.type}</h3><p>{w.description || 'Generated dashboard widget'}</p></section>)}</div></main>;\n}`;
  await writeFile(path.join(dir, 'Dashboard.jsx'), page);
  await writeFile(path.join(dir, 'dashboard.json'), JSON.stringify({ widgets }, null, 2));
  return { widgets: widgets.length };
}
