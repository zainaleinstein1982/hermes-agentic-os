import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Integration } from '@/types';
import {
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  Github,
  Layers,
  Music,
  Box,
  Plug,
  Check,
  X,
  RefreshCw,
  Plus,
  Shield,
} from 'lucide-react';

const ICON_MAP: Record<string, typeof Mail> = {
  gmail: Mail,
  calendar: Calendar,
  notion: FileText,
  slack: MessageSquare,
  github: Github,
  linear: Layers,
  spotify: Music,
  dropbox: Box,
};

const ICON_COLORS: Record<string, string> = {
  gmail: '#ff6b8a',
  calendar: '#5ce8a3',
  notion: '#d4d8e8',
  slack: '#ff8a5c',
  github: '#7e85a0',
  linear: '#b08aff',
  spotify: '#5ce8a3',
  dropbox: '#7c8aff',
};

export default function IntegrationsView({ onUpdate }: { onUpdate?: () => void }) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('integrations').select('*').order('name');
    setIntegrations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (integ: Integration) => {
    const newConnected = !integ.connected;
    const newStatus = newConnected ? 'connected' : 'disconnected';
    const newLastSync = newConnected ? new Date().toISOString() : integ.last_sync;
    await supabase
      .from('integrations')
      .update({
        connected: newConnected,
        status: newStatus,
        last_sync: newLastSync,
      })
      .eq('id', integ.id);
    setIntegrations((list) =>
      list.map((i) =>
        i.id === integ.id
          ? { ...i, connected: newConnected, status: newStatus, last_sync: newLastSync }
          : i
      )
    );
    onUpdate?.();
  };

  const connected = integrations.filter((i) => i.connected);
  const available = integrations.filter((i) => !i.connected);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#08090c]">
      <header className="h-14 flex items-center gap-3 px-5 border-b border-white/[0.05] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#5ce8a3]/10 flex items-center justify-center">
          <Plug size={16} className="text-[#5ce8a3]" />
        </div>
        <h1 className="text-white font-medium text-sm">Integrations</h1>
        <span className="text-[10px] font-mono text-[#4a5068]">{connected.length} CONNECTED</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-[#4a5068]">
          <Shield size={13} />
          <span>OAuth secured</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Connected */}
        <div>
          <h2 className="section-label mb-3">Connected</h2>
          {connected.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center text-[#4a5068] text-sm">
              No integrations connected yet. Connect an app below to give Asih Winarti access.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {connected.map((integ, i) => (
                <IntegrationCard key={integ.id} integ={integ} onToggle={toggle} delay={i * 0.05} />
              ))}
            </div>
          )}
        </div>

        {/* Available */}
        <div>
          <h2 className="section-label mb-3">Available</h2>
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-xl shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {available.map((integ, i) => (
                <IntegrationCard key={integ.id} integ={integ} onToggle={toggle} delay={i * 0.05} />
              ))}
            </div>
          )}
        </div>

        {/* Browse more */}
        <div className="glass rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#7c8aff]/10 flex items-center justify-center mx-auto mb-3">
            <Plus size={20} className="text-[#7c8aff]" />
          </div>
          <h3 className="text-white font-medium text-sm mb-1">Browse all plugins</h3>
          <p className="text-xs text-[#7e85a0] mb-3">
            200+ integrations for productivity, developer tools, and more.
          </p>
          <button className="px-4 py-2 rounded-xl bg-[#7c8aff]/10 hover:bg-[#7c8aff]/20 text-[#7c8aff] text-sm font-medium transition-colors">
            Browse marketplace
          </button>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({
  integ,
  onToggle,
  delay,
}: {
  integ: Integration;
  onToggle: (i: Integration) => void;
  delay: number;
}) {
  const Icon = ICON_MAP[integ.icon] || Plug;
  const color = ICON_COLORS[integ.icon] || '#7c8aff';
  const lastSync = integ.last_sync ? new Date(integ.last_sync).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div
      className="glass rounded-xl p-4 animate-fade-up hover:border-[#7c8aff]/20 transition-all"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon size={18} style={{ color }} />
        </div>
        {integ.connected ? (
          <span className="flex items-center gap-1 text-[10px] text-[#5ce8a3]">
            <Check size={10} /> Connected
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-[#4a5068]">
            <X size={10} /> Disconnected
          </span>
        )}
      </div>
      <h3 className="text-sm text-white font-medium">{integ.name}</h3>
      <p className="text-[11px] text-[#7e85a0] capitalize mb-3">{integ.type}</p>
      {integ.connected && lastSync && (
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#4a5068] mb-3">
          <RefreshCw size={9} />
          Last sync: {lastSync}
        </div>
      )}
      <button
        onClick={() => onToggle(integ)}
        className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
          integ.connected
            ? 'glass hover:bg-[#ff6b8a]/10 text-[#7e85a0] hover:text-[#ff6b8a]'
            : 'bg-[#7c8aff]/10 hover:bg-[#7c8aff]/20 text-[#7c8aff]'
        }`}
      >
        {integ.connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}
