// ==================== REPORTS MODULE - REPORT SCHEDULE PAGE ====================
import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Mail,
  Play,
  Pause,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ScheduleForm, EmptyState, LoadingState, DeleteConfirmDialog } from '../components';
import type { ReportSchedule as ScheduleType, Report } from '../types/reports.types';
import { mockReports as defaultMockReports, formatDateTime } from '../data/mockData';
import { toast } from 'sonner';

interface ReportScheduleProps {
  reportId?: string; // If provided, show schedules for this report only
  initialShowForm?: boolean;
  onFormClose?: () => void;
  reports?: Report[];
}

export const ReportSchedule: React.FC<ReportScheduleProps> = ({
  reportId,
  initialShowForm = false,
  onFormClose,
  reports: propReports,
}) => {
  const reports = propReports || defaultMockReports;
  // Get schedules from reports that have schedules
  const reportsWithSchedules = reports.filter(r => r.schedule);
  const allSchedules = reportsWithSchedules.map(r => r.schedule!).filter(Boolean);
  
  const [schedules, setSchedules] = useState<ScheduleType[]>(
    reportId 
      ? allSchedules.filter(s => s.reportId === reportId)
      : allSchedules
  );
  const [showForm, setShowForm] = useState(initialShowForm);
  
  // Update schedules when reports change
  useEffect(() => {
    const reportsWithSchedules = reports.filter(r => r.schedule);
    const allSchedules = reportsWithSchedules.map(r => r.schedule!).filter(Boolean);
    setSchedules(
      reportId 
        ? allSchedules.filter(s => s.reportId === reportId)
        : allSchedules
    );
  }, [reports, reportId]);
  
  // Update showForm when initialShowForm changes
  useEffect(() => {
    setShowForm(initialShowForm);
  }, [initialShowForm]);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runningScheduleId, setRunningScheduleId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  // Get report name by ID
  const getReportName = (id: string) => {
    return reports.find(r => r.id === id)?.name || 'Unknown Report';
  };

  // Toggle schedule status
  const toggleScheduleStatus = (scheduleId: string) => {
    setSchedules(schedules.map(s =>
      s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
    ));
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete schedule
  const handleConfirmDelete = () => {
    if (scheduleToDelete) {
      setSchedules(schedules.filter(s => s.id !== scheduleToDelete));
      setScheduleToDelete(null);
    }
  };

  // Save schedule
  const handleSaveSchedule = (schedule: Partial<ScheduleType>) => {
    if (editingSchedule) {
      setSchedules(schedules.map(s =>
        s.id === schedule.id ? { ...s, ...schedule } as ScheduleType : s
      ));
    } else {
      setSchedules([...schedules, schedule as ScheduleType]);
    }
    setShowForm(false);
    setEditingSchedule(null);
    onFormClose?.();
  };
  
  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingSchedule(null);
    onFormClose?.();
  };

  // Run schedule now
  const handleRunNow = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    const reportName = getReportName(schedule.reportId);
    setRunningScheduleId(scheduleId);
    setIsLoading(true);

    // Show loading toast
    const toastId = toast.loading(`Running schedule for "${reportName}"...`, {
      description: `Generating ${schedule.format.toUpperCase()} report and sending to ${schedule.recipients.length} recipient${schedule.recipients.length > 1 ? 's' : ''}`,
    });

    // Simulate report generation and sending
    setTimeout(() => {
      const now = new Date().toISOString();
      setSchedules(schedules.map(s =>
        s.id === scheduleId ? { ...s, lastRunAt: now } : s
      ));
      
      // Calculate next run time
      const nextRun = new Date(now);
      if (schedule.frequency === 'daily') {
        nextRun.setDate(nextRun.getDate() + 1);
      } else if (schedule.frequency === 'weekly') {
        nextRun.setDate(nextRun.getDate() + 7);
      } else if (schedule.frequency === 'monthly') {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
      
      setSchedules(schedules.map(s =>
        s.id === scheduleId ? { ...s, lastRunAt: now, nextRunAt: nextRun.toISOString() } : s
      ));

      setIsLoading(false);
      setRunningScheduleId(null);

      // Dismiss loading toast and show success
      toast.dismiss(toastId);
      toast.success(`Schedule executed successfully!`, {
        description: `Report "${reportName}" has been generated and sent to ${schedule.recipients.length} recipient${schedule.recipients.length > 1 ? 's' : ''}`,
        duration: 4000,
      });
    }, 2000);
  };

  // Stats
  const stats = useMemo(() => ({
    total: schedules.length,
    active: schedules.filter(s => s.isActive).length,
    inactive: schedules.filter(s => !s.isActive).length,
    daily: schedules.filter(s => s.frequency === 'daily').length,
    weekly: schedules.filter(s => s.frequency === 'weekly').length,
    monthly: schedules.filter(s => s.frequency === 'monthly').length,
  }), [schedules]);

  // Get frequency badge color
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'weekly': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'monthly': return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'quarterly': return 'bg-pink-500/20 text-pink-300 border-pink-400/30';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  // Get format badge color
  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'excel': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'csv': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">

        <div className="glass-card rounded-xl p-6">
          <ScheduleForm
            schedule={editingSchedule || undefined}
            reportId={reportId || 'rpt-001'}
            onSave={handleSaveSchedule}
            onCancel={handleFormClose}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-sm">Total</p>
          <p className="text-white text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-green-300 text-sm">Active</p>
          <p className="text-white text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-red-300 text-sm">Inactive</p>
          <p className="text-white text-2xl font-semibold">{stats.inactive}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-blue-300 text-sm">Daily</p>
          <p className="text-white text-2xl font-semibold">{stats.daily}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-purple-300 text-sm">Weekly</p>
          <p className="text-white text-2xl font-semibold">{stats.weekly}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-orange-300 text-sm">Monthly</p>
          <p className="text-white text-2xl font-semibold">{stats.monthly}</p>
        </div>
      </div>

      {/* Schedules List */}
      {isLoading ? (
        <LoadingState message="Running schedule..." />
      ) : schedules.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-10 h-10 text-white/40" />}
          title="No schedules yet"
          description="Create a schedule to automatically deliver reports to your team."
          action={{
            label: 'Create Schedule',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`glass-card rounded-xl p-6 transition ${
                schedule.isActive ? '' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {getReportName(schedule.reportId)}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getFrequencyColor(schedule.frequency)}`}>
                      {schedule.frequency}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border uppercase ${getFormatColor(schedule.format)}`}>
                      {schedule.format}
                    </span>
                    {schedule.isActive ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Schedule Details */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/60 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{schedule.timezone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Next: {formatDateTime(schedule.nextRunAt)}</span>
                    </div>
                    {schedule.lastRunAt && (
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Last: {formatDateTime(schedule.lastRunAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Recipients */}
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">Recipients:</span>
                    <div className="flex flex-wrap gap-2">
                      {schedule.recipients.map((email) => (
                        <span
                          key={email}
                          className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80"
                        >
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunNow(schedule.id)}
                    disabled={isLoading && runningScheduleId === schedule.id}
                    className={`flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition text-sm ${
                      isLoading && runningScheduleId === schedule.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Run Now"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading && runningScheduleId === schedule.id ? 'animate-spin' : ''}`} />
                    {isLoading && runningScheduleId === schedule.id ? 'Running...' : 'Run Now'}
                  </button>
                  
                  <button
                    onClick={() => toggleScheduleStatus(schedule.id)}
                    className={`p-2 rounded-lg transition ${
                      schedule.isActive
                        ? 'bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30'
                        : 'bg-orange-500/20 border border-orange-400/30 text-orange-300 hover:bg-orange-500/30'
                    }`}
                    title={schedule.isActive ? 'Pause' : 'Resume'}
                  >
                    {schedule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditingSchedule(schedule);
                      setShowForm(true);
                    }}
                    className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteClick(schedule.id)}
                    className="p-2 bg-white/10 border border-white/20 rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {scheduleToDelete && (
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setScheduleToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Schedule"
          itemName={scheduleToDelete ? getReportName(schedules.find(s => s.id === scheduleToDelete)?.reportId || '') : undefined}
          description={`Are you sure you want to delete this schedule? This action cannot be undone and the schedule will stop running automatically.`}
        />
      )}
    </div>
  );
};

export default ReportSchedule;


