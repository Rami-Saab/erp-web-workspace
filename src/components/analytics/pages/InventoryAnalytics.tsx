// ==================== INVENTORY ANALYTICS PAGE ====================
import React, { useState } from 'react';
import {
  Truck
} from 'lucide-react';
import {
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, Line
} from 'recharts';

import { KPICard, KPIGrid } from '../components/KPICard';
import { ChartContainer, TimeRangeSelect } from '../components/ChartContainer';
import { DataTable, UrgencyBadge, CurrencyDisplay, StatusBadge } from '../components/DataTable';
import {
  inventoryKPIs,
  inventoryTurnover,
  stockAging,
  inventoryByCategory,
  inventoryByWarehouse,
  reorderRecommendations,
  slowMovingItems,
  CHART_COLORS,
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

export const InventoryAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [activeView, setActiveView] = useState<'overview' | 'aging' | 'reorder' | 'warehouse'>('overview');

  // Reorder recommendations columns
  const reorderColumns = [
    { 
      key: 'sku', 
      header: 'SKU', 
      render: (v: unknown) => <span className="text-blue-400 font-mono text-sm">{v as string}</span>
    },
    { key: 'name', header: 'Product', sortable: true },
    { key: 'currentStock', header: 'Current', align: 'right' as const, sortable: true },
    { key: 'reorderPoint', header: 'Reorder Point', align: 'right' as const },
    { key: 'recommended', header: 'Recommended Qty', align: 'right' as const },
    { 
      key: 'estimatedCost', 
      header: 'Est. Cost', 
      align: 'right' as const,
      render: (v: unknown) => <CurrencyDisplay value={v as number} />
    },
    { 
      key: 'urgency', 
      header: 'Urgency', 
      align: 'center' as const,
      render: (v: unknown) => <UrgencyBadge urgency={v as 'critical' | 'high' | 'medium' | 'low'} />
    },
  ];

  // Slow moving items columns
  const slowMovingColumns = [
    { 
      key: 'sku', 
      header: 'SKU', 
      render: (v: unknown) => <span className="text-blue-400 font-mono text-sm">{v as string}</span>
    },
    { key: 'name', header: 'Product', sortable: true },
    { key: 'category', header: 'Category' },
    { key: 'currentStock', header: 'Stock', align: 'right' as const },
    { key: 'daysOfSupply', header: 'Days of Supply', align: 'right' as const },
    { 
      key: 'turnoverRate', 
      header: 'Turnover', 
      align: 'right' as const,
      render: (v: unknown) => <span className="text-red-400">{(v as number)}x</span>
    },
    { 
      key: 'status', 
      header: 'Status', 
      align: 'center' as const,
      render: (v: unknown) => <StatusBadge status={v as string} variant="warning" />
    },
  ];

  // Warehouse columns
  const warehouseColumns = [
    { key: 'warehouse', header: 'Warehouse' },
    { key: 'items', header: 'Items', align: 'right' as const, sortable: true },
    { 
      key: 'value', 
      header: 'Value', 
      align: 'right' as const,
      render: (v: unknown) => <CurrencyDisplay value={v as number} compact />
    },
    { 
      key: 'utilization', 
      header: 'Utilization', 
      align: 'right' as const,
      render: (v: unknown) => {
        const val = v as number;
        return (
          <div className="flex items-center gap-2 justify-end">
            <div className="w-20 bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${val >= 80 ? 'bg-red-500' : val >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${val}%` }}
              />
            </div>
            <span className="text-white/70 text-sm w-10 text-right">{val}%</span>
          </div>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'aging', label: 'Stock Aging' },
          { id: 'reorder', label: 'Reorder' },
          { id: 'warehouse', label: 'Warehouse' },
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
        {inventoryKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            {...kpi}
            icon={
              index === 0 ? 'Package' :
              index === 1 ? 'RefreshCw' :
              index === 2 ? 'Target' :
              'DollarSign'
            }
          />
        ))}
      </KPIGrid>

      {/* Main Content based on active view */}
      {activeView === 'overview' && (
        <>
          {/* Turnover Trend and Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Turnover Trend */}
            <ChartContainer
              title="Inventory Turnover Trend"
              subtitle="Monthly turnover ratio vs target"
              filters={<TimeRangeSelect value={timeRange} onChange={setTimeRange} />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={inventoryTurnover}>
                  <defs>
                    <linearGradient id="turnoverGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" domain={[0, 7]} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value.toFixed(1)}x`, '']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="turnover" 
                    name="Turnover"
                    stroke={CHART_COLORS.primary} 
                    fillOpacity={1} 
                    fill="url(#turnoverGradient)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target"
                    stroke={CHART_COLORS.warning} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Inventory by Category */}
            <ChartContainer
              title="Inventory by Category"
              subtitle="Distribution by product category"
            >
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={280}>
                  <PieChart>
                    <Pie
                      data={inventoryByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {inventoryByCategory.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {inventoryByCategory.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-white/80 text-sm">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium">{cat.value}%</span>
                        <span className="text-white/50 text-xs ml-2">{cat.count} items</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Critical Stock Alerts</h3>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-400/30">
                {reorderRecommendations.filter(r => r.urgency === 'critical').length} Critical
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reorderRecommendations.filter(r => r.urgency === 'critical' || r.urgency === 'high').slice(0, 4).map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border ${
                  item.urgency === 'critical' ? 'bg-red-500/10 border-red-400/30' : 'bg-orange-500/10 border-orange-400/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-mono text-sm">{item.sku}</span>
                    <UrgencyBadge urgency={item.urgency} />
                  </div>
                  <p className="text-white font-medium text-sm mb-1">{item.name}</p>
                  <p className="text-white/60 text-xs">
                    Stock: {item.currentStock} / Reorder: {item.reorderPoint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeView === 'aging' && (
        <>
          {/* Stock Aging Chart */}
          <ChartContainer
            title="Stock Aging Analysis"
            subtitle="Inventory age distribution"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockAging}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ value }: { value: number }) => `${value}%`}
                  >
                    {stockAging.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center space-y-4">
                {stockAging.map((age, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: age.color }} />
                    <div className="flex-1">
                      <p className="text-white font-medium">{age.category}</p>
                      <p className="text-white/60 text-sm">{age.count.toLocaleString()} items ({age.percentage}%)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{age.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartContainer>

          {/* Slow Moving Items */}
          <ChartContainer
            title="Slow Moving / Dead Stock"
            subtitle="Items with low turnover requiring attention"
          >
            <DataTable
              columns={slowMovingColumns}
              data={slowMovingItems as unknown as Record<string, unknown>[]}
              config={{ showPagination: false }}
            />
          </ChartContainer>
        </>
      )}

      {activeView === 'reorder' && (
        <>
          {/* Reorder Recommendations */}
          <ChartContainer
            title="Reorder Recommendations"
            subtitle="Items below or approaching reorder point"
          >
            <DataTable
              columns={reorderColumns}
              data={reorderRecommendations as unknown as Record<string, unknown>[]}
              config={{ showPagination: true, pageSize: 10 }}
            />
          </ChartContainer>

          {/* Reorder Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Critical Items', value: reorderRecommendations.filter(r => r.urgency === 'critical').length, color: 'red' },
              { label: 'High Priority', value: reorderRecommendations.filter(r => r.urgency === 'high').length, color: 'orange' },
              { label: 'Medium Priority', value: reorderRecommendations.filter(r => r.urgency === 'medium').length, color: 'yellow' },
              { label: 'Est. Reorder Cost', value: formatCurrency(reorderRecommendations.reduce((sum, r) => sum + (r.estimatedCost || 0), 0)), color: 'blue' },
            ].map((stat, i) => (
              <div key={i} className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4`}>
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${
                  stat.color === 'red' ? 'text-red-400' :
                  stat.color === 'orange' ? 'text-orange-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'warehouse' && (
        <>
          {/* Warehouse Overview */}
          <ChartContainer
            title="Warehouse Overview"
            subtitle="Stock distribution by location"
          >
            <DataTable
              columns={warehouseColumns}
              data={inventoryByWarehouse}
              config={{ showPagination: false, showSearch: false }}
            />
          </ChartContainer>

          {/* Warehouse Utilization */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventoryByWarehouse.map((wh, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{wh.warehouse}</p>
                    <p className="text-white/50 text-xs">{wh.items.toLocaleString()} items</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Utilization</span>
                    <span className={`font-medium ${
                      wh.utilization >= 80 ? 'text-red-400' : 
                      wh.utilization >= 60 ? 'text-yellow-400' : 'text-green-400'
                    }`}>{wh.utilization}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        wh.utilization >= 80 ? 'bg-red-500' : 
                        wh.utilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${wh.utilization}%` }}
                    />
                  </div>
                </div>
                <p className="text-white/60 text-sm mt-3">Value: {formatCurrency(wh.value)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryAnalytics;







