// ==================== REPORTS MODULE - SCHEDULE FORM COMPONENT ====================
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Mail,
  FileText,
  Users,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import type { ReportSchedule, ScheduleFrequency, ExportFormat } from '../types/reports.types';
import { mockUsers } from '../data/mockData';
import { CustomSelect } from './CustomSelect';
import { TimeInput } from '../../ui/TimeInput';
import { GLASS_STYLES } from '../utils';

interface ScheduleFormProps {
  schedule?: ReportSchedule;
  reportId: string;
  onSave: (schedule: Partial<ReportSchedule>) => void;
  onCancel: () => void;
}

const FREQUENCIES: { value: ScheduleFrequency; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Run every day at the specified time' },
  { value: 'weekly', label: 'Weekly', description: 'Run once a week on the selected day' },
  { value: 'monthly', label: 'Monthly', description: 'Run once a month on the selected day' },
  { value: 'quarterly', label: 'Quarterly', description: 'Run every 3 months' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const FORMATS: { value: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { value: 'pdf', label: 'PDF Document', icon: <FileText className="w-4 h-4" /> },
  { value: 'excel', label: 'Excel Spreadsheet', icon: <FileText className="w-4 h-4" /> },
  { value: 'csv', label: 'CSV File', icon: <FileText className="w-4 h-4" /> },
];

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  reportId,
  onSave,
  onCancel,
}) => {
  const [frequency, setFrequency] = useState<ScheduleFrequency>(schedule?.frequency || 'weekly');
  const [time, setTime] = useState(schedule?.time || '08:00');
  const [timezone, setTimezone] = useState(schedule?.timezone || 'Asia/Riyadh');
  const [dayOfWeek, setDayOfWeek] = useState(schedule?.dayOfWeek ?? 1);
  const [dayOfMonth, _setDayOfMonth] = useState(schedule?.dayOfMonth ?? 1);
  const [format, setFormat] = useState<ExportFormat>(schedule?.format || 'pdf');
  const [recipients, setRecipients] = useState<string[]>(schedule?.recipients || []);
  const [emailInput, setEmailInput] = useState('');
  const [isActive, setIsActive] = useState(schedule?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailAdded, setEmailAdded] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-detect time and timezone from user's location
  useEffect(() => {
    if (!schedule) {
      // Get current time in HH:MM format
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      setTime(currentTime);

      // Get timezone from browser
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(userTimezone);
      } catch (error) {
        // Fallback to default timezone if detection fails
        setTimezone('Asia/Riyadh');
      }
    }
  }, [schedule]);

  // Update button styles when emailAdded changes
  useEffect(() => {
    if (addButtonRef.current) {
      if (emailAdded) {
        addButtonRef.current.style.background = 'rgba(34, 197, 94, 0.2)';
        addButtonRef.current.style.borderColor = 'rgba(34, 197, 94, 0.35)';
        addButtonRef.current.style.boxShadow = '0 4px 12px 0 rgba(34, 197, 94, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
      } else {
        addButtonRef.current.style.background = 'rgba(59, 130, 246, 0.2)';
        addButtonRef.current.style.borderColor = 'rgba(59, 130, 246, 0.35)';
        addButtonRef.current.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
      }
    }
  }, [emailAdded]);

  // Add recipient
  const handleAddRecipient = () => {
    if (emailInput && emailInput.includes('@') && !recipients.includes(emailInput)) {
      setRecipients([...recipients, emailInput]);
      setEmailInput('');
      setErrors({ ...errors, recipients: '' });
      setEmailAdded(true);
      setTimeout(() => {
        setEmailAdded(false);
      }, 2000);
    }
  };

  // Remove recipient
  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  // Add user as recipient
  const handleAddUserAsRecipient = (email: string) => {
    if (!recipients.includes(email)) {
      setRecipients([...recipients, email]);
      setErrors({ ...errors, recipients: '' });
    }
  };

  // Validate and save
  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (recipients.length === 0) {
      newErrors.recipients = 'At least one recipient is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const scheduleData: Partial<ReportSchedule> = {
      id: schedule?.id || `sch-${Date.now()}`,
      reportId,
      frequency,
      time,
      timezone,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      recipients,
      format,
      isActive,
      nextRunAt: calculateNextRun(),
    };

    onSave(scheduleData);
  };

  // Calculate next run date
  const calculateNextRun = (): string => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    if (nextRun <= now) {
      switch (frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7 || 7;
          nextRun.setDate(nextRun.getDate() + daysUntilNext);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          nextRun.setDate(dayOfMonth);
          break;
        case 'quarterly':
          nextRun.setMonth(nextRun.getMonth() + 3);
          break;
      }
    }

    return nextRun.toISOString();
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Frequency Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white" />
          Frequency
        </label>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {FREQUENCIES.map((freq) => (
            <button
              key={freq.value}
              onClick={() => setFrequency(freq.value)}
              className={`p-4 rounded-xl text-left transition ${
                frequency === freq.value
                  ? 'text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
              style={
                frequency === freq.value
                  ? GLASS_STYLES.selected
                  : GLASS_STYLES.card
              }
              onMouseEnter={(e) => {
                if (frequency !== freq.value) {
                  Object.assign(e.currentTarget.style, GLASS_STYLES.cardHover);
                }
              }}
              onMouseLeave={(e) => {
                if (frequency !== freq.value) {
                  Object.assign(e.currentTarget.style, GLASS_STYLES.card);
                }
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">
                  {freq.label}
                </span>
                {frequency === freq.value && (
                  <Check className="w-4 h-4 text-blue-300" />
                )}
              </div>
              <span className="text-xs text-white/60">
                {freq.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Day Selection (for weekly/monthly) */}
      {frequency === 'weekly' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            Day of Week
          </label>
          <div className="flex flex-wrap gap-2 mt-3">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                onClick={() => setDayOfWeek(day.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dayOfWeek === day.value
                    ? 'text-white shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                style={
                  dayOfWeek === day.value
                    ? GLASS_STYLES.selected
                    : GLASS_STYLES.card
                }
                onMouseEnter={(e) => {
                  if (dayOfWeek !== day.value) {
                    Object.assign(e.currentTarget.style, GLASS_STYLES.cardHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (dayOfWeek !== day.value) {
                    Object.assign(e.currentTarget.style, GLASS_STYLES.card);
                  }
                }}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time and Timezone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            Time
          </label>
          <TimeInput
            value={time}
            onChange={(value) => setTime(value)}
            placeholder="HH:MM"
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            Timezone
          </label>
          <CustomSelect
            value={timezone}
            onChange={(value) => setTimezone(value as string)}
            options={[
              { value: 'Asia/Riyadh', label: 'Asia/Riyadh (GMT+3)' },
              { value: 'Asia/Dubai', label: 'Asia/Dubai (GMT+4)' },
              { value: 'Asia/Kuwait', label: 'Asia/Kuwait (GMT+3)' },
              { value: 'Asia/Bahrain', label: 'Asia/Bahrain (GMT+3)' },
              { value: 'Asia/Qatar', label: 'Asia/Qatar (GMT+3)' },
              { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
              { value: 'America/New_York', label: 'America/New_York (GMT-5)' },
              { value: 'America/Los_Angeles', label: 'America/Los_Angeles (GMT-8)' },
              { value: 'Europe/Paris', label: 'Europe/Paris (GMT+1)' },
              { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
              { value: 'Asia/Shanghai', label: 'Asia/Shanghai (GMT+8)' },
              { value: 'Australia/Sydney', label: 'Australia/Sydney (GMT+10)' },
            ]}
            placeholder="Select timezone..."
            searchable
            searchPlaceholder="Search timezone..."
          />
        </div>
      </div>

      {/* Export Format */}
      <div className="space-y-3 mt-6">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-white" />
          Export Format
        </label>
        <div className="flex gap-3 mt-3">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => setFormat(fmt.value)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${
                format === fmt.value
                  ? 'text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
              style={
                format === fmt.value
                  ? GLASS_STYLES.selected
                  : GLASS_STYLES.card
              }
              onMouseEnter={(e) => {
                if (format !== fmt.value) {
                  Object.assign(e.currentTarget.style, GLASS_STYLES.cardHover);
                }
              }}
              onMouseLeave={(e) => {
                if (format !== fmt.value) {
                  Object.assign(e.currentTarget.style, GLASS_STYLES.card);
                }
              }}
            >
              {fmt.icon}
              <span className="text-sm font-medium">{fmt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-white" />
          Recipients
        </label>
        
        <div className="flex gap-2 mt-3">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
            placeholder="Enter email address..."
            className="flex-1 px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            ref={addButtonRef}
            onClick={handleAddRecipient}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition text-white"
            style={emailAdded ? GLASS_STYLES.buttonSuccess : GLASS_STYLES.button}
            onMouseEnter={(e) => {
              if (!emailAdded) {
                Object.assign(e.currentTarget.style, GLASS_STYLES.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              Object.assign(
                e.currentTarget.style,
                emailAdded ? GLASS_STYLES.buttonSuccess : GLASS_STYLES.button
              );
            }}
          >
            {emailAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              'Add'
            )}
          </button>
        </div>

        {errors.recipients && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.recipients}
          </p>
        )}

        {/* Quick add from users */}
        <div className="flex flex-wrap gap-2">
          {mockUsers.slice(0, 4).map((user) => (
            <button
              key={user.id}
              onClick={() => handleAddUserAsRecipient(user.email)}
              disabled={recipients.includes(user.email)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition ${
                recipients.includes(user.email)
                  ? 'text-white/40 cursor-not-allowed'
                  : 'text-white/70 hover:text-white'
              }`}
              style={
                recipients.includes(user.email)
                  ? {
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }
                  : {
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                    }
              }
              onMouseEnter={(e) => {
                if (!recipients.includes(user.email)) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!recipients.includes(user.email)) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
            >
              <Users className="w-3 h-3" />
              {user.name}
            </button>
          ))}
        </div>

        {/* Recipients list */}
        {recipients.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {recipients.map((email) => (
              <span
                key={email}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-white"
                style={GLASS_STYLES.card}
              >
                {email}
                <button
                  onClick={() => handleRemoveRecipient(email)}
                  className="text-white/60 hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status Toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-lg"
        style={GLASS_STYLES.card}
      >
        <div>
          <p className="text-white font-medium">Schedule Status</p>
          <p className="text-white/60 text-sm">
            {isActive ? 'Schedule is active and will run automatically' : 'Schedule is paused'}
          </p>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            isActive ? 'bg-green-500/30' : 'bg-white/20'
          }`}
          style={
            isActive
              ? {
                  boxShadow: "0 2px 8px 0 rgba(34, 197, 94, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                }
              : {
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }
          }
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              isActive ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg font-medium transition text-white"
          style={GLASS_STYLES.button}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, GLASS_STYLES.buttonHover);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, GLASS_STYLES.button);
          }}
        >
          {schedule ? 'Update Schedule' : 'Create Schedule'}
        </button>
      </div>
    </div>
  );
};

export default ScheduleForm;


