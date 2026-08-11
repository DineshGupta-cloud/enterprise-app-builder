import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'generator');

test('generator validates the default ProjectSpec', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', '--validate'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /validation passed/i);
});

test('generator produces the expected application structure', () => {
  const output = path.join(root, '.test-generated');
  const result = spawnSync(process.execPath, ['src/cli.js', `--output=${output}`], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(output, 'backend', 'pom.xml')));
  assert.ok(fs.existsSync(path.join(output, 'backend', 'src/main/resources/application.yml')));
  assert.ok(fs.existsSync(path.join(output, 'backend', 'src/main/resources/db/migration/V1__initial_schema.sql')));
  assert.ok(fs.existsSync(path.join(output, 'frontend', 'package.json')));
  assert.ok(fs.existsSync(path.join(output, 'docker-compose.yml')));
  fs.rmSync(output, { recursive: true, force: true });
});
