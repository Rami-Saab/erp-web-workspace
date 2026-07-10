/**
 * Reports Module - Main Component
 * 
 * This is the main entry point for the Reports module in the ERP system.
 * It manages the overall state and navigation between different report views:
 * - Templates: Pre-built report templates
 * - Schedules: Automated report schedules
 * - Shared: Reports shared with the current user
 * 
 * The component handles:
 * - Navigation between different tabs and views
 * - Report CRUD operations (Create, Read, Update, Delete)
 * - State management for reports, selected reports, and UI state
 * - Routing between list views and detail views
 */

import React, { useState, useCallback } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Layout,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { ReportsList, ReportViewer, ReportBuilder, ReportSchedule, ReportTemplates, CreateReport } from './pages';
import type { ReportsTab, Report } from './types/reports.types';
import { mockReports as initialMockReports } from './data/mockData';

/**
 * Tab configuration for the main navigation
 * Each tab represents a different section of the reports module
 */
const TABS: { id: ReportsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'templates', label: 'Templates', icon: <Layout className="w-4 h-4" /> },
  { id: 'schedule', label: 'Schedules', icon: <Calendar className="w-4 h-4" /> },
  { id: 'shared', label: 'Shared with Me', icon: <Users className="w-4 h-4" /> },
];

interface ReportsModuleProps {
  initialTab?: ReportsTab;
  initialReportId?: string;
  currentUserRole?: string;
}

/**
 * Main Reports Module Component
 * 
 * This component serves as the container for all report-related functionality.
 * It manages the state and coordinates between different child components.
 */
export const ReportsModule: React.FC<ReportsModuleProps> = ({
  initialTab = 'templates',
  initialReportId,
  currentUserRole = 'admin',
}) => {
  // ==================== State Management ====================
  
  // Current active tab (templates, schedule, shared, view, create, edit, list)
  const [currentTab, setCurrentTab] = useState<ReportsTab>(
    initialReportId ? 'view' : initialTab
  );
  
  // ID of the currently selected report (for viewing)
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(initialReportId);
  
  // ID of the report being edited
  const [editingReportId, setEditingReportId] = useState<string | undefined>();
  
  // Section context when creating a new report (templates, schedules, or shared)
  const [createReportSection, setCreateReportSection] = useState<'templates' | 'schedules' | 'shared' | undefined>();
  
  // Collection of all reports (would come from API in production)
  const [reports, setReports] = useState<Report[]>(initialMockReports);

  // ==================== Navigation Handlers ====================
  
  /**
   * Handle viewing a report
   * Opens the report viewer with the selected report
   */
  const handleViewReport = useCallback((id: string) => {
    setSelectedReportId(id);
    setCurrentTab('view');
  }, []);

  /**
   * Handle editing a report
   * Opens the report builder in edit mode
   */
  const handleEditReport = useCallback((id: string) => {
    setEditingReportId(id);
    setCurrentTab('edit');
  }, []);

  /**
   * Handle creating a new report
   * Determines which section to use based on current tab or explicit parameter
   */
  const handleCreateReport = useCallback((section?: 'templates' | 'schedules' | 'shared') => {
    setEditingReportId(undefined);
    
    // Determine section: use parameter, or infer from current tab
    const targetSection = section || 
      (currentTab === 'templates' ? 'templates' : 
       currentTab === 'schedule' ? 'schedules' : 
       currentTab === 'shared' ? 'shared' : undefined);
    
    setCreateReportSection(targetSection);
    setCurrentTab('create');
  }, [currentTab]);

  /**
   * Handle going back to the main list view
   * Clears all selection and editing states
   */
  const handleBack = useCallback(() => {
    setSelectedReportId(undefined);
    setEditingReportId(undefined);
    setCurrentTab('templates');
  }, []);

  /**
   * Handle navigation to a specific section
   * Used when creating a report from a specific section context
   */
  const handleNavigateToSection = useCallback((section: 'templates' | 'schedules' | 'shared') => {
    setSelectedReportId(undefined);
    setEditingReportId(undefined);
    setCreateReportSection(undefined);
    
    // Map section to corresponding tab
    const tabMap: Record<typeof section, ReportsTab> = {
      'templates': 'templates',
      'schedules': 'schedule',
      'shared': 'shared',
    };
    
    setCurrentTab(tabMap[section]);
  }, []);

  // ==================== Report CRUD Operations ====================
  
  /**
   * Handle saving a report (create or update)
   * Validates the report data and adds/updates it in the reports list
   * Also determines which tab to navigate to based on report type
   */
  const handleSaveReport = useCallback((report: Partial<Report>) => {
    // Validate required fields
    if (!report.id || !report.name || !report.module || !report.chartType) {
      toast.error('Failed to save report', {
        description: 'Required fields are missing. Please complete all required fields.',
      });
      handleBack();
      return;
    }

    // Build the complete report object with defaults
    const newReport: Report = {
      id: report.id,
      name: report.name,
      description: report.description || '',
      module: report.module,
      status: report.status || 'draft',
      owner: report.owner || initialMockReports[0]?.owner || { 
        id: 'user-1', 
        name: 'Admin', 
        email: 'admin@company.com', 
        role: 'Admin' 
      },
      createdAt: report.createdAt || new Date().toISOString(),
      updatedAt: report.updatedAt || new Date().toISOString(),
      lastRunAt: report.lastRunAt,
      tags: report.tags || [],
      chartType: report.chartType,
      isTemplate: report.isTemplate || false,
      isFavorite: report.isFavorite || false,
      sharedWith: report.sharedWith || [],
      schedule: report.schedule,
      config: report.config || {
        datasetId: '',
        dimensions: [],
        metrics: [],
        filters: [],
        sorting: [],
      },
    };

    // Update reports list (create new or update existing)
    setReports(prev => {
      const existingIndex = prev.findIndex(r => r.id === newReport.id);
      if (existingIndex >= 0) {
        // Update existing report
        const updatedReports = [...prev];
        updatedReports[existingIndex] = newReport;
        return updatedReports;
      }
      // Add new report
      return [...prev, newReport];
    });
    
    // Determine which tab to navigate to based on report properties
    let targetTab: ReportsTab = 'templates';
    
    if (report.isTemplate) {
      targetTab = 'templates';
    } else if (report.schedule) {
      targetTab = 'schedule';
    } else if (report.sharedWith && report.sharedWith.length > 0) {
      targetTab = 'shared';
    }
    
    // Clear state and navigate to appropriate tab
    setSelectedReportId(undefined);
    setEditingReportId(undefined);
    setCreateReportSection(undefined);
    setCurrentTab(targetTab);
  }, [handleBack]);

  /**
   * Handle sharing a report
   * Currently a placeholder - share dialog is handled within ReportCard/ReportViewer
   */
  const handleShareReport = useCallback((_id: string) => {
    // Share dialog is handled within ReportCard/ReportViewer components
  }, []);

  /**
   * Handle deleting a report
   * Removes the report from the list and navigates away if it was selected
   */
  const handleDeleteReport = useCallback((id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    
    // If the deleted report was selected, navigate away
    if (selectedReportId === id) {
      setSelectedReportId(undefined);
      setCurrentTab('templates');
    }
    
    toast.success('Report deleted successfully');
  }, [selectedReportId]);

  /**
   * Handle duplicating a report
   * Creates a copy of the report with a new ID and updated metadata
   */
  const handleDuplicateReport = useCallback((id: string) => {
    const reportToDuplicate = reports.find(r => r.id === id);
    if (!reportToDuplicate) return;

    const duplicatedReport: Report = {
      ...reportToDuplicate,
      id: `rpt-${Date.now()}`,
      name: `${reportToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    };
    
    setReports(prev => [...prev, duplicatedReport]);
    toast.success('Report duplicated successfully');
  }, [reports]);

  // ==================== Render Logic ====================
  
  /**
   * Render the appropriate content based on the current tab
   * This function determines which child component to display
   */
  const renderContent = () => {
    switch (currentTab) {
      case 'view':
        if (selectedReportId) {
          return (
            <ReportViewer
              reportId={selectedReportId}
              reports={reports}
              onBack={handleBack}
              onEdit={handleEditReport}
              onShare={handleShareReport}
              currentUserRole={currentUserRole}
            />
          );
        }
        return null;

      case 'create':
        return (
          <CreateReport
            onBack={handleBack}
            onSave={handleSaveReport}
            initialSection={createReportSection}
            onNavigateToSection={handleNavigateToSection}
          />
        );

      case 'edit':
        return (
          <ReportBuilder
            reportId={editingReportId}
            onBack={handleBack}
            onSave={handleSaveReport}
          />
        );

      case 'schedule':
        return (
          <ReportSchedule 
            reports={reports}
          />
        );

      case 'templates':
        return (
          <ReportTemplates reports={reports} />
        );

      case 'shared':
        return (
          <ReportsList
            reports={reports}
            onViewReport={handleViewReport}
            onEditReport={handleEditReport}
            onCreateReport={handleCreateReport}
            onDeleteReport={handleDeleteReport}
            onDuplicateReport={handleDuplicateReport}
            onShareReport={handleShareReport}
          />
        );

      case 'list':
      default:
        return (
          <ReportsList
            reports={reports}
            onViewReport={handleViewReport}
            onEditReport={handleEditReport}
            onCreateReport={handleCreateReport}
            onDeleteReport={handleDeleteReport}
            onDuplicateReport={handleDuplicateReport}
            onShareReport={handleShareReport}
          />
        );
    }
  };

  // Check if we're in a detail view (view, create, or edit)
  const isDetailView = ['view', 'create', 'edit'].includes(currentTab);

  return (
    <div className="space-y-6">
      {/* Header & Tab Navigation - Only show when not in detail view */}
      {!isDetailView && (
        <>
          <div className="mb-8">
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                {/* Header with title and create button */}
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div className="min-w-0 flex items-center gap-3">
                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Reports
                      </h2>
                      <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                        Create, manage, and schedule your reports
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCreateReport()}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all h-auto min-h-[42px]"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow:
                        "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      paddingLeft: '16px',
                      paddingRight: '16px',
                    }}
                  >
                    <Plus className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white">Create Report</span>
                  </button>
                </div>
                
                {/* Horizontal Tab Navigation */}
                <nav className="flex flex-wrap gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 relative ${
                        currentTab === tab.id
                          ? 'glass-sidebar-btn-active text-white'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden xs:inline">{tab.label}</span>
                      <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                      {currentTab === tab.id && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/60 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          
          {/* Section Title */}
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {TABS.find(tab => tab.id === currentTab)?.label || 'Reports'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  {currentTab === 'list' && 'View and manage all your reports'}
                  {currentTab === 'templates' && 'Start with a pre-built template'}
                  {currentTab === 'schedule' && 'Schedule automated report generation'}
                  {currentTab === 'shared' && 'Reports shared with you by your team'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content - Renders the appropriate view based on currentTab */}
      {renderContent()}
    </div>
  );
};

export default ReportsModule;
