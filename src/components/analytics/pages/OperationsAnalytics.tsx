// ==================== OPERATIONS ANALYTICS PAGE ====================
import React, { useState } from 'react';
import {
  AlertTriangle, Zap, Wrench, Clock
} from 'lucide-react';
import {
  BarChart, Bar, ComposedChart, Line, AreaChart, Area, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { KPICard, KPIGrid } from '../components/KPICard';
import { ChartContainer, TimeRangeSelect } from '../components/ChartContainer';
import { DataTable, StatusBadge, TableProgressBar } from '../components/DataTable';
import {
  operationsKPIs,
  productionLines,
  downtimeAnalysis,
  efficiencyTrend,
  resourceUtilization,
  productionVsPlan,
  CHART_COLORS,
  CHART_PALETTE
} from '../data/mockData';

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  color: '#f8fafc',
  padding: '12px 16px',
};

export const OperationsAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [activeView, setActiveView] = useState<'overview' | 'efficiency' | 'downtime' | 'resources'>('overview');

  // Production line columns (kept for future use)
  // const lineColumns = [
  //   { key: 'name', header: 'Production Line' },
  //   { 
  //     key: 'status', 
  //     header: 'Status', 
  //     render: (v: unknown) => {
  //       const status = v as string;
  //       return (
  //         <StatusBadge 
  //           status={status.charAt(0).toUpperCase() + status.slice(1)}
  //           variant={status === 'running' ? 'success' : status === 'maintenance' ? 'warning' : 'danger'}
  //         />
  //       );
  //     }
  //   },
  //   { 
  //     key: 'efficiency', 
  //     header: 'Efficiency', 
  //     align: 'right' as const,
  //     render: (v: unknown, row: typeof productionLines[0]) => {
  //       const eff = v as number;
  //       return (
  //         <span className={eff >= row.target ? 'text-green-400' : 'text-red-400'}>
  //           {eff}%
  //         </span>
  //       );
  //     }
  //   },
  //   { key: 'target', header: 'Target', align: 'right' as const, render: (v: unknown) => `${v}%` },
  //   { key: 'output', header: 'Output', align: 'right' as const, render: (v: unknown) => (v as number).toLocaleString() },
  //   { key: 'downtime', header: 'Downtime (hrs)', align: 'right' as const },
  // ];

  // Resource utilization columns
  const resourceColumns = [
    { key: 'resource', header: 'Resource' },
    { key: 'utilized', header: 'Utilized', align: 'right' as const },
    { key: 'available', header: 'Available', align: 'right' as const },
    { 
      key: 'utilizationRate', 
      header: 'Utilization', 
      render: (v: unknown) => (
        <TableProgressBar 
          value={v as number} 
          color={(v as number) >= 85 ? 'green' : (v as number) >= 70 ? 'yellow' : 'red'} 
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
          { id: 'efficiency', label: 'Efficiency' },
          { id: 'downtime', label: 'Downtime' },
          { id: 'resources', label: 'Resources' },
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
        {operationsKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            {...kpi}
            icon={
              index === 0 ? 'Activity' :
              index === 1 ? 'Factory' :
              index === 2 ? 'Clock' :
              'Calculator'
            }
          />
        ))}
      </KPIGrid>

      {/* Main Content based on active view */}
      {activeView === 'overview' && (
        <>
          {/* Production Lines Status */}
          <ChartContainer
            title="Production Line Status"
            subtitle="Real-time production line performance"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {productionLines.map((line, i) => (
                <div key={i} className={`p-4 rounded-lg border ${
                  line.status === 'running' ? 'bg-green-500/10 border-green-400/30' :
                  line.status === 'maintenance' ? 'bg-yellow-500/10 border-yellow-400/30' :
                  'bg-red-500/10 border-red-400/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{line.name}</span>
                    <StatusBadge 
                      status={line.status.charAt(0).toUpperCase() + line.status.slice(1)}
                      variant={line.status === 'running' ? 'success' : line.status === 'maintenance' ? 'warning' : 'danger'}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Efficiency</span>
                      <span className={line.efficiency >= line.target ? 'text-green-400' : 'text-red-400'}>
                        {line.efficiency}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${line.efficiency >= line.target ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${line.efficiency}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>Output: {line.output.toLocaleString()}</span>
                      <span>Target: {line.target}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>

          {/* Production vs Plan */}
          <ChartContainer
            title="Production vs Plan"
            subtitle="Weekly production performance vs planned output"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={productionVsPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="planned" name="Planned" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar dataKey="actual" name="Actual" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}

      {activeView === 'efficiency' && (
        <>
          {/* OEE Trend Chart */}
          <ChartContainer
            title="Overall Equipment Effectiveness (OEE)"
            subtitle="Availability × Performance × Quality"
            filters={<TimeRangeSelect value={timeRange} onChange={setTimeRange} />}
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={efficiencyTrend}>
                <defs>
                  <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" domain={[70, 100]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, '']} />
                <Legend />
                <Area type="monotone" dataKey="oee" name="OEE" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#oeeGradient)" strokeWidth={3} />
                <Line type="monotone" dataKey="availability" name="Availability" stroke={CHART_COLORS.success} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="performance" name="Performance" stroke={CHART_COLORS.warning} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="quality" name="Quality" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* OEE Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Availability', value: 92, target: 95, color: CHART_COLORS.success },
              { label: 'Performance', value: 94, target: 95, color: CHART_COLORS.warning },
              { label: 'Quality', value: 99, target: 99, color: CHART_COLORS.secondary },
            ].map((metric, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/70">{metric.label}</span>
                  <span className={`text-2xl font-bold ${metric.value >= metric.target ? 'text-green-400' : 'text-white'}`}>
                    {metric.value}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all"
                    style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                  />
                </div>
                <p className="text-white/50 text-sm mt-2">Target: {metric.target}%</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'downtime' && (
        <>
          {/* Downtime Analysis Chart */}
          <ChartContainer
            title="Downtime Analysis"
            subtitle="Breakdown by cause"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={downtimeAnalysis} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.6)" />
                  <YAxis type="category" dataKey="cause" stroke="rgba(255,255,255,0.6)" width={140} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value} hours`, '']} />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                    {downtimeAnalysis.map((_entry, index) => (
                      <Cell 
                        key={index} 
                        fill={
                          index === 0 ? CHART_COLORS.danger :
                          index === 1 ? CHART_COLORS.warning :
                          index === 2 ? CHART_COLORS.primary :
                          CHART_PALETTE[index % CHART_PALETTE.length]
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                <h4 className="text-white font-medium">Downtime Breakdown</h4>
                {downtimeAnalysis.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">{item.cause}</span>
                        <span className="text-white/60 text-sm">{item.hours} hrs ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: i === 0 ? CHART_COLORS.danger :
                              i === 1 ? CHART_COLORS.warning :
                              CHART_COLORS.primary
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Total Downtime</span>
                    <span className="text-white font-bold">
                      {downtimeAnalysis.reduce((sum, d) => sum + d.hours, 0)} hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ChartContainer>

          {/* Downtime Incidents */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {downtimeAnalysis.slice(0, 4).map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    i === 0 ? 'bg-red-500/20 text-red-300' :
                    i === 1 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {i === 0 ? <Wrench className="w-5 h-5" /> :
                     i === 1 ? <Clock className="w-5 h-5" /> :
                     i === 2 ? <AlertTriangle className="w-5 h-5" /> :
                     <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{item.cause}</p>
                    <p className="text-white/50 text-xs">{item.incidents} incidents</p>
                  </div>
                </div>
                <p className="text-white text-xl font-bold">{item.hours} hrs</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'resources' && (
        <>
          {/* Resource Utilization Table */}
          <ChartContainer
            title="Resource Utilization"
            subtitle="Current utilization across resources"
          >
            <DataTable
              columns={resourceColumns}
              data={resourceUtilization as unknown as Record<string, unknown>[]}
              config={{ showPagination: false, showSearch: false }}
            />
          </ChartContainer>

          {/* Resource Utilization Chart */}
          <ChartContainer
            title="Utilization Overview"
            subtitle="Resource utilization rates"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="resource" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, 'Utilization']} />
                <Bar dataKey="utilizationRate" name="Utilization" radius={[4, 4, 0, 0]}>
                  {resourceUtilization.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={
                        entry.utilizationRate >= 85 ? CHART_COLORS.success :
                        entry.utilizationRate >= 70 ? CHART_COLORS.warning :
                        CHART_COLORS.danger
                      } 
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

export default OperationsAnalytics;







