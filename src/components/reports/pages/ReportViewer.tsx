// ==================== REPORTS MODULE - REPORT VIEWER PAGE ====================
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Share2,
  Edit3,
  Clock,
  Calendar,
  User,
  BarChart3,
  Table,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { ReportChart, ReportTable, ShareDialog, LoadingState } from '../components';
import { DateInput } from '../../ui/DateInput';
import type { ChartType, DateRange, UserRole } from '../types/reports.types';
import { MODULE_COLORS, STATUS_COLORS, getReportPermissions } from '../types/reports.types';
import {
  mockReports,
  mockSalesChartData,
  mockInventoryChartData,
  mockRegionChartData,
  mockSalesTableData,
  mockInventoryTableData,
  mockFinanceTableData,
  formatDate,
  formatDateTime,
} from '../data/mockData';
import type { Report } from '../types/reports.types';

interface ReportViewerProps {
  reportId: string;
  reports?: Report[];
  onBack: () => void;
  onEdit: (id: string) => void;
  onShare?: (id: string) => void;
  currentUserRole?: UserRole | string;
}

type ViewType = 'chart' | 'table' | 'both';

export const ReportViewer: React.FC<ReportViewerProps> = ({
  reportId,
  reports: propReports,
  onBack,
  onEdit,
  currentUserRole = 'admin', // Default to admin for testing
}) => {
  // Get permissions for current user role
  const permissions = getReportPermissions(currentUserRole);
  const [viewType, setViewType] = useState<ViewType>('chart');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    preset: 'thisYear',
  });

  // Get report data - use propReports if provided, otherwise fall back to mockReports
  const report = useMemo(() => {
    if (propReports && propReports.length > 0) {
      const foundReport = propReports.find(r => r.id === reportId);
      if (foundReport) return foundReport;
    }
    // Fallback to mockReports if propReports not provided or report not found
    return mockReports.find(r => r.id === reportId);
  }, [reportId, propReports]);

  // Get chart data based on report module
  const chartData = useMemo(() => {
    if (!report) return mockSalesChartData;
    switch (report.module) {
      case 'sales':
        return report.chartType === 'pie' ? mockRegionChartData : mockSalesChartData;
      case 'inventory':
        return mockInventoryChartData;
      case 'finance':
        return mockSalesChartData;
      default:
        return mockSalesChartData;
    }
  }, [report]);

  // Get table data based on report module
  const tableData = useMemo(() => {
    if (!report) return mockSalesTableData;
    switch (report.module) {
      case 'sales':
        return mockSalesTableData;
      case 'inventory':
        return mockInventoryTableData;
      case 'finance':
        return mockFinanceTableData;
      default:
        return mockSalesTableData;
    }
  }, [report]);

  // Get table columns based on report module
  const tableColumns = useMemo(() => {
    if (!report) return [];
    switch (report.module) {
      case 'sales':
        return [
          { id: 'region', label: 'Region', sortable: true },
          { id: 'product_category', label: 'Product Category', sortable: true },
          { id: 'total_sales', label: 'Total Sales', dataType: 'currency' as const, sortable: true, align: 'left' as const },
          { id: 'order_count', label: 'Orders', dataType: 'number' as const, sortable: true, align: 'left' as const },
          { id: 'avg_order_value', label: 'Avg Order Value', dataType: 'currency' as const, sortable: true, align: 'left' as const },
        ];
      case 'inventory':
        return [
          { id: 'product_name', label: 'Product', sortable: true },
          { id: 'warehouse', label: 'Warehouse', sortable: true },
          { id: 'current_stock', label: 'Current Stock', dataType: 'number' as const, sortable: true, align: 'left' as const },
          { id: 'reorder_point', label: 'Reorder Point', dataType: 'number' as const, sortable: true, align: 'left' as const },
          { id: 'suggested_order', label: 'Suggested Order', dataType: 'number' as const, sortable: true, align: 'left' as const },
          { id: 'status', label: 'Status', sortable: true },
        ];
      case 'finance':
        return [
          { id: 'month', label: 'Month', sortable: true },
          { id: 'revenue', label: 'Revenue', dataType: 'currency' as const, sortable: true, align: 'left' as const },
          { id: 'expenses', label: 'Expenses', dataType: 'currency' as const, sortable: true, align: 'left' as const },
          { id: 'net_profit', label: 'Net Profit', dataType: 'currency' as const, sortable: true, align: 'left' as const },
          { id: 'margin', label: 'Margin', dataType: 'percent' as const, sortable: true, align: 'left' as const },
        ];
      default:
        return [];
    }
  }, [report]);

  // Calculate chart height based on number of data points in chart
  const chartHeight = useMemo(() => {
    const dataPoints = chartData.length;
    
    // Base height for chart container (header + padding)
    const baseHeight = 100;
    
    // Height per data point (bar/point)
    const heightPerPoint = 60;
    
    // Calculate height based on number of data points
    let calculatedHeight = baseHeight + (dataPoints * heightPerPoint);
    
    // When viewType is 'both', also consider table height for consistency
    if (viewType === 'both') {
      const tablePageSize = 5;
      const rowHeight = 50;
      const headerHeight = 50;
      const paginationHeight = 60;
      const tableTitleHeight = 48;
      const borders = 2;
      
      const totalTableHeight = 
        tableTitleHeight + 
        headerHeight + 
        (tablePageSize * rowHeight) + 
        paginationHeight + 
        borders;
      
      // Use the larger of chart height or table height for consistency
      calculatedHeight = Math.max(calculatedHeight, totalTableHeight);
    }
    
    // Apply min and max constraints
    return Math.max(240, Math.min(500, calculatedHeight));
  }, [viewType, chartData.length]);

  // Handle refresh - fetch new data from API
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // Simulate API call to refresh data
      // In production, this would be: await fetchReportData(reportId)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last run time
      // In production: await updateReportLastRun(reportId)
      
      setIsRefreshing(false);
      toast.success('Report data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing report:', error);
      setIsRefreshing(false);
      toast.error('Failed to refresh report data');
    }
  };

  // Handle export - export chart/table data based on format
  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      // Check download permission
      if (!permissions.download) {
        toast.error('Permission denied', {
          description: 'You do not have permission to download reports',
          duration: 3000,
        });
        return;
      }

      if (!report) {
        toast.error('Report not found', {
          description: 'Unable to export report data',
          duration: 3000,
        });
        return;
      }

      // Get current data based on view type
      let exportData: any[] = [];
      
      if (viewType === 'table' || viewType === 'both') {
        exportData = Array.isArray(tableData) ? tableData : [];
      } else {
        exportData = Array.isArray(chartData) 
          ? chartData.map(point => ({
              label: point?.label || 'N/A',
              value: point?.value ?? 0,
            }))
          : [];
      }

      if (!exportData || exportData.length === 0) {
        toast.error('No data to export', {
          description: 'The report contains no data to export',
          duration: 3000,
        });
        return;
      }

      if (format === 'pdf') {
        // Show loading toast with unique ID
        const toastId = `pdf-export-${Date.now()}`;
        toast.info('Generating PDF...', {
          id: toastId,
          description: 'Please wait while we prepare your file',
          duration: Infinity,
        });

        // Use setTimeout to ensure toast is shown before heavy operation
        setTimeout(() => {
          try {
            // Create PDF document
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = margin;
            const lineHeight = 7;
            const maxWidth = pageWidth - (margin * 2);

            // Helper function to add text with word wrap
            const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
              pdf.setFontSize(fontSize);
              pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
              pdf.setTextColor(color[0], color[1], color[2]);
              
              const lines = pdf.splitTextToSize(text, maxWidth);
              lines.forEach((line: string) => {
                if (yPosition + lineHeight > pageHeight - margin) {
                  pdf.addPage();
                  yPosition = margin;
                }
                pdf.text(line, margin, yPosition);
                yPosition += lineHeight;
              });
            };

            // Add header
            addText(report.name, 18, true, [0, 0, 0]);
            yPosition += 5;
            
            addText(`Generated: ${new Date().toLocaleString()}`, 10, false, [100, 100, 100]);
            yPosition += 3;
            
            if (report.description) {
              addText(`Description: ${report.description}`, 10, false, [100, 100, 100]);
              yPosition += 5;
            }
            
            yPosition += 5;
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;

            // Add data
            if (viewType === 'table' || viewType === 'both') {
              // Export table data
              addText('Table Data:', 14, true);
              yPosition += 5;

              // Add table headers
              const headers = tableColumns.map(col => col.label);
              const colWidths = headers.map(() => maxWidth / headers.length);
              
              // Draw header row
              pdf.setFillColor(240, 240, 240);
              pdf.rect(margin, yPosition - 5, maxWidth, lineHeight + 2, 'F');
              pdf.setDrawColor(200, 200, 200);
              pdf.rect(margin, yPosition - 5, maxWidth, lineHeight + 2, 'S');
              
              let xPos = margin + 2;
              headers.forEach((header, idx) => {
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text(header.substring(0, 15), xPos, yPosition);
                xPos += colWidths[idx];
              });
              yPosition += lineHeight + 5;

              // Add table rows
              exportData.forEach((row: any) => {
                if (yPosition + lineHeight > pageHeight - margin) {
                  pdf.addPage();
                  yPosition = margin;
                }

                xPos = margin + 2;
                tableColumns.forEach((col, colIdx) => {
                  const value = row[col.id as keyof typeof row];
                  const displayValue = value !== null && value !== undefined ? String(value) : 'N/A';
                  pdf.setFontSize(9);
                  pdf.setFont('helvetica', 'normal');
                  pdf.text(displayValue.substring(0, 15), xPos, yPosition);
                  xPos += colWidths[colIdx];
                });
                
                // Draw row border
                pdf.setDrawColor(220, 220, 220);
                pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
                
                yPosition += lineHeight + 2;
              });
            } else {
              // Export chart data
              addText('Chart Data:', 14, true);
              yPosition += 5;

              exportData.forEach((point: any, pointIdx: number) => {
                if (yPosition + lineHeight > pageHeight - margin) {
                  pdf.addPage();
                  yPosition = margin;
                }
                addText(`${pointIdx + 1}. ${point.label}: ${point.value}`, 11, false);
              });
            }

            // Save PDF with consistent naming
            const timestamp = new Date().toISOString().split('T')[0];
            const sanitizedName = report.name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_');
            const fileName = `${sanitizedName}_${timestamp}.pdf`;
            pdf.save(fileName);
            
            // Dismiss loading toast and show success
            toast.dismiss(toastId);
            toast.success('PDF downloaded successfully!', {
              description: `File: ${fileName}`,
              duration: 5000,
            });
          } catch (error) {
            toast.dismiss(toastId);
            toast.error('Failed to generate PDF', {
              description: error instanceof Error ? error.message : 'Unknown error',
              duration: 5000,
            });
          }
        }, 50);
      } else if (format === 'excel') {
        // Show loading toast with unique ID
        const toastId = `excel-export-${Date.now()}`;
        toast.info('Generating Excel file...', {
          id: toastId,
          description: 'Please wait while we prepare your file',
          duration: Infinity,
        });

        // Use setTimeout to ensure toast is shown before heavy operation
        setTimeout(() => {
          try {
            // Export to Excel (CSV format)
            let csvContent = '';
            
            if (viewType === 'table' || viewType === 'both') {
              // Export table data as CSV
              if (!tableColumns || tableColumns.length === 0) {
                console.error('Table columns not found');
                toast.dismiss(toastId);
                toast.error('Table columns not found', {
                  duration: 5000,
                });
                return;
              }
              
              const columns = tableColumns.map(col => col.label);
              csvContent = columns.join(',') + '\n';
              
              exportData.forEach((row: any) => {
                const values = tableColumns.map(col => {
                  const colId = col.id;
                  const value = row[colId as keyof typeof row];
                  if (value === null || value === undefined) return '';
                  return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : String(value);
                });
                csvContent += values.join(',') + '\n';
              });
            } else {
              // Export chart data as CSV
              csvContent = 'Label,Value\n';
              exportData.forEach((point: any) => {
                const label = point.label ? point.label.replace(/"/g, '""') : '';
                const value = point.value ?? 0;
                csvContent += `"${label}",${value}\n`;
              });
            }
            
            // Create and download CSV with consistent naming
            const timestamp = new Date().toISOString().split('T')[0];
            const sanitizedName = report.name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_');
            const fileName = `${sanitizedName}_${timestamp}.csv`;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Clean up after a short delay
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 100);
            
            // Dismiss loading toast and show success
            toast.dismiss(toastId);
            toast.success('Excel file downloaded successfully!', {
              description: `File: ${fileName}`,
              duration: 5000,
            });
          } catch (error) {
            toast.dismiss(toastId);
            toast.error('Failed to generate Excel file', {
              description: error instanceof Error ? error.message : 'Unknown error',
              duration: 5000,
            });
          }
        }, 50);
      }
    } catch (error) {
      console.error(`Error exporting report as ${format}:`, error);
      // Prevent white screen by catching all errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to export report: ${errorMessage}`);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingState message="Loading report..." />
      </div>
    );
  }

  const moduleColor = MODULE_COLORS[report.module];
  const statusColor = STATUS_COLORS[report.status];

  const viewerContent = (
    <div className={`space-y-6 ${isFullscreen ? 'h-screen overflow-auto p-6 bg-slate-900' : ''}`}>
      {/* Header Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {!isFullscreen && (
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
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white truncate leading-tight">{report.name}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text} border ${statusColor.border} capitalize flex-shrink-0 inline-flex items-center gap-2`}>
                  <span 
                    className="rounded-full flex-shrink-0" 
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      minWidth: '8px', 
                      minHeight: '8px',
                      display: 'inline-block',
                      flexShrink: 0,
                      backgroundColor: report.status === 'active' ? '#22c55e' : 
                                      report.status === 'scheduled' ? '#3b82f6' : 
                                      report.status === 'draft' ? '#a855f7' : 
                                      report.status === 'archived' ? '#eab308' : '#a855f7'
                    }} 
                  />
                  <span>{report.status}</span>
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${moduleColor.bg} ${moduleColor.text} border ${moduleColor.border} capitalize flex-shrink-0 inline-flex items-center gap-2`}>
                  <span 
                    className="rounded-full flex-shrink-0" 
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      minWidth: '8px', 
                      minHeight: '8px',
                      display: 'inline-block',
                      flexShrink: 0,
                      backgroundColor: report.module === 'finance' ? '#22c55e' : 
                                      report.module === 'sales' ? '#3b82f6' : 
                                      report.module === 'inventory' ? '#a855f7' : 
                                      report.module === 'hr' ? '#f97316' : 
                                      report.module === 'operations' ? '#eab308' : 
                                      report.module === 'custom' ? '#ec4899' : '#ec4899'
                    }} 
                  />
                  <span>{report.module}</span>
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{report.description}</p>
            </div>
          </div>

          {/* Meta info - moved to right side, vertical layout */}
          <div className="flex flex-col gap-3 text-xs text-white/50 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{report.owner.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Updated {formatDate(report.updatedAt)}</span>
            </div>
            {report.lastRunAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Last run {formatDateTime(report.lastRunAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel (collapsible) */}
      {showFilters && (
        <div className="glass-card rounded-xl p-5 border border-white/10 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 mb-2 block">Date Range</label>
              <div className="flex gap-2">
                <DateInput
                  value={dateRange.startDate}
                  onChange={(value) => setDateRange({ ...dateRange, startDate: value })}
                  placeholder="Start date"
                  className="flex-1"
                />
                <DateInput
                  value={dateRange.endDate}
                  onChange={(value) => setDateRange({ ...dateRange, endDate: value })}
                  placeholder="End date"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Dimension Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 mb-2 block">
                {report.config.dimensions[0]?.label || 'Dimension'}
              </label>
              <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer">
                <option value="" className="bg-slate-800">All</option>
                <option value="region1" className="bg-slate-800">Region 1</option>
                <option value="region2" className="bg-slate-800">Region 2</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button 
                className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-semibold transition"
                style={{
                  background: "rgba(59, 130, 246, 0.15)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
              >
                <Play className="w-4 h-4 inline mr-2" />
                Run Report
              </button>
              <button 
                className="px-4 py-2 text-white/60 hover:text-white text-sm transition rounded-lg hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Toggle & Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
        <div className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            onClick={() => setViewType('chart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              viewType === 'chart'
                ? 'text-white shadow-sm'
                : 'text-white/60 hover:text-white/80'
            }`}
            style={viewType === 'chart' ? {
              background: "rgba(59, 130, 246, 0.25)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            } : {
              background: "transparent",
            }}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chart</span>
          </button>
          <button
            onClick={() => setViewType('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              viewType === 'table'
                ? 'text-white shadow-sm'
                : 'text-white/60 hover:text-white/80'
            }`}
            style={viewType === 'table' ? {
              background: "rgba(59, 130, 246, 0.25)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            } : {
              background: "transparent",
            }}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>

      </div>

      {/* Content */}
      <div className={viewType === 'both' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
        {/* Chart */}
        {(viewType === 'chart' || viewType === 'both') && (
          <div className={viewType === 'both' ? 'space-y-5' : 'space-y-5'}>
            <ReportChart
              data={chartData}
              type={chartType}
              title={report.name}
              height={chartHeight}
              showLegend
              valueFormat={report.module === 'finance' || report.module === 'sales' ? 'currency' : 'number'}
              onRefresh={handleRefresh}
              onExport={() => handleExport('pdf')}
              onFullscreen={toggleFullscreen}
              onTypeChange={setChartType}
              actionButtons={
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white transition disabled:opacity-50"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isRefreshing) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRefreshing) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  
                  {permissions.download && (
                    <div className="flex items-center gap-1 rounded-lg p-1"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                      <div className="w-px h-4 bg-white/20"></div>
                      <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Excel</span>
                      </button>
                    </div>
                  )}
                  
                  {permissions.share && (
                    <button
                      onClick={() => {
                        if (!permissions.share) {
                          toast.error('Permission denied', {
                            description: 'You do not have permission to share reports',
                            duration: 3000,
                          });
                          return;
                        }
                        setShowShareDialog(true);
                      }}
                      className="p-2 rounded-lg text-white/80 hover:text-white transition"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  {permissions.edit && (
                    <button
                      onClick={() => onEdit(reportId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition"
                      style={{
                        background: "rgba(59, 130, 246, 0.15)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  )}
                </div>
              }
            />
            
            {/* Chart Description/Insights */}
            <div className="glass-card rounded-xl p-5 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-2">Chart Insights</h4>
                  <div className="space-y-2 text-xs text-white/70 leading-relaxed">
                    <p>
                      This {chartType} chart displays {report.config.metrics.map(m => m.label).join(', ')} 
                      {report.config.dimensions.length > 0 && ` grouped by ${report.config.dimensions[0]?.label}`}.
                    </p>
                    {report.module === 'sales' && (
                      <p className="text-white/60">
                        The data shows sales performance across different regions and product categories, 
                        helping identify top-performing areas and growth opportunities.
                      </p>
                    )}
                    {report.module === 'finance' && (
                      <p className="text-white/60">
                        Financial metrics are displayed to track revenue, expenses, and profitability 
                        trends over the selected time period.
                      </p>
                    )}
                    {report.module === 'inventory' && (
                      <p className="text-white/60">
                        Inventory levels and stock status are visualized to monitor product availability 
                        and identify items requiring reorder.
                      </p>
                    )}
                    {report.module === 'operations' && (
                      <p className="text-white/60">
                        Operational efficiency metrics show production performance, downtime analysis, 
                        and resource utilization across different production lines.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {(viewType === 'table' || viewType === 'both') && (
          <div className={viewType === 'both' ? 'space-y-5' : 'space-y-5'}>
            <ReportTable
              data={tableData}
              columns={tableColumns}
              title={viewType === 'both' ? 'Data Table' : report.name}
              pageSize={viewType === 'both' ? 5 : 15}
              showPagination
              showRowNumbers
              stickyHeader
              maxHeight={viewType === 'both' ? '400px' : '600px'}
              onExport={(format) => handleExport(format === 'csv' ? 'excel' : format)}
              actionButtons={
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white transition disabled:opacity-50"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isRefreshing) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRefreshing) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  
                  {permissions.download && (
                    <div className="flex items-center gap-1 rounded-lg p-1"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                      <div className="w-px h-4 bg-white/20"></div>
                      <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Excel</span>
                      </button>
                    </div>
                  )}
                  
                  {permissions.share && (
                    <button
                      onClick={() => {
                        if (!permissions.share) {
                          toast.error('Permission denied', {
                            description: 'You do not have permission to share reports',
                            duration: 3000,
                          });
                          return;
                        }
                        setShowShareDialog(true);
                      }}
                      className="p-2 rounded-lg text-white/80 hover:text-white transition"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  {permissions.edit && (
                    <button
                      onClick={() => onEdit(reportId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition"
                      style={{
                        background: "rgba(59, 130, 246, 0.15)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  )}
                </div>
              }
            />
            
            {/* Table Description */}
            {viewType === 'both' && (
              <div className="glass-card rounded-xl p-5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                    <Table className="w-4 h-4 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-2">Data Summary</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Detailed data table showing all {tableData.length} records with sortable columns. 
                      Use the export options to download the data in PDF or Excel format for further analysis.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        reportName={report.name}
        reportId={report.id}
        currentSharedWith={report.sharedWith}
      />
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900">
        {viewerContent}
      </div>
    );
  }

  return viewerContent;
};

export default ReportViewer;


