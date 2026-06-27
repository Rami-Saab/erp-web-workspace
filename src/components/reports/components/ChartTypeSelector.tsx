// ==================== REPORTS MODULE - CHART TYPE SELECTOR COMPONENT ====================
import React from 'react';
import {
  BarChart3,
  PieChart,
  Check,
} from 'lucide-react';
import type { ChartType } from '../types/reports.types';

interface ChartOption {
  type: ChartType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const CHART_OPTIONS: ChartOption[] = [
  {
    type: 'bar',
    label: 'Bar Chart',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    description: 'Compare values across categories',
  },
  {
    type: 'pie',
    label: 'Pie Chart',
    icon: <PieChart className="w-3.5 h-3.5" />,
    description: 'Show proportions of a whole',
  },
];

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
  layout?: 'grid' | 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  value,
  onChange,
  layout = 'grid',
  size = 'md',
  showDescription = true,
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const layoutClasses = {
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'flex flex-col gap-4',
  };

  return (
    <div className={layoutClasses[layout]}>
      {CHART_OPTIONS.map((option) => {
        const isSelected = value === option.type;
        
        return (
          <button
            key={option.type}
            onClick={() => onChange(option.type)}
            className={`${sizeClasses[size]} rounded-xl border transition-all text-left group relative ${
              isSelected
                ? 'bg-blue-500/20 border-transparent'
                : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
            }`}
            style={isSelected ? {
              boxShadow: 'none',
              outline: 'none',
            } : {}}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <div className={`${iconSizes[size]} ${isSelected ? 'text-blue-300' : 'text-white/60 group-hover:text-white/80'} transition-colors`}>
                {option.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                  {option.label}
                </p>
                {showDescription && (
                  <p className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-white/50'}`}>
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// Compact variant for inline use
interface ChartTypeSelectorCompactProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSelectorCompact: React.FC<ChartTypeSelectorCompactProps> = ({
  value,
  onChange,
}) => {
  return (
    <div 
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {CHART_OPTIONS.map((option) => {
        const isSelected = value === option.type;
        
        return (
          <button
            key={option.type}
            onClick={() => onChange(option.type)}
            className={`p-1.5 rounded-lg transition ${
              isSelected
                ? 'text-white shadow-sm'
                : 'text-white/60 hover:text-white/80'
            }`}
            style={isSelected ? {
              background: "rgba(59, 130, 246, 0.25)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            } : {
              background: "transparent",
            }}
            title={option.label}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
};

export default ChartTypeSelector;


