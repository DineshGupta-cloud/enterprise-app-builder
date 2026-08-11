export const BRANCH_MODULE = {
  name: 'Branch',
  entity: 'Branch',
  fields: 'branchCode, branchName, branchType, managerName, email, phone, addressLine1, addressLine2, city, state, country, postalCode, active'
};

export function branchMigrationTemplate() {
  return `CREATE TABLE branch (
    id BIGINT NOT NULL AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    branch_code VARCHAR(50) NOT NULL,
    branch_name VARCHAR(150) NOT NULL,
    branch_type VARCHAR(50),
    manager_name VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(30),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_branch_company_code UNIQUE (company_id, branch_code),
    CONSTRAINT fk_branch_company FOREIGN KEY (company_id) REFERENCES company(id)
);`;
}

export function branchSeedTemplate() {
  return `INSERT INTO branch (company_id, branch_code, branch_name, branch_type, city, state, country, postal_code, active, created_at)
SELECT id, 'BR001', 'Head Office', 'HEAD_OFFICE', 'Nagpur', 'Maharashtra', 'India', '440001', TRUE, CURRENT_TIMESTAMP
FROM company WHERE company_code = 'COMP001' LIMIT 1;`;
}

export function branchApiReadmeTemplate() {
  return `# Branch Module

A Company owns one or more Branch records.

## Endpoints

- GET /api/v1/branches
- GET /api/v1/branches/{id}
- POST /api/v1/branches
- PUT /api/v1/branches/{id}
- DELETE /api/v1/branches/{id}

Branch creation requires a valid companyId. Branch codes are unique within a company.
`;
}
