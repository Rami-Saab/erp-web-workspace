// ==================== ANALYTICS MODULE - MAIN COMPONENT ====================
import React, { useState, useCallback } from 'react';
import {
  BarChart3, Briefcase, DollarSign, ShoppingCart, Package,
  Users, Factory, FileText, Bell, Brain, RefreshCw,
  ChevronDown
} from 'lucide-react';

// Import pages
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { FinanceAnalytics } from './pages/FinanceAnalytics';
import { SalesAnalytics } from './pages/SalesAnalytics';
import { InventoryAnalytics } from './pages/InventoryAnalytics';
import { HRAnalytics } from './pages/HRAnalytics';
import { OperationsAnalytics } from './pages/OperationsAnalytics';
import { SmartReports } from './pages/SmartReports';
import { AlertsCenter } from './pages/AlertsCenter';
import { PredictiveAnalytics } from './pages/PredictiveAnalytics';

// Import components
import { ExportButton } from './components/ExportButton';
import { CustomSelect } from '../ui/CustomSelect';

// Import data
import { activeAlerts } from './data/mockData';

// Types
import type { AnalyticsTab, DateRangePreset } from './types/analytics.types';

// Tab configuration
const tabs: { id: AnalyticsTab; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'executive', label: 'Executive', icon: <Briefcase className="w-4 h-4" />, description: 'High-level business overview' },
  { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" />, description: 'P&L, Cash Flow, AR/AP' },
  { id: 'sales', label: 'Sales', icon: <ShoppingCart className="w-4 h-4" />, description: 'Revenue, Pipeline, Performance' },
  { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" />, description: 'Stock levels, Turnover, Reorder' },
  { id: 'hr', label: 'HR', icon: <Users className="w-4 h-4" />, description: 'Headcount, Turnover, Performance' },
  { id: 'operations', label: 'Operations', icon: <Factory className="w-4 h-4" />, description: 'Efficiency, Downtime, Production' },
  { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" />, description: 'Custom reports and templates' },
  { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" />, description: 'Notifications and rules' },
  { id: 'predictive', label: 'Predictive', icon: <Brain className="w-4 h-4" />, description: 'Forecasts and AI insights' },
];

// Date range presets
const dateRangePresets: { label: string; value: DateRangePreset }[] = [
  { label: 'This Week', value: 'today' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'This Quarter', value: 'thisQuarter' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last Quarter', value: 'lastQuarter' },
];

interface AnalyticsModuleProps {
  initialTab?: AnalyticsTab;
  onTabChange?: (tab: AnalyticsTab) => void;
  showSidebar?: boolean;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  initialTab = 'executive',
  onTabChange,
  showSidebar = true,
}) => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>(initialTab);
  const [dateRange, setDateRange] = useState<DateRangePreset>('thisQuarter');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle tab change
  const handleTabChange = useCallback((tab: AnalyticsTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  }, [onTabChange]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  // Handle export
  const handleExport = useCallback((format: string) => {
    console.log(`Exporting as ${format}`);
    // Export logic will be implemented when connected to backend
  }, []);

  // Navigate from drilldown
  const handleNavigate = useCallback((tab: string) => {
    handleTabChange(tab as AnalyticsTab);
  }, [handleTabChange]);

  // Render active page content
  const renderContent = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveDashboard onNavigate={handleNavigate} />;
      case 'finance':
        return <FinanceAnalytics />;
      case 'sales':
        return <SalesAnalytics />;
      case 'inventory':
        return <InventoryAnalytics />;
      case 'hr':
        return <HRAnalytics />;
      case 'operations':
        return <OperationsAnalytics />;
      case 'reports':
        return <SmartReports />;
      case 'alerts':
        return <AlertsCenter />;
      case 'predictive':
        return <PredictiveAnalytics />;
      default:
        return <ExecutiveDashboard onNavigate={handleNavigate} />;
    }
  };

  // Get active alerts count for badge
  const criticalAlertsCount = activeAlerts.filter(a => a.type === 'critical' && a.status === 'active').length;

  return (
    <div className="min-h-full flex gap-6">
      {/* Sidebar */}
      {showSidebar && (
      <aside className="w-64 flex-shrink-0">
        <div className="glass-card rounded-xl shadow-lg overflow-hidden sticky top-6">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="w-6 h-6 text-white" />
              <h3 className="text-base font-bold text-white">Analytics</h3>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Business Intelligence
            </p>
          </div>
          
          <nav className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1 relative ${
                  activeTab === tab.id
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                title={tab.description}
              >
                {React.cloneElement(tab.icon as React.ReactElement<any>, {
                  className: `w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                    activeTab === tab.id ? "text-white" : "text-white/60"
                  }`
                })}
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.id === 'alerts' && criticalAlertsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                    {criticalAlertsCount}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/60 rounded-r-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="glass-card rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Title */}
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {tabs.find(t => t.id === activeTab)?.label || 'Analytics'}
                  </h2>
                  <p className="text-xs text-white/60 mt-1">
                    {tabs.find(t => t.id === activeTab)?.description || 'Enterprise-grade insights and analytics'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {!showSidebar && (
                    <div className="min-w-[220px]">
                      <CustomSelect
                        value={activeTab}
                        onChange={(value) => handleTabChange(value as AnalyticsTab)}
                        options={tabs.map((tab) => ({
                          value: tab.id,
                          label: tab.label,
                        }))}
                        placeholder="Select section"
                        className="w-full"
                      />
                    </div>
                  )}
                  {/* Date Range Selector */}
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as DateRangePreset)}
                      className="appearance-none px-4 py-2 pr-8 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
                    >
                      {dateRangePresets.map((preset) => (
                        <option key={preset.value} value={preset.value} className="bg-slate-800">
                          {preset.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors disabled:opacity-50"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Export Button */}
                  <ExportButton
                    onExport={handleExport}
                    variant="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;



