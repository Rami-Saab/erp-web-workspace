// ==================== ANALYTICS DATA TABLE COMPONENTS ====================
import React from 'react';

// Currency Display Component
export const CurrencyDisplay: React.FC<{
  value: number;
  compact?: boolean;
}> = ({ value, compact = false }) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 0 : 2,
  }).format(value);

  return (
    <span className="text-white/90 font-medium tabular-nums">
      {formatted}
    </span>
  );
};

// Status Badge Component
export const StatusBadge: React.FC<{
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}> = ({ status, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-white/10 text-white/70 border-white/20',
    success: 'bg-green-500/20 text-green-300 border-green-400/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    danger: 'bg-red-500/20 text-red-300 border-red-400/30',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]}`}
    >
      {status}
    </span>
  );
};

// Trend Indicator Component
export const TrendIndicator: React.FC<{
  value: number;
  showArrow?: boolean;
}> = ({ value, showArrow = true }) => {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const arrow = isPositive ? '↑' : '↓';

  return (
    <span className={`flex items-center gap-1 ${colorClass} font-medium`}>
      {showArrow && <span>{arrow}</span>}
      <span>{Math.abs(value).toFixed(1)}%</span>
    </span>
  );
};

// Urgency Badge Component
export const UrgencyBadge: React.FC<{
  level: 'low' | 'medium' | 'high' | 'critical';
}> = ({ level }) => {
  const levelClasses = {
    low: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    high: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    critical: 'bg-red-500/20 text-red-300 border-red-400/30',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${levelClasses[level]}`}
    >
      {level}
    </span>
  );
};

// Table Progress Bar Component
export const TableProgressBar: React.FC<{
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
}> = ({ value, max = 100, color = 'blue', showLabel = true }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-1">
      <div className="w-full bg-white/10 rounded-full h-2 min-w-[60px]">
        <div
          className={`h-2 rounded-full transition-all ${colorClasses[color] || colorClasses.blue}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-white/70 text-sm text-right block">{percentage.toFixed(0)}%</span>
      )}
    </div>
  );
};

// Data Table Component (placeholder - implement as needed)
export const DataTable: React.FC<{
  data: any[];
  columns: any[];
  config?: any;
}> = ({ data, columns, config: _config }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.id}
                className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider border-b border-white/10"
              >
                {col.header || col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
              {columns.map((col) => {
                const cellValue = row[col.key || col.id];
                return (
                  <td key={col.key || col.id} className="px-4 py-3 text-sm text-white/90">
                    {col.render ? col.render(cellValue, row, idx) : cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
