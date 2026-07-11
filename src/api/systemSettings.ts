/**
 * Mock API Layer for System Settings
 * 
 * This file simulates backend API calls for organization-wide system settings.
 * Each function includes:
 * - Realistic delay (400-900ms) to simulate network latency
 * - Optional failure path for testing error states
 * - TODO comments for actual backend integration
 */

// TODO: Replace with actual API endpoints when backend is available
// Example: const API_BASE = process.env.VITE_API_BASE_URL + '/api/v1/system-settings';

type Role = 'admin' | 'sales' | 'warehouse' | 'finance';

// Types for system settings
export interface CompanyProfile {
  legalName: string;
  tradingName: string;
  logoUrl: string | null;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  taxNumber: string;
  registrationNumber: string;
  fiscalYearStart: number; // 1-12 for month
  timezone: string;
}

export interface LocalizationSettings {
  defaultLanguage: string;
  defaultCountry: string;
  defaultCurrency: string;
  currencySymbolPosition: 'before' | 'after';
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.' | ' ';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  numberFormat: string;
  defaultTimezone: string;
  rtlEnabled: boolean;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description: string;
}

export interface FinancialSettings {
  defaultCurrency: string;
  taxRates: TaxRate[];
  paymentTerms: string[];
  invoicePrefix: string;
  invoiceStartingNumber: number;
  poPrefix: string;
  poStartingNumber: number;
  defaultInvoiceDueDays: number;
}

export interface SystemUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  createdAt: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'payment' | 'email' | 'accounting' | 'webhook';
  status: 'connected' | 'not-connected' | 'error';
  configuredAt: string | null;
}

export interface NotificationRule {
  id: string;
  event: string;
  enabled: boolean;
  targetRoles: Role[];
  targetEmails: string[];
}

export interface DataManagementSettings {
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'manual';
  retentionMonths: number;
  lastBackup: string | null;
}

export interface BrandingSettings {
  logoUrl: string | null;
  primaryColor: string;
  faviconUrl: string | null;
}

export interface SystemSettings {
  companyProfile: CompanyProfile;
  localization: LocalizationSettings;
  financial: FinancialSettings;
  notifications: NotificationRule[];
  dataManagement: DataManagementSettings;
  branding: BrandingSettings;
}

// Mock data
const mockCompanyProfile: CompanyProfile = {
  legalName: 'Tech Solutions International LLC',
  tradingName: 'Tech Solutions',
  logoUrl: null,
  address: 'Business Bay, Tower 1',
  city: 'Dubai',
  country: 'ARE',
  phone: '+971 4 123 4567',
  email: 'info@techsolutions.com',
  website: 'https://techsolutions.com',
  taxNumber: 'VAT123456789',
  registrationNumber: 'CR-12345-2024',
  fiscalYearStart: 1,
  timezone: 'Asia/Dubai',
};

const mockLocalization: LocalizationSettings = {
  defaultLanguage: 'en-GB',
  defaultCountry: 'ARE',
  defaultCurrency: 'AED',
  currencySymbolPosition: 'before',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  dateFormat: 'DD/MM/YYYY',
  numberFormat: '1,234.56',
  defaultTimezone: 'Asia/Dubai',
  rtlEnabled: false,
};

const mockFinancial: FinancialSettings = {
  defaultCurrency: 'AED',
  taxRates: [
    { id: '1', name: 'Standard VAT', rate: 15, description: 'Standard VAT rate' },
    { id: '2', name: 'Reduced VAT', rate: 5, description: 'Reduced VAT rate for eligible items' },
    { id: '3', name: 'Zero Rated', rate: 0, description: 'Zero-rated items' },
  ],
  paymentTerms: ['Net 30', 'Net 60', 'Net 90', 'Due on Receipt'],
  invoicePrefix: 'INV',
  invoiceStartingNumber: 1001,
  poPrefix: 'PO',
  poStartingNumber: 5001,
  defaultInvoiceDueDays: 30,
};

const mockUsers: SystemUser[] = [
  {
    id: '1',
    email: 'admin@techsolutions.com',
    name: 'System Administrator',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 09:30',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    email: 'sales@techsolutions.com',
    name: 'Sales Manager',
    role: 'sales',
    status: 'active',
    lastLogin: '2024-01-14 14:22',
    createdAt: '2023-03-15',
  },
  {
    id: '3',
    email: 'warehouse@techsolutions.com',
    name: 'Warehouse Lead',
    role: 'warehouse',
    status: 'active',
    lastLogin: '2024-01-15 07:45',
    createdAt: '2023-05-20',
  },
  {
    id: '4',
    email: 'finance@techsolutions.com',
    name: 'Finance Controller',
    role: 'finance',
    status: 'active',
    lastLogin: '2024-01-13 16:50',
    createdAt: '2023-02-10',
  },
];

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Stripe Payment Gateway',
    description: 'Accept credit card payments online',
    category: 'payment',
    status: 'not-connected',
    configuredAt: null,
  },
  {
    id: '2',
    name: 'SMTP Email Service',
    description: 'Send transactional emails via SMTP',
    category: 'email',
    status: 'connected',
    configuredAt: '2023-06-15',
  },
  {
    id: '3',
    name: 'QuickBooks Export',
    description: 'Sync financial data with QuickBooks',
    category: 'accounting',
    status: 'not-connected',
    configuredAt: null,
  },
  {
    id: '4',
    name: 'Custom Webhooks',
    description: 'Configure webhook endpoints for events',
    category: 'webhook',
    status: 'not-connected',
    configuredAt: null,
  },
];

const mockNotifications: NotificationRule[] = [
  {
    id: '1',
    event: 'low_stock_alert',
    enabled: true,
    targetRoles: ['admin', 'warehouse'],
    targetEmails: ['warehouse@techsolutions.com'],
  },
  {
    id: '2',
    event: 'overdue_invoice',
    enabled: true,
    targetRoles: ['admin', 'finance'],
    targetEmails: ['finance@techsolutions.com'],
  },
  {
    id: '3',
    event: 'new_order',
    enabled: true,
    targetRoles: ['admin', 'sales'],
    targetEmails: ['sales@techsolutions.com'],
  },
];

const mockDataManagement: DataManagementSettings = {
  backupFrequency: 'weekly',
  retentionMonths: 12,
  lastBackup: '2024-01-14 02:00',
};

const mockBranding: BrandingSettings = {
  logoUrl: null,
  primaryColor: '#3b82f6',
  faviconUrl: null,
};

const mockSystemSettings: SystemSettings = {
  companyProfile: mockCompanyProfile,
  localization: mockLocalization,
  financial: mockFinancial,
  notifications: mockNotifications,
  dataManagement: mockDataManagement,
  branding: mockBranding,
};

// Helper function to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to simulate occasional failure (10% failure rate by default)
const shouldFail = (failureRate: number = 0.1) => Math.random() < failureRate;

/**
 * Get all system settings
 * TODO: Wire to backend GET /api/v1/system-settings
 */
export async function getSystemSettings(options?: { forceFailure?: boolean }): Promise<SystemSettings> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.05)) {
    throw new Error('Failed to fetch system settings. Please try again.');
  }
  
  return { ...mockSystemSettings };
}

/**
 * Update system settings
 * TODO: Wire to backend PUT /api/v1/system-settings
 */
export async function updateSystemSettings(
  settings: Partial<SystemSettings>,
  options?: { forceFailure?: boolean }
): Promise<SystemSettings> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.08)) {
    throw new Error('Failed to update system settings. Please try again.');
  }
  
  // Update mock data
  Object.assign(mockSystemSettings, settings);
  
  return { ...mockSystemSettings };
}

/**
 * Get all users
 * TODO: Wire to backend GET /api/v1/users
 */
export async function getUsers(options?: { forceFailure?: boolean }): Promise<SystemUser[]> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.05)) {
    throw new Error('Failed to fetch users. Please try again.');
  }
  
  return [...mockUsers];
}

/**
 * Create/invite a new user
 * TODO: Wire to backend POST /api/v1/users
 */
export async function createUser(
  userData: Omit<SystemUser, 'id' | 'lastLogin' | 'createdAt'>,
  options?: { forceFailure?: boolean }
): Promise<SystemUser> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.1)) {
    throw new Error('Failed to create user. Please try again.');
  }
  
  const newUser: SystemUser = {
    ...userData,
    id: String(mockUsers.length + 1),
    lastLogin: '-',
    createdAt: new Date().toISOString().split('T')[0],
  };
  
  mockUsers.push(newUser);
  
  return newUser;
}

/**
 * Update user status
 * TODO: Wire to backend PATCH /api/v1/users/:id/status
 */
export async function updateUserStatus(
  userId: string,
  status: 'active' | 'suspended',
  options?: { forceFailure?: boolean }
): Promise<SystemUser> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.08)) {
    throw new Error('Failed to update user status. Please try again.');
  }
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  mockUsers[userIndex].status = status;
  
  return { ...mockUsers[userIndex] };
}

/**
 * Delete a user
 * TODO: Wire to backend DELETE /api/v1/users/:id
 */
export async function deleteUser(
  userId: string,
  options?: { forceFailure?: boolean }
): Promise<void> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.1)) {
    throw new Error('Failed to delete user. Please try again.');
  }
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  mockUsers.splice(userIndex, 1);
}

/**
 * Get integrations
 * TODO: Wire to backend GET /api/v1/integrations
 */
export async function getIntegrations(options?: { forceFailure?: boolean }): Promise<Integration[]> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.05)) {
    throw new Error('Failed to fetch integrations. Please try again.');
  }
  
  return [...mockIntegrations];
}

/**
 * Connect integration
 * TODO: Wire to backend POST /api/v1/integrations/:id/connect
 */
export async function connectIntegration(
  integrationId: string,
  options?: { forceFailure?: boolean }
): Promise<Integration> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.15)) {
    throw new Error('Failed to connect integration. Please try again.');
  }
  
  const integration = mockIntegrations.find(i => i.id === integrationId);
  if (!integration) {
    throw new Error('Integration not found');
  }
  
  integration.status = 'connected';
  integration.configuredAt = new Date().toISOString().split('T')[0];
  
  return { ...integration };
}

/**
 * Disconnect integration
 * TODO: Wire to backend POST /api/v1/integrations/:id/disconnect
 */
export async function disconnectIntegration(
  integrationId: string,
  options?: { forceFailure?: boolean }
): Promise<Integration> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.1)) {
    throw new Error('Failed to disconnect integration. Please try again.');
  }
  
  const integration = mockIntegrations.find(i => i.id === integrationId);
  if (!integration) {
    throw new Error('Integration not found');
  }
  
  integration.status = 'not-connected';
  integration.configuredAt = null;
  
  return { ...integration };
}

/**
 * Export all company data
 * TODO: Wire to backend POST /api/v1/data/export
 */
export async function exportCompanyData(options?: { forceFailure?: boolean }): Promise<Blob> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.1)) {
    throw new Error('Failed to export data. Please try again.');
  }
  
  // Return a mock blob (in real implementation, this would be actual data)
  const mockData = JSON.stringify(mockSystemSettings, null, 2);
  return new Blob([mockData], { type: 'application/json' });
}

/**
 * Reset all data (demo/sandbox only)
 * TODO: Wire to backend POST /api/v1/data/reset
 */
export async function resetAllData(
  confirmation: string,
  options?: { forceFailure?: boolean }
): Promise<void> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.15)) {
    throw new Error('Failed to reset data. Please try again.');
  }
  
  // In real implementation, this would verify the confirmation matches company name
  // and then reset all data
  console.log('Data reset confirmed with:', confirmation);
}

/**
 * Deactivate workspace
 * TODO: Wire to backend POST /api/v1/workspace/deactivate
 */
export async function deactivateWorkspace(
  confirmation: string,
  options?: { forceFailure?: boolean }
): Promise<void> {
  const delayMs = Math.floor(Math.random() * 500) + 400; // 400-900ms
  
  await delay(delayMs);
  
  if (options?.forceFailure || shouldFail(0.15)) {
    throw new Error('Failed to deactivate workspace. Please try again.');
  }
  
  // In real implementation, this would verify the confirmation matches company name
  // and then deactivate the workspace
  console.log('Workspace deactivation confirmed with:', confirmation);
}
