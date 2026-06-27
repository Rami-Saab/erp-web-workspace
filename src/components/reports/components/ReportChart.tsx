// ==================== REPORTS MODULE - REPORT CHART COMPONENT ====================
import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  RefreshCw,
  Download,
} from 'lucide-react';
import type { ChartDataPoint, ChartType } from '../types/reports.types';
import { formatCurrency } from '../data/mockData';

interface ReportChartProps {
  data: ChartDataPoint[];
  type: ChartType;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showValues?: boolean;
  onFullscreen?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  valueFormat?: 'currency' | 'number' | 'percent';
  colors?: string[];
  onTypeChange?: (type: ChartType) => void;
  actionButtons?: React.ReactNode;
}

// Default color palette
const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
];

export const ReportChart: React.FC<ReportChartProps> = ({
  data,
  type,
  title,
  height = 300,
  showLegend = true,
  showValues = false,
  onFullscreen,
  onRefresh,
  onExport,
  valueFormat = 'number',
  colors = DEFAULT_COLORS,
  onTypeChange,
  actionButtons,
}) => {
  // Local state for chart type if no external handler provided
  const [localChartType, setLocalChartType] = useState<ChartType>(type);
  const currentType = onTypeChange ? type : localChartType;
  
  const handleTypeToggle = () => {
    const newType: ChartType = currentType === 'bar' ? 'pie' : 'bar';
    if (onTypeChange) {
      onTypeChange(newType);
    } else {
      setLocalChartType(newType);
    }
  };
  
  // Check if this is Inventory Aging Analysis report
  const isInventoryAging = title === 'Inventory Aging Analysis';
  // Calculate chart dimensions
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  // Sort data in descending order for bar chart (highest to lowest)
  const sortedData = useMemo(() => {
    if (currentType !== 'bar') return data;
    const sorted = [...data].sort((a, b) => b.value - a.value);
    return sorted;
  }, [data, currentType]);

  // Format value based on format type
  const formatValue = (value: number): string => {
    switch (valueFormat) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  // Get chart icon
  const getChartIcon = () => {
    switch (currentType) {
      case 'bar': return <BarChart3 className="w-5 h-5" />;
      case 'line': return <LineChart className="w-5 h-5" />;
      case 'pie':
      case 'donut': return <PieChart className="w-5 h-5" />;
      case 'area': return <AreaChart className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  // Render Bar Chart (Horizontal)
  const renderBarChart = () => {
    // Fixed maximum width for all bars to ensure consistent spacing
    // This ensures all bars have the same max width, leaving space for value label + gap + hover expansion
    // Max bar width: 70% (leaves 30% for value + gap)
    // When bar expands 5% on hover: 70% * 1.05 = 73.5%, leaving ~26.5% for value + gap (safe margin)
    const FIXED_MAX_BAR_WIDTH = 70;
    
    return (
      <div className="relative w-full h-full flex flex-col">
        {/* Chart content */}
        <div className="flex flex-col gap-4 h-full px-5 py-6">
          {sortedData.map((point, index) => {
            const barWidth = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
            // Use color from sorted point (color is preserved during sort)
            const color = point.color || colors[index % colors.length];
            // Use fixed max width for all bars to ensure consistent spacing
            const adjustedBarWidth = Math.min(barWidth, FIXED_MAX_BAR_WIDTH);
            
            return (
              <div 
                key={point.label} 
                className="flex flex-col gap-2.5 w-full"
                style={{ minHeight: '60px' }}
              >
                {/* Label row - consistent width and alignment */}
                <div className="flex items-center mb-1" style={{ minHeight: '20px', width: '100%' }}>
                  <span className="text-sm text-white/90 font-semibold leading-tight">
                    {point.label}
                  </span>
                </div>
                
                {/* Bar container with value label positioned next to bar */}
                <div className="flex items-center w-full" style={{ minHeight: '38px', gap: '12px' }}>
                  {/* Horizontal Bar - width based on value, constrained to fixed max width for all bars */}
                  <div 
                    className="flex-shrink-0 overflow-hidden" 
                    style={{ 
                      minHeight: '38px',
                      width: `${adjustedBarWidth}%`,
                      maxWidth: `${FIXED_MAX_BAR_WIDTH}%`,
                    }}
                  >
                    <div
                      className="h-full rounded-lg transition-all duration-200 cursor-pointer relative group"
                      style={{
                        width: '100%',
                        height: '38px',
                        minWidth: adjustedBarWidth > 0 ? '20px' : '0',
                        background: `linear-gradient(to right, ${color}dd, ${color})`,
                        boxShadow: `0 2px 8px ${color}50, inset 0 1px 1px rgba(255, 255, 255, 0.2)`,
                        transformOrigin: 'left center',
                      }}
                      onMouseEnter={(e) => {
                        // Reduced expansion to 2% and ensure it doesn't exceed container
                        e.currentTarget.style.transform = 'scaleX(1.02)';
                        e.currentTarget.style.boxShadow = `0 4px 12px ${color}70, inset 0 1px 1px rgba(255, 255, 255, 0.3)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleX(1)';
                        e.currentTarget.style.boxShadow = `0 2px 8px ${color}50, inset 0 1px 1px rgba(255, 255, 255, 0.2)`;
                      }}
                    >
                    </div>
                  </div>
                  
                  {/* Value label - positioned next to bar end with consistent spacing */}
                  <div className="flex-shrink-0">
                    <div 
                      className="px-2.5 py-1.5 rounded-lg text-xs text-white font-bold font-mono whitespace-nowrap"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${color}dd, ${color})`,
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${color}80`,
                        boxShadow: `0 2px 8px ${color}40, inset 0 1px 1px rgba(255, 255, 255, 0.15)`,
                        height: '38px',
                        width: 'auto',
                        minWidth: 'fit-content',
                      }}
                    >
                      {formatValue(point.value)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Line Chart
  const renderLineChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = maxValue > 0 ? 100 - (point.value / maxValue) * 100 : 100;
      return { x, y, ...point };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPathD = `${pathD} L 100 100 L 0 100 Z`;
    const yAxisSteps = 5;
    const yAxisValues = Array.from({ length: yAxisSteps }, (_, i) => 
      (maxValue / (yAxisSteps - 1)) * (yAxisSteps - 1 - i)
    );

    return (
      <div className="relative w-full h-full">
        {/* Chart content */}
        <div className="px-3 pb-6">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Grid lines - subtle */}
            {yAxisValues.map((value, i) => {
              const y = (i / (yAxisSteps - 1)) * 100;
              return (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="2,2"
                  strokeWidth="0.5"
                />
              );
            })}
            
            {/* Area fill - subtle */}
            <path
              d={areaPathD}
              fill="url(#lineGradient)"
              opacity="0.2"
            />
            
            {/* Line - clean and professional */}
            <path
              d={pathD}
              fill="none"
              stroke={colors[0]}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            
            {/* Points - simple and clear */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  fill={colors[0]}
                  stroke="white"
                  strokeWidth="1.5"
                  className="cursor-pointer"
                />
              </g>
            ))}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors[0]} stopOpacity="0.3" />
                <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-1.5">
            {data.map((point) => (
              <span key={point.label} className="text-[9px] text-white/60 font-medium leading-tight">
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Pie/Donut Chart
  const renderPieChart = () => {
    let currentAngle = 0;
    const centerX = 50;
    const centerY = 50;
    const radius = type === 'donut' ? 35 : 40;
    const innerRadius = type === 'donut' ? 20 : 0;

    const slices = data.map((point, index) => {
      const percentage = total > 0 ? (point.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      const midAngle = (startAngle + endAngle) / 2;
      currentAngle = endAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      let pathD;
      if (type === 'donut') {
        const ix1 = centerX + innerRadius * Math.cos(startRad);
        const iy1 = centerY + innerRadius * Math.sin(startRad);
        const ix2 = centerX + innerRadius * Math.cos(endRad);
        const iy2 = centerY + innerRadius * Math.sin(endRad);
        
        pathD = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} Z`;
      } else {
        pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      }

      return {
        ...point,
        pathD,
        percentage,
        color: point.color || colors[index % colors.length],
        midAngle,
      };
    });

    const chartSize = Math.min(height * 0.7, 220);
    
    // Convert hex color to rgba helper
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6 px-2 py-2">
        {/* Chart */}
        <div className="relative flex-shrink-0" style={{ width: chartSize, height: chartSize }}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" preserveAspectRatio="xMidYMid meet">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathD}
                fill={slice.color}
                className="cursor-pointer hover:opacity-80 transition-all duration-200"
                style={{ 
                  transformOrigin: 'center',
                  transition: 'transform 0.2s, opacity 0.2s',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            ))}
          </svg>
          
          {/* Center text for donut */}
          {type === 'donut' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                  {formatValue(total)}
                </p>
                <p className="text-xs text-white/60 mt-1 font-medium">Total</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend - Grid below chart */}
        {showLegend && (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {slices.map((slice, index) => (
                <div
                  key={`legend-${index}`}
                  className="flex items-center gap-4 px-6 py-5 rounded-xl border transition-all duration-200 cursor-pointer group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: '1px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
                    minHeight: '100px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-md flex-shrink-0"
                    style={{ 
                      backgroundColor: slice.color,
                      boxShadow: `0 3px 12px ${hexToRgba(slice.color, 0.7)}, inset 0 1px 1px rgba(255, 255, 255, 0.2)`,
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
                    <div className="text-sm text-white/90 font-semibold leading-tight tracking-wide">
                      {slice.label}
                    </div>
                    <div className="text-lg text-white font-semibold leading-tight">
                      {slice.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Area Chart (similar to line but filled)
  const renderAreaChart = () => renderLineChart();

  // Main render
  const renderChart = () => {
    switch (currentType) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      case 'pie':
      case 'donut':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Toggle switch for Inventory Aging Analysis - replaces icon */}
          {isInventoryAging ? (
            <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg p-1 flex items-center gap-1">
              <button
                onClick={() => {
                  if (onTypeChange) onTypeChange('bar');
                  else setLocalChartType('bar');
                }}
                className={`flex items-center justify-center w-8 h-8 rounded transition-all duration-200 ${
                  currentType === 'bar'
                    ? 'bg-blue-500/30 text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
                title="Bar Chart"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (onTypeChange) onTypeChange('pie');
                  else setLocalChartType('pie');
                }}
                className={`flex items-center justify-center w-8 h-8 rounded transition-all duration-200 ${
                  currentType === 'pie'
                    ? 'bg-blue-500/30 text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
                title="Pie Chart"
              >
                <PieChart className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-9 h-9 bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0">
              {getChartIcon()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-white font-bold text-base leading-tight truncate">
                {title}
              </h3>
            )}
            <p className="text-xs text-white/60 mt-1 font-medium">
              {currentType === 'bar' && 'Bar Chart'}
              {currentType === 'line' && 'Line Chart'}
              {currentType === 'area' && 'Area Chart'}
              {currentType === 'pie' && 'Pie Chart'}
              {currentType === 'donut' && 'Donut Chart'}
            </p>
          </div>
        </div>
        
        {/* Actions moved from ReportViewer */}
        {actionButtons && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-4 flex-wrap">
            {actionButtons}
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="px-6 py-5" style={{ minHeight: Math.min(height, 280) }}>
        {data.length > 0 ? (
          <div className="relative w-full">
            {renderChart()}
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ minHeight: Math.min(height, 280) }}>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white/30" />
              </div>
              <p className="text-[10px] font-medium text-white/60">No data available</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReportChart;


