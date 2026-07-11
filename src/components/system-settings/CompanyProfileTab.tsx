import { useState } from 'react';
import { Building2, Upload, X, Loader2 } from 'lucide-react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { toast } from 'sonner';

export function CompanyProfileTab() {
  const { settings, updateSettings, loading } = useSystemSettings();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    legalName: settings?.companyProfile.legalName || '',
    tradingName: settings?.companyProfile.tradingName || '',
    address: settings?.companyProfile.address || '',
    city: settings?.companyProfile.city || '',
    country: settings?.companyProfile.country || '',
    phone: settings?.companyProfile.phone || '',
    email: settings?.companyProfile.email || '',
    website: settings?.companyProfile.website || '',
    taxNumber: settings?.companyProfile.taxNumber || '',
    registrationNumber: settings?.companyProfile.registrationNumber || '',
    fiscalYearStart: settings?.companyProfile.fiscalYearStart || 1,
    timezone: settings?.companyProfile.timezone || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        companyProfile: {
          ...formData,
          logoUrl: settings?.companyProfile.logoUrl || null,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Company Information</h3>
            <p className="text-sm text-white/60">Legal and contact details for your organization</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Legal Company Name *</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="Enter legal company name"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Trading Name</label>
              <input
                type="text"
                value={formData.tradingName}
                onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="Enter trading name"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="City"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="Country code"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Timezone</label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="e.g. Asia/Dubai"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="+971 4 123 4567"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="info@company.com"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
              placeholder="https://company.com"
            />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Tax & Registration</h3>
            <p className="text-sm text-white/60">Tax and business registration details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Tax/VAT Number</label>
              <input
                type="text"
                value={formData.taxNumber}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="VAT123456789"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Registration Number</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="CR-12345-2024"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Fiscal Year Start Month</label>
            <select
              value={formData.fiscalYearStart}
              onChange={(e) => setFormData({ ...formData, fiscalYearStart: parseInt(e.target.value) })}
              className="w-full px-4 py-2 glass-input text-white rounded-lg"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1} className="bg-gray-800">
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Company Logo</h3>
            <p className="text-sm text-white/60">Upload your company logo</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          {settings.companyProfile.logoUrl ? (
            <div className="relative inline-block">
              <img
                src={settings.companyProfile.logoUrl}
                alt="Company Logo"
                className="h-32 w-auto rounded-lg"
              />
              <button
                onClick={() => {
                  // TODO: Implement logo removal
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
                  // TODO: Implement logo upload
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
