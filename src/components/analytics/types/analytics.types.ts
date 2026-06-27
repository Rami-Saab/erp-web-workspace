// ==================== ANALYTICS MODULE TYPES ====================

// KPI Types
export interface KPIData {
  id: string;
  title: string;
  value: string | number;
  previousValue?: string | number;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral';
  icon?: string;
  color: 'blue' | 'green' | 'purple' | 'cyan' | 'yellow' | 'red' | 'orange' | 'pink';
  format?: 'currency' | 'percentage' | 'number' | 'decimal';
  sparklineData?: number[];
  target?: number;
  actual?: number;
  drilldownPath?: string;
}

// Chart Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesData {
  date: string;
  [key: string]: string | number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'radial' | 'scatter' | 'treemap' | 'funnel' | 'gauge';
  height?: number;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

// Table Types
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  header: string | React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableConfig {
  pageSize?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  selectable?: boolean;
  striped?: boolean;
}

// Filter Types
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'search' | 'checkbox';
  options?: FilterOption[];
  defaultValue?: string | string[];
}

// Date Range Types
export type DateRangePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'lastQuarter' | 'thisYear' | 'lastYear' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
  preset?: DateRangePreset;
}

// Analytics Tab Types
export type AnalyticsTab = 
  | 'executive' 
  | 'finance' 
  | 'sales' 
  | 'inventory' 
  | 'hr' 
  | 'operations' 
  | 'reports' 
  | 'alerts' 
  | 'predictive'
  | 'builder';

// Navigation Types
export interface AnalyticsRoute {
  id: AnalyticsTab;
  path: string;
  label: string;
  icon: string;
  badge?: number | string;
  description?: string;
}

// Finance Types
export interface ProfitLossItem {
  category: string;
  amount: number;
  type: 'income' | 'expense' | 'profit';
  subcategories?: ProfitLossItem[];
}

export interface CashFlowData {
  period: string;
  operating: number;
  investing: number;
  financing: number;
  netCashFlow?: number;
}

export interface AgingData {
  range: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface BudgetData {
  department: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
}

// Sales Types
export interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  growth?: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  value: number;
  conversionRate?: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  sku?: string;
  revenue: number;
  units: number;
  growth: number;
  margin?: number;
}

export interface SalesByRegion {
  region: string;
  sales: number;
  growth: number;
  marketShare?: number;
}

export interface SalesForecast {
  period: string;
  actual?: number;
  forecast: number;
  lowerBound: number;
  upperBound: number;
  confidence?: number;
}

// Inventory Types
export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  reorderQty: number;
  unitCost: number;
  lastRestocked?: string;
  daysOfSupply?: number;
  turnoverRate?: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';
}

export interface StockAging {
  category: string;
  value: number;
  count: number;
  percentage: number;
  color: string;
}

export interface InventoryTurnover {
  period: string;
  turnover: number;
  target?: number;
}

export interface ReorderRecommendation {
  sku: string;
  name: string;
  currentStock: number;
  reorderPoint: number;
  recommended: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost?: number;
}

// HR Types
export interface HeadcountData {
  period: string;
  total: number;
  hired: number;
  left: number;
  netChange?: number;
}

export interface DepartmentData {
  name: string;
  headcount: number;
  budget?: number;
  color: string;
}

export interface PerformanceRating {
  rating: string;
  count: number;
  percentage: number;
}

export interface EmployeeTurnover {
  period: string;
  voluntary: number;
  involuntary: number;
  total: number;
  rate: number;
}

export interface AttendanceData {
  period: string;
  present: number;
  absent: number;
  late: number;
  wfh: number;
  rate: number;
}

// Operations Types
export interface ProductionLine {
  id: string;
  name: string;
  efficiency: number;
  target: number;
  output: number;
  downtime: number;
  status: 'running' | 'idle' | 'maintenance' | 'error';
}

export interface DowntimeData {
  cause: string;
  hours: number;
  percentage: number;
  incidents: number;
}

export interface EfficiencyMetric {
  period: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

export interface ResourceUtilization {
  resource: string;
  utilized: number;
  available: number;
  utilizationRate: number;
}

// Alert Types
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string | number;
  type: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  module: string;
  timestamp: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: AlertSeverity;
  enabled: boolean;
  notifyChannels: string[];
  lastTriggered?: string;
}

// Report Builder Types
export interface ReportWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'text' | 'metric';
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export interface SavedReport {
  id: string;
  name: string;
  description?: string;
  widgets: ReportWidget[];
  filters: FilterConfig[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isScheduled: boolean;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    lastRun?: string;
    nextRun?: string;
  };
}

// Predictive Analytics Types
export interface Prediction {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  confidence: number;
  trend: 'up' | 'down' | 'neutral';
  methodology?: string;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation' | 'anomaly';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  module: string;
}

export interface ScenarioComparison {
  scenario: string;
  baseline: number;
  optimistic: number;
  pessimistic: number;
  probability: number;
}

// Export/Import Types
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export interface ExportConfig {
  format: ExportFormat;
  includeCharts: boolean;
  dateRange?: DateRange;
  filters?: Record<string, unknown>;
}

// State Types
export interface AnalyticsState {
  activeTab: AnalyticsTab;
  dateRange: DateRange;
  filters: Record<string, unknown>;
  isLoading: boolean;
  error: string | null;
  refreshing: boolean;
}

// Component Props Types
export interface AnalyticsPageProps {
  initialTab?: AnalyticsTab;
  onTabChange?: (tab: AnalyticsTab) => void;
}

export interface KPICardProps extends KPIData {
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
  actions?: React.ReactNode;
}

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  config?: TableConfig;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onReset?: () => void;
  className?: string;
}








