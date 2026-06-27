/**
 * Create Report Form Component
 * 
 * This component provides a multi-step form for creating new reports in the ERP system.
 * It guides users through three steps:
 * 1. Section Selection: Choose report type (Templates, Schedules, or Shared)
 * 2. Questions: Fill in report details and section-specific options
 * 3. Review: Review all information before saving
 * 
 * The form handles:
 * - Multi-step navigation with validation
 * - Section-specific form fields and validation rules
 * - Report data collection and formatting
 * - Schedule creation for scheduled reports
 * - Shared user management for shared reports
 * - Template configuration for template reports
 */
 
import React, { useState, useCallback } from 'react';
import {
  ArrowLeft,
  Save,
  FileText,
  Layout,
  Calendar,
  Users,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Report, ReportModule, ChartType, ReportSchedule, SharedUser, PermissionLevel, ReportStatus } from '../types/reports.types';
import { mockUsers } from '../data/mockData';
import { CustomSelect } from './CustomSelect';
import { TimeInput } from '../../ui/TimeInput';
import { TIMEZONES } from '../data/timezones';

/**
 * Report section types
 * Determines which type of report is being created
 */
export type ReportSection = 'templates' | 'schedules' | 'shared';

/**
 * Component props
 */
interface CreateReportFormProps {
  onBack: () => void;
  onSave: (report: Partial<Report>) => void;
  initialSection?: ReportSection;
}

/**
 * Form data structure
 * Contains all form fields organized by section
 */
interface FormData {
  section: ReportSection | null;
  reportName: string;
  reportDescription: string;
  module: ReportModule | '';
  chartType: ChartType | '';
  
  // Templates section questions
  templateCategory?: string;
  templatePurpose?: string;
  includeFilters?: boolean;
  
  // Schedules section questions
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  scheduleTime?: string;
  scheduleTimezone?: string;
  recipients?: string[];
  exportFormat?: 'pdf' | 'excel' | 'csv';
  
  // Shared section questions
  shareWithUsers?: string[];
  permissionLevel?: 'view' | 'edit' | 'admin';
  allowDownload?: boolean;
}

/**
 * Available report sections configuration
 * Defines the three types of reports users can create
 */
const SECTIONS: { id: ReportSection; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    id: 'templates', 
    label: 'Templates', 
    icon: <Layout className="w-5 h-5" />,
    description: 'Create a report from a pre-built template'
  },
  { 
    id: 'schedules', 
    label: 'Schedules', 
    icon: <Calendar className="w-5 h-5" />,
    description: 'Schedule automated report generation'
  },
  { 
    id: 'shared', 
    label: 'Shared', 
    icon: <Users className="w-5 h-5" />,
    description: 'Create and share a report with your team'
  },
];

/**
 * Available ERP modules
 * Maps to different departments/business areas
 */
const MODULES: { value: ReportModule; label: string }[] = [
  { value: 'finance', label: 'Finance' },
  { value: 'sales', label: 'Sales' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'hr', label: 'HR' },
  { value: 'operations', label: 'Operations' },
  { value: 'custom', label: 'Custom' },
];

/**
 * Available chart types for visualization
 */
const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'donut', label: 'Donut Chart' },
  { value: 'table', label: 'Table' },
];

/**
 * Create Report Form Component
 * 
 * Manages a multi-step form workflow for creating reports
 */
export const CreateReportForm: React.FC<CreateReportFormProps> = ({
  onBack,
  onSave,
  initialSection,
}) => {
  // ==================== State Management ====================
  
  /**
   * Form data state
   * Stores all user input across all steps
   */
  const [formData, setFormData] = useState<FormData>({
    section: initialSection || null,
    reportName: '',
    reportDescription: '',
    module: '',
    chartType: '',
  });
  
  /**
   * Current step in the form workflow
   * Three steps: section selection, questions, and review
   */
  const [currentStep, setCurrentStep] = useState<'section' | 'questions' | 'review'>('section');
  
  /**
   * Validation errors
   * Maps field names to error messages
   */
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ==================== Form Data Handlers ====================
  
  /**
   * Update a specific form field
   * Automatically clears any error associated with that field
   */
  const updateFormData = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // ==================== Validation ====================
  
  /**
   * Validate the current step
   * Returns true if all required fields are valid, false otherwise
   * Sets error messages for invalid fields
   */
  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'section') {
      if (!formData.section) {
        newErrors.section = 'Please select a section';
      }
    } else if (currentStep === 'questions') {
      if (!formData.reportName || formData.reportName.trim() === '') {
        newErrors.reportName = 'Report name is required';
      } else if (formData.reportName.trim().length < 3) {
        newErrors.reportName = 'Report name must be at least 3 characters';
      } else if (formData.reportName.trim().length > 100) {
        newErrors.reportName = 'Report name must be less than 100 characters';
      }
      if (!formData.module) {
        newErrors.module = 'Please select a module';
      }
      if (!formData.chartType) {
        newErrors.chartType = 'Please select a chart type';
      }

      // Section-specific validation rules
      if (formData.section === 'schedules') {
        if (!formData.scheduleFrequency) {
          newErrors.scheduleFrequency = 'Please select a frequency';
        }
        if (!formData.scheduleTime) {
          newErrors.scheduleTime = 'Please select a time';
        }
        if (!formData.scheduleTimezone) {
          newErrors.scheduleTimezone = 'Please select a region/timezone';
        }
        if (!formData.exportFormat) {
          newErrors.exportFormat = 'Please select an export format';
        }
      } else if (formData.section === 'shared') {
        if (!formData.permissionLevel) {
          newErrors.permissionLevel = 'Please select a permission level';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData]);

  // ==================== Step Navigation Handlers ====================
  
  /**
   * Handle section selection
   * Updates form data and clears section-related errors
   */
  const handleSectionSelect = useCallback((section: ReportSection) => {
    updateFormData('section', section);
    // Clear section error when a section is selected
    if (errors.section) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.section;
        return newErrors;
      });
    }
    // Don't auto-advance - user must click Next
  }, [updateFormData, errors]);

  /**
   * Handle moving to the next step
   * Validates current step before advancing
   * Shows error messages if validation fails
   */
  const handleNext = useCallback(() => {
    if (currentStep === 'section') {
      // Check if section is selected before advancing
      if (!formData.section || formData.section === null) {
        setErrors({ section: 'Please select a report type first' });
        toast.error('Error: Please select a report type', {
          description: 'Please choose one of the three options: Templates, Schedules, or Shared before continuing',
          duration: 5000,
        });
        return; // Stop here, don't advance
      }
      // Clear section error if section is selected
      if (errors.section) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.section;
          return newErrors;
        });
      }
      // Only advance if section is selected
      setCurrentStep('questions');
    } else if (currentStep === 'questions') {
      if (!validateStep()) {
        toast.error('Please fill in all required fields');
        return;
      }
      // Ensure section is still selected
      if (!formData.section) {
        toast.error('Please select a report type');
        setCurrentStep('section');
        return;
      }
      setCurrentStep('review');
    }
  }, [currentStep, validateStep, formData.section, errors]);

  /**
   * Handle moving to the previous step
   * No validation needed when going back
   */
  const handlePrev = useCallback(() => {
    if (currentStep === 'questions') {
      setCurrentStep('section');
    } else if (currentStep === 'review') {
      setCurrentStep('questions');
    }
  }, [currentStep]);

  // ==================== Save Handler ====================
  
  /**
   * Handle saving the report
   * Validates the form, builds the report object with all necessary data,
   * and calls the onSave callback to persist the report
   */
  const handleSave = useCallback(() => {
    // Validate before saving
    if (!validateStep()) {
      toast.error('Please complete all required fields');
      return;
    }

    if (!formData.section) {
      toast.error('Please select a report type');
      return;
    }

    // Generate unique report ID and timestamp
    const now = new Date().toISOString();
    const reportId = `rpt-${Date.now()}`;

    // Build tags array based on section and module
    const tags: string[] = [];
    if (formData.module) {
      tags.push(formData.module.charAt(0).toUpperCase() + formData.module.slice(1));
    }
    if (formData.templateCategory) {
      tags.push(formData.templateCategory);
    }
    if (formData.section === 'schedules') {
      tags.push('Scheduled');
    }
    if (formData.section === 'shared') {
      tags.push('Shared');
    }
    if (formData.section === 'templates') {
      tags.push('Template');
    }

    // Build shared users array for shared reports
    // Maps user IDs to SharedUser objects with permissions
    const sharedWith: SharedUser[] = [];
    if (formData.section === 'shared' && formData.shareWithUsers && formData.shareWithUsers.length > 0) {
      formData.shareWithUsers.forEach(userId => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          sharedWith.push({
            ...user,
            permission: (formData.permissionLevel || 'view') as PermissionLevel,
          });
        }
      });
    }

    // Build schedule object for scheduled reports
    // Calculates next run time based on frequency and sets up schedule configuration
    let schedule: ReportSchedule | undefined;
    if (formData.section === 'schedules') {
      const scheduleId = `sch-${Date.now()}`;
      const nextRun = new Date();
      
      // Determine frequency (defaults to daily if not specified)
      const frequency = formData.scheduleFrequency || 'daily';
      
      // Calculate next run date based on frequency
      if (frequency === 'daily') {
        nextRun.setDate(nextRun.getDate() + 1);
      } else if (frequency === 'weekly') {
        nextRun.setDate(nextRun.getDate() + 7);
      } else if (frequency === 'monthly') {
        nextRun.setMonth(nextRun.getMonth() + 1);
      } else if (frequency === 'quarterly') {
        nextRun.setMonth(nextRun.getMonth() + 3);
      }

      // Use provided time or default to 08:00
      const scheduleTime = formData.scheduleTime || '08:00';

      // Use provided timezone or default to Asia/Riyadh
      const scheduleTimezone = formData.scheduleTimezone || 'Asia/Riyadh';

      schedule = {
        id: scheduleId,
        reportId: reportId,
        frequency: frequency,
        time: scheduleTime,
        timezone: scheduleTimezone,
        recipients: formData.recipients || [],
        format: formData.exportFormat || 'pdf',
        isActive: true,
        nextRunAt: nextRun.toISOString(),
      };
    }

    // Determine report status based on section type
    let status: ReportStatus = 'draft';
    if (formData.section === 'schedules' && schedule) {
      status = 'scheduled';
    } else if (formData.section === 'templates') {
      status = 'active';
    } else if (formData.section === 'shared') {
      status = 'active';
    }

    // Map module to corresponding dataset ID
    // Each module has its own data source
    const datasetIdMap: Record<ReportModule, string> = {
      finance: 'ds-finance',
      sales: 'ds-sales',
      inventory: 'ds-inventory',
      hr: 'ds-hr',
      operations: 'ds-operations',
      custom: 'ds-sales',
    };
    const datasetId = datasetIdMap[formData.module as ReportModule] || 'ds-sales';

    // Build the complete report object
    // Combines all form data into a structured report object
    const report: Partial<Report> = {
      id: reportId,
      name: formData.reportName,
      description: formData.reportDescription || '',
      module: formData.module as ReportModule,
      status: status,
      owner: mockUsers[0],
      chartType: formData.chartType as ChartType,
      isTemplate: formData.section === 'templates',
      isFavorite: false,
      tags: tags,
      sharedWith: sharedWith,
      createdAt: now,
      updatedAt: now,
      schedule: schedule,
      config: {
        datasetId: datasetId,
        dimensions: [],
        metrics: [],
        filters: [],
        sorting: [],
      },
    };

    toast.success('Report created successfully!', {
      description: `"${formData.reportName}" has been created and added to your reports.`,
      duration: 3000,
    });

    onSave(report);
  }, [formData, validateStep, onSave]);

  return (
    <div className="space-y-6">
      {/* Header */}
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
                    Create New Report
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    {currentStep === 'section' && 'Choose a section to start'}
                    {currentStep === 'questions' && 'Fill in the report details'}
                    {currentStep === 'review' && 'Review and save your report'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mt-4">
              {['section', 'questions', 'review'].map((step, index) => {
                const isActive = currentStep === step;
                const isCompleted = 
                  (step === 'section' && formData.section) ||
                  (step === 'questions' && currentStep === 'review') ||
                  (step === 'review' && false);

                return (
                  <React.Fragment key={step}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition ${
                          isActive
                            ? 'bg-white/20 text-white border-2 border-white/30'
                            : isCompleted
                            ? 'bg-green-500/20 text-green-300 border-2 border-green-400/30'
                            : 'bg-white/10 text-white/50 border-2 border-white/10'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${
                        isActive ? 'text-white' : 'text-white/50'
                      }`}>
                        {step === 'section' ? 'Section' : step === 'questions' ? 'Details' : 'Review'}
                      </span>
                    </div>
                    {index < 2 && (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div 
        className="rounded-xl p-4 sm:p-6 pb-8"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        }}
      >
        {currentStep === 'section' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Select Report Type
              </h3>
              <p className="text-white/60 text-sm mb-6">
                Choose how you want to create your report
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section.id)}
                  className={`p-6 rounded-xl border text-left transition-all duration-300 ${
                    formData.section === section.id
                      ? 'border-white/40 ring-2 ring-white/30 shadow-lg'
                      : 'border-white/25 hover:border-white/35 hover:shadow-md'
                  }`}
                  style={{
                    backdropFilter: "blur(12px)",
                    background: formData.section === section.id 
                      ? "rgba(255, 255, 255, 0.2)" 
                      : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      formData.section === section.id
                        ? 'bg-white/20 text-white scale-110'
                        : 'bg-white/10 text-white/70 group-hover:bg-white/15'
                    }`}>
                      {section.icon}
                    </div>
                    <h4 className="font-semibold text-white">{section.label}</h4>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{section.description}</p>
                  {formData.section === section.id && (
                    <div className="mt-4 flex items-center gap-2 text-green-300 text-sm font-medium">
                      <Check className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {errors.section && (
              <div className="flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.section}</span>
              </div>
            )}
          </div>
        )}

        {currentStep === 'questions' && formData.section && (
          <div className="space-y-6">
            {/* Report Details Card */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Report Details
                </h3>
                <p className="text-white/60 text-sm">
                  {formData.section === 'templates' && 'Configure your template-based report'}
                  {formData.section === 'schedules' && 'Set up your scheduled report'}
                  {formData.section === 'shared' && 'Create a report to share with your team'}
                </p>
              </div>

              {/* Common Questions */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Report Name
                    </label>
                    <input
                      type="text"
                      value={formData.reportName}
                      onChange={(e) => updateFormData('reportName', e.target.value)}
                      placeholder="Enter report name..."
                      className={`w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.reportName ? 'border-red-400/50 focus:ring-red-400/30' : 'focus:ring-white/30'
                      }`}
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        minHeight: '42px',
                        height: '42px',
                      }}
                    />
                    {errors.reportName && (
                      <p className="mt-1.5 text-sm text-red-300">{errors.reportName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.reportDescription}
                      onChange={(e) => updateFormData('reportDescription', e.target.value)}
                      placeholder="Brief description..."
                      className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        minHeight: '42px',
                        height: '42px',
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Module
                    </label>
                    <CustomSelect
                      value={formData.module}
                      onChange={(value) => updateFormData('module', value)}
                      options={MODULES.map(m => ({ value: m.value, label: m.label }))}
                      placeholder="Select module..."
                      error={!!errors.module}
                      className="w-full"
                    />
                    {errors.module && (
                      <p className="mt-1.5 text-sm text-red-300">{errors.module}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Chart Type
                    </label>
                    <CustomSelect
                      value={formData.chartType}
                      onChange={(value) => updateFormData('chartType', value)}
                      options={CHART_TYPES.map(t => ({ value: t.value, label: t.label }))}
                      placeholder="Select chart type..."
                      error={!!errors.chartType}
                      className="w-full"
                    />
                    {errors.chartType && (
                      <p className="mt-1.5 text-sm text-red-300">{errors.chartType}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section-Specific Questions */}
            {formData.section === 'templates' && (
              <div className="glass-card rounded-xl p-6 mt-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Template Options</h4>
                </div>
                <div className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Template Category
                  </label>
                  <input
                    type="text"
                    value={formData.templateCategory || ''}
                    onChange={(e) => updateFormData('templateCategory', e.target.value)}
                    placeholder="e.g., Financial Summary, Sales Report..."
                    className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                    style={{
                      background: "rgba(255, 255, 255, 0.12)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      minHeight: '42px',
                      height: '42px',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Purpose
                  </label>
                  <textarea
                    value={formData.templatePurpose || ''}
                    onChange={(e) => updateFormData('templatePurpose', e.target.value)}
                    placeholder="Describe the purpose of this template..."
                    rows={3}
                    className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 resize-none transition"
                    style={{
                      background: "rgba(255, 255, 255, 0.12)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeFilters"
                    checked={formData.includeFilters || false}
                    onChange={(e) => updateFormData('includeFilters', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  />
                  <label htmlFor="includeFilters" className="text-sm text-white/70">
                    Include pre-configured filters
                  </label>
                </div>
                </div>
              </div>
            )}

            {formData.section === 'schedules' && (
              <>
                <div className="glass-card rounded-xl p-6">
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-white mb-2">Schedule Configuration</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Configure when and how your report will be automatically generated and delivered to recipients.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/70">
                          Region / Timezone
                        </label>
                        <div className="w-full">
                          <CustomSelect
                            value={formData.scheduleTimezone || ''}
                            onChange={(value) => updateFormData('scheduleTimezone', value)}
                            options={TIMEZONES}
                            placeholder="Select region/timezone..."
                            searchable
                            searchPlaceholder="Search timezone..."
                            error={!!errors.scheduleTimezone}
                            className="w-full"
                          />
                        </div>
                        {errors.scheduleTimezone && (
                          <p className="mt-1.5 text-sm text-red-300">{errors.scheduleTimezone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/70">
                          Recipients (Email addresses, comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.recipients?.join(', ') || ''}
                          onChange={(e) => {
                            const emails = e.target.value.split(',').map(email => email.trim()).filter(email => email);
                            updateFormData('recipients', emails);
                          }}
                          placeholder="email1@example.com, email2@example.com"
                          className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                          style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            minHeight: '42px',
                            height: '42px',
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/70">
                          Frequency
                        </label>
                        <div className="w-full">
                          <CustomSelect
                            value={formData.scheduleFrequency || ''}
                            onChange={(value) => updateFormData('scheduleFrequency', value)}
                            options={[
                              { value: 'daily', label: 'Daily' },
                              { value: 'weekly', label: 'Weekly' },
                              { value: 'monthly', label: 'Monthly' },
                              { value: 'quarterly', label: 'Quarterly' },
                            ]}
                            placeholder="Select frequency..."
                            error={!!errors.scheduleFrequency}
                            className="w-full"
                          />
                        </div>
                        {errors.scheduleFrequency && (
                          <p className="mt-1.5 text-sm text-red-300">{errors.scheduleFrequency}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/70">
                          Time
                        </label>
                        <TimeInput
                          value={formData.scheduleTime || ''}
                          onChange={(value) => updateFormData('scheduleTime', value)}
                          placeholder="HH:MM"
                          error={!!errors.scheduleTime}
                        />
                        {errors.scheduleTime && (
                          <p className="mt-1.5 text-sm text-red-300">{errors.scheduleTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Export Format
                    </label>
                    <div className="flex gap-3">
                      {(['pdf', 'excel', 'csv'] as const).map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => updateFormData('exportFormat', format)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            formData.exportFormat === format
                              ? 'bg-white/20 text-white border-2 border-white/30'
                              : 'bg-white/10 text-white/70 border-2 border-white/10 hover:bg-white/15'
                          }`}
                        >
                          {format.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    {errors.exportFormat && (
                      <p className="mt-1.5 text-sm text-red-300">{errors.exportFormat}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {formData.section === 'shared' && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-md font-semibold text-white">Sharing Options</h4>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Permission Level
                  </label>
                  <div className="flex gap-3">
                    {(['view', 'edit', 'admin'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateFormData('permissionLevel', level)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                          formData.permissionLevel === level
                            ? 'bg-white/20 text-white border-2 border-white/30'
                            : 'bg-white/10 text-white/70 border-2 border-white/10 hover:bg-white/15'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  {errors.permissionLevel && (
                    <p className="mt-1 text-sm text-red-300">{errors.permissionLevel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Share With Users (User IDs, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.shareWithUsers?.join(', ') || ''}
                    onChange={(e) => updateFormData('shareWithUsers', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="user1, user2, user3..."
                    className="w-full px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                    style={{
                      background: "rgba(255, 255, 255, 0.12)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      minHeight: '42px',
                      height: '42px',
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowDownload"
                    checked={formData.allowDownload || false}
                    onChange={(e) => updateFormData('allowDownload', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  />
                  <label htmlFor="allowDownload" className="text-sm text-white/70">
                    Allow users to download this report
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Review Your Report
              </h3>
              <p className="text-white/60 text-sm mb-6">
                Please review all information before saving
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Section</p>
                    <p className="text-white font-medium capitalize">{formData.section}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Module</p>
                    <p className="text-white font-medium capitalize">{formData.module}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Report Name</p>
                    <p className="text-white font-medium">{formData.reportName}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Chart Type</p>
                    <p className="text-white font-medium capitalize">{formData.chartType}</p>
                  </div>
                </div>
                {formData.reportDescription && (
                  <div className="mt-4">
                    <p className="text-white/60 text-sm mb-1">Description</p>
                    <p className="text-white">{formData.reportDescription}</p>
                  </div>
                )}
              </div>

              {formData.section === 'schedules' && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-3">Schedule Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Frequency</p>
                      <p className="text-white font-medium capitalize">{formData.scheduleFrequency}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Time</p>
                      <p className="text-white font-medium">{formData.scheduleTime}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Export Format</p>
                      <p className="text-white font-medium uppercase">{formData.exportFormat}</p>
                    </div>
                    {formData.recipients && formData.recipients.length > 0 && (
                      <div>
                        <p className="text-white/60 text-sm mb-1">Recipients</p>
                        <p className="text-white font-medium">{formData.recipients.length} recipient(s)</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.section === 'shared' && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-3">Sharing Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Permission Level</p>
                      <p className="text-white font-medium capitalize">{formData.permissionLevel}</p>
                    </div>
                    {formData.shareWithUsers && formData.shareWithUsers.length > 0 && (
                      <div>
                        <p className="text-white/60 text-sm mb-1">Shared With</p>
                        <p className="text-white font-medium">{formData.shareWithUsers.length} user(s)</p>
                      </div>
                    )}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Allow Download</p>
                      <p className="text-white font-medium">{formData.allowDownload ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={currentStep === 'section' ? onBack : handlePrev}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 'section' ? 'Cancel' : 'Previous'}
        </button>

        <div className="flex items-center gap-3">
          {currentStep === 'review' ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition"
              style={{
                background: "rgba(59, 130, 246, 0.15)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              <Save className="w-4 h-4" />
              Save Report
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReportForm;


