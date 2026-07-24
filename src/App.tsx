import { useState, useEffect, useCallback } from 'react';
import { View } from '@/types';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import ChatView from '@/components/ChatView';
import MemoryView from '@/components/MemoryView';
import Dashboard from '@/components/Dashboard';
import IntegrationsView from '@/components/IntegrationsView';
import PersonalityView from '@/components/PersonalityView';
import SkillsView from '@/components/SkillsView';

function App() {
  const [view, setView] = useState<View>('chat');
  const [counts, setCounts] = useState({ memory: 0, connected: 0 });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [mem, integ] = await Promise.all([
          supabase.from('memories').select('*', { count: 'exact', head: true }),
          supabase.from('integrations').select('*', { count: 'exact', head: true }).eq('connected', true),
        ]);
        if (!cancelled) setCounts({ memory: mem.count ?? 0, connected: integ.count ?? 0 });
      } catch {
        // non-fatal — counts stay 0
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const refreshCounts = useCallback(async () => {
    try {
      const [mem, integ] = await Promise.all([
        supabase.from('memories').select('*', { count: 'exact', head: true }),
        supabase.from('integrations').select('*', { count: 'exact', head: true }).eq('connected', true),
      ]);
      setCounts({ memory: mem.count ?? 0, connected: integ.count ?? 0 });
    } catch {
      // non-fatal
    }
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090c]">
      <Sidebar
        view={view}
        onView={setView}
        memoryCount={counts.memory}
        connectedCount={counts.connected}
      />
      <div className="flex-1 overflow-hidden flex">
        {view === 'chat' && <ChatView />}
        {view === 'memory' && <MemoryView onUpdate={refreshCounts} />}
        {view === 'dashboard' && <Dashboard onView={setView} />}
        {view === 'integrations' && <IntegrationsView onUpdate={refreshCounts} />}
        {view === 'personality' && <PersonalityView />}
        {view === 'skills' && <SkillsView />}
      </div>
    </div>
  );
}

export default App;
