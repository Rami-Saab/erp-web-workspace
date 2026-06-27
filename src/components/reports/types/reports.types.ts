// ==================== REPORTS MODULE - TYPE DEFINITIONS ====================

// Report status types
export type ReportStatus = 'draft' | 'active' | 'scheduled' | 'archived';

// Report module/category types
export type ReportModule = 'finance' | 'sales' | 'inventory' | 'hr' | 'operations' | 'custom';

// Chart types
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'table';

// Export format types
export type ExportFormat = 'pdf' | 'excel' | 'csv';

// Schedule frequency types
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

// Permission types
export type PermissionLevel = 'view' | 'edit' | 'admin';

// User roles
export type UserRole = 
  | 'admin' 
  | 'erp_manager' 
  | 'business_analyst' 
  | 'department_manager' 
  | 'accounting_hr' 
  | 'auditor';

// Report permissions
export interface ReportPermissions {
  view: boolean;
  edit: boolean;
  download: boolean;
  share: boolean;
}

// View mode types
export type ViewMode = 'card' | 'table';

// Data aggregation types
export type AggregationType = 'sum' | 'average' | 'count' | 'min' | 'max';

// Filter operator types
export type FilterOperator = 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';

// ==================== INTERFACES ====================

// Report interface
export interface Report {
  id: string;
  name: string;
  description: string;
  module: ReportModule;
  status: ReportStatus;
  owner: User;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  tags: string[];
  chartType: ChartType;
  isTemplate: boolean;
  isFavorite: boolean;
  sharedWith: SharedUser[];
  schedule?: ReportSchedule;
  config: ReportConfig;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole | string;
  department?: string;
}

// Shared user with permissions
export interface SharedUser extends User {
  permission: PermissionLevel;
}

// Report schedule interface
export interface ReportSchedule {
  id: string;
  reportId: string;
  frequency: ScheduleFrequency;
  time: string;
  timezone: string;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  recipients: string[];
  format: ExportFormat;
  isActive: boolean;
  nextRunAt: string;
  lastRunAt?: string;
}

// Report configuration
export interface ReportConfig {
  datasetId: string;
  dimensions: ReportField[];
  metrics: ReportField[];
  filters: ReportFilter[];
  sorting: ReportSorting[];
  groupBy?: string[];
  limit?: number;
}

// Report field (dimension or metric)
export interface ReportField {
  id: string;
  name: string;
  label: string;
  type: 'dimension' | 'metric';
  dataType: 'string' | 'number' | 'date' | 'boolean';
  aggregation?: AggregationType;
  format?: string;
  isVisible: boolean;
  order: number;
}

// Report filter
export interface ReportFilter {
  id: string;
  fieldId: string;
  fieldName: string;
  operator: FilterOperator;
  value: string | number | string[] | number[];
  isActive: boolean;
}

// Report sorting
export interface ReportSorting {
  fieldId: string;
  direction: 'asc' | 'desc';
}

// Dataset interface
export interface Dataset {
  id: string;
  name: string;
  description: string;
  module: ReportModule;
  fields: DatasetField[];
}

// Dataset field
export interface DatasetField {
  id: string;
  name: string;
  label: string;
  type: 'dimension' | 'metric';
  dataType: 'string' | 'number' | 'date' | 'boolean';
}

// Report template
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  module: ReportModule;
  thumbnail?: string;
  config: ReportConfig;
  chartType: ChartType;
  tags: string[];
  usageCount: number;
}

// Filter preset
export interface FilterPreset {
  id: string;
  name: string;
  filters: ReportFilter[];
  isDefault: boolean;
}

// Report data row
export interface ReportDataRow {
  [key: string]: string | number | boolean | null;
}

// Chart data point
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// Report execution result
export interface ReportResult {
  reportId: string;
  executedAt: string;
  data: ReportDataRow[];
  chartData: ChartDataPoint[];
  totalRows: number;
  executionTime: number;
}

// Date range
export interface DateRange {
  startDate: string;
  endDate: string;
  preset?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';
}

// Pagination
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Sort config
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Tab types for reports module
export type ReportsTab = 'list' | 'view' | 'create' | 'edit' | 'schedule' | 'templates' | 'shared';

// Builder step types
export type BuilderStep = 'dataset' | 'visualization' | 'preview';

// Module colors for consistent styling
export const MODULE_COLORS: Record<ReportModule, { bg: string; text: string; border: string }> = {
  finance: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-400/30' },
  sales: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/30' },
  inventory: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-400/30' },
  hr: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-400/30' },
  operations: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-400/30' },
  custom: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-400/30' },
};

// Status colors for consistent styling
export const STATUS_COLORS: Record<ReportStatus, { bg: string; text: string; border: string }> = {
  draft: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-400/30' },
  active: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-400/30' },
  scheduled: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/30' },
  archived: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-400/30' },
};

// Chart type icons mapping
export const CHART_ICONS: Record<ChartType, string> = {
  bar: 'BarChart3',
  line: 'LineChart',
  pie: 'PieChart',
  area: 'AreaChart',
  donut: 'PieChart',
  table: 'Table',
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, ReportPermissions> = {
  admin: {
    view: true,
    edit: true,
    download: true,
    share: true,
  },
  erp_manager: {
    view: true,
    edit: true,
    download: true,
    share: true,
  },
  business_analyst: {
    view: true,
    edit: true,
    download: true,
    share: true,
  },
  department_manager: {
    view: true, // for his department
    edit: false, // limited
    download: true,
    share: false, // limited
  },
  accounting_hr: {
    view: true,
    edit: false, // limited
    download: true,
    share: false, // not allowed
  },
  auditor: {
    view: true,
    edit: false, // not allowed
    download: false, // not allowed
    share: false, // not allowed
  },
};

// Helper function to get permissions for a role
export function getReportPermissions(role: UserRole | string): ReportPermissions {
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_') as UserRole;
  return ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.auditor;
}


