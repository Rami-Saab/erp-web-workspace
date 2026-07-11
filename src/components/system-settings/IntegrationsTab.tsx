import { useState } from 'react';
import { Plug, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getIntegrations, connectIntegration, disconnectIntegration, Integration } from '../../api/systemSettings';
import { toast } from 'sonner';

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getIntegrations();
      setIntegrations(data);
    } catch (error) {
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (integrationId: string) => {
    setConnecting(integrationId);
    try {
      const updated = await connectIntegration(integrationId);
      setIntegrations(integrations.map((i) => i.id === integrationId ? updated : i));
      toast.success('Integration connected successfully');
    } catch (error) {
      toast.error('Failed to connect integration');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    setConnecting(integrationId);
    try {
      const updated = await disconnectIntegration(integrationId);
      setIntegrations(integrations.map((i) => i.id === integrationId ? updated : i));
      toast.success('Integration disconnected');
    } catch (error) {
      toast.error('Failed to disconnect integration');
    } finally {
      setConnecting(null);
    }
  };

  // Load integrations on mount
  useState(() => {
    loadIntegrations();
  });

  const categoryIcons: Record<string, any> = {
    payment: Plug,
    email: Plug,
    accounting: Plug,
    webhook: Plug,
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Plug className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Integrations</h3>
            <p className="text-sm text-white/60">Connect and manage third-party services</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => {
              const Icon = categoryIcons[integration.category] || Plug;
              const isConnected = integration.status === 'connected';
              const isConnecting = connecting === integration.id;

              return (
                <div key={integration.id} className="glass-card rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-500/20' : 'bg-white/10'}`}>
                        <Icon className={`w-5 h-5 ${isConnected ? 'text-green-400' : 'text-white/60'}`} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{integration.name}</h4>
                        <p className="text-white/60 text-sm">{integration.description}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${isConnected ? 'text-green-400' : 'text-white/40'}`}>
                      {isConnected ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span className="text-xs capitalize">{integration.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white/40 capitalize">{integration.category}</span>
                    {isConnected ? (
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        disabled={isConnecting}
                        className="px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-white transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Disconnecting...
                          </>
                        ) : (
                          'Disconnect'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration.id)}
                        disabled={isConnecting}
                        className="px-3 py-1.5 text-sm bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          'Connect'
                        )}
                      </button>
                    )}
                  </div>

                  {isConnected && integration.configuredAt && (
                    <p className="text-xs text-white/40 mt-2">
                      Configured: {integration.configuredAt}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Plug className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Need More Integrations?</h3>
            <p className="text-sm text-white/60">Request additional integrations for your workflow</p>
          </div>
        </div>
        <button
          onClick={() => {
            // TODO: Implement integration request form
            toast.info('Integration request form requires backend integration');
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
        >
          Request Integration
        </button>
      </div>
    </div>
  );
}
