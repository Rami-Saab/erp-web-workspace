import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  SystemSettings,
  getSystemSettings,
  updateSystemSettings,
} from '../api/systemSettings';
import { toast } from 'sonner';

interface SystemSettingsContextValue {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Partial<SystemSettings>) => Promise<void>;
}

const SystemSettingsContext = createContext<SystemSettingsContextValue | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSystemSettings();
      setSettings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load system settings';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<SystemSettings>) => {
    if (!settings) {
      toast.error('No settings loaded');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updated = await updateSystemSettings(updates);
      setSettings(updated);
      toast.success('System settings updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update system settings';
      setError(message);
      toast.error(message);
      throw err; // Re-throw so caller can handle if needed
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Load settings on mount
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const value: SystemSettingsContextValue = {
    settings,
    loading,
    error,
    refreshSettings,
    updateSettings,
  };

  return <SystemSettingsContext.Provider value={value}>{children}</SystemSettingsContext.Provider>;
}

export function useSystemSettings(): SystemSettingsContextValue {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}
