import { useState } from 'react';
import { Palette, Upload, X, Loader2 } from 'lucide-react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { toast } from 'sonner';

export function BrandingTab() {
  const { settings, updateSettings, loading } = useSystemSettings();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    primaryColor: settings?.branding.primaryColor || '#3b82f6',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        branding: {
          ...formData,
          logoUrl: settings?.branding.logoUrl || null,
          faviconUrl: settings?.branding.faviconUrl || null,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, primaryColor: e.target.value });
  };

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Brand Colors</h3>
            <p className="text-sm text-white/60">Configure primary brand color for the application</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-1 block">Primary Brand Color</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={handleColorChange}
                className="w-16 h-12 rounded cursor-pointer border-2 border-white/20"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={handleColorChange}
                className="flex-1 px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg font-mono"
                placeholder="#3b82f6"
              />
            </div>
            <p className="text-white/40 text-xs mt-2">
              This color will be used for buttons, links, and accent elements throughout the application
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-4">
            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
              <button
                key={color}
                onClick={() => setFormData({ ...formData, primaryColor: color })}
                className={`w-full h-12 rounded-lg border-2 transition ${
                  formData.primaryColor === color
                    ? 'border-white scale-105'
                    : 'border-transparent hover:border-white/50'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Company Logo</h3>
            <p className="text-sm text-white/60">Logo used on invoices, reports, and documents</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          {settings.branding.logoUrl ? (
            <div className="relative inline-block">
              <img
                src={settings.branding.logoUrl}
                alt="Company Logo"
                className="h-32 w-auto rounded-lg"
              />
              <button
                onClick={() => {
                  // TODO: Implement logo removal with backend
                  toast.info('Logo removal requires backend integration');
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 mb-2">Drag and drop your logo here, or click to browse</p>
              <p className="text-white/40 text-sm">PNG, JPG up to 2MB</p>
              <button
                onClick={() => {
                  // TODO: Implement logo upload with backend
                  toast.info('Logo upload requires backend integration');
                }}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Upload Logo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Favicon</h3>
            <p className="text-sm text-white/60">Browser tab icon for your application</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          {settings.branding.faviconUrl ? (
            <div className="relative inline-block">
              <img
                src={settings.branding.faviconUrl}
                alt="Favicon"
                className="w-16 h-16 rounded-lg"
              />
              <button
                onClick={() => {
                  // TODO: Implement favicon removal with backend
                  toast.info('Favicon removal requires backend integration');
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <Palette className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 mb-2">Upload a favicon for browser tab</p>
              <p className="text-white/40 text-sm">PNG, ICO up to 1MB (recommended 32x32 or 64x64)</p>
              <button
                onClick={() => {
                  // TODO: Implement favicon upload with backend
                  toast.info('Favicon upload requires backend integration');
                }}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Upload Favicon
              </button>
            </div>
          )}
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
