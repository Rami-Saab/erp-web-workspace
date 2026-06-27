// ==================== HR ANALYTICS PAGE ====================
import React, { useState } from 'react';
import {
  Clock, UserPlus, Award, Briefcase
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { KPICard, KPIGrid } from '../components/KPICard';
import { ChartContainer, TimeRangeSelect } from '../components/ChartContainer';
import { DataTable, TrendIndicator } from '../components/DataTable';
import {
  hrKPIs,
  headcountTrend,
  departmentDistribution,
  performanceDistribution,
  employeeTurnover,
  attendanceData,
  CHART_COLORS
} from '../data/mockData';

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  color: '#f8fafc',
  padding: '12px 16px',
};

export const HRAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [activeView, setActiveView] = useState<'overview' | 'turnover' | 'performance' | 'attendance'>('overview');

  // Turnover table columns
  const turnoverColumns = [
    { key: 'period', header: 'Period', sortable: true },
    { key: 'voluntary', header: 'Voluntary', align: 'right' as const },
    { key: 'involuntary', header: 'Involuntary', align: 'right' as const },
    { key: 'total', header: 'Total', align: 'right' as const, sortable: true },
    { 
      key: 'rate', 
      header: 'Rate', 
      align: 'right' as const,
      render: (v: unknown) => {
        const num = v as number;
        return (
          <span className={num > 4 ? 'text-red-400' : 'text-green-400'}>{num}%</span>
        );
      }
    },
  ];

  // Attendance table columns
  const attendanceColumns = [
    { key: 'period', header: 'Day' },
    { key: 'present', header: 'Present', align: 'right' as const },
    { key: 'absent', header: 'Absent', align: 'right' as const },
    { key: 'late', header: 'Late', align: 'right' as const },
    { key: 'wfh', header: 'WFH', align: 'right' as const },
    { 
      key: 'rate', 
      header: 'Attendance Rate', 
      align: 'right' as const,
      render: (v: unknown) => {
        const num = v as number;
        return (
          <span className={num >= 95 ? 'text-green-400' : num >= 90 ? 'text-yellow-400' : 'text-red-400'}>
            {num}%
          </span>
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
          { id: 'turnover', label: 'Turnover' },
          { id: 'performance', label: 'Performance' },
          { id: 'attendance', label: 'Attendance' },
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
        {hrKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            {...kpi}
            icon={
              index === 0 ? 'Users' :
              index === 1 ? 'UserMinus' :
              index === 2 ? 'Clock' :
              'DollarSign'
            }
          />
        ))}
      </KPIGrid>

      {/* Main Content based on active view */}
      {activeView === 'overview' && (
        <>
          {/* Headcount Trend and Department Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Headcount Trend */}
            <ChartContainer
              title="Headcount Trend"
              subtitle="Monthly headcount with hiring/attrition"
              filters={<TimeRangeSelect value={timeRange} onChange={setTimeRange} />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={headcountTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.6)" />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar yAxisId="right" dataKey="hired" name="Hired" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="left" name="Left" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="total" name="Total Headcount" stroke={CHART_COLORS.primary} strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Department Distribution */}
            <ChartContainer
              title="Department Distribution"
              subtitle="Headcount by department"
            >
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={280}>
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="headcount"
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value} employees`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {departmentDistribution.map((dept, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="text-white/80 text-sm">{dept.name}</span>
                      </div>
                      <span className="text-white font-medium">{dept.headcount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Open Positions', value: '12', icon: <Briefcase className="w-5 h-5" />, color: 'blue' },
              { label: 'New Hires (YTD)', value: '78', icon: <UserPlus className="w-5 h-5" />, color: 'green' },
              { label: 'Avg Training Hours', value: '24', icon: <Clock className="w-5 h-5" />, color: 'purple' },
              { label: 'Satisfaction Score', value: '4.2/5', icon: <Award className="w-5 h-5" />, color: 'yellow' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center text-${stat.color}-300`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'turnover' && (
        <>
          {/* Turnover Trend Chart */}
          <ChartContainer
            title="Employee Turnover Trend"
            subtitle="Quarterly voluntary vs involuntary turnover"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeTurnover}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="voluntary" name="Voluntary" fill={CHART_COLORS.warning} stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="involuntary" name="Involuntary" fill={CHART_COLORS.danger} stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Turnover Table */}
          <ChartContainer
            title="Turnover Details"
            subtitle="Quarterly turnover breakdown"
          >
            <DataTable
              columns={turnoverColumns}
              data={employeeTurnover as unknown as Record<string, unknown>[]}
              config={{ showPagination: false, showSearch: false }}
            />
          </ChartContainer>

          {/* Turnover Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Avg Tenure (Leavers)', value: '2.1 years', trend: -0.3 },
              { label: 'Regrettable Turnover', value: '65%', trend: -5 },
              { label: 'Cost per Turnover', value: '$45K', trend: 8 },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <p className="text-white/70 text-sm mb-2">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                  <TrendIndicator value={stat.trend} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'performance' && (
        <>
          {/* Performance Distribution */}
          <ChartContainer
            title="Performance Rating Distribution"
            subtitle="Employee performance assessment results"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {performanceDistribution.map((rating, i) => (
                <div key={i} className="text-center p-6 rounded-lg bg-white/5">
                  <div className={`text-4xl font-bold mb-2 ${
                    rating.rating === 'Exceptional' ? 'text-green-400' :
                    rating.rating === 'Exceeds' ? 'text-blue-400' :
                    rating.rating === 'Meets' ? 'text-white' :
                    rating.rating === 'Needs Improvement' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {rating.count}
                  </div>
                  <div className="text-white font-medium">{rating.rating}</div>
                  <div className="text-white/50 text-sm">{rating.percentage}%</div>
                </div>
              ))}
            </div>
          </ChartContainer>

          {/* Performance by Department */}
          <ChartContainer
            title="Performance by Department"
            subtitle="Average rating by department"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentDistribution.map(d => ({ ...d, avgRating: 3 + Math.random() * 1.5 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" domain={[0, 5]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value.toFixed(1)}/5`, 'Avg Rating']} />
                <Bar dataKey="avgRating" name="Avg Rating" radius={[4, 4, 0, 0]}>
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}

      {activeView === 'attendance' && (
        <>
          {/* Attendance Chart */}
          <ChartContainer
            title="Weekly Attendance Overview"
            subtitle="Daily attendance breakdown"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="present" name="Present" fill={CHART_COLORS.success} stackId="a" />
                <Bar dataKey="wfh" name="WFH" fill={CHART_COLORS.primary} stackId="a" />
                <Bar dataKey="late" name="Late" fill={CHART_COLORS.warning} stackId="a" />
                <Bar dataKey="absent" name="Absent" fill={CHART_COLORS.danger} stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Attendance Table */}
          <ChartContainer
            title="Attendance Details"
            subtitle="Daily attendance metrics"
          >
            <DataTable
              columns={attendanceColumns}
              data={attendanceData as unknown as Record<string, unknown>[]}
              config={{ showPagination: false, showSearch: false }}
            />
          </ChartContainer>

          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg Attendance Rate', value: '94.9%', color: 'green' },
              { label: 'WFH Rate', value: '18.2%', color: 'blue' },
              { label: 'Late Arrivals', value: '4.5%', color: 'yellow' },
              { label: 'Absenteeism', value: '3.2%', color: 'red' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 text-${stat.color}-400`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HRAnalytics;







