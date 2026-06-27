// ==================== FINANCE ANALYTICS PAGE ====================
import React, { useState } from 'react';
import {
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';

import { KPICard, KPIGrid } from '../components/KPICard';
import { ChartContainer, TimeRangeSelect } from '../components/ChartContainer';
import { DataTable, CurrencyDisplay, TableProgressBar } from '../components/DataTable';
import {
  financeKPIs,
  profitLossData,
  cashFlowData,
  accountsReceivableAging,
  accountsPayableAging,
  expenseBreakdown,
  revenueBySource,
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

export const FinanceAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [activeView, setActiveView] = useState<'overview' | 'cashflow' | 'receivables'>('overview');

  // Table columns for AR aging
  const arColumns = [
    { key: 'range', header: 'Aging Range', sortable: true },
    { 
      key: 'amount', 
      header: 'Amount', 
      align: 'right' as const,
      render: (value: unknown) => <CurrencyDisplay value={value as number} compact />
    },
    { 
      key: 'percentage', 
      header: 'Percentage', 
      align: 'right' as const,
      render: (value: unknown) => <span>{(value as number)}%</span>
    },
    { 
      key: 'count', 
      header: 'Invoices', 
      align: 'right' as const
    },
    {
      key: 'distribution',
      header: 'Distribution',
      render: (_: unknown, row: Record<string, unknown>) => {
        const agingRow = row as { range: string; percentage: number };
        return (
          <TableProgressBar 
            value={agingRow.percentage} 
            color={
              agingRow.range.includes('0-30') ? 'green' :
              agingRow.range.includes('31-60') ? 'blue' :
              agingRow.range.includes('61-90') ? 'yellow' : 'red'
            }
          />
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'cashflow', label: 'Cash Flow' },
          { id: 'receivables', label: 'Receivables' },
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
        {financeKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            {...kpi}
            icon={
              index === 0 ? 'DollarSign' :
              index === 1 ? 'TrendingUp' :
              index === 2 ? 'Receipt' :
              'Wallet'
            }
          />
        ))}
      </KPIGrid>

      {/* Main Content based on active view */}
      {activeView === 'overview' && (
        <>
          {/* P&L and Revenue Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profit & Loss Waterfall */}
            <ChartContainer
              title="Profit & Loss Statement"
              subtitle="Financial breakdown"
            >
              <div className="space-y-3">
                {profitLossData.map((item, i) => {
                  const isProfit = item.type === 'profit';
                  const isExpense = item.type === 'expense';
                  const barWidth = Math.abs(item.amount) / 87000;
                  
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-32 text-right text-white/70 text-sm">{item.category}</div>
                      <div className="flex-1 relative h-8">
                        <div 
                          className={`absolute h-full rounded ${
                            isProfit ? 'bg-green-500/60' : isExpense ? 'bg-red-500/60' : 'bg-blue-500/60'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <div className={`w-24 text-right font-mono text-sm ${
                        isProfit ? 'text-green-400' : isExpense ? 'text-red-400' : 'text-white'
                      }`}>
                        {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartContainer>

            {/* Revenue by Source */}
            <ChartContainer
              title="Revenue by Source"
              subtitle="Revenue distribution breakdown"
            >
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={revenueBySource}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {revenueBySource.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {revenueBySource.map((source, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                        <span className="text-white/80 text-sm">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium">{source.value}%</span>
                        <span className="text-white/50 text-xs ml-2">{formatCurrency(source.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Expense Breakdown */}
          <ChartContainer
            title="Expense Breakdown"
            subtitle="Operating expenses by category"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {expenseBreakdown.map((expense, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5 text-center">
                  <div 
                    className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${expense.color}30` }}
                  >
                    <span style={{ color: expense.color }} className="text-lg font-bold">{expense.value}%</span>
                  </div>
                  <p className="text-white font-medium text-sm">{expense.name}</p>
                  <p className="text-white/50 text-xs mt-1">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          </ChartContainer>
        </>
      )}

      {activeView === 'cashflow' && (
        <>
          {/* Cash Flow Chart */}
          <ChartContainer
            title="Cash Flow Analysis"
            subtitle="Operating, Investing & Financing Activities"
            filters={<TimeRangeSelect value={timeRange} onChange={setTimeRange} />}
          >
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => `$${v/1000}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${(value/1000).toFixed(0)}K`, '']} />
                <Legend />
                <Bar dataKey="operating" name="Operating" stackId="a" fill={CHART_COLORS.success} />
                <Bar dataKey="investing" name="Investing" stackId="a" fill={CHART_COLORS.danger} />
                <Bar dataKey="financing" name="Financing" stackId="a" fill={CHART_COLORS.warning} />
                <Line 
                  type="monotone" 
                  dataKey="netCashFlow" 
                  name="Net Cash Flow" 
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.primary, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Cash Flow Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Operating Cash Flow', value: 6160000, change: 12.5, color: 'green' },
              { label: 'Investing Cash Flow', value: -2060000, change: -8.2, color: 'red' },
              { label: 'Financing Cash Flow', value: -660000, change: -3.4, color: 'yellow' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <p className="text-white/70 text-sm mb-2">{item.label}</p>
                <p className={`text-2xl font-bold ${item.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(item.value)}
                </p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(item.change)}% vs last period
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'receivables' && (
        <>
          {/* AR/AP Aging Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Accounts Receivable Aging"
              subtitle="Outstanding customer balances"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={accountsReceivableAging} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis type="category" dataKey="range" stroke="rgba(255,255,255,0.6)" width={100} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {accountsReceivableAging.map((_entry, index) => (
                      <Cell 
                        key={index} 
                        fill={
                          index === 0 ? CHART_COLORS.success :
                          index === 1 ? CHART_COLORS.primary :
                          index === 2 ? CHART_COLORS.warning :
                          CHART_COLORS.danger
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer
              title="Accounts Payable Aging"
              subtitle="Outstanding vendor balances"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={accountsPayableAging} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis type="category" dataKey="range" stroke="rgba(255,255,255,0.6)" width={100} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {accountsPayableAging.map((_entry, index) => (
                      <Cell 
                        key={index} 
                        fill={
                          index === 0 ? CHART_COLORS.success :
                          index === 1 ? CHART_COLORS.primary :
                          index === 2 ? CHART_COLORS.warning :
                          CHART_COLORS.danger
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* AR Aging Table */}
            <DataTable
              columns={arColumns}
              data={accountsReceivableAging as unknown as Record<string, unknown>[]}
              config={{ showPagination: false, showSearch: false }}
            />
        </>
      )}
    </div>
  );
};

export default FinanceAnalytics;







