// src/components/AnalyticsPage.tsx
// Enterprise-Grade Analytics Module for ERP System
// This file wraps the modular analytics system

import { AnalyticsModule } from './analytics/AnalyticsModule';

/**
 * AnalyticsPage - Main entry point for the Analytics section
 * 
 * This component serves as a wrapper for the comprehensive analytics module
 * which includes:
 * - Executive Dashboard with KPIs and drill-downs
 * - Finance Analytics (P&L, Cash Flow, AR/AP Aging)
 * - Sales Analytics (Pipeline, Forecasts, Performance)
 * - Inventory Analytics (Turnover, Aging, Reorder)
 * - HR Analytics (Headcount, Turnover, Performance)
 * - Operations Analytics (Efficiency, Downtime, Production)
 * - Smart Reports (Report builder, Templates, Scheduling)
 * - Alerts Center (Active alerts, Rules configuration)
 * - Predictive Analytics (AI Insights, Forecasting, Scenarios)
 */
export function AnalyticsPage() {
  return <AnalyticsModule showSidebar={false} />;
}

export default AnalyticsPage;
