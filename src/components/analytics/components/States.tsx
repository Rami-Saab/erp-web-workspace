// ==================== STATE COMPONENTS ====================
import React from 'react';
import { 
  Loader2, AlertCircle, Inbox, RefreshCw, 
  Search, BarChart3, Zap, Database
} from 'lucide-react';

// Loading State Component
export const LoadingState: React.FC<{
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'pulse';
}> = ({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'spinner'
}) => {
  const sizeConfig = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', padding: 'py-6' },
    md: { icon: 'w-10 h-10', text: 'text-base', padding: 'py-12' },
    lg: { icon: 'w-16 h-16', text: 'text-lg', padding: 'py-16' },
  };

  const config = sizeConfig[size];

  if (variant === 'skeleton') {
    return (
      <div className={`${config.padding} space-y-4`}>
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${config.padding}`}>
        <div className="relative">
          <div className={`${config.icon} bg-blue-500/20 rounded-full animate-ping absolute`} />
          <div className={`${config.icon} bg-blue-500/30 rounded-full flex items-center justify-center relative`}>
            <Database className="w-1/2 h-1/2 text-blue-300" />
          </div>
        </div>
        {message && (
          <p className={`text-white/60 ${config.text} mt-4`}>{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${config.padding}`}>
      <Loader2 className={`${config.icon} text-blue-400 animate-spin`} />
      {message && (
        <p className={`text-white/60 ${config.text} mt-4`}>{message}</p>
      )}
    </div>
  );
};

// Error State Component
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading the data.',
  onRetry,
  size = 'md'
}) => {
  const sizeConfig = {
    sm: { icon: 'w-10 h-10', title: 'text-base', text: 'text-sm', padding: 'py-6' },
    md: { icon: 'w-16 h-16', title: 'text-lg', text: 'text-base', padding: 'py-12' },
    lg: { icon: 'w-20 h-20', title: 'text-xl', text: 'text-lg', padding: 'py-16' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center ${config.padding}`}>
      <div className={`${config.icon} bg-red-500/20 rounded-full flex items-center justify-center mb-4`}>
        <AlertCircle className="w-1/2 h-1/2 text-red-400" />
      </div>
      <h3 className={`text-white font-semibold ${config.title} mb-2`}>{title}</h3>
      <p className={`text-white/60 ${config.text} text-center max-w-md mb-4`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

// Empty State Component
export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}> = ({ 
  title = 'No data found',
  message = 'There is no data to display.',
  icon,
  action,
  size = 'md'
}) => {
  const sizeConfig = {
    sm: { icon: 'w-10 h-10', title: 'text-base', text: 'text-sm', padding: 'py-6' },
    md: { icon: 'w-16 h-16', title: 'text-lg', text: 'text-base', padding: 'py-12' },
    lg: { icon: 'w-20 h-20', title: 'text-xl', text: 'text-lg', padding: 'py-16' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center ${config.padding}`}>
      <div className={`${config.icon} bg-white/10 rounded-full flex items-center justify-center mb-4`}>
        {icon || <Inbox className="w-1/2 h-1/2 text-white/40" />}
      </div>
      <h3 className={`text-white font-semibold ${config.title} mb-2`}>{title}</h3>
      <p className={`text-white/60 ${config.text} text-center max-w-md mb-4`}>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 text-sm transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// No Search Results State
export const NoResultsState: React.FC<{
  query: string;
  onClear?: () => void;
}> = ({ query, onClear }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-white/40" />
    </div>
    <h3 className="text-white font-semibold text-lg mb-2">No results found</h3>
    <p className="text-white/60 text-center max-w-md mb-4">
      No results found for "{query}". Try adjusting your search or filters.
    </p>
    {onClear && (
      <button
        onClick={onClear}
        className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm transition-colors"
      >
        Clear Search
      </button>
    )}
  </div>
);

// Coming Soon State
export const ComingSoonState: React.FC<{
  feature: string;
  description?: string;
}> = ({ 
  feature = 'This feature',
  description = 'This feature is currently under development and will be available soon.'
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
      <Zap className="w-10 h-10 text-purple-400" />
    </div>
    <h3 className="text-white font-semibold text-xl mb-2">Coming Soon</h3>
    <p className="text-purple-300 font-medium mb-2">{feature}</p>
    <p className="text-white/60 text-center max-w-md">{description}</p>
  </div>
);

// No Chart Data State
export const NoChartDataState: React.FC<{
  message?: string;
}> = ({ message = 'No data available for the selected period.' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
      <BarChart3 className="w-8 h-8 text-white/40" />
    </div>
    <p className="text-white/60 text-center">{message}</p>
  </div>
);

// Skeleton Components
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 animate-pulse ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-white/10 rounded-lg" />
      <div className="w-16 h-4 bg-white/10 rounded" />
    </div>
    <div className="w-24 h-3 bg-white/10 rounded mb-2" />
    <div className="w-32 h-8 bg-white/10 rounded" />
  </div>
);

export const ChartSkeleton: React.FC<{ height?: number; className?: string }> = ({ 
  height = 300, 
  className = '' 
}) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-white/10">
      <div className="w-32 h-5 bg-white/10 rounded animate-pulse" />
      <div className="w-48 h-3 bg-white/10 rounded mt-2 animate-pulse" />
    </div>
    <div className="p-6">
      <div 
        className="w-full bg-white/5 rounded-lg flex items-center justify-center animate-pulse"
        style={{ height }}
      >
        <BarChart3 className="w-12 h-12 text-white/10" />
      </div>
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className = '' 
}) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="animate-pulse">
      <div className="h-12 bg-white/5 border-b border-white/10" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 border-b border-white/5 flex items-center px-4 gap-4">
          <div className="h-4 bg-white/10 rounded flex-1" />
          <div className="h-4 bg-white/10 rounded w-24" />
          <div className="h-4 bg-white/10 rounded w-20" />
          <div className="h-4 bg-white/10 rounded w-16" />
        </div>
      ))}
    </div>
  </div>
);

export default { LoadingState, ErrorState, EmptyState, NoResultsState, ComingSoonState, NoChartDataState };







