import { useState } from 'react';
import { Database, Download, Loader2, Calendar } from 'lucide-react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { exportCompanyData } from '../../api/systemSettings';
import { toast } from 'sonner';

export function DataManagementTab() {
  const { settings, updateSettings, loading } = useSystemSettings();
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [formData, setFormData] = useState({
    backupFrequency: settings?.dataManagement.backupFrequency || 'weekly',
    retentionMonths: settings?.dataManagement.retentionMonths || 12,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        dataManagement: {
          ...formData,
          lastBackup: settings?.dataManagement.lastBackup || null,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportCompanyData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `company-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Data Export</h3>
            <p className="text-sm text-white/60">Export all company data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong>Note:</strong> This will export all organization data including users, orders,
              inventory, and settings. The export is in JSON format.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting || loading}
            className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export All Data
              </>
            )}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Backup Configuration</h3>
            <p className="text-sm text-white/60">Configure automatic backup settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-200">
              <strong>Note:</strong> Scheduled backups require backend integration.
              This section is a UI placeholder for future implementation.
            </p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Backup Frequency</label>
            <select
              value={formData.backupFrequency}
              onChange={(e) => setFormData({ ...formData, backupFrequency: e.target.value as any })}
              className="w-full px-4 py-2 glass-input text-white rounded-lg"
            >
              <option value="daily" className="bg-gray-800">Daily</option>
              <option value="weekly" className="bg-gray-800">Weekly</option>
              <option value="monthly" className="bg-gray-800">Monthly</option>
              <option value="manual" className="bg-gray-800">Manual Only</option>
            </select>
          </div>

          {settings.dataManagement.lastBackup && (
            <div className="text-white/60 text-sm">
              Last backup: {settings.dataManagement.lastBackup}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Data Retention Policy</h3>
            <p className="text-sm text-white/60">Configure how long to retain data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-1 block">Audit Log Retention (months)</label>
            <input
              type="number"
              value={formData.retentionMonths}
              onChange={(e) => setFormData({ ...formData, retentionMonths: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
              placeholder="e.g. 12"
              min="1"
            />
            <p className="text-white/40 text-xs mt-1">
              Audit logs older than this period will be automatically deleted
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
