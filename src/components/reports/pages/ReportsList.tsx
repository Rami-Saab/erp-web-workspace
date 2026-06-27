// ==================== REPORTS MODULE - REPORTS LIST PAGE ====================
import React, { useState, useMemo, useCallback } from 'react';
import {
  LayoutGrid,
  List,
  FileText,
  Star,
  Clock,
  Users,
  TrendingUp,
  Search,
  Eye,
  Edit,
  Share2,
  X,
} from 'lucide-react';
import { ReportCard, EmptyState, ReportCardSkeleton, ShareDialog } from '../components';
import type { Report, ReportModule, ReportStatus, ViewMode, DateRange } from '../types/reports.types';
import { mockReports as defaultMockReports, formatDate } from '../data/mockData';
import { MODULE_COLORS, STATUS_COLORS } from '../types/reports.types';

interface ReportsListProps {
  onViewReport: (id: string) => void;
  onEditReport: (id: string) => void;
  onCreateReport: () => void;
  onDeleteReport?: (id: string) => void;
  onDuplicateReport?: (id: string) => void;
  onShareReport?: (id: string) => void;
  reports?: Report[];
}

export const ReportsList: React.FC<ReportsListProps> = ({
  onViewReport,
  onEditReport,
  onDeleteReport,
  onDuplicateReport,
  onShareReport,
  reports: propReports,
}) => {
  const reports = propReports || defaultMockReports;
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModules, setSelectedModules] = useState<ReportModule[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ReportStatus[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(reports.filter(r => r.isFavorite).map(r => r.id))
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedReportForShare, setSelectedReportForShare] = useState<Report | null>(null);

  const reportsPerPage = 9;

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          report.name.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.owner.name.toLowerCase().includes(query) ||
          report.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Module filter
      if (selectedModules.length > 0 && !selectedModules.includes(report.module)) {
        return false;
      }

      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(report.status)) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => report.tags.includes(tag))) {
        return false;
      }

      // Date range filter
      if (dateRange) {
        const reportDate = new Date(report.updatedAt);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        if (reportDate < startDate || reportDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedModules, selectedStatuses, selectedTags, dateRange]);

  // Paginate reports
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    return filteredReports.slice(startIndex, startIndex + reportsPerPage);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Stats
  const stats = useMemo(() => ({
    total: reports.length,
    active: reports.filter(r => r.status === 'active').length,
    scheduled: reports.filter(r => r.status === 'scheduled').length,
    favorites: reports.filter(r => r.isFavorite).length,
  }), [reports]);

  // Toggle favorite
  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  // Handle run report
  const handleRunReport = useCallback((id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onViewReport(id);
    }, 500);
  }, [onViewReport]);

  // Handle share report
  const handleShareReport = useCallback((id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setSelectedReportForShare(report);
      setShareDialogOpen(true);
    }
    onShareReport?.(id);
  }, [reports, onShareReport]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedModules([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
    setDateRange(null);
    setCurrentPage(1);
  }, []);


  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-300" />
            </div>
            <span className="text-xs text-blue-300 font-medium">Total</span>
          </div>
          <p className="text-white/60 text-sm">All Reports</p>
          <p className="text-white text-2xl font-semibold">{stats.total}</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-300" />
            </div>
            <span className="text-xs text-green-300 font-medium">Active</span>
          </div>
          <p className="text-white/60 text-sm">Active Reports</p>
          <p className="text-white text-2xl font-semibold">{stats.active}</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-300" />
            </div>
            <span className="text-xs text-purple-300 font-medium">Scheduled</span>
          </div>
          <p className="text-white/60 text-sm">Scheduled Reports</p>
          <p className="text-white text-2xl font-semibold">{stats.scheduled}</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-300" />
            </div>
            <span className="text-xs text-yellow-300 font-medium">Favorites</span>
          </div>
          <p className="text-white/60 text-sm">Favorite Reports</p>
          <p className="text-white text-2xl font-semibold">{stats.favorites}</p>
        </div>
      </div>

      {/* Combined Table with Search, View Toggle, and Reports */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Toolbar with Search and View Toggle */}
        <div className="flex items-center justify-between gap-4 flex-nowrap p-6 pb-4 border-b border-white/10">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 h-[42px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-xl"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow:
                "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
              height: '42px',
            }}
          >
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 h-full ${
                viewMode === 'card'
                  ? "text-white shadow-sm"
                  : "text-white/60 hover:text-white/80"
              }`}
              style={
                viewMode === 'card'
                  ? {
                      background:
                        "rgba(59, 130, 246, 0.25)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow:
                        "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    }
                  : {
                      background: "transparent",
                    }
              }
            >
              <LayoutGrid className="w-3 h-3" />
              <span className="hidden sm:inline text-xs">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 h-full ${
                viewMode === 'table'
                  ? "text-white shadow-sm"
                  : "text-white/60 hover:text-white/80"
              }`}
              style={
                viewMode === 'table'
                  ? {
                      background:
                        "rgba(59, 130, 246, 0.25)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow:
                        "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    }
                  : {
                      background: "transparent",
                    }
              }
            >
              <List className="w-3 h-3" />
              <span className="hidden sm:inline text-xs">List</span>
            </button>
          </div>
        </div>

        {/* Reports Grid/List Content */}
        <div className="p-6 pt-4">
          {isLoading ? (
            <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, i) => (
                <ReportCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <EmptyState
              icon={<Search className="w-10 h-10 text-white/40" />}
              title="No reports found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={{
                label: 'Clear Filters',
                onClick: handleResetFilters,
              }}
            />
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {paginatedReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={{ ...report, isFavorite: favorites.has(report.id) }}
                  onView={onViewReport}
                  onEdit={onEditReport}
                  onDelete={onDeleteReport}
                  onDuplicate={onDuplicateReport}
                  onToggleFavorite={handleToggleFavorite}
                  onRun={handleRunReport}
                  onShare={handleShareReport}
                />
              ))}
            </div>
          ) : (
            <div 
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
              <thead 
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span>Report</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                      <span>Module</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>Owner</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 flex-shrink-0" />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>Last Updated</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>Shared with</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="flex items-center justify-end gap-2 w-full">
                      <Edit className="w-4 h-4 flex-shrink-0" />
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody 
                className="divide-y"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                {paginatedReports.map((report) => {
                  const moduleColor = MODULE_COLORS[report.module];
                  const statusColor = STATUS_COLORS[report.status];
                  
                  // Get dot background color style for status
                  const getStatusDotStyle = () => {
                    const colors: Record<string, string> = {
                      active: '#22c55e', // green-500
                      scheduled: '#3b82f6', // blue-500
                      draft: '#a855f7', // purple-500
                      archived: '#eab308', // yellow-500
                    };
                    return { backgroundColor: colors[report.status] || '#a855f7' };
                  };
                  
                  return (
                    <tr 
                      key={report.id} 
                      className="transition-all duration-200 group"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(10px)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleFavorite(report.id)}
                            className="text-white/40 hover:text-yellow-400 transition-all duration-200 flex-shrink-0 p-1 rounded hover:bg-white/5"
                            title={favorites.has(report.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            {favorites.has(report.id) ? (
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ) : (
                              <Star className="w-4 h-4 text-white/50 stroke-white/30" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <p className="text-white font-semibold text-sm truncate">{report.name}</p>
                            </div>
                            <p className="text-white/50 text-xs truncate max-w-md leading-relaxed">{report.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${moduleColor.bg} ${moduleColor.text} border ${moduleColor.border} capitalize inline-flex items-center gap-2`}>
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
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-sm"
                            style={{
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            {report.owner.name.charAt(0)}
                          </div>
                          <span className="text-white/90 text-sm font-medium truncate max-w-[140px]">{report.owner.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusColor.bg} ${statusColor.text} border ${statusColor.border} capitalize inline-flex items-center gap-2`}>
                          <span 
                            className="rounded-full flex-shrink-0" 
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              minWidth: '8px', 
                              minHeight: '8px',
                              display: 'inline-block',
                              flexShrink: 0,
                              ...getStatusDotStyle()
                            }} 
                          />
                          <span>{report.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-white/40 flex-shrink-0" />
                          <span className="text-white/70 text-sm whitespace-nowrap font-medium">{formatDate(report.updatedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {report.sharedWith.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {report.sharedWith.slice(0, 3).map((user) => (
                              <div
                                key={user.id}
                                className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-sm"
                                style={{
                                  backdropFilter: "blur(8px)",
                                  width: '32px',
                                  height: '32px',
                                  minWidth: '32px',
                                  minHeight: '32px',
                                  flexShrink: 0,
                                }}
                                title={`${user.name} (${user.permission})`}
                              >
                                {user.name.charAt(0)}
                              </div>
                            ))}
                            {report.sharedWith.length > 3 && (
                              <div 
                                className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-medium flex-shrink-0 shadow-sm"
                                style={{
                                  backdropFilter: "blur(8px)",
                                  width: '32px',
                                  height: '32px',
                                  minWidth: '32px',
                                  minHeight: '32px',
                                  flexShrink: 0,
                                }}
                                title={`+${report.sharedWith.length - 3} more`}
                              >
                                +{report.sharedWith.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewReport(report.id)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              backdropFilter: "blur(8px)",
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
                            title="View Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShareReport(report.id)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              backdropFilter: "blur(8px)",
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
                            title="Share Report"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditReport(report.id)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              backdropFilter: "blur(8px)",
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
                            title="Edit Report"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 glass-content-inner rounded-lg text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  currentPage === pageNum
                    ? 'bg-blue-500/25 border border-blue-400/50 text-white'
                    : 'glass-content-inner text-white/60 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 glass-content-inner rounded-lg text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Share Dialog */}
      {selectedReportForShare && (
        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => {
            setShareDialogOpen(false);
            setSelectedReportForShare(null);
          }}
          reportName={selectedReportForShare.name}
          reportId={selectedReportForShare.id}
          currentSharedWith={selectedReportForShare.sharedWith}
        />
      )}
    </div>
  );
};

export default ReportsList;


