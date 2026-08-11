export const COMPANY_MODULE = {
  name: 'Company',
  entity: 'Company',
  fields: 'companyCode, companyName, legalName, email, phone, website, taxNumber, addressLine1, addressLine2, city, state, country, postalCode, active'
};

export function companySeedTemplate() {
  return `INSERT INTO company (company_code, company_name, legal_name, email, phone, website, tax_number, address_line1, address_line2, city, state, country, postal_code, active, created_at)\nVALUES ('COMP001', 'Demo Corporation', 'Demo Corporation Pvt Ltd', 'admin@example.com', '+91-0000000000', 'https://example.com', 'DEMO-TAX-001', 'Main Road', NULL, 'Nagpur', 'Maharashtra', 'India', '440001', TRUE, CURRENT_TIMESTAMP);\n`;
}

export function companyApiReadmeTemplate() {
  return `# Company Module\n\nThe Company module is the organization foundation for the generated application.\n\nEndpoint: /api/v1/company\n\nThe generated module supports pagination, create, read, update and delete operations.\n`;
}
