// ==================== EXPORT BUTTON COMPONENT ====================
import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, ChevronDown, Check } from 'lucide-react';
import type { ExportFormat } from '../types/analytics.types';

// Export format configuration
const exportFormats: { format: ExportFormat; label: string; icon: React.ReactNode; description: string }[] = [
  { format: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" />, description: 'Export as PDF document' },
  { format: 'excel', label: 'Excel', icon: <FileSpreadsheet className="w-4 h-4" />, description: 'Export as Excel spreadsheet' },
  { format: 'csv', label: 'CSV', icon: <FileText className="w-4 h-4" />, description: 'Export as CSV file' },
  { format: 'json', label: 'JSON', icon: <FileJson className="w-4 h-4" />, description: 'Export as JSON data' },
];

// Simple Export Button
export const ExportButton: React.FC<{
  onExport: (format: ExportFormat) => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  onExport, 
  loading = false, 
  disabled = false,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);

  const handleExport = (format: ExportFormat) => {
    setSelectedFormat(format);
    onExport(format);
    setIsOpen(false);
    // Reset selection after animation
    setTimeout(() => setSelectedFormat(null), 2000);
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const variantClasses = {
    default: 'bg-white/10 border border-white/20 text-white hover:bg-white/15',
    primary: 'bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30',
    ghost: 'text-white/70 hover:text-white hover:bg-white/10',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`
          rounded-lg font-medium transition-colors flex items-center
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>Export</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl py-1 overflow-hidden">
            {exportFormats.map((item) => (
              <button
                key={item.format}
                onClick={() => handleExport(item.format)}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors
                  ${selectedFormat === item.format 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'text-white/80 hover:bg-white/10'}
                `}
              >
                {selectedFormat === item.format ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  item.icon
                )}
                <div>
                  <div className="font-medium">{item.label}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Export Modal Component
export const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat, options: { includeCharts: boolean }) => void;
  title?: string;
}> = ({ isOpen, onClose, onExport, title = 'Export Data' }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await onExport(selectedFormat, { includeCharts });
    setIsExporting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800/95 border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-white/60 text-sm mt-1">Choose format and options</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Options */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Options</label>
            <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/20"
              />
              <div>
                <span className="text-white text-sm">Include Charts</span>
                <p className="text-white/50 text-xs">Export charts as images (PDF/Excel only)</p>
              </div>
            </label>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              {exportFormats.map((item) => (
                <button
                  key={item.format}
                  onClick={() => setSelectedFormat(item.format)}
                  className={`
                    p-3 rounded-lg border text-left transition-colors
                    ${selectedFormat === item.format
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-xs text-white/50">{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Export Buttons Row
export const ExportButtonGroup: React.FC<{
  onExport: (format: ExportFormat) => void;
  loading?: ExportFormat | null;
}> = ({ onExport, loading }) => (
  <div className="flex items-center gap-2">
    {exportFormats.map((item) => (
      <button
        key={item.format}
        onClick={() => onExport(item.format)}
        disabled={loading === item.format}
        className={`
          px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
          bg-white/10 border border-white/20 text-white/80 hover:bg-white/15 hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={item.description}
      >
        {loading === item.format ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          item.icon
        )}
        {item.label}
      </button>
    ))}
  </div>
);

export default ExportButton;






















