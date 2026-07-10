// ==================== ALERTS CENTER PAGE ====================
import React, { useState } from 'react';
import {
  Bell, AlertCircle, AlertTriangle, Info, CheckCircle2, XCircle,
  Filter, Clock, Mail, Slack, MessageSquare, Plus,
  Trash2, Edit, Power
} from 'lucide-react';

import { ChartContainer } from '../components/ChartContainer';
import { DataTable, StatusBadge } from '../components/DataTable';
import {
  activeAlerts,
  alertRules,
  alertStats
} from '../data/mockData';

export const AlertsCenter: React.FC = () => {
  const [activeView, setActiveView] = useState<'alerts' | 'rules' | 'history'>('alerts');
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  // Filter alerts
  const filteredAlerts = alertFilter === 'all' 
    ? activeAlerts 
    : activeAlerts.filter(a => a.type === alertFilter);

  // Alert rule columns
  const ruleColumns = [
    { key: 'name', header: 'Rule Name', sortable: true },
    { key: 'condition', header: 'Condition' },
    { 
      key: 'threshold', 
      header: 'Threshold', 
      align: 'right' as const,
      render: (v: unknown) => <span>{v ? String(v) : 'N/A'}</span>
    },
    { 
      key: 'severity', 
      header: 'Severity', 
      align: 'center' as const,
      render: (v: unknown) => {
        const severity = v as string;
        return (
          <StatusBadge 
            status={severity.charAt(0).toUpperCase() + severity.slice(1)}
            variant={severity === 'critical' ? 'danger' : severity === 'warning' ? 'warning' : 'default'}
          />
        );
      }
    },
    { 
      key: 'enabled', 
      header: 'Status', 
      align: 'center' as const,
      render: (v: unknown) => (
        <StatusBadge 
          status={v ? 'Active' : 'Disabled'}
          variant={v ? 'success' : 'default'}
        />
      )
    },
    { 
      key: 'notifyChannels', 
      header: 'Channels', 
      render: (v: unknown) => {
        const channels = v as string[];
        return (
          <div className="flex items-center gap-1">
            {channels.includes('email') && <Mail className="w-4 h-4 text-white/60" />}
            {channels.includes('slack') && <Slack className="w-4 h-4 text-white/60" />}
            {channels.includes('sms') && <MessageSquare className="w-4 h-4 text-white/60" />}
          </div>
        );
      }
    },
    { key: 'lastTriggered', header: 'Last Triggered' },
    { 
      key: 'actions', 
      header: '', 
      align: 'center' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const ruleRow = row as { enabled?: boolean };
        return (
          <div className="flex items-center justify-center gap-1">
            <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className={`p-1.5 hover:bg-white/10 rounded transition-colors ${ruleRow.enabled ? 'text-green-400' : 'text-white/40'}`}>
              <Power className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      }
    },
  ];

  // Get icon based on alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  // Get color classes based on alert type
  const getAlertColors = (type: string) => {
    switch (type) {
      case 'critical': return { bg: 'bg-red-500/10', border: 'border-red-400/30', text: 'text-red-300', icon: 'bg-red-500/20' };
      case 'warning': return { bg: 'bg-yellow-500/10', border: 'border-yellow-400/30', text: 'text-yellow-300', icon: 'bg-yellow-500/20' };
      default: return { bg: 'bg-blue-500/10', border: 'border-blue-400/30', text: 'text-blue-300', icon: 'bg-blue-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: 'alerts', label: 'Active Alerts' },
            { id: 'rules', label: 'Alert Rules' },
            { id: 'history', label: 'History' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as typeof activeView)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === view.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {view.label}
              {view.id === 'alerts' && activeAlerts.filter(a => a.status === 'active').length > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {activeAlerts.filter(a => a.status === 'active').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeView === 'rules' && (
          <button className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 text-sm hover:bg-blue-500/30 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Rule
          </button>
        )}
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {alertStats.map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                {stat.color === 'red' ? <AlertCircle className={`w-5 h-5 text-${stat.color}-300`} /> :
                 stat.color === 'yellow' ? <AlertTriangle className={`w-5 h-5 text-${stat.color}-300`} /> :
                 stat.color === 'blue' ? <Bell className={`w-5 h-5 text-${stat.color}-300`} /> :
                 <CheckCircle2 className={`w-5 h-5 text-${stat.color}-300`} />}
              </div>
            </div>
            <p className="text-white/70 text-sm">{stat.title}</p>
            <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content based on active view */}
      {activeView === 'alerts' && (
        <>
          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm">Filter:</span>
            {['all', 'critical', 'warning', 'info'].map((filter) => (
              <button
                key={filter}
                onClick={() => setAlertFilter(filter as typeof alertFilter)}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                  alertFilter === filter
                    ? filter === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                      filter === 'warning' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                      filter === 'info' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                      'bg-white/10 text-white border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Active Alerts */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const colors = getAlertColors(alert.type);
              return (
                <div key={alert.id} className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon} ${colors.text}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{alert.title}</h4>
                          {alert.status === 'acknowledged' && (
                            <span className="px-2 py-0.5 bg-white/10 rounded text-white/60 text-xs">
                              Acknowledged by {alert.acknowledgedBy}
                            </span>
                          )}
                          {alert.status === 'resolved' && (
                            <span className="px-2 py-0.5 bg-green-500/20 rounded text-green-300 text-xs">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-white/70 text-sm">{alert.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-white/50 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp}
                          </span>
                          <span className="px-2 py-0.5 bg-white/10 rounded text-white/60 text-xs">{alert.module}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === 'active' && (
                        <>
                          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm transition-colors">
                            Acknowledge
                          </button>
                          <button className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 text-sm transition-colors">
                            Resolve
                          </button>
                        </>
                      )}
                      <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white/70 text-lg">No alerts to display</p>
              <p className="text-white/50 text-sm mt-1">All systems are operating normally</p>
            </div>
          )}
        </>
      )}

      {activeView === 'rules' && (
        <>
          {/* Alert Rules */}
          <ChartContainer
            title="Alert Rules Configuration"
            subtitle="Manage automated alert triggers"
          >
            <DataTable
              columns={ruleColumns}
              data={alertRules as unknown as Record<string, unknown>[]}
              config={{ showPagination: true, pageSize: 10 }}
            />
          </ChartContainer>

          {/* Rule Configuration Form (Preview) */}
          <ChartContainer
            title="Create New Rule"
            subtitle="Configure alert conditions and notifications"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Rule Name</label>
                  <input
                    type="text"
                    placeholder="Enter rule name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Condition</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20">
                    <option value="" className="bg-slate-800">Select condition</option>
                    <option value="less_than" className="bg-slate-800">Less than</option>
                    <option value="greater_than" className="bg-slate-800">Greater than</option>
                    <option value="equals" className="bg-slate-800">Equals</option>
                    <option value="changed" className="bg-slate-800">Changed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Threshold</label>
                  <input
                    type="number"
                    placeholder="Enter threshold value"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Severity</label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20">
                    <option value="info" className="bg-slate-800">Info</option>
                    <option value="warning" className="bg-slate-800">Warning</option>
                    <option value="critical" className="bg-slate-800">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Notification Channels</label>
                  <div className="space-y-2">
                    {[
                      { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
                      { id: 'slack', label: 'Slack', icon: <Slack className="w-4 h-4" /> },
                      { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
                    ].map((channel) => (
                      <label key={channel.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="checkbox" className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/20" />
                        <span className="text-white/60">{channel.icon}</span>
                        <span className="text-white text-sm">{channel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 text-sm transition-colors">
                Create Rule
              </button>
            </div>
          </ChartContainer>
        </>
      )}

      {activeView === 'history' && (
        <>
          {/* Alert History */}
          <ChartContainer
            title="Alert History"
            subtitle="Past alerts and resolutions"
          >
            <div className="space-y-3">
              {activeAlerts.filter(a => a.status === 'resolved').concat(
                activeAlerts.filter(a => a.status === 'acknowledged')
              ).map((alert) => {
                const colors = getAlertColors(alert.type);
                return (
                  <div key={alert.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.icon} ${colors.text}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{alert.title}</p>
                        <p className="text-white/60 text-sm">{alert.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/50 text-sm">{alert.timestamp}</span>
                      {alert.status === 'resolved' && (
                        <span className="px-2 py-1 bg-green-500/20 rounded text-green-300 text-xs">
                          Resolved {alert.resolvedAt}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartContainer>
        </>
      )}
    </div>
  );
};

export default AlertsCenter;







