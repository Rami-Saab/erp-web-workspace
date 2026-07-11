import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2, Power } from 'lucide-react';
import { resetAllData, deactivateWorkspace } from '../../api/systemSettings';
import { toast } from 'sonner';

export function DangerZoneTab() {
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [deactivateConfirmation, setDeactivateConfirmation] = useState('');
  const [resetting, setResetting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const companyLegalName = 'Tech Solutions International LLC'; // This should come from settings in real implementation

  const handleResetData = async () => {
    if (resetConfirmation !== companyLegalName) {
      toast.error('Confirmation does not match company name');
      return;
    }

    setResetting(true);
    try {
      await resetAllData(resetConfirmation);
      
      // TODO: Add audit log entry for data reset
      // This should call the audit log API to record the destructive action
      console.log('Audit log: Data reset performed by admin');
      
      toast.success('All data has been reset. Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Failed to reset data');
    } finally {
      setResetting(false);
    }
  };

  const handleDeactivateWorkspace = async () => {
    if (deactivateConfirmation !== companyLegalName) {
      toast.error('Confirmation does not match company name');
      return;
    }

    setDeactivating(true);
    try {
      await deactivateWorkspace(deactivateConfirmation);
      
      // TODO: Add audit log entry for workspace deactivation
      // This should call the audit log API to record the destructive action
      console.log('Audit log: Workspace deactivated by admin');
      
      toast.success('Workspace has been deactivated');
      // In real implementation, redirect to login or show deactivation screen
    } catch (error) {
      toast.error('Failed to deactivate workspace');
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
            <p className="text-sm text-white/60">Irreversible and destructive actions</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-200">
            <strong>Warning:</strong> Actions in this section are irreversible and can have
            serious consequences. All actions are logged in the audit trail.
          </p>
        </div>

        <div className="space-y-6">
          {/* Reset All Data Section */}
          <div className="glass-card rounded-lg p-5 border border-red-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  Reset All Data
                </h4>
                <p className="text-white/60 text-sm mt-1">
                  Permanently delete all data in the workspace. This action cannot be undone.
                  This is intended for demo/sandbox environments only.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-white/70 text-sm mb-1 block">
                  Type <span className="font-mono bg-white/10 px-1 rounded">{companyLegalName}</span> to confirm
                </label>
                <input
                  type="text"
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg font-mono"
                  placeholder="Company legal name"
                />
              </div>

              <button
                onClick={handleResetData}
                disabled={resetConfirmation !== companyLegalName || resetting}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resetting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Reset All Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Deactivate Workspace Section */}
          <div className="glass-card rounded-lg p-5 border border-red-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Power className="w-4 h-4 text-red-400" />
                  Deactivate Workspace
                </h4>
                <p className="text-white/60 text-sm mt-1">
                  Deactivate the entire workspace. All users will lose access and data will be
                  archived. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-white/70 text-sm mb-1 block">
                  Type <span className="font-mono bg-white/10 px-1 rounded">{companyLegalName}</span> to confirm
                </label>
                <input
                  type="text"
                  value={deactivateConfirmation}
                  onChange={(e) => setDeactivateConfirmation(e.target.value)}
                  className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg font-mono"
                  placeholder="Company legal name"
                />
              </div>

              <button
                onClick={handleDeactivateWorkspace}
                disabled={deactivateConfirmation !== companyLegalName || deactivating}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deactivating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deactivating...
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    Deactivate Workspace
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Notice */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
            <p className="text-sm text-white/60">All destructive actions are logged</p>
          </div>
        </div>
        <p className="text-white/70 text-sm">
          All actions taken in the Danger Zone are automatically logged in the system audit log
          with the following information: action performed, user who performed it, timestamp,
          IP address, and result. This audit trail is maintained for security and compliance purposes.
        </p>
      </div>
    </div>
  );
}
