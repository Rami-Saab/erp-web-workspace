// ==================== ANALYTICS MOCK DATA ====================

import type {
  KPIData,
  ProfitLossItem,
  CashFlowData,
  AgingData,
  BudgetData,
  SalesData,
  PipelineStage,
  ProductPerformance,
  SalesByRegion,
  SalesForecast,
  InventoryItem,
  StockAging,
  InventoryTurnover,
  ReorderRecommendation,
  HeadcountData,
  DepartmentData,
  PerformanceRating,
  EmployeeTurnover,
  AttendanceData,
  ProductionLine,
  DowntimeData,
  EfficiencyMetric,
  ResourceUtilization,
  Alert,
  AlertRule,
  SavedReport,
  Prediction,
  AIInsight,
  ScenarioComparison,
} from '../types/analytics.types';

// ==================== CHART COLORS ====================
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
  orange: '#f97316',
};

export const CHART_PALETTE = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', 
  '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316'
];

// ==================== EXECUTIVE DASHBOARD DATA ====================
export const executiveKPIs: KPIData[] = [
  { 
    id: 'net-profit',
    title: 'Net Profit', 
    value: '$2.4M', 
    change: 12.5, 
    changeLabel: 'vs last quarter', 
    color: 'green', 
    trend: 'up',
    sparklineData: [1800000, 1950000, 2100000, 2250000, 2300000, 2400000],
    target: 2500000,
    actual: 2400000,
    drilldownPath: 'finance'
  },
  { 
    id: 'total-revenue',
    title: 'Total Revenue', 
    value: '$8.7M', 
    change: 8.3, 
    changeLabel: 'vs last quarter', 
    color: 'blue', 
    trend: 'up',
    sparklineData: [7200000, 7500000, 7800000, 8100000, 8400000, 8700000],
    target: 9000000,
    actual: 8700000,
    drilldownPath: 'finance'
  },
  { 
    id: 'cash-flow',
    title: 'Cash Flow', 
    value: '$1.8M', 
    change: 15.7, 
    changeLabel: 'vs last quarter', 
    color: 'cyan', 
    trend: 'up',
    sparklineData: [1200000, 1350000, 1500000, 1600000, 1700000, 1800000],
    drilldownPath: 'finance'
  },
  { 
    id: 'sales-growth',
    title: 'Sales Growth', 
    value: '18.5%', 
    change: 3.2, 
    changeLabel: 'vs last quarter', 
    color: 'purple', 
    trend: 'up',
    sparklineData: [12, 13.5, 15, 16.2, 17.8, 18.5],
    drilldownPath: 'sales'
  },
  { 
    id: 'budget-achievement',
    title: 'Budget Achievement', 
    value: '94.2%', 
    change: 2.1, 
    changeLabel: 'vs target', 
    color: 'yellow', 
    trend: 'up',
    target: 100,
    actual: 94.2,
    drilldownPath: 'finance'
  },
  { 
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction', 
    value: '4.6/5', 
    change: 0.2, 
    changeLabel: 'vs last quarter', 
    color: 'pink', 
    trend: 'up',
    sparklineData: [4.2, 4.3, 4.4, 4.5, 4.5, 4.6],
    drilldownPath: 'sales'
  },
];

export const revenueVsExpenses = [
  { month: 'Jan', revenue: 1200000, expenses: 850000, profit: 350000, target: 1250000 },
  { month: 'Feb', revenue: 1350000, expenses: 920000, profit: 430000, target: 1300000 },
  { month: 'Mar', revenue: 1180000, expenses: 880000, profit: 300000, target: 1350000 },
  { month: 'Apr', revenue: 1420000, expenses: 950000, profit: 470000, target: 1400000 },
  { month: 'May', revenue: 1580000, expenses: 1020000, profit: 560000, target: 1450000 },
  { month: 'Jun', revenue: 1720000, expenses: 1080000, profit: 640000, target: 1500000 },
  { month: 'Jul', revenue: 1850000, expenses: 1120000, profit: 730000, target: 1550000 },
  { month: 'Aug', revenue: 1920000, expenses: 1150000, profit: 770000, target: 1600000 },
  { month: 'Sep', revenue: 2050000, expenses: 1200000, profit: 850000, target: 1650000 },
  { month: 'Oct', revenue: 2180000, expenses: 1280000, profit: 900000, target: 1700000 },
  { month: 'Nov', revenue: 2350000, expenses: 1350000, profit: 1000000, target: 1750000 },
  { month: 'Dec', revenue: 2500000, expenses: 1420000, profit: 1080000, target: 1800000 },
];

export const budgetAchievement: BudgetData[] = [
  { department: 'Sales', budgeted: 2500000, actual: 2300000, variance: -200000, variancePercent: -8 },
  { department: 'Marketing', budgeted: 1200000, actual: 1296000, variance: 96000, variancePercent: 8 },
  { department: 'Operations', budgeted: 3500000, actual: 3675000, variance: 175000, variancePercent: 5 },
  { department: 'R&D', budgeted: 2000000, actual: 1560000, variance: -440000, variancePercent: -22 },
  { department: 'HR', budgeted: 800000, actual: 784000, variance: -16000, variancePercent: -2 },
  { department: 'IT', budgeted: 1500000, actual: 1545000, variance: 45000, variancePercent: 3 },
];

export const keyMetrics = [
  { label: 'Gross Margin', value: '63.2%', change: '+2.1%', positive: true },
  { label: 'Customer Retention', value: '94.5%', change: '+0.8%', positive: true },
  { label: 'Employee Satisfaction', value: '4.2/5', change: '+0.3', positive: true },
  { label: 'Avg Order Value', value: '$2,450', change: '-1.2%', positive: false },
  { label: 'Operating Margin', value: '28.4%', change: '+1.5%', positive: true },
  { label: 'Inventory Turnover', value: '5.3x', change: '+0.4', positive: true },
];

// ==================== FINANCE ANALYTICS DATA ====================
export const financeKPIs: KPIData[] = [
  { id: 'fin-revenue', title: 'Total Revenue', value: '$8.7M', change: 8.3, changeLabel: 'vs last quarter', color: 'blue', trend: 'up' },
  { id: 'fin-profit', title: 'Net Profit', value: '$2.4M', change: 12.5, changeLabel: 'vs last quarter', color: 'green', trend: 'up' },
  { id: 'fin-ar', title: 'Accounts Receivable', value: '$2.76M', change: -5.2, changeLabel: 'vs last quarter', color: 'purple', trend: 'down' },
  { id: 'fin-cash', title: 'Cash on Hand', value: '$1.8M', change: 15.7, changeLabel: 'vs last quarter', color: 'cyan', trend: 'up' },
];

export const profitLossData: ProfitLossItem[] = [
  { category: 'Revenue', amount: 8700000, type: 'income' },
  { category: 'Cost of Goods Sold', amount: -3200000, type: 'expense' },
  { category: 'Gross Profit', amount: 5500000, type: 'profit' },
  { category: 'Operating Expenses', amount: -2100000, type: 'expense' },
  { category: 'EBITDA', amount: 3400000, type: 'profit' },
  { category: 'Depreciation & Amortization', amount: -450000, type: 'expense' },
  { category: 'Interest Expense', amount: -180000, type: 'expense' },
  { category: 'Tax Expense', amount: -370000, type: 'expense' },
  { category: 'Net Income', amount: 2400000, type: 'profit' },
];

export const cashFlowData: CashFlowData[] = [
  { period: 'Jan', operating: 420000, investing: -180000, financing: -50000, netCashFlow: 190000 },
  { period: 'Feb', operating: 380000, investing: -120000, financing: -60000, netCashFlow: 200000 },
  { period: 'Mar', operating: 510000, investing: -200000, financing: -40000, netCashFlow: 270000 },
  { period: 'Apr', operating: 450000, investing: -150000, financing: -55000, netCashFlow: 245000 },
  { period: 'May', operating: 580000, investing: -220000, financing: -45000, netCashFlow: 315000 },
  { period: 'Jun', operating: 620000, investing: -180000, financing: -50000, netCashFlow: 390000 },
  { period: 'Jul', operating: 550000, investing: -160000, financing: -65000, netCashFlow: 325000 },
  { period: 'Aug', operating: 680000, investing: -190000, financing: -55000, netCashFlow: 435000 },
  { period: 'Sep', operating: 720000, investing: -210000, financing: -60000, netCashFlow: 450000 },
  { period: 'Oct', operating: 650000, investing: -170000, financing: -70000, netCashFlow: 410000 },
  { period: 'Nov', operating: 780000, investing: -230000, financing: -50000, netCashFlow: 500000 },
  { period: 'Dec', operating: 850000, investing: -200000, financing: -80000, netCashFlow: 570000 },
];

export const accountsReceivableAging: AgingData[] = [
  { range: '0-30 days', amount: 1250000, percentage: 45, count: 89 },
  { range: '31-60 days', amount: 680000, percentage: 25, count: 45 },
  { range: '61-90 days', amount: 420000, percentage: 15, count: 28 },
  { range: '90+ days', amount: 410000, percentage: 15, count: 32 },
];

export const accountsPayableAging: AgingData[] = [
  { range: '0-30 days', amount: 890000, percentage: 52, count: 67 },
  { range: '31-60 days', amount: 450000, percentage: 26, count: 34 },
  { range: '61-90 days', amount: 250000, percentage: 15, count: 19 },
  { range: '90+ days', amount: 120000, percentage: 7, count: 12 },
];

export const expenseBreakdown = [
  { name: 'Salaries & Benefits', value: 45, amount: 945000, color: '#3b82f6' },
  { name: 'Operations', value: 25, amount: 525000, color: '#10b981' },
  { name: 'Marketing', value: 15, amount: 315000, color: '#8b5cf6' },
  { name: 'Technology', value: 10, amount: 210000, color: '#f59e0b' },
  { name: 'Administrative', value: 5, amount: 105000, color: '#6b7280' },
];

export const revenueBySource = [
  { name: 'Product Sales', value: 55, amount: 4785000, color: '#3b82f6' },
  { name: 'Services', value: 25, amount: 2175000, color: '#10b981' },
  { name: 'Subscriptions', value: 15, amount: 1305000, color: '#8b5cf6' },
  { name: 'Other', value: 5, amount: 435000, color: '#f59e0b' },
];

// ==================== SALES ANALYTICS DATA ====================
export const salesKPIs: KPIData[] = [
  { id: 'sales-total', title: 'Total Sales', value: '$8.7M', change: 8.3, changeLabel: 'vs last quarter', color: 'blue', trend: 'up' },
  { id: 'sales-conversion', title: 'Conversion Rate', value: '3.4%', change: 0.5, changeLabel: 'vs last quarter', color: 'green', trend: 'up' },
  { id: 'sales-avg-deal', title: 'Avg Deal Size', value: '$50K', change: 12.1, changeLabel: 'vs last quarter', color: 'purple', trend: 'up' },
  { id: 'sales-pipeline', title: 'Pipeline Value', value: '$31.8M', change: 22.4, changeLabel: 'vs last quarter', color: 'cyan', trend: 'up' },
];

export const salesData: SalesData[] = [
  { period: 'Jan', revenue: 1200000, orders: 245, avgOrderValue: 4898, growth: 5.2 },
  { period: 'Feb', revenue: 1350000, orders: 278, avgOrderValue: 4856, growth: 12.5 },
  { period: 'Mar', revenue: 1180000, orders: 232, avgOrderValue: 5086, growth: -12.6 },
  { period: 'Apr', revenue: 1420000, orders: 295, avgOrderValue: 4814, growth: 20.3 },
  { period: 'May', revenue: 1580000, orders: 318, avgOrderValue: 4969, growth: 11.3 },
  { period: 'Jun', revenue: 1720000, orders: 342, avgOrderValue: 5029, growth: 8.9 },
  { period: 'Jul', revenue: 1850000, orders: 365, avgOrderValue: 5068, growth: 7.6 },
  { period: 'Aug', revenue: 1920000, orders: 378, avgOrderValue: 5079, growth: 3.8 },
  { period: 'Sep', revenue: 2050000, orders: 402, avgOrderValue: 5100, growth: 6.8 },
  { period: 'Oct', revenue: 2180000, orders: 425, avgOrderValue: 5129, growth: 6.3 },
  { period: 'Nov', revenue: 2350000, orders: 456, avgOrderValue: 5154, growth: 7.8 },
  { period: 'Dec', revenue: 2500000, orders: 485, avgOrderValue: 5155, growth: 6.4 },
];

export const salesByRegion: SalesByRegion[] = [
  { region: 'North America', sales: 3200000, growth: 12.5, marketShare: 37 },
  { region: 'Europe', sales: 2400000, growth: 8.3, marketShare: 28 },
  { region: 'Asia Pacific', sales: 1800000, growth: 22.1, marketShare: 21 },
  { region: 'Middle East', sales: 850000, growth: 15.7, marketShare: 10 },
  { region: 'Latin America', sales: 450000, growth: 5.2, marketShare: 4 },
];

export const salesPipeline: PipelineStage[] = [
  { stage: 'Leads', count: 1250, value: 12500000, conversionRate: 100 },
  { stage: 'Qualified', count: 420, value: 8400000, conversionRate: 33.6 },
  { stage: 'Proposal', count: 180, value: 5400000, conversionRate: 42.9 },
  { stage: 'Negotiation', count: 85, value: 3400000, conversionRate: 47.2 },
  { stage: 'Closed Won', count: 42, value: 2100000, conversionRate: 49.4 },
];

export const topProducts: ProductPerformance[] = [
  { id: '1', name: 'Enterprise Suite', sku: 'ENT-001', revenue: 2100000, units: 145, growth: 18.5, margin: 42 },
  { id: '2', name: 'Pro License', sku: 'PRO-001', revenue: 1450000, units: 890, growth: 12.3, margin: 38 },
  { id: '3', name: 'Cloud Storage', sku: 'CLD-001', revenue: 980000, units: 2340, growth: 28.7, margin: 65 },
  { id: '4', name: 'Support Plan', sku: 'SUP-001', revenue: 720000, units: 1560, growth: 8.9, margin: 72 },
  { id: '5', name: 'Training Package', sku: 'TRN-001', revenue: 340000, units: 420, growth: -2.1, margin: 55 },
  { id: '6', name: 'Consulting Services', sku: 'CON-001', revenue: 580000, units: 48, growth: 15.2, margin: 45 },
  { id: '7', name: 'Custom Development', sku: 'DEV-001', revenue: 890000, units: 32, growth: 22.8, margin: 35 },
  { id: '8', name: 'Data Analytics Add-on', sku: 'ANA-001', revenue: 420000, units: 680, growth: 45.3, margin: 68 },
];

export const bottomProducts: ProductPerformance[] = [
  { id: '9', name: 'Legacy Module', sku: 'LEG-001', revenue: 85000, units: 12, growth: -45.2, margin: 15 },
  { id: '10', name: 'Basic Plan', sku: 'BAS-001', revenue: 120000, units: 890, growth: -12.3, margin: 22 },
  { id: '11', name: 'Print Services', sku: 'PRT-001', revenue: 45000, units: 156, growth: -28.7, margin: 18 },
  { id: '12', name: 'Manual Backup', sku: 'BKP-001', revenue: 32000, units: 45, growth: -35.5, margin: 20 },
];

export const salesForecast: SalesForecast[] = [
  { period: 'Jul', actual: 1850000, forecast: 1850000, lowerBound: 1650000, upperBound: 2050000, confidence: 95 },
  { period: 'Aug', actual: 1920000, forecast: 1920000, lowerBound: 1700000, upperBound: 2140000, confidence: 95 },
  { period: 'Sep', forecast: 2100000, lowerBound: 1850000, upperBound: 2350000, confidence: 92 },
  { period: 'Oct', forecast: 2280000, lowerBound: 2000000, upperBound: 2560000, confidence: 88 },
  { period: 'Nov', forecast: 2450000, lowerBound: 2150000, upperBound: 2750000, confidence: 85 },
  { period: 'Dec', forecast: 2680000, lowerBound: 2350000, upperBound: 3010000, confidence: 82 },
];

export const salesRepPerformance = [
  { name: 'Sarah Johnson', deals: 45, revenue: 1250000, quota: 1200000, achievement: 104 },
  { name: 'Mike Chen', deals: 38, revenue: 980000, quota: 1000000, achievement: 98 },
  { name: 'Emily Davis', deals: 52, revenue: 1450000, quota: 1300000, achievement: 112 },
  { name: 'James Wilson', deals: 29, revenue: 750000, quota: 900000, achievement: 83 },
  { name: 'Lisa Anderson', deals: 41, revenue: 1100000, quota: 1100000, achievement: 100 },
];

// ==================== INVENTORY ANALYTICS DATA ====================
export const inventoryKPIs: KPIData[] = [
  { id: 'inv-value', title: 'Inventory Value', value: '$4.2M', change: 5.2, changeLabel: 'vs last quarter', color: 'blue', trend: 'up' },
  { id: 'inv-turnover', title: 'Turnover Ratio', value: '5.3x', change: 8.1, changeLabel: 'vs last quarter', color: 'green', trend: 'up' },
  { id: 'inv-accuracy', title: 'Stock Accuracy', value: '98.5%', change: 1.2, changeLabel: 'vs last quarter', color: 'purple', trend: 'up' },
  { id: 'inv-carrying', title: 'Carrying Cost', value: '$180K', change: -3.4, changeLabel: 'vs last quarter', color: 'cyan', trend: 'down' },
];

export const inventoryTurnover: InventoryTurnover[] = [
  { period: 'Jan', turnover: 4.2, target: 5.0 },
  { period: 'Feb', turnover: 4.5, target: 5.0 },
  { period: 'Mar', turnover: 4.1, target: 5.0 },
  { period: 'Apr', turnover: 4.8, target: 5.0 },
  { period: 'May', turnover: 5.1, target: 5.0 },
  { period: 'Jun', turnover: 5.3, target: 5.0 },
  { period: 'Jul', turnover: 5.0, target: 5.0 },
  { period: 'Aug', turnover: 5.4, target: 5.0 },
  { period: 'Sep', turnover: 5.6, target: 5.0 },
  { period: 'Oct', turnover: 5.2, target: 5.0 },
  { period: 'Nov', turnover: 5.8, target: 5.0 },
  { period: 'Dec', turnover: 6.1, target: 5.0 },
];

export const stockAging: StockAging[] = [
  { category: 'Fresh (0-30 days)', value: 45, count: 1250, percentage: 45, color: '#10b981' },
  { category: 'Normal (31-90 days)', value: 30, count: 850, percentage: 30, color: '#3b82f6' },
  { category: 'Aging (91-180 days)', value: 15, count: 420, percentage: 15, color: '#f59e0b' },
  { category: 'Dead Stock (180+ days)', value: 10, count: 280, percentage: 10, color: '#ef4444' },
];

export const inventoryByCategory = [
  { name: 'Electronics', value: 35, count: 980, amount: 1470000, color: '#3b82f6' },
  { name: 'Accessories', value: 25, count: 1250, amount: 1050000, color: '#10b981' },
  { name: 'Software', value: 20, count: 450, amount: 840000, color: '#8b5cf6' },
  { name: 'Hardware', value: 15, count: 320, amount: 630000, color: '#f59e0b' },
  { name: 'Services', value: 5, count: 100, amount: 210000, color: '#6b7280' },
];

export const inventoryByWarehouse = [
  { warehouse: 'Main Warehouse', items: 1850, value: 2100000, utilization: 78 },
  { warehouse: 'East Distribution', items: 920, value: 980000, utilization: 65 },
  { warehouse: 'West Hub', items: 680, value: 720000, utilization: 82 },
  { warehouse: 'North Facility', items: 450, value: 400000, utilization: 45 },
];

export const reorderRecommendations: ReorderRecommendation[] = [
  { sku: 'SKU-001', name: 'Widget A', currentStock: 45, reorderPoint: 100, recommended: 200, urgency: 'critical', estimatedCost: 4500 },
  { sku: 'SKU-002', name: 'Component B', currentStock: 120, reorderPoint: 150, recommended: 300, urgency: 'high', estimatedCost: 8400 },
  { sku: 'SKU-003', name: 'Part C', currentStock: 280, reorderPoint: 200, recommended: 400, urgency: 'low', estimatedCost: 12000 },
  { sku: 'SKU-004', name: 'Assembly D', currentStock: 15, reorderPoint: 50, recommended: 100, urgency: 'critical', estimatedCost: 2500 },
  { sku: 'SKU-005', name: 'Module E', currentStock: 95, reorderPoint: 100, recommended: 200, urgency: 'medium', estimatedCost: 6800 },
  { sku: 'SKU-006', name: 'Connector F', currentStock: 180, reorderPoint: 200, recommended: 400, urgency: 'medium', estimatedCost: 3200 },
  { sku: 'SKU-007', name: 'Cable G', currentStock: 320, reorderPoint: 250, recommended: 500, urgency: 'low', estimatedCost: 4800 },
];

export const slowMovingItems: InventoryItem[] = [
  { sku: 'SLW-001', name: 'Legacy Adapter', category: 'Hardware', currentStock: 450, reorderPoint: 50, reorderQty: 100, unitCost: 25, daysOfSupply: 320, turnoverRate: 0.8, status: 'overstocked' },
  { sku: 'SLW-002', name: 'Old Module', category: 'Electronics', currentStock: 280, reorderPoint: 30, reorderQty: 50, unitCost: 85, daysOfSupply: 280, turnoverRate: 1.2, status: 'overstocked' },
  { sku: 'SLW-003', name: 'Discontinued Part', category: 'Accessories', currentStock: 150, reorderPoint: 0, reorderQty: 0, unitCost: 12, daysOfSupply: 450, turnoverRate: 0.5, status: 'overstocked' },
];

// ==================== HR ANALYTICS DATA ====================
export const hrKPIs: KPIData[] = [
  { id: 'hr-headcount', title: 'Total Headcount', value: '278', change: 4.5, changeLabel: 'vs last quarter', color: 'blue', trend: 'up' },
  { id: 'hr-turnover', title: 'Turnover Rate', value: '8.2%', change: -1.5, changeLabel: 'vs last quarter', color: 'green', trend: 'down' },
  { id: 'hr-tenure', title: 'Avg Tenure', value: '3.2 yrs', change: 0.3, changeLabel: 'vs last quarter', color: 'purple', trend: 'up' },
  { id: 'hr-cost', title: 'Cost per Employee', value: '$85K', change: 2.1, changeLabel: 'vs last quarter', color: 'cyan', trend: 'up' },
];

export const headcountTrend: HeadcountData[] = [
  { period: 'Jan', total: 245, hired: 12, left: 5, netChange: 7 },
  { period: 'Feb', total: 252, hired: 10, left: 3, netChange: 7 },
  { period: 'Mar', total: 258, hired: 8, left: 2, netChange: 6 },
  { period: 'Apr', total: 262, hired: 6, left: 2, netChange: 4 },
  { period: 'May', total: 270, hired: 11, left: 3, netChange: 8 },
  { period: 'Jun', total: 278, hired: 12, left: 4, netChange: 8 },
  { period: 'Jul', total: 285, hired: 10, left: 3, netChange: 7 },
  { period: 'Aug', total: 290, hired: 8, left: 3, netChange: 5 },
  { period: 'Sep', total: 298, hired: 12, left: 4, netChange: 8 },
  { period: 'Oct', total: 305, hired: 10, left: 3, netChange: 7 },
  { period: 'Nov', total: 312, hired: 9, left: 2, netChange: 7 },
  { period: 'Dec', total: 318, hired: 8, left: 2, netChange: 6 },
];

export const departmentDistribution: DepartmentData[] = [
  { name: 'Engineering', headcount: 85, budget: 8500000, color: '#3b82f6' },
  { name: 'Sales', headcount: 62, budget: 6200000, color: '#10b981' },
  { name: 'Operations', headcount: 48, budget: 3840000, color: '#8b5cf6' },
  { name: 'Marketing', headcount: 35, budget: 3150000, color: '#f59e0b' },
  { name: 'HR', headcount: 18, budget: 1440000, color: '#ec4899' },
  { name: 'Finance', headcount: 15, budget: 1350000, color: '#06b6d4' },
  { name: 'Other', headcount: 15, budget: 1200000, color: '#6b7280' },
];

export const performanceDistribution: PerformanceRating[] = [
  { rating: 'Exceptional', count: 28, percentage: 10 },
  { rating: 'Exceeds', count: 78, percentage: 28 },
  { rating: 'Meets', count: 139, percentage: 50 },
  { rating: 'Needs Improvement', count: 28, percentage: 10 },
  { rating: 'Unsatisfactory', count: 5, percentage: 2 },
];

export const employeeTurnover: EmployeeTurnover[] = [
  { period: 'Q1 2023', voluntary: 8, involuntary: 2, total: 10, rate: 4.1 },
  { period: 'Q2 2023', voluntary: 6, involuntary: 3, total: 9, rate: 3.6 },
  { period: 'Q3 2023', voluntary: 10, involuntary: 2, total: 12, rate: 4.6 },
  { period: 'Q4 2023', voluntary: 7, involuntary: 1, total: 8, rate: 3.0 },
  { period: 'Q1 2024', voluntary: 5, involuntary: 2, total: 7, rate: 2.5 },
  { period: 'Q2 2024', voluntary: 9, involuntary: 1, total: 10, rate: 3.5 },
];

export const attendanceData: AttendanceData[] = [
  { period: 'Mon', present: 265, absent: 8, late: 12, wfh: 45, rate: 95.3 },
  { period: 'Tue', present: 270, absent: 5, late: 8, wfh: 42, rate: 97.1 },
  { period: 'Wed', present: 268, absent: 6, late: 10, wfh: 48, rate: 96.4 },
  { period: 'Thu', present: 262, absent: 10, late: 15, wfh: 52, rate: 94.2 },
  { period: 'Fri', present: 255, absent: 15, late: 18, wfh: 65, rate: 91.7 },
];

// ==================== OPERATIONS ANALYTICS DATA ====================
export const operationsKPIs: KPIData[] = [
  { id: 'ops-oee', title: 'OEE Score', value: '87.2%', change: 3.5, changeLabel: 'vs last quarter', color: 'blue', trend: 'up' },
  { id: 'ops-output', title: 'Production Output', value: '47.7K', change: 8.2, changeLabel: 'vs last quarter', color: 'green', trend: 'up' },
  { id: 'ops-downtime', title: 'Downtime Hours', value: '129 hrs', change: -12.3, changeLabel: 'vs last quarter', color: 'purple', trend: 'down' },
  { id: 'ops-cost', title: 'Cost per Unit', value: '$12.40', change: -2.8, changeLabel: 'vs last quarter', color: 'cyan', trend: 'down' },
];

export const productionLines: ProductionLine[] = [
  { id: 'line-a', name: 'Line A', efficiency: 94, target: 95, output: 12500, downtime: 24, status: 'running' },
  { id: 'line-b', name: 'Line B', efficiency: 87, target: 90, output: 10200, downtime: 48, status: 'running' },
  { id: 'line-c', name: 'Line C', efficiency: 91, target: 92, output: 11800, downtime: 32, status: 'running' },
  { id: 'line-d', name: 'Line D', efficiency: 96, target: 93, output: 13200, downtime: 16, status: 'running' },
  { id: 'line-e', name: 'Line E', efficiency: 0, target: 90, output: 0, downtime: 0, status: 'maintenance' },
];

export const downtimeAnalysis: DowntimeData[] = [
  { cause: 'Equipment Failure', hours: 45, percentage: 35, incidents: 12 },
  { cause: 'Scheduled Maintenance', hours: 32, percentage: 25, incidents: 8 },
  { cause: 'Material Shortage', hours: 26, percentage: 20, incidents: 6 },
  { cause: 'Quality Issues', hours: 18, percentage: 14, incidents: 15 },
  { cause: 'Other', hours: 8, percentage: 6, incidents: 4 },
];

export const efficiencyTrend: EfficiencyMetric[] = [
  { period: 'Jan', oee: 82, availability: 88, performance: 92, quality: 98 },
  { period: 'Feb', oee: 84, availability: 89, performance: 93, quality: 98 },
  { period: 'Mar', oee: 83, availability: 87, performance: 94, quality: 99 },
  { period: 'Apr', oee: 85, availability: 90, performance: 93, quality: 98 },
  { period: 'May', oee: 86, availability: 91, performance: 94, quality: 99 },
  { period: 'Jun', oee: 87, availability: 92, performance: 94, quality: 99 },
];

export const resourceUtilization: ResourceUtilization[] = [
  { resource: 'Assembly Machines', utilized: 85, available: 100, utilizationRate: 85 },
  { resource: 'Packaging Lines', utilized: 72, available: 100, utilizationRate: 72 },
  { resource: 'Testing Equipment', utilized: 90, available: 100, utilizationRate: 90 },
  { resource: 'Warehouse Space', utilized: 78, available: 100, utilizationRate: 78 },
  { resource: 'Delivery Fleet', utilized: 68, available: 100, utilizationRate: 68 },
];

export const productionVsPlan = [
  { period: 'Week 1', planned: 12000, actual: 11500, variance: -4.2 },
  { period: 'Week 2', planned: 12000, actual: 12200, variance: 1.7 },
  { period: 'Week 3', planned: 12500, actual: 12800, variance: 2.4 },
  { period: 'Week 4', planned: 13000, actual: 12600, variance: -3.1 },
];

// ==================== ALERTS DATA ====================
export const activeAlerts: Alert[] = [
  { id: '1', type: 'critical', status: 'active', title: 'Low Cash Balance', message: 'Cash balance below $500K threshold', module: 'Finance', timestamp: '2 hours ago' },
  { id: '2', type: 'warning', status: 'active', title: 'Inventory Shortage', message: 'SKU-001 below reorder point', module: 'Inventory', timestamp: '4 hours ago' },
  { id: '3', type: 'warning', status: 'acknowledged', title: 'Budget Overrun', message: 'Marketing budget exceeded by 8%', module: 'Finance', timestamp: '1 day ago', acknowledgedBy: 'John Smith' },
  { id: '4', type: 'info', status: 'active', title: 'Overdue Receivables', message: '15 invoices overdue > 60 days', module: 'Finance', timestamp: '1 day ago' },
  { id: '5', type: 'critical', status: 'active', title: 'Production Delay', message: 'Line B efficiency dropped below 85%', module: 'Operations', timestamp: '3 hours ago' },
  { id: '6', type: 'warning', status: 'resolved', title: 'High Turnover Risk', message: '3 key employees flagged for attrition', module: 'HR', timestamp: '2 days ago', resolvedAt: '1 day ago' },
  { id: '7', type: 'info', status: 'active', title: 'New Forecast Available', message: 'Q4 sales forecast updated', module: 'Sales', timestamp: '5 hours ago' },
];

export const alertRules: AlertRule[] = [
  { id: '1', name: 'Low Cash Balance', condition: 'Cash balance < threshold', threshold: 500000, severity: 'critical', enabled: true, notifyChannels: ['email', 'slack'], lastTriggered: '2 hours ago' },
  { id: '2', name: 'Inventory Below Reorder', condition: 'Stock < reorder point', threshold: 0, severity: 'warning', enabled: true, notifyChannels: ['email'], lastTriggered: '4 hours ago' },
  { id: '3', name: 'Budget Overrun', condition: 'Actual > Budget %', threshold: 5, severity: 'warning', enabled: true, notifyChannels: ['email', 'slack'], lastTriggered: '1 day ago' },
  { id: '4', name: 'Overdue Invoices', condition: 'Invoice age > days', threshold: 60, severity: 'info', enabled: true, notifyChannels: ['email'], lastTriggered: '1 day ago' },
  { id: '5', name: 'Production Efficiency', condition: 'OEE < target %', threshold: 85, severity: 'critical', enabled: true, notifyChannels: ['email', 'slack', 'sms'], lastTriggered: '3 hours ago' },
  { id: '6', name: 'Sales Target', condition: 'Sales < target %', threshold: 90, severity: 'warning', enabled: false, notifyChannels: ['email'], lastTriggered: 'Never' },
];

export const alertStats = [
  { title: 'Critical Alerts', value: 2, color: 'red' },
  { title: 'Warning Alerts', value: 3, color: 'yellow' },
  { title: 'Info Alerts', value: 8, color: 'blue' },
  { title: 'Resolved Today', value: 12, color: 'green' },
];

// ==================== PREDICTIVE ANALYTICS DATA ====================
export const predictions: Prediction[] = [
  { id: '1', title: 'Sales Forecast', value: '$2.68M', subtitle: 'Next Month Prediction', confidence: 92, trend: 'up', methodology: 'Time Series Analysis' },
  { id: '2', title: 'Inventory Demand', value: '15,200 units', subtitle: 'Predicted Q4 Demand', confidence: 88, trend: 'up', methodology: 'ML Demand Forecasting' },
  { id: '3', title: 'Cash Flow Forecast', value: '$1.2M', subtitle: 'Expected Month-End', confidence: 95, trend: 'up', methodology: 'Regression Analysis' },
  { id: '4', title: 'Customer Churn', value: '3.2%', subtitle: 'Expected Next Quarter', confidence: 78, trend: 'down', methodology: 'Predictive Modeling' },
  { id: '5', title: 'Production Output', value: '52K units', subtitle: 'Next Month Forecast', confidence: 90, trend: 'up', methodology: 'Capacity Planning' },
  { id: '6', title: 'Hiring Needs', value: '12 FTEs', subtitle: 'Required Next Quarter', confidence: 85, trend: 'up', methodology: 'Workforce Planning' },
];

export const aiInsights: AIInsight[] = [
  { id: '1', type: 'opportunity', title: 'Growth Opportunity', description: 'Asia Pacific region shows 22% higher growth potential based on current trends. Consider increasing marketing spend by 15%.', impact: 'high', actionable: true, module: 'Sales' },
  { id: '2', type: 'risk', title: 'Inventory Risk', description: 'Predicted inventory shortage for SKU-001 within 2 weeks based on current sales velocity.', impact: 'high', actionable: true, module: 'Inventory' },
  { id: '3', type: 'risk', title: 'Attrition Risk', description: '3 high-performers in Engineering show elevated attrition risk based on engagement patterns.', impact: 'medium', actionable: true, module: 'HR' },
  { id: '4', type: 'recommendation', title: 'Cost Optimization', description: 'Potential 8% cost reduction identified in procurement process through vendor consolidation.', impact: 'medium', actionable: true, module: 'Finance' },
  { id: '5', type: 'anomaly', title: 'Unusual Pattern', description: 'Sales in North America showing unusual spike in last 2 weeks. Recommend investigation.', impact: 'low', actionable: false, module: 'Sales' },
  { id: '6', type: 'opportunity', title: 'Upsell Potential', description: '45 existing customers identified as high-probability upsell candidates based on usage patterns.', impact: 'high', actionable: true, module: 'Sales' },
];

export const scenarioComparisons: ScenarioComparison[] = [
  { scenario: 'Q4 Revenue', baseline: 8500000, optimistic: 9500000, pessimistic: 7800000, probability: 65 },
  { scenario: 'Year-End Headcount', baseline: 320, optimistic: 340, pessimistic: 305, probability: 70 },
  { scenario: 'Annual Profit', baseline: 2800000, optimistic: 3200000, pessimistic: 2400000, probability: 60 },
  { scenario: 'Market Share', baseline: 12.5, optimistic: 14.2, pessimistic: 11.8, probability: 55 },
];

// ==================== REPORTS DATA ====================
export const savedReports: SavedReport[] = [
  { 
    id: '1', 
    name: 'Weekly Sales Report', 
    description: 'Weekly summary of sales performance across all regions',
    widgets: [], 
    filters: [], 
    createdAt: '2024-01-15', 
    updatedAt: '2024-03-10', 
    createdBy: 'John Smith',
    isScheduled: true,
    schedule: { frequency: 'weekly', recipients: ['team@company.com', 'manager@company.com'], lastRun: '2 days ago', nextRun: 'Monday 8:00 AM' }
  },
  { 
    id: '2', 
    name: 'Monthly Financial Summary', 
    description: 'Comprehensive monthly financial overview including P&L and cash flow',
    widgets: [], 
    filters: [], 
    createdAt: '2024-02-01', 
    updatedAt: '2024-03-01', 
    createdBy: 'Sarah Johnson',
    isScheduled: true,
    schedule: { frequency: 'monthly', recipients: ['finance@company.com', 'cfo@company.com'], lastRun: '1 week ago', nextRun: '1st of month' }
  },
  { 
    id: '3', 
    name: 'Daily Inventory Alert', 
    description: 'Daily report of inventory levels and reorder recommendations',
    widgets: [], 
    filters: [], 
    createdAt: '2024-01-20', 
    updatedAt: '2024-03-12', 
    createdBy: 'Mike Chen',
    isScheduled: true,
    schedule: { frequency: 'daily', recipients: ['inventory@company.com'], lastRun: '1 day ago', nextRun: 'Tomorrow 6:00 AM' }
  },
  { 
    id: '4', 
    name: 'Quarterly HR Dashboard', 
    description: 'Quarterly human resources metrics and workforce analytics',
    widgets: [], 
    filters: [], 
    createdAt: '2024-01-10', 
    updatedAt: '2024-03-05', 
    createdBy: 'Emily Davis',
    isScheduled: false
  },
  { 
    id: '5', 
    name: 'Executive Summary', 
    description: 'High-level executive summary of key business metrics',
    widgets: [], 
    filters: [], 
    createdAt: '2024-02-15', 
    updatedAt: '2024-03-08', 
    createdBy: 'John Smith',
    isScheduled: true,
    schedule: { frequency: 'weekly', recipients: ['executives@company.com'], lastRun: '3 days ago', nextRun: 'Friday 5:00 PM' }
  },
];

export const reportTemplates = [
  { 
    id: '1', 
    name: 'Monthly P&L Statement', 
    icon: 'DollarSign', 
    category: 'Finance',
    description: 'Standard profit and loss statement template',
    tags: ['Finance', 'P&L', 'Monthly'],
    usageCount: 78
  },
  { 
    id: '2', 
    name: 'Cash Flow Report', 
    icon: 'DollarSign', 
    category: 'Finance',
    description: 'Comprehensive cash flow analysis',
    tags: ['Finance', 'Cash Flow', 'Financial'],
    usageCount: 52
  },
  { 
    id: '3', 
    name: 'Balance Sheet', 
    icon: 'DollarSign', 
    category: 'Finance',
    description: 'Assets, liabilities, and equity statement',
    tags: ['Finance', 'Balance Sheet', 'Financial'],
    usageCount: 45
  },
  { 
    id: '4', 
    name: 'Sales Performance Dashboard', 
    icon: 'ShoppingCart', 
    category: 'Sales',
    description: 'Pre-configured sales performance report with key metrics',
    tags: ['Sales', 'Performance', 'Dashboard'],
    usageCount: 45
  },
  { 
    id: '5', 
    name: 'Revenue Analysis', 
    icon: 'ShoppingCart', 
    category: 'Sales',
    description: 'Detailed revenue breakdown by product and region',
    tags: ['Sales', 'Revenue', 'Analysis'],
    usageCount: 62
  },
  { 
    id: '6', 
    name: 'Sales Pipeline Report', 
    icon: 'ShoppingCart', 
    category: 'Sales',
    description: 'Track deals through sales pipeline stages',
    tags: ['Sales', 'Pipeline', 'Forecast'],
    usageCount: 38
  },
  { 
    id: '7', 
    name: 'Stock Level Report', 
    icon: 'Package', 
    category: 'Inventory',
    description: 'Current inventory levels and stock status',
    tags: ['Inventory', 'Stock', 'Levels'],
    usageCount: 34
  },
  { 
    id: '8', 
    name: 'Inventory Turnover', 
    icon: 'Package', 
    category: 'Inventory',
    description: 'Track inventory turnover rates and trends',
    tags: ['Inventory', 'Turnover', 'Analysis'],
    usageCount: 28
  },
  { 
    id: '9', 
    name: 'Reorder Point Report', 
    icon: 'Package', 
    category: 'Inventory',
    description: 'Automated reorder recommendations',
    tags: ['Inventory', 'Reorder', 'Recommendations'],
    usageCount: 41
  },
  { 
    id: '10', 
    name: 'HR Headcount Report', 
    icon: 'Users', 
    category: 'HR',
    description: 'Employee headcount by department and role',
    tags: ['HR', 'Headcount', 'Employees'],
    usageCount: 29
  },
  { 
    id: '11', 
    name: 'Employee Performance', 
    icon: 'Users', 
    category: 'HR',
    description: 'Performance reviews and ratings dashboard',
    tags: ['HR', 'Performance', 'Reviews'],
    usageCount: 36
  },
  { 
    id: '12', 
    name: 'Turnover Analysis', 
    icon: 'Users', 
    category: 'HR',
    description: 'Employee turnover rates and trends',
    tags: ['HR', 'Turnover', 'Analysis'],
    usageCount: 22
  },
  { 
    id: '13', 
    name: 'Production Efficiency', 
    icon: 'Factory', 
    category: 'Operations',
    description: 'Manufacturing efficiency metrics and KPIs',
    tags: ['Operations', 'Production', 'Efficiency'],
    usageCount: 31
  },
  { 
    id: '14', 
    name: 'Downtime Analysis', 
    icon: 'Factory', 
    category: 'Operations',
    description: 'Equipment downtime tracking and analysis',
    tags: ['Operations', 'Downtime', 'Maintenance'],
    usageCount: 27
  },
];

// ==================== HELPER FUNCTIONS ====================
export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

export const getColorClass = (color: string, type: 'bg' | 'text' | 'border' = 'bg'): string => {
  const colorMap: Record<string, Record<string, string>> = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-400/30' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-400/30' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-400/30' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-400/30' },
    red: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-400/30' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-400/30' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-400/30' },
  };
  return colorMap[color]?.[type] || colorMap.blue[type];
};







