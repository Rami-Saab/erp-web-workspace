// ==================== REPORTS MODULE - STATE COMPONENTS ====================
import React from 'react';
import { Loader2, FileX, Search, AlertTriangle, RefreshCw } from 'lucide-react';

// ==================== LOADING STATE ====================
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full bg-blue-500/20 animate-pulse`} />
        <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin absolute inset-0`} />
      </div>
      <p className={`mt-4 text-white/70 ${textClasses[size]}`}>{message}</p>
    </div>
  );
};

// ==================== EMPTY STATE ====================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        {icon || <FileX className="w-10 h-10 text-white/40" />}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-white/60 max-w-md mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 font-medium hover:bg-blue-500/30 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// ==================== NO RESULTS STATE ====================
interface NoResultsStateProps {
  searchTerm?: string;
  onClearSearch?: () => void;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({
  searchTerm,
  onClearSearch,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-white/40" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
      <p className="text-white/60 max-w-md mb-6">
        {searchTerm
          ? `No reports match "${searchTerm}". Try adjusting your search or filters.`
          : 'No reports match your current filters. Try adjusting your criteria.'}
      </p>
      {onClearSearch && (
        <button
          onClick={onClearSearch}
          className="px-6 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white/80 font-medium hover:bg-white/15 transition-all"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

// ==================== ERROR STATE ====================
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 font-medium hover:bg-red-500/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

// ==================== SKELETON LOADERS ====================
export const ReportCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10" />
          <div>
            <div className="h-5 w-40 bg-white/10 rounded mb-2" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
        </div>
        <div className="h-6 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="h-4 w-full bg-white/5 rounded mb-2" />
      <div className="h-4 w-3/4 bg-white/5 rounded mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-16 bg-white/10 rounded-full" />
        <div className="h-5 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="h-4 w-32 bg-white/5 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-white/10 rounded-lg" />
          <div className="h-8 w-8 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const ReportTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-white/10 rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
          {[1, 2, 3, 4, 5].map((j) => (
            <div key={j} className="h-4 bg-white/5 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse p-6">
      <div className="h-6 w-48 bg-white/10 rounded mb-6" />
      <div className="flex items-end justify-between gap-4 h-64">
        {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 90, 95].map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-white/10 rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((label, i) => (
          <div key={i} className="h-4 w-6 bg-white/5 rounded" />
        ))}
      </div>
    </div>
  );
};

// ==================== INLINE LOADING ====================
export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'Loading' }) => {
  return (
    <span className="inline-flex items-center gap-2 text-white/60">
      <Loader2 className="w-4 h-4 animate-spin" />
      {text}
    </span>
  );
};


