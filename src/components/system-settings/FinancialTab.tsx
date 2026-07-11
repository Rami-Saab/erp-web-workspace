import { useState } from 'react';
import { DollarSign, Plus, Trash2, Loader2 } from 'lucide-react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

export function FinancialTab() {
  const { settings, updateSettings, loading } = useSystemSettings();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    defaultCurrency: settings?.financial.defaultCurrency || 'AED',
    paymentTerms: settings?.financial.paymentTerms || ['Net 30', 'Net 60', 'Net 90', 'Due on Receipt'],
    invoicePrefix: settings?.financial.invoicePrefix || 'INV',
    invoiceStartingNumber: settings?.financial.invoiceStartingNumber || 1001,
    poPrefix: settings?.financial.poPrefix || 'PO',
    poStartingNumber: settings?.financial.poStartingNumber || 5001,
    defaultInvoiceDueDays: settings?.financial.defaultInvoiceDueDays || 30,
    taxRates: settings?.financial.taxRates || [],
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        financial: formData,
      });
    } finally {
      setSaving(false);
    }
  };

  const addTaxRate = () => {
    setFormData({
      ...formData,
      taxRates: [
        ...formData.taxRates,
        {
          id: String(formData.taxRates.length + 1),
          name: 'New Tax Rate',
          rate: 0,
          description: '',
        },
      ],
    });
  };

  const removeTaxRate = (id: string) => {
    setFormData({
      ...formData,
      taxRates: formData.taxRates.filter((rate) => rate.id !== id),
    });
  };

  const updateTaxRate = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      taxRates: formData.taxRates.map((rate) =>
        rate.id === id ? { ...rate, [field]: value } : rate
      ),
    });
  };

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Currency & Payment Terms</h3>
            <p className="text-sm text-white/60">Default currency and payment configurations</p>
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
            <label className="text-white/70 text-sm mb-1 block">Payment Terms</label>
            <div className="space-y-2">
              {formData.paymentTerms.map((term, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => {
                      const newTerms = [...formData.paymentTerms];
                      newTerms[index] = e.target.value;
                      setFormData({ ...formData, paymentTerms: newTerms });
                    }}
                    className="flex-1 px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const newTerms = formData.paymentTerms.filter((_, i) => i !== index);
                      setFormData({ ...formData, paymentTerms: newTerms });
                    }}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFormData({ ...formData, paymentTerms: [...formData.paymentTerms, ''] })}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Payment Term
              </button>
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Default Invoice Due Days</label>
            <input
              type="number"
              value={formData.defaultInvoiceDueDays}
              onChange={(e) => setFormData({ ...formData, defaultInvoiceDueDays: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
              placeholder="e.g. 30"
            />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Tax Rates</h3>
            <p className="text-sm text-white/60">Configure tax rates for transactions</p>
          </div>
        </div>

        <div className="space-y-4">
          {formData.taxRates.map((rate) => (
            <div key={rate.id} className="glass-card rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Name</label>
                    <input
                      type="text"
                      value={rate.name}
                      onChange={(e) => updateTaxRate(rate.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 glass-input text-white text-sm rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Rate (%)</label>
                    <input
                      type="number"
                      value={rate.rate}
                      onChange={(e) => updateTaxRate(rate.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 glass-input text-white text-sm rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Description</label>
                    <input
                      type="text"
                      value={rate.description}
                      onChange={(e) => updateTaxRate(rate.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 glass-input text-white text-sm rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeTaxRate(rate.id)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addTaxRate}
            className="w-full py-3 border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tax Rate
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Numbering Configuration</h3>
            <p className="text-sm text-white/60">Invoice and purchase order numbering</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="e.g. INV"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Starting Number</label>
              <input
                type="number"
                value={formData.invoiceStartingNumber}
                onChange={(e) => setFormData({ ...formData, invoiceStartingNumber: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="e.g. 1001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">PO Prefix</label>
              <input
                type="text"
                value={formData.poPrefix}
                onChange={(e) => setFormData({ ...formData, poPrefix: e.target.value })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="e.g. PO"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Starting Number</label>
              <input
                type="number"
                value={formData.poStartingNumber}
                onChange={(e) => setFormData({ ...formData, poStartingNumber: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                placeholder="e.g. 5001"
              />
            </div>
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
