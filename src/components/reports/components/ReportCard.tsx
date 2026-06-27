// ==================== REPORTS MODULE - REPORT CARD COMPONENT ====================
import React from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  Table,
  Star,
  StarOff,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Clock,
  User,
  Calendar,
  Play,
  Share2,
  UserCheck,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Users as UsersIcon,
  Settings,
  FileText,
} from 'lucide-react';
import type { Report, ChartType } from '../types/reports.types';
import { MODULE_COLORS, STATUS_COLORS } from '../types/reports.types';
import { formatDate } from '../data/mockData';

// Chart type icon mapping
const getChartIcon = (chartType: ChartType): React.ReactNode => {
  switch (chartType) {
    case 'bar':
      return <BarChart3 className="w-5 h-5" />;
    case 'line':
      return <LineChart className="w-5 h-5" />;
    case 'pie':
    case 'donut':
      return <PieChart className="w-5 h-5" />;
    case 'area':
      return <AreaChart className="w-5 h-5" />;
    case 'table':
      return <Table className="w-5 h-5" />;
    default:
      return <BarChart3 className="w-5 h-5" />;
  }
};

// Module icon mapping - each module has its own icon
const getModuleIcon = (module: string): React.ReactNode => {
  switch (module) {
    case 'finance':
      return <DollarSign className="w-5 h-5" />;
    case 'sales':
      return <TrendingUp className="w-5 h-5" />;
    case 'inventory':
      return <Package className="w-5 h-5" />;
    case 'hr':
      return <UsersIcon className="w-5 h-5" />;
    case 'operations':
      return <Settings className="w-5 h-5" />;
    case 'custom':
      return <FileText className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

interface ReportCardProps {
  report: Report;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onRun?: (id: string) => void;
  onShare?: (id: string) => void;
  isCompact?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onRun,
  onShare,
  isCompact = false,
}) => {

  const moduleColor = MODULE_COLORS[report.module];
  const statusColor = STATUS_COLORS[report.status];

  if (isCompact) {
    return (
      <div className="glass-card rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-lg ${moduleColor.bg} border ${moduleColor.border} flex items-center justify-center ${moduleColor.text}`}>
            {getModuleIcon(report.module)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium truncate">{report.name}</h3>
              {report.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
            </div>
            <p className="text-white/50 text-sm truncate">{report.description}</p>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text} border ${statusColor.border} capitalize`}>
              {report.status}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(report.id);
              }}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-5 hover:border-white/30 hover:shadow-xl transition-all duration-300 group h-full flex flex-col relative overflow-hidden ${report.name === 'Operations Efficiency Report' ? 'border-yellow-400/20 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent' : ''}`}>
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${report.name === 'Operations Efficiency Report' ? 'group-hover:from-yellow-500/10' : ''}`} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl ${moduleColor.bg} ${report.name === 'Operations Efficiency Report' ? '' : `border ${moduleColor.border}`} flex items-center justify-center ${moduleColor.text} flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {getModuleIcon(report.module)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-white font-semibold text-sm truncate leading-tight group-hover:text-white transition-colors ${report.name === 'Operations Efficiency Report' ? 'text-yellow-100' : ''}`}>
              {report.name}
            </h3>
            <p className="text-white/50 text-xs capitalize mt-1">{report.module} Report</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text} border ${statusColor.border} capitalize whitespace-nowrap shadow-sm`}>
            {report.status}
          </span>
          <button
            onClick={() => onToggleFavorite?.(report.id)}
            className="p-1.5 text-white/50 hover:text-yellow-400 transition-all flex-shrink-0 rounded-lg hover:bg-white/10"
            title={report.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {report.isFavorite ? (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ) : (
              <StarOff className="w-4 h-4 text-white/50 stroke-white/30" />
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/60 text-xs line-clamp-2 mb-4 flex-shrink-0 leading-relaxed relative z-10">
        {report.description}
      </p>

      {/* Special Badge for Operations Efficiency Report */}
      {report.name === 'Operations Efficiency Report' && (
        <div className="mb-3 flex-shrink-0 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-yellow-300 text-xs font-semibold">High Priority</span>
          </div>
        </div>
      )}

      {/* Tags */}
      {report.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0 relative z-10">
          {report.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${moduleColor.bg} ${moduleColor.text} border ${moduleColor.border} shadow-sm`}
            >
              {tag}
            </span>
          ))}
          {report.tags.length > 3 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/20 shadow-sm">
              +{report.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-3 text-xs text-white/50 mb-4 flex-wrap flex-shrink-0 relative z-10">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate max-w-[120px]">{report.owner.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="whitespace-nowrap">{formatDate(report.updatedAt)}</span>
        </div>
        {report.lastRunAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap text-xs">Run {formatDate(report.lastRunAt)}</span>
          </div>
        )}
      </div>

      {/* Shared With */}
      {report.sharedWith.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-shrink-0 relative z-10">
          <span className="text-xs text-white/50 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Shared with:
          </span>
          <div className="flex items-center gap-1.5">
            {report.sharedWith.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-sm"
                style={{
                  backdropFilter: "blur(8px)",
                }}
                title={`${user.name} (${user.permission})`}
              >
                {user.name.charAt(0)}
              </div>
            ))}
            {report.sharedWith.length > 3 && (
              <div 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-medium flex-shrink-0 shadow-sm"
                style={{
                  backdropFilter: "blur(8px)",
                }}
                title={`+${report.sharedWith.length - 3} more`}
              >
                +{report.sharedWith.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-auto relative z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRun?.(report.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-semibold transition-all whitespace-nowrap"
            style={{
              background: "rgba(59, 130, 246, 0.15)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 2px 8px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
              e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
            }}
          >
            <Play className="w-3.5 h-3.5" />
            Run
          </button>
          <button
            onClick={() => onView?.(report.id)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onShare?.(report.id)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;


