// ==================== REPORTS MODULE - MOCK DATA ====================

import type {
  Report,
  User,
  Dataset,
  ReportTemplate,
  FilterPreset,
  ReportDataRow,
  ChartDataPoint,
  ReportSchedule,
  ReportModule,
} from '../types/reports.types';

// ==================== MOCK USERS ====================
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Ahmed Hassan', email: 'ahmed.h@company.com', avatar: undefined, role: 'Admin' },
  { id: 'user-2', name: 'Fatima Ali', email: 'fatima.a@company.com', avatar: undefined, role: 'Manager' },
  { id: 'user-3', name: 'Mohamed Saeed', email: 'mohamed.s@company.com', avatar: undefined, role: 'Analyst' },
  { id: 'user-4', name: 'Sara Ibrahim', email: 'sara.i@company.com', avatar: undefined, role: 'Accountant' },
  { id: 'user-5', name: 'Omar Khalil', email: 'omar.k@company.com', avatar: undefined, role: 'Sales Rep' },
  { id: 'user-6', name: 'Layla Ahmed', email: 'layla.a@company.com', avatar: undefined, role: 'HR Manager' },
  { id: 'user-7', name: 'Khalid Mansour', email: 'khalid.m@company.com', avatar: undefined, role: 'Developer' },
  { id: 'user-8', name: 'Noura Al-Zahra', email: 'noura.z@company.com', avatar: undefined, role: 'Designer' },
  { id: 'user-9', name: 'Youssef Hamdi', email: 'youssef.h@company.com', avatar: undefined, role: 'Marketing' },
  { id: 'user-10', name: 'Mariam Fadel', email: 'mariam.f@company.com', avatar: undefined, role: 'Accountant' },
  { id: 'user-11', name: 'Tariq Nasser', email: 'tariq.n@company.com', avatar: undefined, role: 'Sales Rep' },
  { id: 'user-12', name: 'Hala Salim', email: 'hala.s@company.com', avatar: undefined, role: 'Manager' },
  { id: 'user-13', name: 'Bassam Karim', email: 'bassam.k@company.com', avatar: undefined, role: 'Analyst' },
  { id: 'user-14', name: 'Rania Taha', email: 'rania.t@company.com', avatar: undefined, role: 'HR Manager' },
  { id: 'user-15', name: 'Fadi Rizk', email: 'fadi.r@company.com', avatar: undefined, role: 'Developer' },
  { id: 'user-16', name: 'Dina Malek', email: 'dina.m@company.com', avatar: undefined, role: 'Designer' },
  { id: 'user-17', name: 'Ziad Farid', email: 'ziad.f@company.com', avatar: undefined, role: 'Marketing' },
  { id: 'user-18', name: 'Lina Samir', email: 'lina.s@company.com', avatar: undefined, role: 'Accountant' },
  { id: 'user-19', name: 'Waleed Amin', email: 'waleed.a@company.com', avatar: undefined, role: 'Sales Rep' },
  { id: 'user-20', name: 'Nada Hisham', email: 'nada.h@company.com', avatar: undefined, role: 'Manager' },
  { id: 'user-21', name: 'Rami Saad', email: 'rami.s@company.com', avatar: undefined, role: 'Analyst' },
  { id: 'user-22', name: 'Salma Youssef', email: 'salma.y@company.com', avatar: undefined, role: 'HR Manager' },
  { id: 'user-23', name: 'Karim Badr', email: 'karim.b@company.com', avatar: undefined, role: 'Developer' },
  { id: 'user-24', name: 'Nour Haddad', email: 'nour.h@company.com', avatar: undefined, role: 'Designer' },
  { id: 'user-25', name: 'Majed Zaki', email: 'majed.z@company.com', avatar: undefined, role: 'Marketing' },
  { id: 'user-26', name: 'Reem Farouk', email: 'reem.f@company.com', avatar: undefined, role: 'Accountant' },
  { id: 'user-27', name: 'Samir Nasr', email: 'samir.n@company.com', avatar: undefined, role: 'Sales Rep' },
  { id: 'user-28', name: 'Hanan Maher', email: 'hanan.m@company.com', avatar: undefined, role: 'Manager' },
  { id: 'user-29', name: 'Adel Shaker', email: 'adel.s@company.com', avatar: undefined, role: 'Analyst' },
  { id: 'user-30', name: 'Yasmin Reda', email: 'yasmin.r@company.com', avatar: undefined, role: 'HR Manager' },
];

// ==================== MOCK REPORTS ====================
export const mockReports: Report[] = [
  {
    id: 'rpt-001',
    name: 'Monthly Sales Performance',
    description: 'Comprehensive monthly sales analysis with regional breakdown and product categories',
    module: 'sales',
    status: 'active',
    owner: mockUsers[0],
    createdAt: '2024-10-15T09:00:00Z',
    updatedAt: '2024-12-10T14:30:00Z',
    lastRunAt: '2024-12-15T08:00:00Z',
    tags: ['Sales', 'Monthly', 'Performance'],
    chartType: 'bar',
    isTemplate: false,
    isFavorite: true,
    sharedWith: [
      { ...mockUsers[1], permission: 'edit' },
      { ...mockUsers[2], permission: 'view' },
      { ...mockUsers[3], permission: 'view' },
      { ...mockUsers[4], permission: 'view' },
      { ...mockUsers[5], permission: 'view' },
      { ...mockUsers[6], permission: 'view' },
      { ...mockUsers[7], permission: 'view' },
      { ...mockUsers[8], permission: 'view' },
      { ...mockUsers[9], permission: 'view' },
      { ...mockUsers[10], permission: 'view' },
      { ...mockUsers[11], permission: 'view' },
      { ...mockUsers[12], permission: 'view' },
      { ...mockUsers[13], permission: 'view' },
      { ...mockUsers[14], permission: 'view' },
      { ...mockUsers[15], permission: 'view' },
      { ...mockUsers[16], permission: 'view' },
      { ...mockUsers[17], permission: 'view' },
      { ...mockUsers[18], permission: 'view' },
      { ...mockUsers[19], permission: 'view' },
      { ...mockUsers[20], permission: 'view' },
      { ...mockUsers[21], permission: 'view' },
      { ...mockUsers[22], permission: 'view' },
      { ...mockUsers[23], permission: 'view' },
      { ...mockUsers[24], permission: 'view' },
      { ...mockUsers[25], permission: 'view' },
      { ...mockUsers[26], permission: 'view' },
      { ...mockUsers[27], permission: 'view' },
      { ...mockUsers[28], permission: 'view' },
      { ...mockUsers[29], permission: 'view' },
    ],
    config: {
      datasetId: 'ds-sales',
      dimensions: [
        { id: 'dim-1', name: 'region', label: 'Region', type: 'dimension', dataType: 'string', isVisible: true, order: 1 },
        { id: 'dim-2', name: 'product_category', label: 'Product Category', type: 'dimension', dataType: 'string', isVisible: true, order: 2 },
      ],
      metrics: [
        { id: 'met-1', name: 'total_sales', label: 'Total Sales', type: 'metric', dataType: 'number', aggregation: 'sum', format: 'currency', isVisible: true, order: 1 },
        { id: 'met-2', name: 'order_count', label: 'Orders', type: 'metric', dataType: 'number', aggregation: 'count', isVisible: true, order: 2 },
      ],
      filters: [],
      sorting: [{ fieldId: 'met-1', direction: 'desc' }],
    },
  },
  {
    id: 'rpt-002',
    name: 'Inventory Aging Analysis',
    description: 'Track inventory age and identify slow-moving items across warehouses',
    module: 'inventory',
    status: 'active',
    owner: mockUsers[1],
    createdAt: '2024-09-20T11:00:00Z',
    updatedAt: '2024-12-08T16:45:00Z',
    lastRunAt: '2024-12-14T10:00:00Z',
    tags: ['Inventory', 'Aging', 'Warehouse'],
    chartType: 'pie',
    isTemplate: false,
    isFavorite: false,
    sharedWith: [{ ...mockUsers[3], permission: 'view' }],
    config: {
      datasetId: 'ds-inventory',
      dimensions: [
        { id: 'dim-3', name: 'warehouse', label: 'Warehouse', type: 'dimension', dataType: 'string', isVisible: true, order: 1 },
        { id: 'dim-4', name: 'age_bucket', label: 'Age Bucket', type: 'dimension', dataType: 'string', isVisible: true, order: 2 },
      ],
      metrics: [
        { id: 'met-3', name: 'item_count', label: 'Item Count', type: 'metric', dataType: 'number', aggregation: 'count', isVisible: true, order: 1 },
        { id: 'met-4', name: 'total_value', label: 'Total Value', type: 'metric', dataType: 'number', aggregation: 'sum', format: 'currency', isVisible: true, order: 2 },
      ],
      filters: [],
      sorting: [{ fieldId: 'dim-4', direction: 'asc' }],
    },
  },
  {
    id: 'rpt-003',
    name: 'Employee Performance Dashboard',
    description: 'Track employee KPIs, attendance, and productivity metrics',
    module: 'hr',
    status: 'scheduled',
    owner: mockUsers[5],
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-12-12T09:15:00Z',
    lastRunAt: '2024-12-13T06:00:00Z',
    tags: ['HR', 'Performance', 'KPI'],
    chartType: 'line',
    isTemplate: false,
    isFavorite: true,
    sharedWith: [
      { ...mockUsers[0], permission: 'admin' },
      { ...mockUsers[1], permission: 'view' },
    ],
    schedule: {
      id: 'sch-001',
      reportId: 'rpt-003',
      frequency: 'weekly',
      time: '06:00',
      timezone: 'Asia/Riyadh',
      dayOfWeek: 1,
      recipients: ['ahmed.h@company.com', 'fatima.a@company.com'],
      format: 'pdf',
      isActive: true,
      nextRunAt: '2024-12-16T06:00:00Z',
      lastRunAt: '2024-12-09T06:00:00Z',
    },
    config: {
      datasetId: 'ds-hr',
      dimensions: [
        { id: 'dim-5', name: 'department', label: 'Department', type: 'dimension', dataType: 'string', isVisible: true, order: 1 },
        { id: 'dim-6', name: 'month', label: 'Month', type: 'dimension', dataType: 'date', isVisible: true, order: 2 },
      ],
      metrics: [
        { id: 'met-5', name: 'avg_performance', label: 'Avg Performance Score', type: 'metric', dataType: 'number', aggregation: 'average', isVisible: true, order: 1 },
        { id: 'met-6', name: 'attendance_rate', label: 'Attendance Rate %', type: 'metric', dataType: 'number', aggregation: 'average', format: 'percent', isVisible: true, order: 2 },
      ],
      filters: [],
      sorting: [{ fieldId: 'dim-6', direction: 'asc' }],
    },
  },
  {
    id: 'rpt-004',
    name: 'Profit & Loss Statement',
    description: 'Monthly P&L report with revenue, expenses, and net profit analysis',
    module: 'finance',
    status: 'active',
    owner: mockUsers[3],
    createdAt: '2024-08-10T10:00:00Z',
    updatedAt: '2024-12-11T17:00:00Z',
    lastRunAt: '2024-12-15T07:00:00Z',
    tags: ['Finance', 'P&L', 'Monthly'],
    chartType: 'area',
    isTemplate: true,
    isFavorite: true,
    sharedWith: [
      { ...mockUsers[0], permission: 'admin' },
      { ...mockUsers[1], permission: 'edit' },
    ],
    config: {
      datasetId: 'ds-finance',
      dimensions: [
        { id: 'dim-7', name: 'month', label: 'Month', type: 'dimension', dataType: 'date', isVisible: true, order: 1 },
        { id: 'dim-8', name: 'category', label: 'Category', type: 'dimension', dataType: 'string', isVisible: true, order: 2 },
      ],
      metrics: [
        { id: 'met-7', name: 'revenue', label: 'Revenue', type: 'metric', dataType: 'number', aggregation: 'sum', format: 'currency', isVisible: true, order: 1 },
        { id: 'met-8', name: 'expenses', label: 'Expenses', type: 'metric', dataType: 'number', aggregation: 'sum', format: 'currency', isVisible: true, order: 2 },
        { id: 'met-9', name: 'net_profit', label: 'Net Profit', type: 'metric', dataType: 'number', aggregation: 'sum', format: 'currency', isVisible: true, order: 3 },
      ],
      filters: [],
      sorting: [{ fieldId: 'dim-7', direction: 'asc' }],
    },
  },
  {
    id: 'rpt-005',
    name: 'Operations Efficiency Report',
    description: 'Track production efficiency, downtime, and resource utilization',
    module: 'operations',
    status: 'draft',
    owner: mockUsers[2],
    createdAt: '2024-12-01T14:00:00Z',
    updatedAt: '2024-12-14T11:30:00Z',
    tags: ['Operations', 'Efficiency', 'Production'],
    chartType: 'bar',
    isTemplate: false,
    isFavorite: false,
    sharedWith: [],
    config: {
      datasetId: 'ds-operations',
      dimensions: [
        { id: 'dim-9', name: 'production_line', label: 'Production Line', type: 'dimension', dataType: 'string', isVisible: true, order: 1 },
        { id: 'dim-10', name: 'shift', label: 'Shift', type: 'dimension', dataType: 'string', isVisible: true, order: 2 },
      ],
      metrics: [
        { id: 'met-10', name: 'efficiency_rate', label: 'Efficiency Rate %', type: 'metric', dataType: 'number', aggregation: 'average', format: 'percent', isVisible: true, order: 1 },
        { id: 'met-11', name: 'downtime_hours', label: 'Downtime (Hours)', type: 'metric', dataType: 'number', aggregation: 'sum', isVisible: true, order: 2 },
      ],
      filters: [],
      sorting: [{ fieldId: 'met-10', direction: 'desc' }],
    },
  },
  {
    id: 'rpt-006',
    name: 'Customer Acquisition Report',
    description: 'Track new customer acquisition channels and conversion rates',
    module: 'sales',
    status: 'active',
    owner: mockUsers[4],
    createdAt: '2024-11-15T09:30:00Z',
    updatedAt: '2024-12-13T15:00:00Z',
    lastRunAt: '2024-12-14T12:00:00Z',
    tags: ['Sales', 'Customers', 'Acquisition'],
    chartType: 'donut',
    isTemplate: false,
    isFavorite: false,
    sharedWith: [{ ...mockUsers[0], permission: 'view' }],
    config: {
      datasetId: 'ds-sales',
      dimensions: [
        { id: 'dim-11', name: 'acquisition_channel', label: 'Acquisition Channel', type: 'dimension', dataType: 'string', isVisible: true, order: 1 },
      ],
      metrics: [
        { id: 'met-12', name: 'new_customers', label: 'New Customers', type: 'metric', dataType: 'number', aggregation: 'count', isVisible: true, order: 1 },
        { id: 'met-13', name: 'conversion_rate', label: 'Conversion Rate %', type: 'metric', dataType: 'number', aggregation: 'average', format: 'percent', isVisible: true, order: 2 },
      ],
      filters: [],
      sorting: [{ fieldId: 'met-12', direction: 'desc' }],
    },
  },
  {
    id: 'rpt-007',
    name: 'Accounts Receivable Aging',
    description: 'Monitor outstanding receivables by age bucket and customer',
    module: 'finance',
    status: 'scheduled',
    owner: mockUsers[3],
    createdAt: '2024-10-01T08:00:00Z',
    updatedAt: '2024-12-10T10:00:00Z',
    lastRunAt: '2024-12-14T08:00:00Z',
    tags: ['Finance', 'AR', 'Aging'],
    chartType: 'bar',
    isTemplate: false,
    isFavorite: true,
    sharedWith: [
      { ...mockUsers[0], permission: 'admin' },
      { ...mockUsers[1], permission: 'edit' },
    ],
    schedule: {
      id: 'sch-002',
      reportId: 'rpt-007',
      frequency: 'daily',
      time: '08:00',
      timezone: 'Asia/Riyadh',
      recipients: ['sara.i@company.com', 'ahmed.h@company.com'],
      format: 'excel',
      isActive: true,
      nextRunAt: '2024-12-16T08:00:00Z',
      lastRunAt: '2024-12-15T08:00:00Z',
    },
    config: {
      datasetId: 'ds-finance',
      dimensions: [
        { id: 'dim-12', name: 'customer', label: 'Customer', type: 'dimension', dataType: 'string', isVisible: true, order: 1 },
        { id: 'dim-13', name: 'age_bucket', label: 'Age Bucket', type: 'dimension', dataType: 'string', isVisible: true, order: 2 },
      ],
      metrics: [
        { id: 'met-14', name: 'outstanding_amount', label: 'Outstanding Amount', type: 'metric', dataType: 'number', aggregation: 'sum', format: 'currency', isVisible: true, order: 1 },
        { id: 'met-15', name: 'invoice_count', label: 'Invoice Count', type: 'metric', dataType: 'number', aggregation: 'count', isVisible: true, order: 2 },
      ],
      filters: [],
      sorting: [{ fieldId: 'met-14', direction: 'desc' }],
    },
  },
  {
    id: 'rpt-008',
    name: 'Stock Reorder Report',
    description: 'Identify items that need to be reordered based on current stock levels',
    module: 'inventory',
    status: 'active',
    owner: mockUsers[1],
    createdAt: '2024-09-15T11:00:00Z',
    updatedAt: '2024-12-12T14:00:00Z',
    lastRunAt: '2024-12-15T06:00:00Z',
    tags: ['Inventory', 'Reorder', 'Stock'],
    chartType: 'table',
    isTemplate: false,
    isFavorite: false,
    sharedWith: [{ ...mockUsers[2], permission: 'view' }],
    config: {
      datasetId: 'ds-inventory',
      dimensions: [
        { id: 'dim-14', name: 'product_name', label: 'Product Name', type: 'dimension', dataType: 'string', isVisible: true, order: 1 },
        { id: 'dim-15', name: 'warehouse', label: 'Warehouse', type: 'dimension', dataType: 'string', isVisible: true, order: 2 },
      ],
      metrics: [
        { id: 'met-16', name: 'current_stock', label: 'Current Stock', type: 'metric', dataType: 'number', aggregation: 'sum', isVisible: true, order: 1 },
        { id: 'met-17', name: 'reorder_point', label: 'Reorder Point', type: 'metric', dataType: 'number', aggregation: 'min', isVisible: true, order: 2 },
        { id: 'met-18', name: 'suggested_order', label: 'Suggested Order Qty', type: 'metric', dataType: 'number', aggregation: 'sum', isVisible: true, order: 3 },
      ],
      filters: [],
      sorting: [{ fieldId: 'met-16', direction: 'asc' }],
    },
  },
];

// ==================== MOCK DATASETS ====================
export const mockDatasets: Dataset[] = [
  {
    id: 'ds-sales',
    name: 'Sales Data',
    description: 'Comprehensive sales transactions and customer data',
    module: 'sales',
    fields: [
      { id: 'f1', name: 'order_id', label: 'Order ID', type: 'dimension', dataType: 'string' },
      { id: 'f2', name: 'order_date', label: 'Order Date', type: 'dimension', dataType: 'date' },
      { id: 'f3', name: 'customer_name', label: 'Customer Name', type: 'dimension', dataType: 'string' },
      { id: 'f4', name: 'region', label: 'Region', type: 'dimension', dataType: 'string' },
      { id: 'f5', name: 'product_category', label: 'Product Category', type: 'dimension', dataType: 'string' },
      { id: 'f6', name: 'product_name', label: 'Product Name', type: 'dimension', dataType: 'string' },
      { id: 'f7', name: 'acquisition_channel', label: 'Acquisition Channel', type: 'dimension', dataType: 'string' },
      { id: 'f8', name: 'sales_rep', label: 'Sales Rep', type: 'dimension', dataType: 'string' },
      { id: 'f9', name: 'total_sales', label: 'Total Sales', type: 'metric', dataType: 'number' },
      { id: 'f10', name: 'quantity', label: 'Quantity', type: 'metric', dataType: 'number' },
      { id: 'f11', name: 'discount', label: 'Discount', type: 'metric', dataType: 'number' },
      { id: 'f12', name: 'profit', label: 'Profit', type: 'metric', dataType: 'number' },
    ],
  },
  {
    id: 'ds-inventory',
    name: 'Inventory Data',
    description: 'Stock levels, warehouse data, and inventory movements',
    module: 'inventory',
    fields: [
      { id: 'f13', name: 'product_id', label: 'Product ID', type: 'dimension', dataType: 'string' },
      { id: 'f14', name: 'product_name', label: 'Product Name', type: 'dimension', dataType: 'string' },
      { id: 'f15', name: 'category', label: 'Category', type: 'dimension', dataType: 'string' },
      { id: 'f16', name: 'warehouse', label: 'Warehouse', type: 'dimension', dataType: 'string' },
      { id: 'f17', name: 'age_bucket', label: 'Age Bucket', type: 'dimension', dataType: 'string' },
      { id: 'f18', name: 'supplier', label: 'Supplier', type: 'dimension', dataType: 'string' },
      { id: 'f19', name: 'current_stock', label: 'Current Stock', type: 'metric', dataType: 'number' },
      { id: 'f20', name: 'reorder_point', label: 'Reorder Point', type: 'metric', dataType: 'number' },
      { id: 'f21', name: 'unit_cost', label: 'Unit Cost', type: 'metric', dataType: 'number' },
      { id: 'f22', name: 'total_value', label: 'Total Value', type: 'metric', dataType: 'number' },
    ],
  },
  {
    id: 'ds-finance',
    name: 'Finance Data',
    description: 'Financial transactions, accounts, and statements',
    module: 'finance',
    fields: [
      { id: 'f23', name: 'transaction_id', label: 'Transaction ID', type: 'dimension', dataType: 'string' },
      { id: 'f24', name: 'date', label: 'Date', type: 'dimension', dataType: 'date' },
      { id: 'f25', name: 'month', label: 'Month', type: 'dimension', dataType: 'date' },
      { id: 'f26', name: 'account', label: 'Account', type: 'dimension', dataType: 'string' },
      { id: 'f27', name: 'category', label: 'Category', type: 'dimension', dataType: 'string' },
      { id: 'f28', name: 'customer', label: 'Customer', type: 'dimension', dataType: 'string' },
      { id: 'f29', name: 'age_bucket', label: 'Age Bucket', type: 'dimension', dataType: 'string' },
      { id: 'f30', name: 'revenue', label: 'Revenue', type: 'metric', dataType: 'number' },
      { id: 'f31', name: 'expenses', label: 'Expenses', type: 'metric', dataType: 'number' },
      { id: 'f32', name: 'net_profit', label: 'Net Profit', type: 'metric', dataType: 'number' },
      { id: 'f33', name: 'outstanding_amount', label: 'Outstanding Amount', type: 'metric', dataType: 'number' },
    ],
  },
  {
    id: 'ds-hr',
    name: 'HR Data',
    description: 'Employee information, attendance, and performance data',
    module: 'hr',
    fields: [
      { id: 'f34', name: 'employee_id', label: 'Employee ID', type: 'dimension', dataType: 'string' },
      { id: 'f35', name: 'employee_name', label: 'Employee Name', type: 'dimension', dataType: 'string' },
      { id: 'f36', name: 'department', label: 'Department', type: 'dimension', dataType: 'string' },
      { id: 'f37', name: 'position', label: 'Position', type: 'dimension', dataType: 'string' },
      { id: 'f38', name: 'month', label: 'Month', type: 'dimension', dataType: 'date' },
      { id: 'f39', name: 'performance_score', label: 'Performance Score', type: 'metric', dataType: 'number' },
      { id: 'f40', name: 'attendance_rate', label: 'Attendance Rate', type: 'metric', dataType: 'number' },
      { id: 'f41', name: 'salary', label: 'Salary', type: 'metric', dataType: 'number' },
      { id: 'f42', name: 'bonus', label: 'Bonus', type: 'metric', dataType: 'number' },
    ],
  },
  {
    id: 'ds-operations',
    name: 'Operations Data',
    description: 'Production lines, efficiency metrics, and operational data',
    module: 'operations',
    fields: [
      { id: 'f43', name: 'production_line', label: 'Production Line', type: 'dimension', dataType: 'string' },
      { id: 'f44', name: 'shift', label: 'Shift', type: 'dimension', dataType: 'string' },
      { id: 'f45', name: 'date', label: 'Date', type: 'dimension', dataType: 'date' },
      { id: 'f46', name: 'product', label: 'Product', type: 'dimension', dataType: 'string' },
      { id: 'f47', name: 'operator', label: 'Operator', type: 'dimension', dataType: 'string' },
      { id: 'f48', name: 'units_produced', label: 'Units Produced', type: 'metric', dataType: 'number' },
      { id: 'f49', name: 'efficiency_rate', label: 'Efficiency Rate', type: 'metric', dataType: 'number' },
      { id: 'f50', name: 'downtime_hours', label: 'Downtime Hours', type: 'metric', dataType: 'number' },
      { id: 'f51', name: 'defect_rate', label: 'Defect Rate', type: 'metric', dataType: 'number' },
    ],
  },
];

// ==================== MOCK TEMPLATES ====================
export const mockTemplates: ReportTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Sales Performance Dashboard',
    description: 'Pre-configured sales performance report with key metrics',
    module: 'sales',
    chartType: 'bar',
    tags: ['Sales', 'Performance', 'Dashboard'],
    usageCount: 45,
    config: {
      datasetId: 'ds-sales',
      dimensions: [{ id: 'dim-1', name: 'region', label: 'Region', type: 'dimension', dataType: 'string', isVisible: true, order: 1 }],
      metrics: [{ id: 'met-1', name: 'total_sales', label: 'Total Sales', type: 'metric', dataType: 'number', aggregation: 'sum', isVisible: true, order: 1 }],
      filters: [],
      sorting: [],
    },
  },
  {
    id: 'tpl-002',
    name: 'Inventory Overview',
    description: 'Standard inventory status and aging report',
    module: 'inventory',
    chartType: 'pie',
    tags: ['Inventory', 'Stock', 'Overview'],
    usageCount: 32,
    config: {
      datasetId: 'ds-inventory',
      dimensions: [{ id: 'dim-2', name: 'warehouse', label: 'Warehouse', type: 'dimension', dataType: 'string', isVisible: true, order: 1 }],
      metrics: [{ id: 'met-2', name: 'current_stock', label: 'Current Stock', type: 'metric', dataType: 'number', aggregation: 'sum', isVisible: true, order: 1 }],
      filters: [],
      sorting: [],
    },
  },
  {
    id: 'tpl-003',
    name: 'Monthly P&L Statement',
    description: 'Standard profit and loss statement template',
    module: 'finance',
    chartType: 'area',
    tags: ['Finance', 'P&L', 'Monthly'],
    usageCount: 78,
    config: {
      datasetId: 'ds-finance',
      dimensions: [{ id: 'dim-3', name: 'month', label: 'Month', type: 'dimension', dataType: 'date', isVisible: true, order: 1 }],
      metrics: [
        { id: 'met-3', name: 'revenue', label: 'Revenue', type: 'metric', dataType: 'number', aggregation: 'sum', isVisible: true, order: 1 },
        { id: 'met-4', name: 'expenses', label: 'Expenses', type: 'metric', dataType: 'number', aggregation: 'sum', isVisible: true, order: 2 },
      ],
      filters: [],
      sorting: [],
    },
  },
  {
    id: 'tpl-004',
    name: 'Employee Performance Tracker',
    description: 'Track employee KPIs and performance over time',
    module: 'hr',
    chartType: 'line',
    tags: ['HR', 'Performance', 'KPI'],
    usageCount: 23,
    config: {
      datasetId: 'ds-hr',
      dimensions: [{ id: 'dim-4', name: 'department', label: 'Department', type: 'dimension', dataType: 'string', isVisible: true, order: 1 }],
      metrics: [{ id: 'met-5', name: 'performance_score', label: 'Performance Score', type: 'metric', dataType: 'number', aggregation: 'average', isVisible: true, order: 1 }],
      filters: [],
      sorting: [],
    },
  },
  {
    id: 'tpl-005',
    name: 'Production Efficiency Report',
    description: 'Monitor production line efficiency and downtime',
    module: 'operations',
    chartType: 'bar',
    tags: ['Operations', 'Efficiency', 'Production'],
    usageCount: 18,
    config: {
      datasetId: 'ds-operations',
      dimensions: [{ id: 'dim-5', name: 'production_line', label: 'Production Line', type: 'dimension', dataType: 'string', isVisible: true, order: 1 }],
      metrics: [{ id: 'met-6', name: 'efficiency_rate', label: 'Efficiency Rate', type: 'metric', dataType: 'number', aggregation: 'average', isVisible: true, order: 1 }],
      filters: [],
      sorting: [],
    },
  },
];

// ==================== MOCK FILTER PRESETS ====================
export const mockFilterPresets: FilterPreset[] = [
  {
    id: 'fp-001',
    name: 'This Month',
    filters: [
      { id: 'f1', fieldId: 'date', fieldName: 'Date', operator: 'between', value: ['2024-12-01', '2024-12-31'], isActive: true },
    ],
    isDefault: true,
  },
  {
    id: 'fp-002',
    name: 'Last Quarter',
    filters: [
      { id: 'f2', fieldId: 'date', fieldName: 'Date', operator: 'between', value: ['2024-09-01', '2024-11-30'], isActive: true },
    ],
    isDefault: false,
  },
  {
    id: 'fp-003',
    name: 'High Value Only',
    filters: [
      { id: 'f3', fieldId: 'total_sales', fieldName: 'Total Sales', operator: 'greaterThan', value: 10000, isActive: true },
    ],
    isDefault: false,
  },
];

// ==================== MOCK SCHEDULES ====================
export const mockSchedules: ReportSchedule[] = [
  {
    id: 'sch-001',
    reportId: 'rpt-003',
    frequency: 'weekly',
    time: '06:00',
    timezone: 'Asia/Riyadh',
    dayOfWeek: 1,
    recipients: ['ahmed.h@company.com', 'fatima.a@company.com'],
    format: 'pdf',
    isActive: true,
    nextRunAt: '2024-12-16T06:00:00Z',
    lastRunAt: '2024-12-09T06:00:00Z',
  },
  {
    id: 'sch-002',
    reportId: 'rpt-007',
    frequency: 'daily',
    time: '08:00',
    timezone: 'Asia/Riyadh',
    recipients: ['sara.i@company.com', 'ahmed.h@company.com'],
    format: 'excel',
    isActive: true,
    nextRunAt: '2024-12-16T08:00:00Z',
    lastRunAt: '2024-12-15T08:00:00Z',
  },
  {
    id: 'sch-003',
    reportId: 'rpt-001',
    frequency: 'monthly',
    time: '07:00',
    timezone: 'Asia/Riyadh',
    dayOfMonth: 1,
    recipients: ['mohamed.s@company.com', 'omar.k@company.com'],
    format: 'pdf',
    isActive: false,
    nextRunAt: '2025-01-01T07:00:00Z',
    lastRunAt: '2024-12-01T07:00:00Z',
  },
  {
    id: 'sch-004',
    reportId: 'rpt-002',
    frequency: 'daily',
    time: '09:00',
    timezone: 'Asia/Riyadh',
    recipients: ['layla.a@company.com', 'sara.i@company.com', 'mohamed.s@company.com'],
    format: 'csv',
    isActive: true,
    nextRunAt: '2024-12-16T09:00:00Z',
    lastRunAt: '2024-12-15T09:00:00Z',
  },
  {
    id: 'sch-005',
    reportId: 'rpt-004',
    frequency: 'weekly',
    time: '10:00',
    timezone: 'Asia/Riyadh',
    dayOfWeek: 3,
    recipients: ['omar.k@company.com', 'fatima.a@company.com'],
    format: 'excel',
    isActive: true,
    nextRunAt: '2024-12-18T10:00:00Z',
    lastRunAt: '2024-12-11T10:00:00Z',
  },
  {
    id: 'sch-006',
    reportId: 'rpt-005',
    frequency: 'monthly',
    time: '08:30',
    timezone: 'Asia/Riyadh',
    dayOfMonth: 15,
    recipients: ['ahmed.h@company.com', 'layla.a@company.com', 'sara.i@company.com'],
    format: 'pdf',
    isActive: false,
    nextRunAt: '2025-01-15T08:30:00Z',
    lastRunAt: '2024-12-15T08:30:00Z',
  },
];

// ==================== MOCK CHART DATA ====================
export const mockSalesChartData: ChartDataPoint[] = [
  { label: 'Jan', value: 125000, color: '#3b82f6' },
  { label: 'Feb', value: 142000, color: '#3b82f6' },
  { label: 'Mar', value: 168000, color: '#3b82f6' },
  { label: 'Apr', value: 155000, color: '#3b82f6' },
  { label: 'May', value: 189000, color: '#3b82f6' },
  { label: 'Jun', value: 201000, color: '#3b82f6' },
  { label: 'Jul', value: 195000, color: '#3b82f6' },
  { label: 'Aug', value: 212000, color: '#3b82f6' },
  { label: 'Sep', value: 228000, color: '#3b82f6' },
  { label: 'Oct', value: 245000, color: '#3b82f6' },
  { label: 'Nov', value: 267000, color: '#3b82f6' },
  { label: 'Dec', value: 289000, color: '#3b82f6' },
];

export const mockInventoryChartData: ChartDataPoint[] = [
  { label: '0-30 Days', value: 45, color: '#22c55e' },
  { label: '31-60 Days', value: 28, color: '#3b82f6' },
  { label: '61-90 Days', value: 15, color: '#f59e0b' },
  { label: '90+ Days', value: 12, color: '#ef4444' },
];

export const mockRegionChartData: ChartDataPoint[] = [
  { label: 'Riyadh', value: 450000, color: '#3b82f6' },
  { label: 'Jeddah', value: 320000, color: '#22c55e' },
  { label: 'Dammam', value: 180000, color: '#f59e0b' },
  { label: 'Makkah', value: 150000, color: '#8b5cf6' },
  { label: 'Madinah', value: 120000, color: '#ec4899' },
];

// ==================== MOCK TABLE DATA ====================
export const mockSalesTableData: ReportDataRow[] = [
  { id: 1, region: 'Riyadh', product_category: 'Electronics', total_sales: 125000, order_count: 342, avg_order_value: 365.50 },
  { id: 2, region: 'Riyadh', product_category: 'Furniture', total_sales: 89000, order_count: 156, avg_order_value: 570.51 },
  { id: 3, region: 'Jeddah', product_category: 'Electronics', total_sales: 98000, order_count: 267, avg_order_value: 367.04 },
  { id: 4, region: 'Jeddah', product_category: 'Furniture', total_sales: 67000, order_count: 112, avg_order_value: 598.21 },
  { id: 5, region: 'Dammam', product_category: 'Electronics', total_sales: 78000, order_count: 198, avg_order_value: 393.94 },
  { id: 6, region: 'Dammam', product_category: 'Furniture', total_sales: 45000, order_count: 78, avg_order_value: 576.92 },
  { id: 7, region: 'Makkah', product_category: 'Electronics', total_sales: 56000, order_count: 145, avg_order_value: 386.21 },
  { id: 8, region: 'Makkah', product_category: 'Furniture', total_sales: 34000, order_count: 56, avg_order_value: 607.14 },
  { id: 9, region: 'Madinah', product_category: 'Electronics', total_sales: 42000, order_count: 112, avg_order_value: 375.00 },
  { id: 10, region: 'Madinah', product_category: 'Furniture', total_sales: 28000, order_count: 45, avg_order_value: 622.22 },
];

export const mockInventoryTableData: ReportDataRow[] = [
  { id: 1, product_name: 'Laptop Pro 15"', warehouse: 'Riyadh Main', current_stock: 45, reorder_point: 50, suggested_order: 100, status: 'Low Stock' },
  { id: 2, product_name: 'Office Chair Deluxe', warehouse: 'Riyadh Main', current_stock: 120, reorder_point: 80, suggested_order: 0, status: 'In Stock' },
  { id: 3, product_name: 'Wireless Mouse', warehouse: 'Jeddah', current_stock: 200, reorder_point: 150, suggested_order: 0, status: 'In Stock' },
  { id: 4, product_name: 'USB-C Hub', warehouse: 'Jeddah', current_stock: 30, reorder_point: 40, suggested_order: 60, status: 'Low Stock' },
  { id: 5, product_name: 'Monitor 27"', warehouse: 'Dammam', current_stock: 15, reorder_point: 25, suggested_order: 50, status: 'Critical' },
  { id: 6, product_name: 'Keyboard Mechanical', warehouse: 'Dammam', current_stock: 85, reorder_point: 60, suggested_order: 0, status: 'In Stock' },
  { id: 7, product_name: 'Webcam HD', warehouse: 'Riyadh Main', current_stock: 0, reorder_point: 30, suggested_order: 100, status: 'Out of Stock' },
  { id: 8, product_name: 'Desk Standing', warehouse: 'Jeddah', current_stock: 22, reorder_point: 20, suggested_order: 0, status: 'In Stock' },
];

export const mockFinanceTableData: ReportDataRow[] = [
  { id: 1, month: 'January', revenue: 450000, expenses: 320000, net_profit: 130000, margin: 28.9 },
  { id: 2, month: 'February', revenue: 480000, expenses: 340000, net_profit: 140000, margin: 29.2 },
  { id: 3, month: 'March', revenue: 520000, expenses: 360000, net_profit: 160000, margin: 30.8 },
  { id: 4, month: 'April', revenue: 490000, expenses: 350000, net_profit: 140000, margin: 28.6 },
  { id: 5, month: 'May', revenue: 550000, expenses: 380000, net_profit: 170000, margin: 30.9 },
  { id: 6, month: 'June', revenue: 580000, expenses: 400000, net_profit: 180000, margin: 31.0 },
  { id: 7, month: 'July', revenue: 560000, expenses: 390000, net_profit: 170000, margin: 30.4 },
  { id: 8, month: 'August', revenue: 600000, expenses: 410000, net_profit: 190000, margin: 31.7 },
  { id: 9, month: 'September', revenue: 620000, expenses: 420000, net_profit: 200000, margin: 32.3 },
  { id: 10, month: 'October', revenue: 650000, expenses: 440000, net_profit: 210000, margin: 32.3 },
  { id: 11, month: 'November', revenue: 680000, expenses: 460000, net_profit: 220000, margin: 32.4 },
  { id: 12, month: 'December', revenue: 720000, expenses: 480000, net_profit: 240000, margin: 33.3 },
];

// ==================== HELPER FUNCTIONS ====================
export function getReportsByModule(module: ReportModule): Report[] {
  return mockReports.filter(r => r.module === module);
}

export function getReportById(id: string): Report | undefined {
  return mockReports.find(r => r.id === id);
}

export function getDatasetById(id: string): Dataset | undefined {
  return mockDatasets.find(d => d.id === id);
}

export function getTemplatesByModule(module: ReportModule): ReportTemplate[] {
  return mockTemplates.filter(t => t.module === module);
}

export function getSchedulesByReportId(reportId: string): ReportSchedule[] {
  return mockSchedules.filter(s => s.reportId === reportId);
}

export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  // Remove trailing .00
  return formatted.replace(/\.00$/, '');
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}


