import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProject } from '../src/generate.js';

const spec = {
  version: '0.1.0',
  project: { name: 'CRM', packageName: 'com.example.crm', database: 'mysql', java: '17' },
  architecture: { backend: 'spring-boot', frontend: 'react-mui', security: 'jwt-rbac', migration: 'flyway' },
  modules: [{ name: 'Customer', entity: 'Customer', fields: 'name, email, active' }]
};

test('generates a complete module skeleton', () => {
  const result = generateProject(spec);
  assert.equal(result.spec.modules[0].fields.length, 3);
  assert.ok(result.files['backend/src/main/java/com/example/crm/module/customer/entity/Customer.java']);
  assert.ok(result.files['backend/src/main/java/com/example/crm/module/customer/repository/CustomerRepository.java']);
  assert.ok(result.files['backend/src/main/java/com/example/crm/module/customer/controller/CustomerController.java']);
  assert.ok(result.files['backend/src/main/resources/db/migration/V1__create_customer.sql']);
  assert.ok(result.files['frontend/src/modules/customer/CustomerList.jsx']);
});

test('rejects an invalid specification', () => {
  assert.throws(() => generateProject({ project: {}, architecture: {}, modules: [] }), /Invalid project specification/);
});
