// ==================== EXECUTIVE DASHBOARD PAGE ====================
import React from 'react';
import {
  DollarSign, TrendingUp, Users, Package,
  AlertTriangle, ArrowUpRight, ArrowDownRight, ChevronRight
} from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadialBarChart, RadialBar,
  AreaChart, Area
} from 'recharts';

import { KPICard, KPIGrid } from '../components/KPICard';
import { ChartContainer, TimeRangeSelect } from '../components/ChartContainer';
import {
  executiveKPIs,
  revenueVsExpenses,
  keyMetrics,
  CHART_COLORS,
  CHART_PALETTE
} from '../data/mockData';

// Tooltip style for all charts
const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  color: '#f8fafc',
  padding: '12px 16px',
};

interface ExecutiveDashboardProps {
  onNavigate?: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = React.useState('6m');

  // Recent activity data
  const recentActivity = [
    { icon: <DollarSign className="w-4 h-4" />, text: 'New order received: $45,000', time: '10 min ago', color: 'green' },
    { icon: <Users className="w-4 h-4" />, text: 'New enterprise client onboarded', time: '1 hour ago', color: 'blue' },
    { icon: <Package className="w-4 h-4" />, text: 'Inventory restocked: 500 units', time: '2 hours ago', color: 'purple' },
    { icon: <AlertTriangle className="w-4 h-4" />, text: 'Budget threshold alert triggered', time: '3 hours ago', color: 'yellow' },
    { icon: <TrendingUp className="w-4 h-4" />, text: 'Monthly target achieved: 105%', time: '5 hours ago', color: 'green' },
  ];

  // Department performance data
  const departmentPerformance = [
    { name: 'Sales', achievement: 92, target: 100, color: CHART_COLORS.primary },
    { name: 'Marketing', achievement: 108, target: 100, color: CHART_COLORS.secondary },
    { name: 'Operations', achievement: 105, target: 100, color: CHART_COLORS.success },
    { name: 'R&D', achievement: 78, target: 100, color: CHART_COLORS.warning },
  ];

  // World regions performance
  const regionPerformance = [
    { region: 'North America', revenue: '$3.2M', growth: 12.5, share: 37 },
    { region: 'Europe', revenue: '$2.4M', growth: 8.3, share: 28 },
    { region: 'Asia Pacific', revenue: '$1.8M', growth: 22.1, share: 21 },
    { region: 'Middle East', revenue: '$0.85M', growth: 15.7, share: 10 },
    { region: 'Latin America', revenue: '$0.45M', growth: 5.2, share: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPIGrid columns={6}>
        {executiveKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            {...kpi}
            icon={
              index === 0 ? 'DollarSign' :
              index === 1 ? 'TrendingUp' :
              index === 2 ? 'Activity' :
              index === 3 ? 'BarChart3' :
              index === 4 ? 'Target' :
              'Users'
            }
            onClick={() => kpi.drilldownPath && onNavigate?.(kpi.drilldownPath)}
          />
        ))}
      </KPIGrid>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <ChartContainer
          title="Revenue vs Expenses"
          subtitle="Monthly comparison with profit trend"
          onRefresh={() => {}}
          onExport={() => {}}
          filters={
            <TimeRangeSelect
              value={timeRange}
              onChange={setTimeRange}
            />
          }
        >
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={revenueVsExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => `$${v/1000000}M`} />
              <Tooltip 
                contentStyle={tooltipStyle} 
                formatter={(value: number) => [`$${(value/1000000).toFixed(2)}M`, '']} 
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
              <Line 
                type="monotone" 
                dataKey="profit" 
                name="Profit" 
                stroke={CHART_COLORS.success} 
                strokeWidth={3} 
                dot={{ fill: CHART_COLORS.success, r: 4 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Budget Achievement */}
        <ChartContainer
          title="Budget Achievement"
          subtitle="Department performance vs targets"
        >
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="30%" 
                outerRadius="100%" 
                data={departmentPerformance}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar 
                  dataKey="achievement" 
                  cornerRadius={10} 
                  background={{ fill: 'rgba(255,255,255,0.1)' }}
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={tooltipStyle} 
                  formatter={(value: number) => [`${value}%`, 'Achievement']} 
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-3">
              {departmentPerformance.map((dept, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span className="text-white/80 text-sm">{dept.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${dept.achievement >= 100 ? 'text-green-400' : 'text-white'}`}>
                    {dept.achievement}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <ChartContainer title="Key Metrics" subtitle="Performance indicators">
          <div className="space-y-4">
            {keyMetrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <span className="text-white/70">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{metric.value}</span>
                  <span className={`text-xs flex items-center gap-0.5 ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Regional Performance */}
        <ChartContainer 
          title="Regional Performance" 
          subtitle="Sales by geography"
          actions={
            <button 
              onClick={() => onNavigate?.('sales')}
              className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-1"
            >
              View Details <ChevronRight className="w-4 h-4" />
            </button>
          }
        >
          <div className="space-y-3">
            {regionPerformance.map((region, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{region.region}</span>
                    <span className="text-white/70 text-sm">{region.revenue}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${region.share}%`,
                        backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length]
                      }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-medium w-16 text-right ${region.growth >= 10 ? 'text-green-400' : 'text-white/60'}`}>
                  +{region.growth}%
                </span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Recent Activity */}
        <ChartContainer title="Recent Activity" subtitle="Latest updates">
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${activity.color}-500/20 text-${activity.color}-300`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{activity.text}</p>
                  <p className="text-white/50 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Bottom Row - Actual vs Target Trend */}
      <ChartContainer
        title="Actual vs Target Performance"
        subtitle="Monthly revenue comparison with target"
        onExport={() => {}}
      >
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueVsExpenses}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.warning} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_COLORS.warning} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
            <YAxis stroke="rgba(255,255,255,0.6)" tickFormatter={(v) => `$${v/1000000}M`} />
            <Tooltip 
              contentStyle={tooltipStyle} 
              formatter={(value: number) => [`$${(value/1000000).toFixed(2)}M`, '']} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              name="Actual Revenue" 
              stroke={CHART_COLORS.primary} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="target" 
              name="Target" 
              stroke={CHART_COLORS.warning} 
              fillOpacity={1} 
              fill="url(#colorTarget)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ExecutiveDashboard;







