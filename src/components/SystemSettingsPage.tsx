import { useState } from 'react';
import {
  Building2,
  Globe,
  DollarSign,
  Users,
  Plug,
  Bell,
  Database,
  Palette,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { RequireRole } from './RequireRole';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { CompanyProfileTab } from './system-settings/CompanyProfileTab';
import { LocalizationTab } from './system-settings/LocalizationTab';
import { FinancialTab } from './system-settings/FinancialTab';
import { UserManagementTab } from './system-settings/UserManagementTab';
import { IntegrationsTab } from './system-settings/IntegrationsTab';
import { NotificationsTab } from './system-settings/NotificationsTab';
import { DataManagementTab } from './system-settings/DataManagementTab';
import { BrandingTab } from './system-settings/BrandingTab';
import { DangerZoneTab } from './system-settings/DangerZoneTab';

type SystemSettingsTab =
  | 'company'
  | 'localization'
  | 'financial'
  | 'users'
  | 'integrations'
  | 'notifications'
  | 'data'
  | 'branding'
  | 'danger';

const tabs: { id: SystemSettingsTab; label: string; icon: any }[] = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

/**
 * SystemSettingsPage - Organization-wide settings for administrators
 * 
 * This page is only accessible to users with the 'admin' role.
 * It provides configuration options for the entire organization,
 * separate from personal account settings in SettingsPage.
 * 
 * Note: The system-wide default language setting here is the ORG-WIDE DEFAULT
 * for new users and unauthenticated contexts (login page, system emails).
 * Individual user's personal language preference (in SettingsPage) always
 * takes precedence for their own session.
 */
export function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<SystemSettingsTab>('company');
  const { loading } = useSystemSettings();

  // Role guard - only admins can access system settings
  return (
    <RequireRole allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  System Settings
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  Configure organization-wide settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tab Navigation */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                        activeTab === tab.id
                          ? 'glass-sidebar-btn-active text-white'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-3">
              {activeTab === 'company' && <CompanyProfileTab />}
              {activeTab === 'localization' && <LocalizationTab />}
              {activeTab === 'financial' && <FinancialTab />}
              {activeTab === 'users' && <UserManagementTab />}
              {activeTab === 'integrations' && <IntegrationsTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'data' && <DataManagementTab />}
              {activeTab === 'branding' && <BrandingTab />}
              {activeTab === 'danger' && <DangerZoneTab />}
            </div>
          </div>
        )}
      </div>
    </RequireRole>
  );
}
