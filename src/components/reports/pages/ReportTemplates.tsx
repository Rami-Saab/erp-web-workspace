// ==================== REPORTS MODULE - REPORT TEMPLATES PAGE ====================
import React, { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  Table,
  Eye,
  Users,
} from 'lucide-react';
import { EmptyState } from '../components';
import type { ReportTemplate, ReportModule, ChartType, Report } from '../types/reports.types';
import { MODULE_COLORS } from '../types/reports.types';
import { mockTemplates } from '../data/mockData';

interface ReportTemplatesProps {
  onPreviewTemplate?: (template: ReportTemplate) => void;
  reports?: Report[];
}

// Chart type icon mapping
const getChartIcon = (chartType: ChartType, compact: boolean = false): React.ReactNode => {
  const iconSize = compact ? "w-4 h-4" : "w-5 h-5";
  switch (chartType) {
    case 'bar': return <BarChart3 className={iconSize} />;
    case 'line': return <LineChart className={iconSize} />;
    case 'pie':
    case 'donut': return <PieChart className={iconSize} />;
    case 'area': return <AreaChart className={iconSize} />;
    case 'table': return <Table className={iconSize} />;
    default: return <BarChart3 className={iconSize} />;
  }
};

const MODULES: { value: ReportModule | 'all'; label: string }[] = [
  { value: 'all', label: 'All Modules' },
  { value: 'finance', label: 'Finance' },
  { value: 'sales', label: 'Sales' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'hr', label: 'HR' },
  { value: 'operations', label: 'Operations' },
];

export const ReportTemplates: React.FC<ReportTemplatesProps> = ({
  onPreviewTemplate,
  reports,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<ReportModule | 'all'>('all');

  // Get reports that are templates and convert them to ReportTemplate format
  const templateReports = useMemo(() => {
    if (!reports) return [];
    return reports.filter(r => r.isTemplate).map(report => ({
      id: report.id,
      name: report.name,
      description: report.description,
      module: report.module,
      chartType: report.chartType,
      tags: report.tags,
      config: report.config,
      usageCount: 0, // New templates start with 0 usage
    }));
  }, [reports]);

  // Combine mock templates with user-created template reports
  const allTemplates = useMemo(() => {
    return [...mockTemplates, ...templateReports];
  }, [templateReports]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Module filter
      if (selectedModule !== 'all' && template.module !== selectedModule) {
        return false;
      }

      return true;
    });
  }, [allTemplates, searchQuery, selectedModule]);

  // Group templates by module
  const groupedTemplates = useMemo(() => {
    const groups: Record<ReportModule, ReportTemplate[]> = {
      finance: [],
      sales: [],
      inventory: [],
      hr: [],
      operations: [],
      custom: [],
    };

    filteredTemplates.forEach(template => {
      groups[template.module].push(template);
    });

    return groups;
  }, [filteredTemplates]);

  return (
    <div className="space-y-6">

      {/* Search & Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl glass-card border border-white/15">
              {MODULES.map((module) => (
                <button
                  key={module.value}
                  onClick={() => setSelectedModule(module.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                    selectedModule === module.value
                      ? "glass-button text-white"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {module.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-10 h-10 text-white/40" />}
          title="No templates found"
          description="Try adjusting your search or filter criteria."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setSearchQuery('');
              setSelectedModule('all');
            },
          }}
        />
      ) : selectedModule === 'all' ? (
        // Grouped view - compact layout with reduced width for better spacing
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 justify-items-center lg:justify-items-start">
          {(Object.keys(groupedTemplates) as ReportModule[]).map((module) => {
            const templates = groupedTemplates[module];
            if (templates.length === 0) return null;

            const moduleColor = MODULE_COLORS[module];

            return (
              <div key={module} className="space-y-3 w-full max-w-[420px]">
                <h2 className={`text-base font-semibold ${moduleColor.text} mb-3 capitalize flex items-center gap-2`}>
                  <span 
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
                    style={{
                      backgroundColor: module === 'finance' ? '#22c55e' : 
                                      module === 'sales' ? '#3b82f6' : 
                                      module === 'inventory' ? '#a855f7' : 
                                      module === 'hr' ? '#f97316' : 
                                      module === 'operations' ? '#eab308' : 
                                      module === 'custom' ? '#ec4899' : '#ec4899'
                    }}
                  />
                  {module} Templates
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onPreview={onPreviewTemplate}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Flat view
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={onPreviewTemplate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Template Card Component
interface TemplateCardProps {
  template: ReportTemplate;
  onPreview?: (template: ReportTemplate) => void;
  compact?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  compact = false,
}) => {
  const moduleColor = MODULE_COLORS[template.module];

  if (compact) {
    return (
      <div className="glass-card rounded-xl p-4 hover:border-white/30 transition group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg ${moduleColor.bg} border ${moduleColor.border} flex items-center justify-center ${moduleColor.text}`}>
            {getChartIcon(template.chartType, true)}
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${moduleColor.bg} ${moduleColor.text} border ${moduleColor.border} capitalize inline-flex items-center gap-1.5`}>
            <span 
              className="rounded-full flex-shrink-0" 
              style={{ 
                width: '6px', 
                height: '6px', 
                minWidth: '6px', 
                minHeight: '6px',
                display: 'inline-block',
                flexShrink: 0,
                backgroundColor: template.module === 'finance' ? '#22c55e' : 
                                template.module === 'sales' ? '#3b82f6' : 
                                template.module === 'inventory' ? '#a855f7' : 
                                template.module === 'hr' ? '#f97316' : 
                                template.module === 'operations' ? '#eab308' : 
                                template.module === 'custom' ? '#ec4899' : '#ec4899'
              }} 
            />
            <span>{template.module}</span>
          </span>
        </div>

        {/* Content */}
        <h3 className="text-white font-semibold text-sm mb-1.5">{template.name}</h3>
        <p className="text-white/60 text-xs line-clamp-2 mb-3">{template.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[10px] text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Usage count */}
        <div className="flex items-center gap-1.5 text-xs text-white/50 mb-3">
          <Users className="w-3 h-3" />
          <span>Used {template.usageCount} times</span>
        </div>

        {/* Actions */}
        {onPreview && (
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <button
              onClick={() => onPreview(template)}
              className="p-1.5 bg-white/10 border border-white/20 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition"
              title="Preview"
            >
              <Eye className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 hover:border-white/30 transition group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${moduleColor.bg} border ${moduleColor.border} flex items-center justify-center ${moduleColor.text}`}>
          {getChartIcon(template.chartType)}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${moduleColor.bg} ${moduleColor.text} border ${moduleColor.border} capitalize inline-flex items-center gap-2`}>
          <span 
            className="rounded-full flex-shrink-0" 
            style={{ 
              width: '8px', 
              height: '8px', 
              minWidth: '8px', 
              minHeight: '8px',
              display: 'inline-block',
              flexShrink: 0,
              backgroundColor: template.module === 'finance' ? '#22c55e' : 
                              template.module === 'sales' ? '#3b82f6' : 
                              template.module === 'inventory' ? '#a855f7' : 
                              template.module === 'hr' ? '#f97316' : 
                              template.module === 'operations' ? '#eab308' : 
                              template.module === 'custom' ? '#ec4899' : '#ec4899'
            }} 
          />
          <span>{template.module}</span>
        </span>
      </div>

      {/* Content */}
      <h3 className="text-white font-semibold mb-2">{template.name}</h3>
      <p className="text-white/60 text-sm line-clamp-2 mb-4">{template.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {template.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white/70"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Usage count */}
      <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
        <Users className="w-4 h-4" />
        <span>Used {template.usageCount} times</span>
      </div>

      {/* Actions */}
      {onPreview && (
        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
          <button
            onClick={() => onPreview(template)}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportTemplates;


