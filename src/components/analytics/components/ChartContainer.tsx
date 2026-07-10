// ==================== CHART CONTAINER COMPONENT ====================
import React, { useState } from 'react';
import { 
  RefreshCw, Download, Maximize2, MoreHorizontal, 
  Filter, Settings 
} from 'lucide-react';
import { CustomSelect } from '../../ui/CustomSelect';
import type { ChartContainerProps } from '../types/analytics.types';

// Loading Skeleton for charts
const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="animate-pulse" style={{ height }}>
    <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-white/10 rounded-full" />
        <div className="w-24 h-3 bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

// Error state for charts
const ChartError: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
      <span className="text-red-400 text-2xl">!</span>
    </div>
    <p className="text-white/70 text-sm mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    )}
  </div>
);

// Dropdown menu for chart actions
const DropdownMenu: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onExport?: () => void;
  onFullscreen?: () => void;
  onSettings?: () => void;
}> = ({ isOpen, onClose, onExport, onFullscreen, onSettings }) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl py-1">
        {onExport && (
          <button 
            onClick={() => { onExport(); onClose(); }}
            className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        )}
        {onFullscreen && (
          <button 
            onClick={() => { onFullscreen(); onClose(); }}
            className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 text-sm flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Fullscreen
          </button>
        )}
        {onSettings && (
          <button 
            onClick={() => { onSettings(); onClose(); }}
            className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 text-sm flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        )}
      </div>
    </>
  );
};

export const ChartContainer: React.FC<ChartContainerProps & {
  height?: number;
  onFullscreen?: () => void;
  onSettings?: () => void;
  filters?: React.ReactNode;
}> = ({
  title,
  subtitle,
  children,
  loading = false,
  error,
  onRefresh,
  onExport,
  onFullscreen,
  onSettings,
  className = '',
  actions,
  filters,
  height = 300,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
            {subtitle && (
              <p className="text-white/60 text-sm mt-0.5">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {filters}
            
            {actions}
            
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            
            {(onExport || onFullscreen || onSettings) && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="More options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <DropdownMenu
                  isOpen={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  onExport={onExport}
                  onFullscreen={onFullscreen}
                  onSettings={onSettings}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {loading ? (
          <ChartSkeleton height={height} />
        ) : error ? (
          <ChartError message={error} onRetry={onRefresh} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// Preset select component for time ranges
export const TimeRangeSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
}> = ({ 
  value, 
  onChange, 
  options = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 3 months', value: '3m' },
    { label: 'Last 6 months', value: '6m' },
    { label: 'Last 12 months', value: '12m' },
    { label: 'Year to date', value: 'ytd' },
  ]
}) => (
  <CustomSelect
    value={value}
    onChange={(v) => onChange(String(v))}
    options={options.map(opt => ({ value: opt.value, label: opt.label }))}
    placeholder="Select time range..."
  />
);

// Filter button component
export const FilterButton: React.FC<{
  active?: boolean;
  onClick?: () => void;
  label?: string;
}> = ({ active = false, onClick, label = 'Filters' }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
      ${active 
        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/15 border border-white/20'
      }
    `}
  >
    <Filter className="w-4 h-4" />
    {label}
    {active && (
      <span className="w-2 h-2 bg-blue-400 rounded-full" />
    )}
  </button>
);

export default ChartContainer;







