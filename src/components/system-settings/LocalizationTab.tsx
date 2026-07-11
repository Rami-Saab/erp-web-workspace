import { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { CustomSelect } from '../ui/CustomSelect';

// Language options (duplicated from SettingsPage since they're not exported)
const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'ar-SA', label: 'العربية (السعودية)' },
  { value: 'ar-AE', label: 'العربية (الإمارات)' },
  { value: 'ar-EG', label: 'العربية (مصر)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'fr-CA', label: 'Français (Canada)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'es-MX', label: 'Español (México)' },
  { value: 'it-IT', label: 'Italiano (Italia)' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'pt-PT', label: 'Português (Portugal)' },
  { value: 'ru-RU', label: 'Русский (Россия)' },
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'zh-TW', label: '中文 (繁體)' },
  { value: 'ja-JP', label: '日本語 (日本)' },
  { value: 'ko-KR', label: '한국어 (한국)' },
  { value: 'hi-IN', label: 'हिन्दी (भारत)' },
  { value: 'tr-TR', label: 'Türkçe (Türkiye)' },
];

// Country options (duplicated from SettingsPage since they're not exported)
const COUNTRY_OPTIONS = [
  { value: 'USA', label: 'United States' },
  { value: 'GBR', label: 'United Kingdom' },
  { value: 'SAU', label: 'Saudi Arabia' },
  { value: 'ARE', label: 'United Arab Emirates' },
  { value: 'EGY', label: 'Egypt' },
  { value: 'FRA', label: 'France' },
  { value: 'CAN', label: 'Canada' },
  { value: 'DEU', label: 'Germany' },
  { value: 'ESP', label: 'Spain' },
  { value: 'MEX', label: 'Mexico' },
  { value: 'ITA', label: 'Italy' },
  { value: 'BRA', label: 'Brazil' },
  { value: 'PRT', label: 'Portugal' },
  { value: 'RUS', label: 'Russia' },
  { value: 'CHN', label: 'China' },
  { value: 'TWN', label: 'Taiwan' },
  { value: 'JPN', label: 'Japan' },
  { value: 'KOR', label: 'South Korea' },
  { value: 'IND', label: 'India' },
  { value: 'TUR', label: 'Turkey' },
];

export function LocalizationTab() {
  const { settings, updateSettings, loading } = useSystemSettings();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    defaultLanguage: settings?.localization.defaultLanguage || 'en-GB',
    defaultCountry: settings?.localization.defaultCountry || 'ARE',
    defaultCurrency: settings?.localization.defaultCurrency || 'AED',
    currencySymbolPosition: settings?.localization.currencySymbolPosition || 'before',
    decimalSeparator: settings?.localization.decimalSeparator || '.',
    thousandsSeparator: settings?.localization.thousandsSeparator || ',',
    dateFormat: settings?.localization.dateFormat || 'DD/MM/YYYY',
    defaultTimezone: settings?.localization.defaultTimezone || 'Asia/Dubai',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        localization: {
          ...formData,
          numberFormat: '1,234.56',
          rtlEnabled: formData.defaultLanguage.startsWith('ar'),
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
          <Globe className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Regional Defaults</h3>
            <p className="text-sm text-white/60">
              System-wide default language and regional settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-200">
              <strong>Note:</strong> The system-wide default language here is the ORG-WIDE DEFAULT
              for new users and unauthenticated contexts (login page, system emails).
              Individual user's personal language preference (in SettingsPage) always
              takes precedence for their own session.
            </p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Default System Language</label>
            <CustomSelect
              value={formData.defaultLanguage}
              onChange={(value) => setFormData({ ...formData, defaultLanguage: String(value) })}
              options={LANGUAGE_OPTIONS}
              placeholder="Select default language"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Default Country</label>
            <CustomSelect
              value={formData.defaultCountry}
              onChange={(value) => setFormData({ ...formData, defaultCountry: String(value) })}
              options={COUNTRY_OPTIONS}
              placeholder="Select default country"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Default Timezone</label>
            <input
              type="text"
              value={formData.defaultTimezone}
              onChange={(e) => setFormData({ ...formData, defaultTimezone: e.target.value })}
              className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
              placeholder="e.g. Asia/Dubai"
            />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Currency & Number Format</h3>
            <p className="text-sm text-white/60">Configure how currency and numbers are displayed</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-1 block">Default Currency</label>
            <input
              type="text"
              value={formData.defaultCurrency}
              onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
              className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
              placeholder="e.g. AED, USD, EUR"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Currency Symbol Position</label>
            <select
              value={formData.currencySymbolPosition}
              onChange={(e) => setFormData({ ...formData, currencySymbolPosition: e.target.value as 'before' | 'after' })}
              className="w-full px-4 py-2 glass-input text-white rounded-lg"
            >
              <option value="before" className="bg-gray-800">Before (e.g. $100.00)</option>
              <option value="after" className="bg-gray-800">After (e.g. 100.00$)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Decimal Separator</label>
              <select
                value={formData.decimalSeparator}
                onChange={(e) => setFormData({ ...formData, decimalSeparator: e.target.value as '.' | ',' })}
                className="w-full px-4 py-2 glass-input text-white rounded-lg"
              >
                <option value="." className="bg-gray-800">Period (.)</option>
                <option value="," className="bg-gray-800">Comma (,)</option>
              </select>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Thousands Separator</label>
              <select
                value={formData.thousandsSeparator}
                onChange={(e) => setFormData({ ...formData, thousandsSeparator: e.target.value as ',' | '.' | ' ' })}
                className="w-full px-4 py-2 glass-input text-white rounded-lg"
              >
                <option value="," className="bg-gray-800">Comma (,)</option>
                <option value="." className="bg-gray-800">Period (.)</option>
                <option value=" " className="bg-gray-800">Space ( )</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Date Format</h3>
            <p className="text-sm text-white/60">Configure date display format</p>
          </div>
        </div>

        <div>
          <label className="text-white/70 text-sm mb-1 block">Date Format</label>
          <select
            value={formData.dateFormat}
            onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' })}
            className="w-full px-4 py-2 glass-input text-white rounded-lg"
          >
            <option value="DD/MM/YYYY" className="bg-gray-800">DD/MM/YYYY (e.g. 15/01/2024)</option>
            <option value="MM/DD/YYYY" className="bg-gray-800">MM/DD/YYYY (e.g. 01/15/2024)</option>
            <option value="YYYY-MM-DD" className="bg-gray-800">YYYY-MM-DD (e.g. 2024-01-15)</option>
          </select>
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
