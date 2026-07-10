// ==================== REPORTS MODULE - MAIN INDEX ====================

// Main module export
export { ReportsModule } from './ReportsModule';

// Page exports
export { ReportsList, ReportViewer, ReportBuilder, ReportTemplates } from './pages';

// Component exports
export {
  ReportCard,
  ReportTable,
  ReportChart,
  FilterPanel,
  ChartTypeSelector,
  ChartTypeSelectorCompact,
  ShareDialog,
  ScheduleForm,
  LoadingState,
  EmptyState,
  NoResultsState,
  ErrorState,
  ReportCardSkeleton,
  ReportTableSkeleton,
  ChartSkeleton,
  InlineLoader,
} from './components';

// Type exports
export type {
  Report,
  ReportStatus,
  ReportModule,
  ChartType,
  ExportFormat,
  ScheduleFrequency,
  PermissionLevel,
  ViewMode,
  AggregationType,
  FilterOperator,
  User,
  SharedUser,
  ReportSchedule,
  ReportConfig,
  ReportField,
  ReportFilter,
  ReportSorting,
  Dataset,
  DatasetField,
  ReportTemplate,
  FilterPreset,
  ReportDataRow,
  ChartDataPoint,
  ReportResult,
  DateRange,
  Pagination,
  SortConfig,
  ReportsTab,
  BuilderStep,
} from './types/reports.types';

// Constants exports
export { MODULE_COLORS, STATUS_COLORS, CHART_ICONS } from './types/reports.types';

// Mock data exports (for testing/demo purposes)
export {
  mockUsers,
  mockReports,
  mockDatasets,
  mockTemplates,
  mockFilterPresets,
  mockSchedules,
  mockSalesChartData,
  mockInventoryChartData,
  mockRegionChartData,
  mockSalesTableData,
  mockInventoryTableData,
  mockFinanceTableData,
  getReportsByModule,
  getReportById,
  getDatasetById,
  getTemplatesByModule,
  getSchedulesByReportId,
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
} from './data/mockData';


