// ==================== PREDICTIVE ANALYTICS PAGE ====================
import React, { useState } from 'react';
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, Activity
} from 'lucide-react';
import {
  BarChart, Bar, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart
} from 'recharts';

import { ChartContainer } from '../components/ChartContainer';
import {
  predictions,
  aiInsights,
  scenarioComparisons,
  salesForecast,
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

// Icon mapping for insights
const insightIcons: Record<string, React.ReactNode> = {
  opportunity: <TrendingUp className="w-5 h-5" />,
  risk: <AlertTriangle className="w-5 h-5" />,
  recommendation: <Lightbulb className="w-5 h-5" />,
  anomaly: <Activity className="w-5 h-5" />,
};

// Color mapping for insight types
const insightColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  opportunity: { bg: 'bg-green-500/10', border: 'border-green-400/30', text: 'text-green-300', icon: 'bg-green-500/20' },
  risk: { bg: 'bg-red-500/10', border: 'border-red-400/30', text: 'text-red-300', icon: 'bg-red-500/20' },
  recommendation: { bg: 'bg-blue-500/10', border: 'border-blue-400/30', text: 'text-blue-300', icon: 'bg-blue-500/20' },
  anomaly: { bg: 'bg-yellow-500/10', border: 'border-yellow-400/30', text: 'text-yellow-300', icon: 'bg-yellow-500/20' },
};

export const PredictiveAnalytics: React.FC = () => {
  const [activeView, setActiveView] = useState<'forecasts' | 'insights' | 'scenarios'>('forecasts');
  const [insightFilter, setInsightFilter] = useState<'all' | 'opportunity' | 'risk' | 'recommendation' | 'anomaly'>('all');

  // Filter insights
  const filteredInsights = insightFilter === 'all'
    ? aiInsights
    : aiInsights.filter(i => i.type === insightFilter);

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'forecasts', label: 'Forecasts' },
          { id: 'insights', label: 'AI Insights' },
          { id: 'scenarios', label: 'Scenarios' },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as typeof activeView)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === view.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Main Content based on active view */}
      {activeView === 'forecasts' && (
        <>
          {/* Prediction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.slice(0, 6).map((prediction) => (
              <div key={prediction.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-400/30">
                    {prediction.confidence}% confidence
                  </span>
                </div>
                <p className="text-white/70 text-sm mb-1">{prediction.title}</p>
                <p className="text-white text-2xl font-bold mb-1">{prediction.value}</p>
                <p className="text-white/50 text-xs">{prediction.subtitle}</p>
                {prediction.methodology && (
                  <p className="text-purple-300/60 text-xs mt-3 italic">Method: {prediction.methodology}</p>
                )}
              </div>
            ))}
          </div>

          {/* Sales Forecast Chart */}
          <ChartContainer
            title="Sales Forecast"
            subtitle="6-month prediction with confidence interval"
          >
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={salesForecast}>
                <defs>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
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
                  fill={CHART_COLORS.secondary} 
                  fillOpacity={0.15} 
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
                  stroke={CHART_COLORS.secondary} 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ fill: CHART_COLORS.secondary, r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual"
                  stroke={CHART_COLORS.success} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.success, r: 5 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Forecast Accuracy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Model Accuracy', value: '94.2%', description: 'Historical prediction accuracy' },
              { label: 'Forecast Horizon', value: '6 months', description: 'Maximum reliable forecast period' },
              { label: 'Last Updated', value: '2 hours ago', description: 'Model retraining frequency' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className="text-white text-xl font-bold mt-1">{stat.value}</p>
                <p className="text-white/50 text-xs mt-1">{stat.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'insights' && (
        <>
          {/* Insight Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/60 text-sm">Filter by type:</span>
            {['all', 'opportunity', 'risk', 'recommendation', 'anomaly'].map((filter) => (
              <button
                key={filter}
                onClick={() => setInsightFilter(filter as typeof insightFilter)}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                  insightFilter === filter
                    ? filter === 'opportunity' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                      filter === 'risk' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                      filter === 'recommendation' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                      filter === 'anomaly' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                      'bg-white/10 text-white border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* AI Insights */}
          <ChartContainer
            title="AI-Powered Insights"
            subtitle="Machine learning generated recommendations and alerts"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInsights.map((insight) => {
                const colors = insightColors[insight.type];
                return (
                  <div key={insight.id} className={`p-5 rounded-xl border ${colors.bg} ${colors.border}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon} ${colors.text}`}>
                        {insightIcons[insight.type]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium">{insight.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                            insight.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                            insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {insight.impact} impact
                          </span>
                        </div>
                        <p className="text-white/70 text-sm">{insight.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-white/50 text-xs">{insight.module}</span>
                          {insight.actionable && (
                            <button className="px-3 py-1 bg-white/10 hover:bg-white/15 rounded text-white text-xs transition-colors">
                              Take Action
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartContainer>

          {/* Insight Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { type: 'opportunity', label: 'Opportunities', count: aiInsights.filter(i => i.type === 'opportunity').length },
              { type: 'risk', label: 'Risks', count: aiInsights.filter(i => i.type === 'risk').length },
              { type: 'recommendation', label: 'Recommendations', count: aiInsights.filter(i => i.type === 'recommendation').length },
              { type: 'anomaly', label: 'Anomalies', count: aiInsights.filter(i => i.type === 'anomaly').length },
            ].map((stat, i) => {
              const colors = insightColors[stat.type];
              return (
                <div key={i} className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon} ${colors.text}`}>
                      {insightIcons[stat.type]}
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">{stat.label}</p>
                      <p className={`text-xl font-bold ${colors.text}`}>{stat.count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeView === 'scenarios' && (
        <>
          {/* Scenario Comparison */}
          <ChartContainer
            title="Scenario Analysis"
            subtitle="Compare baseline, optimistic, and pessimistic projections"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={scenarioComparisons}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="scenario" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="pessimistic" name="Pessimistic" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" name="Baseline" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimistic" name="Optimistic" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Scenario Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarioComparisons.map((scenario, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{scenario.scenario}</h3>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-400/30">
                    {scenario.probability}% probability
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-400/30">
                    <p className="text-white/60 text-xs mb-1">Pessimistic</p>
                    <p className="text-red-300 font-bold">
                      {typeof scenario.pessimistic === 'number' && scenario.pessimistic > 1000 
                        ? formatCurrency(scenario.pessimistic) 
                        : scenario.pessimistic}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-400/30">
                    <p className="text-white/60 text-xs mb-1">Baseline</p>
                    <p className="text-blue-300 font-bold">
                      {typeof scenario.baseline === 'number' && scenario.baseline > 1000 
                        ? formatCurrency(scenario.baseline) 
                        : scenario.baseline}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                    <p className="text-white/60 text-xs mb-1">Optimistic</p>
                    <p className="text-green-300 font-bold">
                      {typeof scenario.optimistic === 'number' && scenario.optimistic > 1000 
                        ? formatCurrency(scenario.optimistic) 
                        : scenario.optimistic}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* What-If Analysis Tool */}
          <ChartContainer
            title="What-If Analysis"
            subtitle="Adjust parameters to see projected outcomes"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Sales Growth', current: 8, min: -10, max: 30, unit: '%' },
                { label: 'Cost Reduction', current: 5, min: 0, max: 20, unit: '%' },
                { label: 'Market Expansion', current: 2, min: 0, max: 10, unit: ' markets' },
              ].map((param, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-white/70 text-sm">{param.label}</label>
                    <span className="text-white font-medium">{param.current}{param.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    value={param.current}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
                  />
                  <div className="flex justify-between text-white/50 text-xs">
                    <span>{param.min}{param.unit}</span>
                    <span>{param.max}{param.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Projected Annual Revenue Impact</p>
                  <p className="text-purple-300 text-2xl font-bold">+$1.8M</p>
                </div>
                <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg text-purple-300 text-sm transition-colors">
                  Run Analysis
                </button>
              </div>
            </div>
          </ChartContainer>
        </>
      )}
    </div>
  );
};

export default PredictiveAnalytics;







