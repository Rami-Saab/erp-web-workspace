import { useState } from 'react';
import { Bell, Loader2, Mail } from 'lucide-react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { toast } from 'sonner';

type Role = 'admin' | 'sales' | 'warehouse' | 'finance';

export function NotificationsTab() {
  const { settings, updateSettings, loading } = useSystemSettings();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    notifications: settings?.notifications || [],
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ notifications: formData.notifications });
    } finally {
      setSaving(false);
    }
  };

  const toggleRule = (ruleId: string) => {
    setFormData({
      notifications: formData.notifications.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      ),
    });
  };

  const updateRuleRoles = (ruleId: string, role: Role) => {
    setFormData({
      notifications: formData.notifications.map((rule) => {
        if (rule.id === ruleId) {
          const newRoles = rule.targetRoles.includes(role)
            ? rule.targetRoles.filter((r) => r !== role)
            : [...rule.targetRoles, role];
          return { ...rule, targetRoles: newRoles };
        }
        return rule;
      }),
    });
  };

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">System-Wide Notifications</h3>
            <p className="text-sm text-white/60">Configure which events trigger notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          {formData.notifications.map((rule) => (
            <div key={rule.id} className="glass-card rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                    <h4 className="text-white font-medium capitalize">{rule.event.replace(/_/g, ' ')}</h4>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-white/70 text-xs mb-2 block">Target Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {(['admin', 'sales', 'warehouse', 'finance'] as Role[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => updateRuleRoles(rule.id, role)}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          rule.targetRoles.includes(role)
                            ? 'bg-blue-500/30 border border-blue-400/50 text-white'
                            : 'bg-white/10 border border-white/20 text-white/60'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-xs mb-2 block">Additional Email Recipients</label>
                  <div className="flex gap-2">
                    {rule.targetEmails.map((email, index) => (
                      <span key={index} className="px-2 py-1 bg-white/10 rounded text-white/80 text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Email Templates</h3>
            <p className="text-sm text-white/60">Customize system email templates</p>
          </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-200">
            <strong>Note:</strong> Email template customization requires backend template support.
            This section is a UI placeholder for future implementation.
          </p>
        </div>
        <button
          onClick={() => {
            // TODO: Implement email template editor
            toast.info('Email template editor requires backend integration');
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
        >
          Configure Templates
        </button>
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
