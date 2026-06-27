// ==================== FILTER PANEL COMPONENT ====================
import React, { useState } from 'react';
import { 
  Filter, X, ChevronDown, Search, Check,
  RotateCcw, SlidersHorizontal
} from 'lucide-react';
import { CustomSelect } from '../../ui/CustomSelect';
import { DateInput } from '../../ui/DateInput';
import type { FilterConfig, FilterPanelProps } from '../types/analytics.types';

// Select dropdown component - now using CustomSelect
const SelectInput: React.FC<{
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, options, onChange, placeholder = 'Select...' }) => {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={options.map(opt => ({ value: opt.value, label: opt.label }))}
      placeholder={placeholder}
    />
  );
};

// Keep old implementation for reference (commented out)
/*
const SelectInputOld: React.FC<{
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, options, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <span className={selectedOption ? 'text-white' : 'text-white/50'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center justify-between
                  ${value === opt.value ? 'bg-blue-500/20 text-blue-300' : 'text-white/80 hover:bg-white/10'}
                `}
              >
                {opt.label}
                {value === opt.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Multi-select component
const MultiSelectInput: React.FC<{
  values: string[];
  options: { label: string; value: string }[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}> = ({ values, options, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabels = options
    .filter(opt => values.includes(opt.value))
    .map(opt => opt.label);

  const toggleOption = (optValue: string) => {
    if (values.includes(optValue)) {
      onChange(values.filter(v => v !== optValue));
    } else {
      onChange([...values, optValue]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <span className={selectedLabels.length > 0 ? 'text-white truncate' : 'text-white/50'}>
          {selectedLabels.length > 0 
            ? selectedLabels.length > 2 
              ? `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`
              : selectedLabels.join(', ')
            : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center justify-between
                  ${values.includes(opt.value) ? 'bg-blue-500/20 text-blue-300' : 'text-white/80 hover:bg-white/10'}
                `}
              >
                {opt.label}
                {values.includes(opt.value) && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Search input component
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
    />
    {value && (
      <button 
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

// Checkbox component
const CheckboxInput: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div className={`
      w-5 h-5 rounded border transition-colors flex items-center justify-center
      ${checked 
        ? 'bg-blue-500 border-blue-500' 
        : 'bg-white/5 border-white/20 group-hover:border-white/40'}
    `}>
      {checked && <Check className="w-3 h-3 text-white" />}
    </div>
    <span className="text-white/80 text-sm">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
  </label>
);

// Main FilterPanel Component
export const FilterPanel: React.FC<FilterPanelProps & {
  collapsed?: boolean;
  onToggle?: () => void;
}> = ({
  filters,
  values,
  onChange,
  onReset,
  className = '',
  collapsed = false,
  onToggle,
}) => {
  const handleFilterChange = (filterId: string, value: unknown) => {
    onChange({ ...values, [filterId]: value });
  };

  const activeFiltersCount = Object.values(values).filter(v => 
    v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.id];

    switch (filter.type) {
      case 'select':
        return (
          <SelectInput
            value={(value as string) || ''}
            options={filter.options || []}
            onChange={(v) => handleFilterChange(filter.id, v)}
            placeholder={`Select ${filter.label.toLowerCase()}`}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectInput
            values={(value as string[]) || []}
            options={filter.options || []}
            onChange={(v) => handleFilterChange(filter.id, v)}
            placeholder={`Select ${filter.label.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <DateInput
            value={(value as string) || ''}
            onChange={(v) => handleFilterChange(filter.id, v)}
          />
        );

      case 'daterange':
        const dateRange = (value as { start: string; end: string }) || { start: '', end: '' };
        return (
          <div className="flex gap-2">
            <DateInput
              value={dateRange.start}
              onChange={(v) => handleFilterChange(filter.id, { ...dateRange, start: v })}
              placeholder="Start date"
            />
            <DateInput
              value={dateRange.end}
              onChange={(v) => handleFilterChange(filter.id, { ...dateRange, end: v })}
              placeholder="End date"
            />
          </div>
        );

      case 'search':
        return (
          <SearchInput
            value={(value as string) || ''}
            onChange={(v) => handleFilterChange(filter.id, v)}
            placeholder={`Search ${filter.label.toLowerCase()}`}
          />
        );

      case 'checkbox':
        return (
          <CheckboxInput
            checked={(value as boolean) || false}
            onChange={(v) => handleFilterChange(filter.id, v)}
            label={filter.label}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div 
        className="px-4 py-3 border-b border-white/10 flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-white/70" />
          <span className="text-white font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onReset && activeFiltersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="text-white/60 hover:text-white text-sm flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          {onToggle && (
            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          )}
        </div>
      </div>

      {/* Filters */}
      {!collapsed && (
        <div className="p-4 space-y-4">
          {filters.map((filter) => (
            <div key={filter.id}>
              {filter.type !== 'checkbox' && (
                <label className="block text-white/70 text-sm mb-1.5">{filter.label}</label>
              )}
              {renderFilter(filter)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Quick filter bar (horizontal filters)
export const QuickFilterBar: React.FC<{
  filters: FilterConfig[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onReset?: () => void;
}> = ({ filters, values, onChange, onReset }) => {
  const handleFilterChange = (filterId: string, value: unknown) => {
    onChange({ ...values, [filterId]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Filter className="w-5 h-5 text-white/60" />
      
      {filters.map((filter) => {
        if (filter.type === 'select') {
          return (
            <select
              key={filter.id}
              value={(values[filter.id] as string) || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="" className="bg-slate-800">{filter.label}</option>
              {filter.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-800">
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }
        return null;
      })}

      {onReset && Object.keys(values).some(k => values[k]) && (
        <button
          onClick={onReset}
          className="text-white/60 hover:text-white text-sm flex items-center gap-1 px-3 py-1.5"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterPanel;



















