/** Canonical enterprise module catalog. ProjectSpec remains the generator source of truth. */
export const STANDARD_MODULES = [
  { key: 'company', name: 'Company', entity: 'Company', group: 'organization', parent: null, fields: ['companyCode','companyName','legalName','email','phone','website','taxNumber','addressLine1','addressLine2','city','state','country','postalCode','active'] },
  { key: 'branch', name: 'Branch', entity: 'Branch', group: 'organization', parent: 'company', fields: ['companyId','branchCode','branchName','branchType','managerName','email','phone','addressLine1','addressLine2','city','state','country','postalCode','active'] },
  { key: 'department', name: 'Department', entity: 'Department', group: 'organization', parent: 'branch', fields: ['branchId','departmentCode','departmentName','description','active'] },
  { key: 'designation', name: 'Designation', entity: 'Designation', group: 'organization', parent: 'department', fields: ['designationCode','designationName','description','level','active'] },
  { key: 'employee', name: 'Employee', entity: 'Employee', group: 'organization', parent: 'designation', fields: ['employeeNumber','departmentId','designationId','firstName','lastName','email','mobile','joiningDate','employmentType','active'] },
  { key: 'user', name: 'User', entity: 'User', group: 'security', parent: 'employee', fields: ['employeeId','username','email','passwordHash','enabled','lastLoginAt'] },
  { key: 'role', name: 'Role', entity: 'Role', group: 'security', parent: null, fields: ['roleCode','roleName','description','active'] },
  { key: 'permission', name: 'Permission', entity: 'Permission', group: 'security', parent: null, fields: ['permissionCode','permissionName','resource','action'] },
  { key: 'customer', name: 'Customer', entity: 'Customer', group: 'crm', parent: 'company', fields: ['customerNumber','name','email','mobile','industry','status','addressLine1','city','state','country','active'] },
  { key: 'lead', name: 'Lead', entity: 'Lead', group: 'crm', parent: 'company', fields: ['leadNumber','name','email','mobile','source','status','priority','assignedTo','expectedValue'] },
  { key: 'vendor', name: 'Vendor', entity: 'Vendor', group: 'crm', parent: 'company', fields: ['vendorNumber','name','email','mobile','category','taxNumber','status','active'] },
  { key: 'product', name: 'Product', entity: 'Product', group: 'crm', parent: 'company', fields: ['productCode','productName','category','unitPrice','taxRate','stockQuantity','active'] },
  { key: 'task', name: 'Task', entity: 'Task', group: 'crm', parent: 'user', fields: ['title','description','assignedTo','priority','status','dueDate','completedAt'] },
  { key: 'activity', name: 'Activity', entity: 'Activity', group: 'crm', parent: 'user', fields: ['activityType','subject','description','relatedType','relatedId','activityAt'] },
  { key: 'note', name: 'Note', entity: 'Note', group: 'crm', parent: 'user', fields: ['title','content','relatedType','relatedId'] },
  { key: 'followUp', name: 'Follow-up', entity: 'FollowUp', group: 'crm', parent: 'lead', fields: ['leadId','followUpAt','type','remarks','status','assignedTo'] }
];

export const STANDARD_ROLES = [
  { code: 'SUPER_ADMIN', name: 'Super Administrator' },
  { code: 'ADMIN', name: 'Administrator' },
  { code: 'MANAGER', name: 'Manager' },
  { code: 'EMPLOYEE', name: 'Employee' },
  { code: 'SALES', name: 'Sales' },
  { code: 'SUPPORT', name: 'Support' }
];

export const STANDARD_PERMISSIONS = [
  'COMPANY_READ','COMPANY_WRITE','BRANCH_READ','BRANCH_WRITE','EMPLOYEE_READ','EMPLOYEE_WRITE',
  'USER_READ','USER_WRITE','ROLE_READ','ROLE_WRITE','CUSTOMER_READ','CUSTOMER_WRITE',
  'LEAD_READ','LEAD_WRITE','VENDOR_READ','VENDOR_WRITE','PRODUCT_READ','PRODUCT_WRITE',
  'TASK_READ','TASK_WRITE','REPORT_READ'
];

export function getStandardModule(key) { return STANDARD_MODULES.find((module) => module.key === key); }
