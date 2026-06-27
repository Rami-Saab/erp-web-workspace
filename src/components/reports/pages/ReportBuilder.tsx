// ==================== REPORTS MODULE - REPORT BUILDER PAGE ====================
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Database,
  BarChart3,
  Check,
  ChevronRight,
  Download,
  FileText,
  LineChart,
  User,
  Calendar,
  Clock,
} from 'lucide-react';
import { ReportChart, ReportTable, ChartTypeSelector } from '../components';
import { toast } from 'sonner';
import type { 
  Report, 
  Dataset, 
  ReportField, 
  ReportFilter,
  ChartType,
  BuilderStep,
  ReportModule,
  ReportStatus,
} from '../types/reports.types';
import { MODULE_COLORS, STATUS_COLORS } from '../types/reports.types';
import {
  mockDatasets,
  mockReports,
  mockSalesChartData,
  mockSalesTableData,
  getDatasetById,
  formatDate,
  formatDateTime,
  mockUsers,
} from '../data/mockData';

interface ReportBuilderProps {
  reportId?: string; // If provided, we're editing
  onBack: () => void;
  onSave: (report: Partial<Report>) => void;
}

const STEPS: { id: BuilderStep; label: string; icon: React.ReactNode }[] = [
  { id: 'dataset', label: 'Select Dataset', icon: <Database className="w-5 h-5" /> },
  { id: 'visualization', label: 'Visualization', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'preview', label: 'Preview', icon: <Eye className="w-5 h-5" /> },
];

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  reportId,
  onBack,
  onSave,
}) => {
  // Get existing report if editing
  const existingReport = reportId ? mockReports.find(r => r.id === reportId) : null;

  // State
  const [currentStep, setCurrentStep] = useState<BuilderStep>('dataset');
  const [reportName, setReportName] = useState(existingReport?.name || '');
  const [reportDescription, setReportDescription] = useState(existingReport?.description || '');
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(
    existingReport ? getDatasetById(existingReport.config.datasetId) || null : null
  );
  const [selectedDimensions, setSelectedDimensions] = useState<ReportField[]>(
    existingReport?.config.dimensions || []
  );
  const [selectedMetrics, setSelectedMetrics] = useState<ReportField[]>(
    existingReport?.config.metrics || []
  );
  const [filters] = useState<ReportFilter[]>(
    existingReport?.config.filters || []
  );
  const [chartType, setChartType] = useState<ChartType>(existingReport?.chartType || 'bar');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select fields when dataset is selected
  useEffect(() => {
    if (selectedDataset && !existingReport) {
      // Auto-select first 2 dimensions and first 2 metrics
      const dimensions = selectedDataset.fields
        .filter(f => f.type === 'dimension')
        .slice(0, 2)
        .map((field, index) => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type,
          dataType: field.dataType,
          isVisible: true,
          order: index,
        }));
      
      const metrics = selectedDataset.fields
        .filter(f => f.type === 'metric')
        .slice(0, 2)
        .map((field, index) => ({
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type,
          dataType: field.dataType,
          aggregation: 'sum' as const,
          isVisible: true,
          order: index,
        }));
      
      setSelectedDimensions(dimensions);
      setSelectedMetrics(metrics);
    }
  }, [selectedDataset, existingReport]);

  // Calculate step completion
  const stepCompletion = useMemo(() => ({
    dataset: !!selectedDataset,
    visualization: true, // Has default
    preview: true,
  }), [selectedDataset]);

  // Get current step index
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  // Navigation
  const goToStep = useCallback((step: BuilderStep) => {
    setCurrentStep(step);
  }, []);

  const goNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  }, [currentStepIndex]);

  const goPrev = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  }, [currentStepIndex]);


  // Save report (download to user's device)
  const handleSave = useCallback(() => {
    // Validate all required fields
    const errors: string[] = [];
    
    if (!reportName || reportName.trim() === '') {
      errors.push('Report name is required');
    }
    
    if (!selectedDataset) {
      errors.push('Please select a data source');
    }
    
    if (selectedDimensions.length === 0) {
      errors.push('Please select at least one dimension');
    }
    
    if (selectedMetrics.length === 0) {
      errors.push('Please select at least one metric');
    }
    
    if (!chartType) {
      errors.push('Please select a chart type');
    }
    
    // If there are errors, show detailed message
    if (errors.length > 0) {
      const errorMessage = `Please complete the following information:\n\n${errors.map((error, index) => `${index + 1}. ${error}`).join('\n')}\n\nPlease fill in all required fields before saving the report.`;
      toast.error(errorMessage, {
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);
    
    const report: Partial<Report> = {
      id: reportId || `rpt-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      module: selectedDataset?.module as ReportModule,
      status: 'draft' as ReportStatus,
      owner: mockUsers[0], // Default owner - in real app, use current user
      chartType,
      isTemplate: false,
      isFavorite: false,
      tags: [],
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: {
        datasetId: selectedDataset?.id || '',
        dimensions: selectedDimensions,
        metrics: selectedMetrics,
        filters,
        sorting: [],
      },
    };

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Report saved successfully!', {
        description: `"${reportName}" has been added to your reports.`,
        duration: 3000,
      });
      onSave(report);
    }, 500);
  }, [reportId, reportName, reportDescription, selectedDataset, chartType, selectedDimensions, selectedMetrics, filters, onSave]);


  return (
    <div className="space-y-6">
      {/* Header - Matching ReportsModule style */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="p-2 text-white/60 hover:text-white rounded-lg transition flex-shrink-0"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white flex-shrink-0" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {reportId ? 'Edit Report' : 'Create New Report'}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Build your custom report step by step
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {existingReport && (
                  <div className="hidden sm:flex flex-col gap-2.5 flex-shrink-0">
                    <div className="flex items-center gap-2 text-white/50 text-sm justify-end">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span>{existingReport.owner.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50 text-sm justify-end">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Updated {formatDate(existingReport.updatedAt)}</span>
                    </div>
                    {existingReport.lastRunAt && (
                      <div className="flex items-center gap-2 text-white/50 text-sm justify-end">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>Last run {formatDateTime(existingReport.lastRunAt)}</span>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving || !reportName || !selectedDataset}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all h-auto min-h-[42px]"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    opacity: (isSaving || !reportName || !selectedDataset) ? 0.5 : 1,
                    cursor: (isSaving || !reportName || !selectedDataset) ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSaving && reportName && selectedDataset) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving && reportName && selectedDataset) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                    }
                  }}
                >
                  <Save className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white">{isSaving ? 'Saving...' : 'Save Report'}</span>
                </button>
              </div>
            </div>
            
            {/* Badges Row */}
            {(existingReport || selectedDataset) && (
              <div className="flex items-center gap-2 flex-wrap">
                {existingReport && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[existingReport.status].bg} ${STATUS_COLORS[existingReport.status].text} border ${STATUS_COLORS[existingReport.status].border} capitalize flex-shrink-0 inline-flex items-center gap-2`}>
                    <span 
                      className="rounded-full flex-shrink-0" 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        minWidth: '8px', 
                        minHeight: '8px',
                        display: 'inline-block',
                        flexShrink: 0,
                        backgroundColor: existingReport.status === 'active' ? '#22c55e' : 
                                        existingReport.status === 'scheduled' ? '#3b82f6' : 
                                        existingReport.status === 'draft' ? '#a855f7' : '#eab308'
                      }} 
                    />
                    <span>{existingReport.status}</span>
                  </span>
                )}
                {selectedDataset && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${MODULE_COLORS[selectedDataset.module as ReportModule]?.bg || MODULE_COLORS.custom.bg} ${MODULE_COLORS[selectedDataset.module as ReportModule]?.text || MODULE_COLORS.custom.text} border ${MODULE_COLORS[selectedDataset.module as ReportModule]?.border || MODULE_COLORS.custom.border} capitalize flex-shrink-0 inline-flex items-center gap-2`}>
                    <span 
                      className="rounded-full flex-shrink-0" 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        minWidth: '8px', 
                        minHeight: '8px',
                        display: 'inline-block',
                        flexShrink: 0,
                        backgroundColor: selectedDataset.module === 'finance' ? '#22c55e' : 
                                        selectedDataset.module === 'sales' ? '#3b82f6' : 
                                        selectedDataset.module === 'inventory' ? '#a855f7' : 
                                        selectedDataset.module === 'hr' ? '#f97316' : 
                                        selectedDataset.module === 'operations' ? '#eab308' : '#ec4899'
                      }} 
                    />
                    <span>{selectedDataset.module}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress Steps Card */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between gap-2 pt-2">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = stepCompletion[step.id];
            const isPast = index < currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition border ${
                    isActive
                      ? 'bg-white/10 border-white/20 text-white'
                      : isPast && isCompleted
                      ? 'text-green-300 hover:bg-white/10 border-white/10'
                      : 'text-white/50 hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive
                      ? 'bg-white/15'
                      : isPast && isCompleted
                      ? 'bg-green-500/20'
                      : 'bg-white/10'
                  }`}>
                    {isPast && isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="hidden md:block font-medium">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-white/30 hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Step Content */}
          {currentStep === 'dataset' && (
            <>
          {/* Report Name & Description */}
          <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Report Details
                </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">Report Name</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name..."
                  className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">Description</label>
                <input
                  type="text"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>

            <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Select Data Source
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDatasets.map((dataset) => (
                  <button
                    key={dataset.id}
                    onClick={() => {
                      setSelectedDataset(dataset);
                    }}
                    className={`p-4 rounded-xl border text-left transition ${
                      selectedDataset?.id === dataset.id
                        ? 'bg-white/10 border-white/30 ring-2 ring-white/20'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white">{dataset.name}</span>
                      {selectedDataset?.id === dataset.id && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-4">{dataset.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span>{dataset.fields.filter(f => f.type === 'dimension').length} dimensions</span>
                      <span>{dataset.fields.filter(f => f.type === 'metric').length} metrics</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            </>
          )}


          {currentStep === 'visualization' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Chart Type
              </h3>
              <ChartTypeSelector
                value={chartType}
                onChange={setChartType}
                layout="grid"
              />
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="space-y-6">
                  <ReportChart
                    data={mockSalesChartData}
                    type={chartType}
                    title="Preview"
                    height={350}
                    showLegend
                  />
                  <ReportTable
                    data={mockSalesTableData}
                    columns={[
                      { id: 'region', label: 'Region', sortable: true },
                      { id: 'product_category', label: 'Category', sortable: true },
                      { id: 'total_sales', label: 'Sales', dataType: 'currency', sortable: true, align: 'right' },
                      { id: 'order_count', label: 'Orders', dataType: 'number', sortable: true, align: 'right' },
                    ]}
                    pageSize={5}
                    title="Preview Table"
                    actionButtons={
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 rounded-lg p-1"
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                          }}
                        >
                          <button
                            onClick={() => {}}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">PDF</span>
                          </button>
                          <div className="w-px h-4 bg-white/20"></div>
                          <button
                            onClick={() => {}}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Excel</span>
                          </button>
                        </div>
                      </div>
                    }
                  />
            </div>
          )}
            </div>

            {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
              <button
                onClick={goPrev}
                disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={goNext}
                disabled={currentStepIndex === STEPS.length - 1}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition text-sm disabled:opacity-50"
              >
                Next
              </button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;


