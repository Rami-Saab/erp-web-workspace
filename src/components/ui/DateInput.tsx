// ==================== DATE INPUT COMPONENT ====================
import React from 'react';
import { Calendar } from 'lucide-react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  error = false,
  disabled = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
        <Calendar className="w-5 h-5" />
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${
          error ? 'border-red-400/50 focus:ring-red-400/30' : 'focus:ring-white/30'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(16px)",
          border: error ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)",
          color: '#ffffff',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !error) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !error) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 2px rgba(59, 130, 246, 0.2)';
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.borderColor = error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)';
          }
        }}
      />
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.6;
          cursor: pointer;
          margin-right: 8px;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        input[type="date"]::-webkit-datetime-edit-text {
          color: rgba(255, 255, 255, 0.9);
        }
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
};

export default DateInput;

