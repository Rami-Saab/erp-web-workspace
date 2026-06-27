// ==================== REPORTS MODULE - FILTER PANEL COMPONENT ====================
import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  ChevronDown,
  Check,
  RotateCcw,
  Save,
  Bookmark,
} from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { DateInput } from '../../ui/DateInput';
import type { ReportModule, ReportStatus, DateRange, FilterPreset } from '../types/reports.types';
import { MODULE_COLORS, STATUS_COLORS } from '../types/reports.types';
import { mockFilterPresets } from '../data/mockData';

interface FilterPanelProps {
  onSearch?: (query: string) => void;
  onModuleFilter?: (modules: ReportModule[]) => void;
  onStatusFilter?: (statuses: ReportStatus[]) => void;
  onDateRangeChange?: (range: DateRange) => void;
  onTagFilter?: (tags: string[]) => void;
  onApply?: () => void;
  onReset?: () => void;
  onSavePreset?: (name: string) => void;
  onLoadPreset?: (preset: FilterPreset) => void;
  availableTags?: string[];
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

const MODULES: ReportModule[] = ['finance', 'sales', 'inventory', 'hr', 'operations', 'custom'];
const STATUSES: ReportStatus[] = ['draft', 'active', 'scheduled', 'archived'];
const DATE_PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'This Quarter', value: 'thisQuarter' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'Custom', value: 'custom' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onSearch,
  onModuleFilter,
  onStatusFilter,
  onDateRangeChange,
  onTagFilter,
  onApply,
  onReset,
  onSavePreset,
  onLoadPreset,
  availableTags = ['Sales', 'Finance', 'Inventory', 'HR', 'Operations', 'Monthly', 'Weekly', 'KPI', 'Performance'],
  isCollapsible = false,
  defaultExpanded = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModules, setSelectedModules] = useState<ReportModule[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ReportStatus[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState<string>('');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Toggle module selection
  const toggleModule = (module: ReportModule) => {
    const newModules = selectedModules.includes(module)
      ? selectedModules.filter(m => m !== module)
      : [...selectedModules, module];
    setSelectedModules(newModules);
    onModuleFilter?.(newModules);
  };

  // Toggle status selection
  const toggleStatus = (status: ReportStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    onStatusFilter?.(newStatuses);
  };

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onTagFilter?.(newTags);
  };

  // Handle date preset change
  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    if (preset !== 'custom') {
      // Calculate date range based on preset
      const now = new Date();
      let startDate = new Date();
      const endDate = new Date();

      switch (preset) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          startDate = new Date(now.setDate(now.getDate() - 1));
          startDate.setHours(0, 0, 0, 0);
          endDate.setDate(endDate.getDate() - 1);
          break;
        case 'last7days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'last30days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate.setDate(0);
          break;
        case 'thisQuarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      onDateRangeChange?.({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        preset: preset as DateRange['preset'],
      });
    }
  };

  // Handle custom date change
  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    const newRange = { ...customDateRange, [field]: value };
    setCustomDateRange(newRange);
    if (newRange.start && newRange.end) {
      onDateRangeChange?.({
        startDate: newRange.start,
        endDate: newRange.end,
        preset: 'custom',
      });
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSearchQuery('');
    setSelectedModules([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
    setDatePreset('');
    setCustomDateRange({ start: '', end: '' });
    onSearch?.('');
    onModuleFilter?.([]);
    onStatusFilter?.([]);
    onTagFilter?.([]);
    onReset?.();
  };

  // Save preset
  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset?.(presetName);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  // Load preset
  const handleLoadPreset = (preset: FilterPreset) => {
    onLoadPreset?.(preset);
    setShowPresetDropdown(false);
  };

  // Count active filters
  const activeFilterCount = selectedModules.length + selectedStatuses.length + selectedTags.length + (datePreset ? 1 : 0);

  return (
    <div className="glass-card rounded-xl">
      {/* Header */}
      <div 
        className={`flex items-center justify-between px-6 py-4 rounded-t-xl ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <p className="text-white/50 text-sm">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-white/60 hover:text-white text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
          {isCollapsible && (
            <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {/* Filter Content */}
      {(!isCollapsible || isExpanded) && (
        <div className="px-6 pb-6 pt-2 space-y-5 rounded-b-xl">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-3 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3 pt-1">
            {/* Module Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowModuleDropdown(!showModuleDropdown);
                  setShowStatusDropdown(false);
                  setShowTagDropdown(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedModules.length > 0
                    ? 'text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
                style={
                  selectedModules.length > 0
                    ? {
                        background: "rgba(59, 130, 246, 0.25)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        boxShadow:
                          "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      }
                    : {
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow:
                          "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                      }
                }
              >
                Module
                {selectedModules.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-400 text-white text-xs flex items-center justify-center">
                    {selectedModules.length}
                  </span>
                )}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showModuleDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 glass-card rounded-xl border border-white/20 shadow-xl z-50 py-2">
                  {MODULES.map((module) => {
                    const color = MODULE_COLORS[module];
                    return (
                      <button
                        key={module}
                        onClick={() => toggleModule(module)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 transition"
                      >
                        <span className={`capitalize ${color.text}`}>{module}</span>
                        {selectedModules.includes(module) && (
                          <Check className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowModuleDropdown(false);
                  setShowTagDropdown(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedStatuses.length > 0
                    ? 'text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
                style={
                  selectedStatuses.length > 0
                    ? {
                        background: "rgba(59, 130, 246, 0.25)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        boxShadow:
                          "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      }
                    : {
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow:
                          "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                      }
                }
              >
                Status
                {selectedStatuses.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-400 text-white text-xs flex items-center justify-center">
                    {selectedStatuses.length}
                  </span>
                )}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 glass-card rounded-xl border border-white/20 shadow-xl z-50 py-2">
                  {STATUSES.map((status) => {
                    const color = STATUS_COLORS[status];
                    return (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 transition"
                      >
                        <span className={`capitalize ${color.text}`}>{status}</span>
                        {selectedStatuses.includes(status) && (
                          <Check className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tags Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTagDropdown(!showTagDropdown);
                  setShowModuleDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTags.length > 0
                    ? 'text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
                style={
                  selectedTags.length > 0
                    ? {
                        background: "rgba(59, 130, 246, 0.25)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        boxShadow:
                          "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      }
                    : {
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow:
                          "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                      }
                }
              >
                Tags
                {selectedTags.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-400 text-white text-xs flex items-center justify-center">
                    {selectedTags.length}
                  </span>
                )}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showTagDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 glass-card rounded-xl border border-white/20 shadow-xl z-50 py-2 max-h-64 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 transition"
                    >
                      <span className="text-white/80">{tag}</span>
                      {selectedTags.includes(tag) && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: datePreset
                    ? "rgba(59, 130, 246, 0.25)"
                    : "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                  border: datePreset
                    ? "1px solid rgba(59, 130, 246, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: datePreset
                    ? "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)"
                    : "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                <Calendar className={`w-4 h-4 ${datePreset ? 'text-white' : 'text-white/60'}`} />
                <CustomSelect
                  value={datePreset}
                  onChange={(value) => handleDatePresetChange(value as string)}
                  options={[
                    { value: '', label: 'Date Range' },
                    ...DATE_PRESETS.map(preset => ({ value: preset.value, label: preset.label })),
                  ]}
                  placeholder="Date Range"
                  className="bg-transparent"
                />
              </div>
              
              {datePreset === 'custom' && (
                <div className="flex items-center gap-2">
                  <DateInput
                    value={customDateRange.start}
                    onChange={(value) => handleCustomDateChange('start', value)}
                    placeholder="Start date"
                    className="flex-1"
                  />
                  <span className="text-white/40">to</span>
                  <DateInput
                    value={customDateRange.end}
                    onChange={(value) => handleCustomDateChange('end', value)}
                    placeholder="End date"
                    className="flex-1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Selected Filters Pills */}
          {(selectedModules.length > 0 || selectedStatuses.length > 0 || selectedTags.length > 0) && (
            <div className="flex flex-wrap gap-2 pt-3 pb-1">
              {selectedModules.map((module) => (
                <span
                  key={module}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${MODULE_COLORS[module].bg} ${MODULE_COLORS[module].text} border ${MODULE_COLORS[module].border}`}
                >
                  {module}
                  <button onClick={() => toggleModule(module)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedStatuses.map((status) => (
                <span
                  key={status}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text} border ${STATUS_COLORS[status].border}`}
                >
                  {status}
                  <button onClick={() => toggleStatus(status)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Presets & Actions */}
          <div className="flex items-center justify-between pt-4 pb-1 border-t border-white/10">
            <div className="relative">
              <button
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white text-sm transition"
              >
                <Bookmark className="w-4 h-4" />
                Saved Filters
              </button>
              
              {showPresetDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-56 glass-card rounded-xl border border-white/20 shadow-xl z-50 py-2">
                  {mockFilterPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 transition"
                    >
                      <span className="text-white/80">{preset.name}</span>
                      {preset.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">Default</span>
                      )}
                    </button>
                  ))}
                  <hr className="my-2 border-white/10" />
                  <button
                    onClick={() => {
                      setShowPresetDropdown(false);
                      setShowSavePreset(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-blue-300 hover:bg-white/10 transition"
                  >
                    <Save className="w-4 h-4" />
                    Save Current Filters
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-white/60 hover:text-white text-sm font-medium transition"
              >
                Clear All
              </button>
              <button
                onClick={onApply}
                className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 text-sm font-medium hover:bg-blue-500/30 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Preset Modal */}
      {showSavePreset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Save Filter Preset</h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSavePreset(false)}
                className="px-4 py-2 text-white/60 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 font-medium hover:bg-blue-500/30 transition"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;


