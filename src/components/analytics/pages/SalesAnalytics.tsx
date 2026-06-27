// ==================== SALES ANALYTICS PAGE ====================
import React, { useState } from 'react';
import {
  Target, DollarSign, Layers, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, Cell, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { KPICard, KPIGrid } from '../components/KPICard';
import { ChartContainer, TimeRangeSelect } from '../components/ChartContainer';
import { DataTable, TrendIndicator, CurrencyDisplay, StatusBadge } from '../components/DataTable';
import {
  salesKPIs,
  salesData,
  salesByRegion,
  salesPipeline,
  topProducts,
  bottomProducts,
  salesForecast,
  salesRepPerformance,
  CHART_COLORS,
  CHART_PALETTE,
  formatCurrency
} from '../data/mockData';

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  color: '#f8fafc',
  padding: '12px 16px',
};

export const SalesAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [activeView, setActiveView] = useState<'overview' | 'pipeline' | 'products' | 'team'>('overview');

  // Product table columns
  const productColumns = [
    { key: 'name', header: 'Product', sortable: true },
    { key: 'sku', header: 'SKU', render: (v: unknown) => <span className="text-blue-400 font-mono text-sm">{v as string}</span> },
    { 
      key: 'revenue', 
      header: 'Revenue', 
      align: 'right' as const,
      sortable: true,
      render: (v: unknown) => <CurrencyDisplay value={v as number} compact />
    },
    { key: 'units', header: 'Units', align: 'right' as const, sortable: true },
    { 
      key: 'growth', 
      header: 'Growth', 
      align: 'right' as const,
      sortable: true,
      render: (v: unknown) => <TrendIndicator value={v as number} />
    },
    { 
      key: 'margin', 
      header: 'Margin', 
      align: 'right' as const,
      render: (v: unknown) => <span className="text-white/70">{(v as number)}%</span>
    },
  ];

  // Sales rep table columns
  const repColumns = [
    { key: 'name', header: 'Sales Rep', sortable: true },
    { key: 'deals', header: 'Deals', align: 'right' as const, sortable: true },
    { 
      key: 'revenue', 
      header: 'Revenue', 
      align: 'right' as const,
      sortable: true,
      render: (v: unknown) => <CurrencyDisplay value={v as number} compact />
    },
    { 
      key: 'quota', 
      header: 'Quota', 
      align: 'right' as const,
      render: (v: unknown) => <CurrencyDisplay value={v as number} compact />
    },
    { 
      key: 'achievement', 
      header: 'Achievement', 
      align: 'center' as const,
      render: (v: unknown) => (
        <StatusBadge 
          status={`${v}%`}
          variant={(v as number) >= 100 ? 'success' : (v as number) >= 90 ? 'warning' : 'danger'}
        />
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'pipeline', label: 'Pipeline' },
          { id: 'products', label: 'Products' },
          { id: 'team', label: 'Team Performance' },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as typeof activeView)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === view.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <KPIGrid columns={4}>
        {salesKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            {...kpi}
            icon={
              index === 0 ? 'ShoppingCart' :
              index === 1 ? 'Target' :
              index === 2 ? 'DollarSign' :
              'Layers'
            }
          />
        ))}
      </KPIGrid>

      {/* Main Content based on active view */}
      {activeView === 'overview' && (
        <>
          {/* Sales Trend and Regional Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <ChartContainer
              title="Sales Trend"
              subtitle="Monthly revenue and orders"
              filters={<TimeRangeSelect value={timeRange} onChange={setTimeRange} />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [
                    name === 'Revenue' ? formatCurrency(value) : value,
                    name
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke={CHART_COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Sales by Region */}
            <ChartContainer
              title="Sales by Region"
              subtitle="Regional revenue distribution"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByRegion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis type="category" dataKey="region" stroke="rgba(255,255,255,0.6)" width={110} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Sales']} />
                  <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
                    {salesByRegion.map((_entry, index) => (
                      <Cell key={index} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Sales Forecast */}
          <ChartContainer
            title="Sales Forecast"
            subtitle="6-month prediction with confidence interval"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesForecast}>
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), '']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="upperBound" 
                  name="Upper Bound"
                  stroke="transparent" 
                  fill={CHART_COLORS.primary} 
                  fillOpacity={0.1} 
                />
                <Area 
                  type="monotone" 
                  dataKey="lowerBound" 
                  name="Lower Bound"
                  stroke="transparent" 
                  fill="#0f172a" 
                  fillOpacity={1} 
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast"
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ fill: CHART_COLORS.primary, r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual"
                  stroke={CHART_COLORS.success} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.success, r: 5 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}

      {activeView === 'pipeline' && (
        <>
          {/* Sales Pipeline Funnel */}
          <ChartContainer
            title="Sales Pipeline Funnel"
            subtitle="Opportunity progression through stages"
          >
            <div className="space-y-4">
              {salesPipeline.map((stage, i) => {
                const width = ((stage.count / salesPipeline[0].count) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/70">{stage.count} deals</span>
                        <span className="text-white">{formatCurrency(stage.value)}</span>
                        {i > 0 && (
                          <span className="text-green-400">{stage.conversionRate?.toFixed(1)}% conv.</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-10 overflow-hidden">
                      <div 
                        className="h-full rounded-full flex items-center justify-center text-white text-sm font-medium transition-all"
                        style={{ 
                          width: `${width}%`, 
                          background: `linear-gradient(90deg, ${CHART_PALETTE[i]} 0%, ${CHART_PALETTE[i]}99 100%)` 
                        }}
                      >
                        {width > 15 && `${width.toFixed(0)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartContainer>

          {/* Pipeline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Pipeline Value', value: '$31.8M', icon: <Layers className="w-5 h-5" /> },
              { label: 'Avg Deal Size', value: '$50K', icon: <DollarSign className="w-5 h-5" /> },
              { label: 'Win Rate', value: '3.4%', icon: <Target className="w-5 h-5" /> },
              { label: 'Avg Sales Cycle', value: '45 days', icon: <TrendingUp className="w-5 h-5" /> },
            ].map((metric, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300">
                  {metric.icon}
                </div>
                <div>
                  <p className="text-white/70 text-sm">{metric.label}</p>
                  <p className="text-white text-xl font-bold">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'products' && (
        <>
          {/* Top Products */}
          <ChartContainer
            title="Top Performing Products"
            subtitle="Highest revenue generating products"
          >
            <DataTable
              columns={productColumns}
              data={topProducts as unknown as Record<string, unknown>[]}
              config={{ showPagination: false, showSearch: false }}
            />
          </ChartContainer>

          {/* Bottom Products */}
          <ChartContainer
            title="Underperforming Products"
            subtitle="Products requiring attention"
          >
            <DataTable
              columns={productColumns}
              data={bottomProducts as unknown as Record<string, unknown>[]}
              config={{ showPagination: false, showSearch: false }}
            />
          </ChartContainer>
        </>
      )}

      {activeView === 'team' && (
        <>
          {/* Team Performance Table */}
          <ChartContainer
            title="Sales Team Performance"
            subtitle="Individual rep metrics and quota attainment"
          >
            <DataTable
              columns={repColumns}
              data={salesRepPerformance}
              config={{ showPagination: false }}
            />
          </ChartContainer>

          {/* Team Performance Chart */}
          <ChartContainer
            title="Quota Attainment"
            subtitle="Performance vs quota by sales rep"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesRepPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.6)" domain={[0, 120]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.6)" width={120} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, 'Achievement']} />
                <Bar dataKey="achievement" radius={[0, 4, 4, 0]}>
                  {salesRepPerformance.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.achievement >= 100 ? CHART_COLORS.success : entry.achievement >= 90 ? CHART_COLORS.warning : CHART_COLORS.danger} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}
    </div>
  );
};

export default SalesAnalytics;







